<?php

namespace App\Services\Exchanges;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class BinanceExchange implements ExchangeInterface
{
    private string $baseUrl = 'https://api.binance.com';

    public function getName(): string
    {
        return 'Binance';
    }

    public function validateCredentials(string $apiKey, string $apiSecret): bool
    {
        return !empty($apiKey) && !empty($apiSecret);
    }

    /**
     * Get trading history from Binance
     */
    public function getTradeHistory(string $apiKey, string $apiSecret, ?string $apiPassphrase = null, int $days = 30): array
    {
        try {
            $trades = [];
            $timestamp = round(microtime(true) * 1000);
            $recvWindow = 60000;
            
            // Calculate start time (X days ago)
            $startTime = $timestamp - ($days * 24 * 60 * 60 * 1000);

            // Get all trading symbols first
            $exchangeInfoResponse = Http::get("{$this->baseUrl}/api/v3/exchangeInfo");
            $symbols = [];
            
            if ($exchangeInfoResponse->successful()) {
                $exchangeInfo = $exchangeInfoResponse->json();
                foreach ($exchangeInfo['symbols'] as $symbolInfo) {
                    if ($symbolInfo['status'] === 'TRADING' && str_ends_with($symbolInfo['symbol'], 'USDT')) {
                        $symbols[] = $symbolInfo['symbol'];
                    }
                }
            }

            // Limit to top 50 symbols to avoid rate limits
            $symbols = array_slice($symbols, 0, 50);

            // ⚡ PARALLEL FETCH: Process symbols in batches for better performance
            $batchSize = 10; // Fetch 10 symbols at once
            $symbolBatches = array_chunk($symbols, $batchSize);
            
            Log::info("Binance: Fetching trades for " . count($symbols) . " symbols in " . count($symbolBatches) . " parallel batches");

            foreach ($symbolBatches as $batchIndex => $batch) {
                // Create parallel requests for this batch
                $promises = [];
                
                foreach ($batch as $symbol) {
                    $timestamp = round(microtime(true) * 1000); // Fresh timestamp for each request
                    $queryString = 'symbol=' . $symbol . '&startTime=' . $startTime . '&recvWindow=' . $recvWindow . '&timestamp=' . $timestamp;
                    $signature = hash_hmac('sha256', $queryString, $apiSecret);

                    // Store promise with symbol as key
                    $promises[$symbol] = Http::withHeaders([
                        'X-MBX-APIKEY' => $apiKey
                    ])->async()->get("{$this->baseUrl}/api/v3/myTrades", [
                        'symbol' => $symbol,
                        'startTime' => $startTime,
                        'recvWindow' => $recvWindow,
                        'timestamp' => $timestamp,
                        'signature' => $signature
                    ]);
                }

                // Wait for all requests in this batch to complete
                $responses = [];
                foreach ($promises as $symbol => $promise) {
                    try {
                        $responses[$symbol] = $promise->wait();
                    } catch (\Exception $e) {
                        Log::warning("Binance: Failed to fetch trades for {$symbol}: " . $e->getMessage());
                        $responses[$symbol] = null;
                    }
                }

                // Process responses
                foreach ($responses as $symbol => $response) {
                    if ($response && $response->successful()) {
                        $symbolTrades = $response->json();
                        
                        foreach ($symbolTrades as $trade) {
                            $qty = (float)$trade['qty'];
                            $price = (float)$trade['price'];
                            $commission = (float)$trade['commission'];
                            $isBuyer = $trade['isBuyer'];
                            
                            // Calculate realized P&L (simplified)
                            // For buy: negative (cost), for sell: positive (revenue)
                            $realizedPnl = $isBuyer ? -($qty * $price) : ($qty * $price);
                            $realizedPnl -= $commission; // Subtract commission
                            
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
                }

                // Small delay between batches to respect rate limits
                if ($batchIndex < count($symbolBatches) - 1) {
                    usleep(200000); // 200ms between batches (reduced from 100ms per symbol)
                }
            }

            // Also fetch Futures trades
            $futuresTrades = $this->getFuturesTrades($apiKey, $apiSecret, $startTime, $timestamp, $recvWindow);
            $trades = array_merge($trades, $futuresTrades);

            Log::info('Binance: Fetched ' . count($trades) . ' trades');

            return $trades;

        } catch (\Exception $e) {
            Log::error('Binance Trade History Error: ' . $e->getMessage());
            return [];
        }
    }

    /**
     * Get Futures trading history
     */
    private function getFuturesTrades(string $apiKey, string $apiSecret, int $startTime, int $timestamp, int $recvWindow): array
    {
        try {
            $trades = [];
            
            // Get futures income history (realized P&L)
            $queryString = 'incomeType=REALIZED_PNL&startTime=' . $startTime . '&recvWindow=' . $recvWindow . '&timestamp=' . $timestamp;
            $signature = hash_hmac('sha256', $queryString, $apiSecret);

            $response = Http::withHeaders([
                'X-MBX-APIKEY' => $apiKey
            ])->get("https://fapi.binance.com/fapi/v1/income", [
                'incomeType' => 'REALIZED_PNL',
                'startTime' => $startTime,
                'recvWindow' => $recvWindow,
                'timestamp' => $timestamp,
                'signature' => $signature
            ]);

            if ($response->successful()) {
                $incomes = $response->json();
                
                foreach ($incomes as $income) {
                    $trades[] = [
                        'symbol' => $income['symbol'],
                        'side' => 'FUTURES',
                        'price' => 0,
                        'quantity' => 0,
                        'commission' => 0,
                        'realizedPnl' => (float)$income['income'],
                        'timestamp' => $income['time'],
                    ];
                }
            }

            return $trades;

        } catch (\Exception $e) {
            Log::warning('Binance Futures trades fetch failed: ' . $e->getMessage());
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
            ])->get("{$this->baseUrl}/api/v3/account", [
                'recvWindow' => $recvWindow,
                'timestamp' => $timestamp,
                'signature' => $signature
            ]);

            $spotBalances = [];
            $spotTotalUsdt = 0;

            if ($accountResponse->successful()) {
                $accountData = $accountResponse->json();
                $spotBalances = collect($accountData['balances'])->filter(function ($b) {
                    return (float)$b['free'] > 0 || (float)$b['locked'] > 0;
                });
            }

            // Fetch Futures Account Balances (USDT-M)
            $timestamp = round(microtime(true) * 1000);
            $queryString = 'recvWindow=' . $recvWindow . '&timestamp=' . $timestamp;
            $signature = hash_hmac('sha256', $queryString, $apiSecret);

            $futuresResponse = Http::withHeaders([
                'X-MBX-APIKEY' => $apiKey
            ])->get("https://fapi.binance.com/fapi/v2/account", [
                'recvWindow' => $recvWindow,
                'timestamp' => $timestamp,
                'signature' => $signature
            ]);

            $futuresBalances = [];
            $futuresTotalUsdt = 0;
            $futuresPositions = [];

            if ($futuresResponse->successful()) {
                $futuresData = $futuresResponse->json();
                $futuresTotalUsdt = (float)($futuresData['totalWalletBalance'] ?? 0);
                
                Log::info('Binance Futures Balance: ' . $futuresTotalUsdt);
                
                // Get futures assets
                if (isset($futuresData['assets'])) {
                    foreach ($futuresData['assets'] as $asset) {
                        $balance = (float)$asset['walletBalance'];
                        if ($balance > 0) {
                            $futuresBalances[] = $asset;
                        }
                    }
                }

                // Get open positions
                if (isset($futuresData['positions'])) {
                    foreach ($futuresData['positions'] as $pos) {
                        $amt = (float)$pos['positionAmt'];
                        if ($amt != 0) {
                            $futuresPositions[] = $pos;
                        }
                    }
                }
            } else {
                Log::warning('Binance Futures API Error: ' . $futuresResponse->body());
            }

            // Fetch All Ticker Prices
            $tickerResponse = Http::get("{$this->baseUrl}/api/v3/ticker/price");
            $tickers = [];
            if ($tickerResponse->successful()) {
                foreach ($tickerResponse->json() as $t) {
                    $tickers[$t['symbol']] = (float)$t['price'];
                }
            }

            // Calculate Spot Balance in USDT
            $activeDeployments = [];
            
            foreach ($spotBalances as $balance) {
                $asset = $balance['asset'];
                $amount = (float)$balance['free'] + (float)$balance['locked'];
                $usdtValue = 0;

                if ($asset === 'USDT' || $asset === 'USDC' || $asset === 'BUSD' || $asset === 'FDUSD') {
                    $usdtValue = $amount;
                } else {
                    $symbol = $asset . 'USDT';
                    if (isset($tickers[$symbol])) {
                        $usdtValue = $amount * $tickers[$symbol];
                    }
                }

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

            // Add Futures Balances to deployments
            foreach ($futuresBalances as $asset) {
                $assetName = $asset['asset'];
                $balance = (float)$asset['walletBalance'];
                $usdtValue = 0;

                if ($assetName === 'USDT') {
                    $usdtValue = $balance;
                } else {
                    $symbol = $assetName . 'USDT';
                    if (isset($tickers[$symbol])) {
                        $usdtValue = $balance * $tickers[$symbol];
                    }
                }

                if ($usdtValue > 1) {
                    $activeDeployments[] = [
                        'id' => uniqid(),
                        'asset' => $assetName . ' / USDT',
                        'type' => 'FUTURES WALLET',
                        'entry' => 'N/A',
                        'size' => number_format($balance, 4) . ' ' . $assetName,
                        'pnl' => '+$' . number_format($usdtValue, 2),
                        'percent' => '-',
                        'duration' => 'Available',
                        'positive' => true,
                    ];
                }
            }

            // Add Futures Open Positions
            foreach ($futuresPositions as $pos) {
                $symbol = $pos['symbol'];
                $positionAmt = (float)$pos['positionAmt'];
                $entryPrice = (float)$pos['entryPrice'];
                $unrealizedProfit = (float)$pos['unrealizedProfit'];
                $leverage = (float)$pos['leverage'];
                
                $positionValue = abs($positionAmt * $entryPrice);
                $pnlPercent = $positionValue > 0 ? ($unrealizedProfit / $positionValue) * 100 : 0;

                $pnlSign = $unrealizedProfit >= 0 ? '+' : '';
                $activeDeployments[] = [
                    'id' => uniqid(),
                    'asset' => $symbol,
                    'type' => ($positionAmt > 0 ? 'LONG' : 'SHORT') . ' ' . $leverage . 'x',
                    'entry' => '$' . number_format($entryPrice, 2),
                    'size' => number_format(abs($positionAmt), 4),
                    'pnl' => $pnlSign . '$' . number_format($unrealizedProfit, 2),
                    'percent' => number_format($pnlPercent, 2) . '%',
                    'duration' => 'Open',
                    'positive' => $unrealizedProfit >= 0,
                ];
            }

            // Total Balance = Spot + Futures
            $totalUsdt = $spotTotalUsdt + $futuresTotalUsdt;
            
            Log::info('Binance Total Balance', [
                'spot' => $spotTotalUsdt,
                'futures' => $futuresTotalUsdt,
                'total' => $totalUsdt
            ]);

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
            Log::error('Binance Sync Error: ' . $e->getMessage());
            throw $e;
        }
    }
}
