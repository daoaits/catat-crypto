<?php

namespace App\Services\Exchanges;

use App\Models\Trade;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class TradeSyncService
{
    /**
     * Save trades to database from exchange API
     * 
     * @param int $userId
     * @param int $cexAccountId
     * @param array $trades Array of trades from exchange API
     * @return int Number of trades saved
     */
    public static function saveTrades(int $userId, int $cexAccountId, array $trades): int
    {
        $savedCount = 0;

        foreach ($trades as $trade) {
            try {
                // Skip if essential data is missing
                if (empty($trade['symbol']) || empty($trade['timestamp'])) {
                    continue;
                }

                // Parse timestamp
                $tradeDate = Carbon::createFromTimestampMs($trade['timestamp']);

                // Determine status
                $pnl = (float)($trade['realizedPnl'] ?? 0);
                $status = 'OPEN';
                if ($pnl > 0) {
                    $status = 'WIN';
                } elseif ($pnl < 0) {
                    $status = 'LOSE';
                }

                // Determine direction
                $direction = strtoupper($trade['side'] ?? 'BUY');
                if (in_array($direction, ['BUY', 'SELL'])) {
                    // Keep as is
                } else {
                    // Map to LONG/SHORT if needed
                    $direction = $pnl >= 0 ? 'LONG' : 'SHORT';
                }

                // Calculate PnL percentage if we have entry/exit prices
                $pnlPercentage = null;
                if (isset($trade['price']) && $trade['price'] > 0 && isset($trade['quantity'])) {
                    $positionValue = $trade['price'] * $trade['quantity'];
                    if ($positionValue > 0) {
                        $pnlPercentage = ($pnl / $positionValue) * 100;
                    }
                }

                // Create or update trade
                Trade::updateOrCreate(
                    [
                        'user_id' => $userId,
                        'cex_account_id' => $cexAccountId,
                        'pairs' => $trade['symbol'],
                        'trade_date' => $tradeDate,
                    ],
                    [
                        'direction' => $direction,
                        'leverage' => $trade['leverage'] ?? null,
                        'position_size' => $trade['quantity'] ?? null,
                        'entry_price' => $trade['price'] ?? null,
                        'exit_price' => $trade['exitPrice'] ?? null,
                        'status' => $status,
                        'pnl_amount' => $pnl,
                        'pnl_percentage' => $pnlPercentage,
                        'is_manual' => false,
                        'synced_at' => now(),
                    ]
                );

                $savedCount++;

            } catch (\Exception $e) {
                Log::warning('TradeSyncService: Failed to save trade: ' . $e->getMessage(), [
                    'trade' => $trade
                ]);
                continue;
            }
        }

        Log::info("TradeSyncService: Saved {$savedCount} trades for user {$userId}, CEX account {$cexAccountId}");

        return $savedCount;
    }
}
