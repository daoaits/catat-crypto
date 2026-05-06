<?php

namespace App\Services\Exchanges;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class BitgetExchange implements ExchangeInterface
{
    private string $baseUrl = 'https://api.bitget.com';

    public function getName(): string
    {
        return 'Bitget';
    }

    public function validateCredentials(string $apiKey, string $apiSecret): bool
    {
        return !empty($apiKey) && !empty($apiSecret);
    }

    /**
     * Get trading history from Bitget
     */
    public function getTradeHistory(string $apiKey, string $apiSecret, ?string $apiPassphrase = null, int $days = 30): array
    {
        try {
            $trades = [];
            $endTime = round(microtime(true) * 1000);
            $startTime = $endTime - ($days * 24 * 60 * 60 * 1000);

            // Fetch spot trade history
            $timestamp = round(microtime(true) * 1000);
            $method = 'GET';
            $requestPath = '/api/v2/spot/trade/fills';
            $queryString = '?startTime=' . $startTime . '&endTime=' . $endTime . '&limit=100';
            
            $prehash = $timestamp . $method . $requestPath . $queryString;
            $signature = base64_encode(hash_hmac('sha256', $prehash, $apiSecret, true));

            $response = Http::withHeaders([
                'ACCESS-KEY' => $apiKey,
                'ACCESS-SIGN' => $signature,
                'ACCESS-TIMESTAMP' => $timestamp,
                'ACCESS-PASSPHRASE' => $apiPassphrase ?? '',
                'Content-Type' => 'application/json',
            ])->get("{$this->baseUrl}{$requestPath}{$queryString}");

            if ($response->successful()) {
                $data = $response->json();
                
                if ($data['code'] === '00000' && isset($data['data'])) {
                    foreach ($data['data'] as $trade) {
                        $side = $trade['side'];
                        $price = (float)$trade['priceAvg'];
                        $qty = (float)$trade['size'];
                        $fee = (float)($trade['feeDetail']['totalFee'] ?? 0);
                        
                        // Calculate realized P&L
                        $realizedPnl = $side === 'buy' ? -($qty * $price) : ($qty * $price);
                        $realizedPnl -= $fee;
                        
                        $trades[] = [
                            'symbol' => $trade['symbol'],
                            'side' => strtoupper($side),
                            'price' => $price,
                            'quantity' => $qty,
                            'commission' => $fee,
                            'realizedPnl' => $realizedPnl,
                            'timestamp' => (int)$trade['cTime'],
                        ];
                    }
                }
            }

            Log::info('Bitget: Fetched ' . count($trades) . ' trades');

            return $trades;

        } catch (\Exception $e) {
            Log::error('Bitget Trade History Error: ' . $e->getMessage());
            return [];
        }
    }

    public function syncAccount(string $apiKey, string $apiSecret, ?string $apiPassphrase = null, ?int $userId = null, ?int $cexAccountId = null): array
    {
        try {
            $timestamp = round(microtime(true) * 1000);
            $method = 'GET';
            $requestPath = '/api/v2/spot/account/assets';
            
            // Bitget signature: timestamp + method + requestPath + body
            $prehash = $timestamp . $method . $requestPath;
            $signature = base64_encode(hash_hmac('sha256', $prehash, $apiSecret, true));

            $response = Http::withHeaders([
                'ACCESS-KEY' => $apiKey,
                'ACCESS-SIGN' => $signature,
                'ACCESS-TIMESTAMP' => $timestamp,
                'ACCESS-PASSPHRASE' => $apiPassphrase ?? '',

                'Content-Type' => 'application/json',
            ])->get("{$this->baseUrl}{$requestPath}");

            if (!$response->successful()) {
                $status = $response->status();
                Log::error("Bitget API Error ($status): " . $response->body());
                throw new \Exception('Failed to connect to Bitget. Please check your API keys and passphrase.');
            }

            $data = $response->json();
            
            if ($data['code'] !== '00000') {
                throw new \Exception($data['msg'] ?? 'Bitget API error');
            }

            // Parse balance data
            $totalUsdt = 0;
            $activeDeployments = [];

            if (isset($data['data'])) {
                foreach ($data['data'] as $asset) {
                    $coin = $asset['coin'];
                    $amount = (float)($asset['available'] ?? 0);
                    $usdtValue = (float)($asset['usdtValue'] ?? 0);

                    $totalUsdt += $usdtValue;

                    if ($usdtValue > 1) {
                        $activeDeployments[] = [
                            'id' => uniqid(),
                            'asset' => $coin . ' / USDT',
                            'type' => 'SPOT HOLDING',
                            'entry' => 'N/A',
                            'size' => number_format($amount, 4) . ' ' . $coin,
                            'pnl' => '+$' . number_format($usdtValue, 2),
                            'percent' => '-',
                            'duration' => 'Permanent',
                            'positive' => true,
                        ];
                    }
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
            Log::error('Bitget Sync Error: ' . $e->getMessage());
            throw $e;
        }
    }
}
