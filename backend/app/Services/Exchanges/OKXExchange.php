<?php

namespace App\Services\Exchanges;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class OKXExchange implements ExchangeInterface
{
    private string $baseUrl = 'https://www.okx.com';

    public function getName(): string
    {
        return 'OKX';
    }

    public function validateCredentials(string $apiKey, string $apiSecret): bool
    {
        return !empty($apiKey) && !empty($apiSecret);
    }

    /**
     * Get trading history from OKX
     */
    public function getTradeHistory(string $apiKey, string $apiSecret, ?string $apiPassphrase = null, int $days = 30): array
    {
        try {
            $trades = [];
            $endTime = round(microtime(true) * 1000);
            $startTime = $endTime - ($days * 24 * 60 * 60 * 1000);

            $timestamp = gmdate('Y-m-d\TH:i:s.000\Z');
            $method = 'GET';
            $requestPath = '/api/v5/trade/fills-history?instType=SPOT&begin=' . $startTime . '&end=' . $endTime;
            
            $prehash = $timestamp . $method . $requestPath;
            $signature = base64_encode(hash_hmac('sha256', $prehash, $apiSecret, true));

            $response = Http::withHeaders([
                'OK-ACCESS-KEY' => $apiKey,
                'OK-ACCESS-SIGN' => $signature,
                'OK-ACCESS-TIMESTAMP' => $timestamp,
                'OK-ACCESS-PASSPHRASE' => $apiPassphrase ?? '',
            ])->get("{$this->baseUrl}{$requestPath}");

            if ($response->successful()) {
                $data = $response->json();
                
                if ($data['code'] === '0' && isset($data['data'])) {
                    foreach ($data['data'] as $trade) {
                        $side = $trade['side'];
                        $price = (float)$trade['fillPx'];
                        $qty = (float)$trade['fillSz'];
                        $fee = (float)$trade['fee'];
                        
                        $realizedPnl = $side === 'buy' ? -($qty * $price) : ($qty * $price);
                        $realizedPnl -= abs($fee);
                        
                        $trades[] = [
                            'symbol' => $trade['instId'],
                            'side' => strtoupper($side),
                            'price' => $price,
                            'quantity' => $qty,
                            'commission' => abs($fee),
                            'realizedPnl' => $realizedPnl,
                            'timestamp' => (int)$trade['ts'],
                        ];
                    }
                }
            }

            Log::info('OKX: Fetched ' . count($trades) . ' trades');

            return $trades;

        } catch (\Exception $e) {
            Log::error('OKX Trade History Error: ' . $e->getMessage());
            return [];
        }
    }

    public function syncAccount(string $apiKey, string $apiSecret, ?string $apiPassphrase = null, ?int $userId = null, ?int $cexAccountId = null): array
    {
        try {
            $timestamp = gmdate('Y-m-d\TH:i:s.000\Z');
            $method = 'GET';
            $requestPath = '/api/v5/account/balance';
            
            // OKX requires: timestamp + method + requestPath + body
            $prehash = $timestamp . $method . $requestPath;
            $signature = base64_encode(hash_hmac('sha256', $prehash, $apiSecret, true));

            $response = Http::withHeaders([
                'OK-ACCESS-KEY' => $apiKey,
                'OK-ACCESS-SIGN' => $signature,
                'OK-ACCESS-TIMESTAMP' => $timestamp,
                'OK-ACCESS-PASSPHRASE' => '', // User needs to provide passphrase separately
            ])->get("{$this->baseUrl}{$requestPath}");

            if (!$response->successful()) {
                $status = $response->status();
                Log::error("OKX API Error ($status): " . $response->body());
                throw new \Exception('Failed to connect to OKX. Please check your API keys and passphrase.');
            }

            $data = $response->json();
            
            if ($data['code'] !== '0') {
                throw new \Exception($data['msg'] ?? 'OKX API error');
            }

            // Parse balance data
            $totalUsdt = 0;
            $activeDeployments = [];

            if (isset($data['data'][0]['details'])) {
                foreach ($data['data'][0]['details'] as $detail) {
                    $asset = $detail['ccy'];
                    $amount = (float)($detail['availBal'] ?? 0);
                    $usdtValue = (float)($detail['eqUsd'] ?? 0);

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
            Log::error('OKX Sync Error: ' . $e->getMessage());
            throw $e;
        }
    }
}
