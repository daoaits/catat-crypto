<?php

namespace App\Services\Exchanges;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class IndodaxExchange implements ExchangeInterface
{
    private string $baseUrl = 'https://indodax.com/tapi';

    public function getName(): string
    {
        return 'Indodax';
    }

    public function validateCredentials(string $apiKey, string $apiSecret): bool
    {
        return !empty($apiKey) && !empty($apiSecret);
    }

    /**
     * Get trading history from Indodax
     */
    public function getTradeHistory(string $apiKey, string $apiSecret, ?string $apiPassphrase = null, int $days = 30): array
    {
        try {
            $trades = [];
            
            // Indodax doesn't have a direct "all trades" endpoint
            // We need to fetch trade history per pair
            // For now, we'll fetch the most common pairs
            $pairs = ['btc_idr', 'eth_idr', 'usdt_idr', 'bnb_idr', 'ada_idr'];

            foreach ($pairs as $pair) {
                try {
                    $tradeData = $this->makeRequest('tradeHistory', ['pair' => $pair], $apiKey, $apiSecret);
                    
                    if (isset($tradeData['return']['trades'])) {
                        foreach ($tradeData['return']['trades'] as $trade) {
                            $type = $trade['type'];
                            $price = (float)$trade['price'];
                            $qty = (float)($trade[$type] ?? 0); // 'btc' for btc_idr pair
                            $fee = (float)($trade['fee'] ?? 0);
                            $timestamp = (int)$trade['trade_time'] * 1000; // Convert to milliseconds
                            
                            // Calculate realized P&L in IDR
                            $realizedPnlIdr = $type === 'buy' ? -($qty * $price) : ($qty * $price);
                            $realizedPnlIdr -= $fee;
                            
                            // Convert to USDT (approximate)
                            $usdtIdrRate = 15800; // Default rate
                            $realizedPnl = $realizedPnlIdr / $usdtIdrRate;
                            
                            $trades[] = [
                                'symbol' => strtoupper(str_replace('_', '/', $pair)),
                                'side' => strtoupper($type),
                                'price' => $price,
                                'quantity' => $qty,
                                'commission' => $fee / $usdtIdrRate,
                                'realizedPnl' => $realizedPnl,
                                'timestamp' => $timestamp,
                            ];
                        }
                    }
                } catch (\Exception $e) {
                    Log::warning("Indodax: Failed to fetch trades for {$pair}: " . $e->getMessage());
                    continue;
                }
            }

            Log::info('Indodax: Fetched ' . count($trades) . ' trades');

            return $trades;

        } catch (\Exception $e) {
            Log::error('Indodax Trade History Error: ' . $e->getMessage());
            return [];
        }
    }

    public function syncAccount(string $apiKey, string $apiSecret, ?string $apiPassphrase = null, ?int $userId = null, ?int $cexAccountId = null): array
    {
        try {
            // Get account info
            $accountData = $this->makeRequest('getInfo', [], $apiKey, $apiSecret);
            
            if (!isset($accountData['return'])) {
                throw new \Exception($accountData['error'] ?? 'Failed to get account info');
            }

            $balances = $accountData['return']['balance'] ?? [];
            $balancesHold = $accountData['return']['balance_hold'] ?? [];

            // Get ticker prices for IDR conversion
            $tickerResponse = Http::get('https://indodax.com/api/summaries');
            $tickers = [];
            
            if ($tickerResponse->successful()) {
                $tickerData = $tickerResponse->json();
                if (isset($tickerData['tickers'])) {
                    foreach ($tickerData['tickers'] as $pair => $data) {
                        $tickers[$pair] = [
                            'last' => (float)($data['last'] ?? 0),
                        ];
                    }
                }
            }

            // Calculate total balance in IDR, then convert to USDT
            $totalIdr = 0;
            $activeDeployments = [];
            
            // Get USDT/IDR rate for conversion
            $usdtIdrRate = $tickers['usdtidr']['last'] ?? 15800; // Default ~15,800 IDR per USDT
            
            foreach ($balances as $asset => $balance) {
                $amount = (float)$balance;
                $hold = (float)($balancesHold[$asset] ?? 0);
                $totalAmount = $amount + $hold;
                
                if ($totalAmount > 0) {
                    $idrValue = 0;
                    
                    // Convert to IDR
                    if ($asset === 'idr') {
                        $idrValue = $totalAmount;
                    } else {
                        $pair = strtolower($asset) . 'idr';
                        if (isset($tickers[$pair])) {
                            $idrValue = $totalAmount * $tickers[$pair]['last'];
                        }
                    }
                    
                    $totalIdr += $idrValue;
                    
                    // Convert IDR to USDT for display
                    $usdtValue = $idrValue / $usdtIdrRate;
                    
                    // Only show assets worth more than $1
                    if ($usdtValue > 1) {
                        $activeDeployments[] = [
                            'id' => uniqid(),
                            'asset' => strtoupper($asset) . ' / IDR',
                            'type' => 'SPOT HOLDING',
                            'entry' => 'N/A',
                            'size' => number_format($totalAmount, 8) . ' ' . strtoupper($asset),
                            'pnl' => '+$' . number_format($usdtValue, 2),
                            'percent' => '-',
                            'duration' => 'Permanent',
                            'positive' => true,
                        ];
                    }
                }
            }

            // Convert total IDR to USDT
            $totalUsdt = $totalIdr / $usdtIdrRate;

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
            Log::error('Indodax Sync Error: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Make authenticated request to Indodax API
     */
    private function makeRequest(string $method, array $params, string $apiKey, string $apiSecret): array
    {
        $params['method'] = $method;
        $params['nonce'] = time() * 1000; // Milliseconds timestamp
        
        $postData = http_build_query($params);
        $signature = hash_hmac('sha512', $postData, $apiSecret);

        $response = Http::asForm()
            ->withHeaders([
                'Key' => $apiKey,
                'Sign' => $signature,
            ])
            ->post($this->baseUrl, $params);

        if (!$response->successful()) {
            $status = $response->status();
            Log::error("Indodax API Error ($status): " . $response->body());
            throw new \Exception('Failed to connect to Indodax. Please check your API keys.');
        }

        $data = $response->json();
        
        if (isset($data['success']) && $data['success'] === 0) {
            throw new \Exception($data['error'] ?? 'Indodax API error');
        }

        return $data;
    }
}
