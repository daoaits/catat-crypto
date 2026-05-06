<?php

namespace App\Services\Exchanges;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class TokocryptoExchange implements ExchangeInterface
{
    private string $baseUrl = 'https://www.tokocrypto.com';

    public function getName(): string
    {
        return 'Tokocrypto';
    }

    public function validateCredentials(string $apiKey, string $apiSecret): bool
    {
        return !empty($apiKey) && !empty($apiSecret);
    }

    public function getTradeHistory(string $apiKey, string $apiSecret, ?string $apiPassphrase = null, int $days = 30): array
    {
        try {
            $trades = [];
            $timestamp = round(microtime(true) * 1000);
            $startTime = $timestamp - ($days * 24 * 60 * 60 * 1000);

            // Get account info first to get balances
            $recvWindow = 60000;
            $queryString = 'recvWindow=' . $recvWindow . '&timestamp=' . $timestamp;
            $signature = hash_hmac('sha256', $queryString, $apiSecret);

            $accountResponse = Http::withHeaders([
                'X-MBX-APIKEY' => $apiKey
            ])->get("{$this->baseUrl}/open/v1/account", [
                'recvWindow' => $recvWindow,
                'timestamp' => $timestamp,
                'signature' => $signature
            ]);

            if (!$accountResponse->successful()) {
                Log::warning('Tokocrypto: Failed to fetch account for trade history');
                return [];
            }

            // For now, return empty trades as Tokocrypto trade history endpoint needs more investigation
            Log::info('Tokocrypto: Trade history feature not yet implemented');
            return $trades;

        } catch (\Exception $e) {
            Log::error('Tokocrypto Trade History Error: ' . $e->getMessage());
            return [];
        }
    }

    public function syncAccount(string $apiKey, string $apiSecret, ?string $apiPassphrase = null, ?int $userId = null, ?int $cexAccountId = null): array
    {
        try {
            $timestamp = round(microtime(true) * 1000);
            $recvWindow = 60000; // 60 seconds window to handle clock skew
            $queryString = 'recvWindow=' . $recvWindow . '&timestamp=' . $timestamp;
            $signature = hash_hmac('sha256', $queryString, $apiSecret);

            // Fetch Spot Account Balances
            $accountResponse = Http::withHeaders([
                'X-MBX-APIKEY' => $apiKey
            ])->get("{$this->baseUrl}/open/v1/account/spot", [
                'recvWindow' => $recvWindow,
                'timestamp' => $timestamp,
                'signature' => $signature
            ]);

            $spotBalances = [];
            $spotTotalUsdt = 0;

            if ($accountResponse->successful()) {
                $accountData = $accountResponse->json();
                
                // Tokocrypto uses 'accountAssets' not 'balances'
                $balances = $accountData['data']['accountAssets'] ?? $accountData['data']['balances'] ?? $accountData['balances'] ?? [];
                
                Log::info('Tokocrypto: Total assets received: ' . count($balances));
                
                $spotBalances = collect($balances)->filter(function ($b) {
                    $total = (float)($b['total'] ?? 0);
                    return $total > 0;
                });
                
                Log::info('Tokocrypto: Assets with balance: ' . $spotBalances->count());
                if ($spotBalances->count() > 0) {
                    foreach ($spotBalances as $bal) {
                        Log::info('Tokocrypto Balance: ' . $bal['asset'] . ' = ' . $bal['total']);
                    }
                }
            } else {
                Log::warning('Tokocrypto Account API Error: ' . $accountResponse->body());
            }

            // Fetch All Ticker Prices - Get BTC price from Binance as fallback
            // Tokocrypto doesn't provide public ticker endpoint, so we use Binance
            $btcPrice = 0;
            try {
                $binanceResponse = Http::get('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT');
                if ($binanceResponse->successful()) {
                    $btcData = $binanceResponse->json();
                    $btcPrice = (float)($btcData['price'] ?? 0);
                    Log::info('Tokocrypto: BTC price from Binance: $' . number_format($btcPrice, 2));
                }
            } catch (\Exception $e) {
                Log::warning('Tokocrypto: Failed to fetch BTC price: ' . $e->getMessage());
            }

            // Calculate Spot Balance in USDT using totalOfBtc
            $activeDeployments = [];
            
            foreach ($spotBalances as $balance) {
                $asset = $balance['asset'];
                $amount = (float)($balance['total'] ?? 0);
                $totalOfBtc = (float)($balance['totalOfBtc'] ?? 0);
                
                // Calculate USDT value using BTC conversion
                $usdtValue = $totalOfBtc * $btcPrice;
                
                Log::info("Tokocrypto: $asset = $amount | BTC: $totalOfBtc | USDT: $usdtValue");

                $spotTotalUsdt += $usdtValue;

                // Only show assets worth more than $1 in deployments
                if ($usdtValue > 1) {
                    $activeDeployments[] = [
                        'id' => uniqid(),
                        'asset' => $asset . ' / USDT',
                        'type' => 'SPOT HOLDING',
                        'entry' => 'N/A',
                        'size' => number_format($amount, 4) . ' ' . $asset,
                        'pnl' => '+$' . number_format($usdtValue, 2),
                        'percent' => '-',
                        'duration' => 'Permanent',
                        'positive' => true,
                    ];
                }
            }

            $totalUsdt = $spotTotalUsdt;
            
            Log::info('Tokocrypto Total Balance', [
                'spot' => $spotTotalUsdt,
                'total' => $totalUsdt
            ]);

            // Fetch trading history and save to database
            $trades = $this->getTradeHistory($apiKey, $apiSecret, $apiPassphrase, 30);
            
            // Save trades to database if user ID and CEX account ID are provided
            if ($userId && $cexAccountId && !empty($trades)) {
                \App\Services\Exchanges\TradeSyncService::saveTrades($userId, $cexAccountId, $trades);
            }
            
            $metrics = TradeMetricsCalculator::calculate($trades, $totalUsdt);

            // Performance data (placeholder for now)
            $performance = [];
            for ($i = 30; $i >= 0; $i--) {
                $performance[] = [
                    'date' => date('d', strtotime("-$i days")),
                    'dayName' => date('D', strtotime("-$i days")),
                    'realized' => '-',
                    'realizedValue' => 0,
                    'tradesCount' => 0,
                    'positive' => false,
                    'neutral' => true,
                ];
            }
            $performance = array_reverse($performance);

            return [
                'totalBalance' => '$' . number_format($totalUsdt, 2),
                'netPnl' => $metrics['netPnl'],
                'netPnlPercent' => $metrics['netPnlPercent'],
                'netPnlPositive' => $metrics['netPnlPositive'],
                'dayWinRate' => $metrics['dayWinRate'],
                'dayWinRateSub' => $metrics['dayWinRateSub'],
                'tradeWinRate' => $metrics['tradeWinRate'],
                'tradeWinRateSub' => $metrics['tradeWinRateSub'],
                'avgWinLoss' => $metrics['avgWinLoss'],
                'rrRatio' => $metrics['rrRatio'],
                'activeDeployments' => $activeDeployments,
                'performance' => $performance
            ];

        } catch (\Exception $e) {
            Log::error('Tokocrypto Sync Error: ' . $e->getMessage());
            throw $e;
        }
    }
}
