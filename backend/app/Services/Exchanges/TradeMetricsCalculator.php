<?php

namespace App\Services\Exchanges;

use Illuminate\Support\Facades\Log;

class TradeMetricsCalculator
{
    /**
     * Calculate all trading metrics from trade history
     * 
     * @param array $trades Array of trades with 'realizedPnl', 'timestamp', etc.
     * @param float $currentBalance Current account balance
     * @return array Calculated metrics
     */
    public static function calculate(array $trades, float $currentBalance): array
    {
        if (empty($trades)) {
            return self::getEmptyMetrics();
        }

        // Sort trades by timestamp (oldest first)
        usort($trades, function($a, $b) {
            return ($a['timestamp'] ?? 0) <=> ($b['timestamp'] ?? 0);
        });

        // Calculate metrics
        $totalPnl = 0;
        $winningTrades = [];
        $losingTrades = [];
        $dailyPnl = [];

        foreach ($trades as $trade) {
            $pnl = (float)($trade['realizedPnl'] ?? 0);
            $totalPnl += $pnl;

            // Categorize trades
            if ($pnl > 0) {
                $winningTrades[] = $pnl;
            } elseif ($pnl < 0) {
                $losingTrades[] = abs($pnl);
            }

            // Group by date
            $date = date('Y-m-d', $trade['timestamp'] / 1000);
            if (!isset($dailyPnl[$date])) {
                $dailyPnl[$date] = 0;
            }
            $dailyPnl[$date] += $pnl;
        }

        // Calculate win rates
        $totalTrades = count($trades);
        $winningTradesCount = count($winningTrades);
        $tradeWinRate = $totalTrades > 0 ? ($winningTradesCount / $totalTrades) * 100 : 0;

        // Calculate day win rate
        $profitableDays = count(array_filter($dailyPnl, fn($pnl) => $pnl > 0));
        $totalDays = count($dailyPnl);
        $dayWinRate = $totalDays > 0 ? ($profitableDays / $totalDays) * 100 : 0;

        // Calculate average win/loss
        $avgWin = count($winningTrades) > 0 ? array_sum($winningTrades) / count($winningTrades) : 0;
        $avgLoss = count($losingTrades) > 0 ? array_sum($losingTrades) / count($losingTrades) : 0;
        $rrRatio = $avgLoss > 0 ? $avgWin / $avgLoss : 0;

        // Calculate net P&L percentage
        $initialBalance = $currentBalance - $totalPnl;
        $pnlPercent = $initialBalance > 0 ? ($totalPnl / $initialBalance) * 100 : 0;

        // Build performance array (last 31 days)
        $performance = self::buildPerformanceArray($dailyPnl, $trades);

        return [
            'netPnl' => '$' . number_format($totalPnl, 2),
            'netPnlPercent' => number_format($pnlPercent, 1) . '%',
            'netPnlPositive' => $totalPnl >= 0,
            'dayWinRate' => number_format($dayWinRate, 0) . '%',
            'dayWinRateSub' => $profitableDays . '/' . $totalDays . ' Days',
            'tradeWinRate' => number_format($tradeWinRate, 0) . '%',
            'tradeWinRateSub' => $winningTradesCount . '/' . $totalTrades . ' Trades',
            'avgWinLoss' => '$' . number_format($avgWin, 2) . ' / $' . number_format($avgLoss, 2),
            'rrRatio' => 'RR: ' . number_format($rrRatio, 2),
            'performance' => $performance,
        ];
    }

    /**
     * Build performance array for last 31 days
     */
    private static function buildPerformanceArray(array $dailyPnl, array $trades): array
    {
        $performance = [];
        
        for ($i = 30; $i >= 0; $i--) {
            $date = date('Y-m-d', strtotime("-{$i} days"));
            $dayNum = date('d', strtotime("-{$i} days"));
            $dayName = date('D', strtotime("-{$i} days"));
            
            $pnl = $dailyPnl[$date] ?? 0;
            $tradesCount = self::countTradesForDate($trades, $date);
            
            $performance[] = [
                'date' => $dayNum,
                'dayName' => $dayName,
                'realized' => $pnl != 0 ? '$' . number_format($pnl, 2) : '-',
                'realizedValue' => $pnl,
                'tradesCount' => $tradesCount,
                'positive' => $pnl > 0,
                'neutral' => $pnl == 0,
            ];
        }

        return array_reverse($performance);
    }

    /**
     * Count trades for a specific date
     */
    private static function countTradesForDate(array $trades, string $date): int
    {
        $count = 0;
        foreach ($trades as $trade) {
            $tradeDate = date('Y-m-d', $trade['timestamp'] / 1000);
            if ($tradeDate === $date) {
                $count++;
            }
        }
        return $count;
    }

    /**
     * Get empty metrics when no trades available
     */
    private static function getEmptyMetrics(): array
    {
        $performance = [];
        for ($i = 30; $i >= 0; $i--) {
            $performance[] = [
                'date' => date('d', strtotime("-{$i} days")),
                'dayName' => date('D', strtotime("-{$i} days")),
                'realized' => '-',
                'realizedValue' => 0,
                'tradesCount' => 0,
                'positive' => false,
                'neutral' => true,
            ];
        }

        return [
            'netPnl' => '$0.00',
            'netPnlPercent' => '0.0%',
            'netPnlPositive' => true,
            'dayWinRate' => '0%',
            'dayWinRateSub' => '0/0 Days',
            'tradeWinRate' => '0%',
            'tradeWinRateSub' => '0/0 Trades',
            'avgWinLoss' => '$0 / $0',
            'rrRatio' => 'RR: 0.00',
            'performance' => array_reverse($performance),
        ];
    }
}
