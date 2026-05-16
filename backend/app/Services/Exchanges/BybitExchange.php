<?php

namespace App\Services\Exchanges;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class BybitExchange implements ExchangeInterface
{
    private string $baseUrl = 'https://api.bybit.com';
    private int $recvWindow = 20000;

    public function getName(): string
    {
        return 'Bybit';
    }

    private function getHttpClient()
    {
        $client = Http::withHeaders([
            'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        ])
        ->timeout(45)
        ->connectTimeout(20);

        // Force IPv4 to bypass some ISP issues and potential IPv6 handshake timeouts
        $client = $client->withOptions([
            'curl' => [
                CURLOPT_IPRESOLVE => CURL_IPRESOLVE_V4,
            ],
        ]);

        // Support proxy if configured in .env
        $proxy = config('services.proxy.url') ?? env('HTTP_PROXY');
        if ($proxy) {
            $client = $client->withOptions([
                'proxy' => $proxy
            ]);
        }

        // Handle SSL verification (useful for local dev with ISP blocking)
        if (env('CURL_VERIFY_SSL', true) === false) {
            $client->withoutVerifying();
        }

        return $client;
    }

    public function validateCredentials(string $apiKey, string $apiSecret): bool
    {
        return !empty($apiKey) && !empty($apiSecret);
    }

    /**
     * Get trading history from Bybit
     */
    public function getTradeHistory(string $apiKey, string $apiSecret, ?string $apiPassphrase = null, int $days = 30): array
    {
        try {
            $trades = [];
            $endTime = round(microtime(true) * 1000);
            $startTime = $endTime - ($days * 24 * 60 * 60 * 1000);

            // Fetch closed P&L for linear (USDT) perpetuals
            $categories = ['linear', 'spot'];

            foreach ($categories as $category) {
                try {
                    $data = $this->authenticatedGet('/v5/position/closed-pnl', [
                        'category' => $category,
                        'startTime' => $startTime,
                        'endTime' => $endTime,
                        'limit' => 100,
                    ], $apiKey, $apiSecret);

                    foreach ($data['result']['list'] ?? [] as $trade) {
                        $trades[] = [
                            'symbol' => $trade['symbol'],
                            'side' => $trade['side'] ?? 'UNKNOWN',
                            'price' => (float)($trade['avgExitPrice'] ?? 0),
                            'quantity' => (float)($trade['qty'] ?? 0),
                            'commission' => 0,
                            'realizedPnl' => (float)($trade['closedPnl'] ?? 0),
                            'timestamp' => (int)($trade['updatedTime'] ?? $trade['createdTime'] ?? time() * 1000),
                        ];
                    }
                } catch (\Exception $e) {
                    Log::warning("Bybit {$category} trade history fetch skipped: " . $e->getMessage());
                }
            }

            Log::info('Bybit: Fetched ' . count($trades) . ' trades');

            return $trades;

        } catch (\Exception $e) {
            Log::error('Bybit Trade History Error: ' . $e->getMessage());
            return [];
        }
    }

    /**
     * Generate Bybit V5 HMAC-SHA256 signature.
     * Format: timestamp + apiKey + recvWindow + queryString
     */
    private function generateSignature(string $apiSecret, string $timestamp, string $apiKey, string $queryString): string
    {
        $payload = $timestamp . $apiKey . $this->recvWindow . $queryString;
        return hash_hmac('sha256', $payload, $apiSecret);
    }

    /**
     * Make authenticated GET request to Bybit V5 API.
     */
    private function authenticatedGet(string $endpoint, array $params, string $apiKey, string $apiSecret): array
    {
        $timestamp = (string) round(microtime(true) * 1000);
        $queryString = http_build_query($params);
        $signature = $this->generateSignature($apiSecret, $timestamp, $apiKey, $queryString);

        $response = $this->getHttpClient()->withHeaders([
            'X-BAPI-API-KEY'    => $apiKey,
            'X-BAPI-SIGN'       => $signature,
            'X-BAPI-TIMESTAMP'  => $timestamp,
            'X-BAPI-RECV-WINDOW' => (string) $this->recvWindow,
        ])->get("{$this->baseUrl}{$endpoint}", $params);

        if (!$response->successful()) {
            Log::error("Bybit HTTP Error [{$response->status()}] {$endpoint}: " . $response->body());
            throw new \Exception("Bybit API request failed (HTTP {$response->status()}).");
        }

        $data = $response->json();

        if (($data['retCode'] ?? -1) !== 0) {
            $msg = $data['retMsg'] ?? 'Unknown Bybit error';
            Log::error("Bybit API retCode error [{$data['retCode']}]: {$msg}");
            throw new \Exception("Bybit API error: {$msg}");
        }

        return $data;
    }

    public function syncAccount(string $apiKey, string $apiSecret, ?string $apiPassphrase = null, ?int $userId = null, ?int $cexAccountId = null): array
    {
        try {
            $activeDeployments = [];
            $totalUsdt = 0;

            // ── 1. UNIFIED account (covers Spot + Derivatives in one wallet) ──
            $unifiedUsdt = $this->fetchUnifiedBalance($apiKey, $apiSecret, $activeDeployments);
            $totalUsdt += $unifiedUsdt;

            // ── 2. SPOT account (classic / non-unified users) ──
            $spotUsdt = $this->fetchSpotBalance($apiKey, $apiSecret, $activeDeployments);
            $totalUsdt += $spotUsdt;

            // ── 3. CONTRACT account (inverse / USDT perpetual wallet) ──
            $contractUsdt = $this->fetchContractBalance($apiKey, $apiSecret, $activeDeployments);
            $totalUsdt += $contractUsdt;

            // ── 4. Open Derivatives Positions ──
            $this->fetchOpenPositions($apiKey, $apiSecret, $activeDeployments);

            // ── 5. Fetch trading history and calculate metrics ──
            $trades = $this->getTradeHistory($apiKey, $apiSecret, $apiPassphrase, 30);
            
            // Save trades to database if user ID and CEX account ID are provided
            if ($userId && $cexAccountId && !empty($trades)) {
                TradeSyncService::saveTrades($userId, $cexAccountId, $trades);
            }
            
            $metrics = TradeMetricsCalculator::calculate($trades, $totalUsdt);

            Log::info('Bybit Sync Complete', ['totalUsdt' => $totalUsdt]);

            return [
                'totalBalance'    => '$' . number_format($totalUsdt, 2),
                'netPnl'          => $metrics['netPnl'],
                'netPnlPercent'   => $metrics['netPnlPercent'],
                'netPnlPositive'  => $metrics['netPnlPositive'],
                'dayWinRate'      => $metrics['dayWinRate'],
                'dayWinRateSub'   => $metrics['dayWinRateSub'],
                'tradeWinRate'    => $metrics['tradeWinRate'],
                'tradeWinRateSub' => $metrics['tradeWinRateSub'],
                'avgWinLoss'      => $metrics['avgWinLoss'],
                'rrRatio'         => $metrics['rrRatio'],
                'activeDeployments' => $activeDeployments,
                'performance'     => $metrics['performance'],
            ];

        } catch (\Exception $e) {
            Log::error('Bybit Sync Error: ' . $e->getMessage());
            throw $e;
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Private helpers
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Fetch UNIFIED wallet balance (Spot + Derivatives merged).
     * Returns total USD value and appends to $deployments.
     */
    private function fetchUnifiedBalance(string $apiKey, string $apiSecret, array &$deployments): float
    {
        try {
            $data = $this->authenticatedGet('/v5/account/wallet-balance', [
                'accountType' => 'UNIFIED',
            ], $apiKey, $apiSecret);

            $total = 0;
            foreach ($data['result']['list'] ?? [] as $account) {
                foreach ($account['coin'] ?? [] as $coin) {
                    $asset     = $coin['coin'];
                    $amount    = (float) ($coin['walletBalance'] ?? 0);
                    $usdtValue = (float) ($coin['usdValue'] ?? 0);

                    $total += $usdtValue;

                    if ($usdtValue > 1) {
                        $deployments[] = [
                            'id'       => uniqid(),
                            'asset'    => $asset . ' / USDT',
                            'type'     => 'UNIFIED WALLET',
                            'entry'    => 'N/A',
                            'size'     => number_format($amount, 6) . ' ' . $asset,
                            'pnl'      => '+$' . number_format($usdtValue, 2),
                            'percent'  => '-',
                            'duration' => 'Permanent',
                            'positive' => true,
                        ];
                    }
                }
            }
            return $total;
        } catch (\Exception $e) {
            Log::warning('Bybit UNIFIED balance fetch skipped: ' . $e->getMessage());
            return 0;
        }
    }

    /**
     * Fetch classic SPOT wallet balance.
     */
    private function fetchSpotBalance(string $apiKey, string $apiSecret, array &$deployments): float
    {
        try {
            $data = $this->authenticatedGet('/v5/account/wallet-balance', [
                'accountType' => 'SPOT',
            ], $apiKey, $apiSecret);

            $total = 0;
            foreach ($data['result']['list'] ?? [] as $account) {
                foreach ($account['coin'] ?? [] as $coin) {
                    $asset     = $coin['coin'];
                    $amount    = (float) ($coin['walletBalance'] ?? 0);
                    $usdtValue = (float) ($coin['usdValue'] ?? 0);

                    $total += $usdtValue;

                    if ($usdtValue > 1) {
                        $deployments[] = [
                            'id'       => uniqid(),
                            'asset'    => $asset . ' / USDT',
                            'type'     => 'SPOT HOLDING',
                            'entry'    => 'N/A',
                            'size'     => number_format($amount, 6) . ' ' . $asset,
                            'pnl'      => '+$' . number_format($usdtValue, 2),
                            'percent'  => '-',
                            'duration' => 'Permanent',
                            'positive' => true,
                        ];
                    }
                }
            }
            return $total;
        } catch (\Exception $e) {
            Log::warning('Bybit SPOT balance fetch skipped: ' . $e->getMessage());
            return 0;
        }
    }

    /**
     * Fetch CONTRACT (derivatives) wallet balance.
     */
    private function fetchContractBalance(string $apiKey, string $apiSecret, array &$deployments): float
    {
        try {
            $data = $this->authenticatedGet('/v5/account/wallet-balance', [
                'accountType' => 'CONTRACT',
            ], $apiKey, $apiSecret);

            $total = 0;
            foreach ($data['result']['list'] ?? [] as $account) {
                foreach ($account['coin'] ?? [] as $coin) {
                    $asset     = $coin['coin'];
                    $amount    = (float) ($coin['walletBalance'] ?? 0);
                    $usdtValue = (float) ($coin['usdValue'] ?? 0);

                    $total += $usdtValue;

                    if ($usdtValue > 1) {
                        $deployments[] = [
                            'id'       => uniqid(),
                            'asset'    => $asset . ' / USDT',
                            'type'     => 'CONTRACT WALLET',
                            'entry'    => 'N/A',
                            'size'     => number_format($amount, 6) . ' ' . $asset,
                            'pnl'      => '+$' . number_format($usdtValue, 2),
                            'percent'  => '-',
                            'duration' => 'Available',
                            'positive' => true,
                        ];
                    }
                }
            }
            return $total;
        } catch (\Exception $e) {
            Log::warning('Bybit CONTRACT balance fetch skipped: ' . $e->getMessage());
            return 0;
        }
    }

    /**
     * Fetch open linear/inverse perpetual positions.
     */
    private function fetchOpenPositions(string $apiKey, string $apiSecret, array &$deployments): void
    {
        $categories = ['linear', 'inverse'];

        foreach ($categories as $category) {
            try {
                $data = $this->authenticatedGet('/v5/position/list', [
                    'category'  => $category,
                    'settleCoin' => $category === 'linear' ? 'USDT' : 'BTC',
                ], $apiKey, $apiSecret);

                foreach ($data['result']['list'] ?? [] as $pos) {
                    $size          = (float) ($pos['size'] ?? 0);
                    $entryPrice    = (float) ($pos['avgPrice'] ?? 0);
                    $unrealisedPnl = (float) ($pos['unrealisedPnl'] ?? 0);
                    $leverage      = $pos['leverage'] ?? '1';
                    $side          = $pos['side'] ?? 'None'; // Buy or Sell

                    if ($size == 0 || $side === 'None') {
                        continue;
                    }

                    $positionValue = $size * $entryPrice;
                    $pnlPercent    = $positionValue > 0
                        ? ($unrealisedPnl / $positionValue) * 100
                        : 0;

                    $pnlSign = $unrealisedPnl >= 0 ? '+' : '';
                    $deployments[] = [
                        'id'       => uniqid(),
                        'asset'    => $pos['symbol'],
                        'type'     => ($side === 'Buy' ? 'LONG' : 'SHORT') . ' ' . $leverage . 'x',
                        'entry'    => '$' . number_format($entryPrice, 4),
                        'size'     => number_format($size, 4),
                        'pnl'      => $pnlSign . '$' . number_format($unrealisedPnl, 2),
                        'percent'  => number_format($pnlPercent, 2) . '%',
                        'duration' => 'Open',
                        'positive' => $unrealisedPnl >= 0,
                    ];
                }
            } catch (\Exception $e) {
                Log::warning("Bybit {$category} positions fetch skipped: " . $e->getMessage());
            }
        }
    }
}
