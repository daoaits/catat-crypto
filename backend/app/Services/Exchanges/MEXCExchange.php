<?php

namespace App\Services\Exchanges;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class MEXCExchange implements ExchangeInterface
{
    private string $baseUrl = 'https://api.mexc.com';

    public function getName(): string
    {
        return 'MEXC';
    }

    public function validateCredentials(string $apiKey, string $apiSecret): bool
    {
        return !empty($apiKey) && !empty($apiSecret);
    }

    /**
     * Get trading history from MEXC
     */
    public function getTradeHistory(string $apiKey, string $apiSecret, ?string $apiPassphrase = null, int $days = 30): array
    {
        try {
            $trades = [];
            $timestamp = round(microtime(true) * 1000);
            $startTime = $timestamp - ($days * 24 * 60 * 60 * 1000);

            // Get trading symbols
            $exchangeInfoResponse = Http::get("{$this->baseUrl}/api/v3/exchangeInfo");
            $symbols = [];
            
            if ($exchangeInfoResponse->successful()) {
                $exchangeInfo = $exchangeInfoResponse->json();
                foreach ($exchangeInfo['symbols'] as $symbolInfo) {
                    if ($symbolInfo['status'] === 'ENABLED' && str_ends_with($symbolInfo['symbol'], 'USDT')) {
                        $symbols[] = $symbolInfo['symbol'];
                    }
                }
            }

            // Limit to top 50 symbols
            $symbols = array_slice($symbols, 0, 50);

            // Fetch trades for each symbol
            foreach ($symbols as $symbol) {
                try {
                    $queryString = 'symbol=' . $symbol . '&startTime=' . $startTime . '&timestamp=' . $timestamp;
                    $signature = hash_hmac('sha256', $queryString, $apiSecret);

                    $response = Http::withHeaders([
                        'X-MEXC-APIKEY' => $apiKey
                    ])->get("{$this->baseUrl}/api/v3/myTrades", [
                        'symbol' => $symbol,
                        'startTime' => $startTime,
                        'timestamp' => $timestamp,
                        'signature' => $signature
                    ]);

                    if ($response->successful()) {
                        $symbolTrades = $response->json();
                        
                        foreach ($symbolTrades as $trade) {
                            $qty = (float)$trade['qty'];
                            $price = (float)$trade['price'];
                            $commission = (float)$trade['commission'];
                            $isBuyer = $trade['isBuyer'];
                            
                            $realizedPnl = $isBuyer ? -($qty * $price) : ($qty * $price);
                            $realizedPnl -= $commission;
                            
                            $trades[] = [
                                'symbol' => $trade['symbol'],
                                'side' => $isBuyer ? 'BUY' : 'SELL',
                                'price' => $price,
                                'quantity' => $qty,
                                'commission' => $commission,
                                'realizedPnl' => $realizedPnl,
                                'timestamp' => $trade['time'],
                            ];
                        }
                    }

                    usleep(100000); // 100ms delay

                } catch (\Exception $e) {
                    Log::warning("MEXC: Failed to fetch trades for {$symbol}: " . $e->getMessage());
                    continue;
                }
            }

            Log::info('MEXC: Fetched ' . count($trades) . ' trades');

            return $trades;

        } catch (\Exception $e) {
            Log::error('MEXC Trade History Error: ' . $e->getMessage());
            return [];
        }
    }

    public function syncAccount(string $apiKey, string $apiSecret, ?string $apiPassphrase = null, ?int $userId = null, ?int $cexAccountId = null): array
    {
        try {
            $timestamp = round(microtime(true) * 1000);
            $queryString = 'timestamp=' . $timestamp;
            $signature = hash_hmac('sha256', $queryString, $apiSecret);

            // MEXC uses similar API structure to Binance
            $accountResponse = Http::withHeaders([
                'X-MEXC-APIKEY' => $apiKey
            ])->get("{$this->baseUrl}/api/v3/account", [
                'timestamp' => $timestamp,
                'signature' => $signature
            ]);

            if (!$accountResponse->successful()) {
                $status = $accountResponse->status();
                Log::error("MEXC API Error ($status): " . $accountResponse->body());
                throw new \Exception('Failed to connect to MEXC. Please check your API keys.');
            }

            $accountData = $accountResponse->json();
            $balances = collect($accountData['balances'])->filter(function ($b) {
                return (float)$b['free'] > 0 || (float)$b['locked'] > 0;
            });

            // Fetch ticker prices
            $tickerResponse = Http::get("{$this->baseUrl}/api/v3/ticker/price");
            $tickers = [];
            if ($tickerResponse->successful()) {
                foreach ($tickerResponse->json() as $t) {
                    $tickers[$t['symbol']] = (float)$t['price'];
                }
            }

            // Calculate total balance
            $totalUsdt = 0;
            $activeDeployments = [];
            
            foreach ($balances as $balance) {
                $asset = $balance['asset'];
                $amount = (float)$balance['free'] + (float)$balance['locked'];
                $usdtValue = 0;

                if ($asset === 'USDT' || $asset === 'USDC') {
                    $usdtValue = $amount;
                } else {
                    $symbol = $asset . 'USDT';
                    if (isset($tickers[$symbol])) {
                        $usdtValue = $amount * $tickers[$symbol];
                    }
                }

                $totalUsdt += $usdtValue;

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

            // Fetch trading history and calculate metrics
            $trades = $this->getTradeHistory($apiKey, $apiSecret, $apiPassphrase, 30);
            
            // Save trades to database if user ID and CEX account ID are provided
            if ($userId && $cexAccountId && !empty($trades)) {
                TradeSyncService::saveTrades($userId, $cexAccountId, $trades);
            }
            
            $metrics = TradeMetricsCalculator::calculate($trades, $totalUsdt);

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
                'performance' => $metrics['performance']
            ];

        } catch (\Exception $e) {
            Log::error('MEXC Sync Error: ' . $e->getMessage());
            throw $e;
        }
    }
}
