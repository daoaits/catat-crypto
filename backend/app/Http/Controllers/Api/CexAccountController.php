<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\UserCexAccount;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class CexAccountController extends Controller
{
    /**
     * Supported CEX list
     */
    private const SUPPORTED_CEX = [
        'binance', 'bybit', 'okx', 'mexc', 'bitget', 'indodax', 'tokocrypto'
    ];

    /**
     * CEX that require passphrase
     */
    private const REQUIRES_PASSPHRASE = ['okx', 'bitget'];

    /**
     * Get all CEX accounts for authenticated user
     * 
     * GET /api/cex-accounts
     */
    public function index(Request $request)
    {
        try {
            $user = $request->user();
            
            $accounts = UserCexAccount::forUser($user->id)
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($account) {
                    return [
                        'id' => $account->id,
                        'cex_name' => $account->cex_name,
                        'cex_display_name' => $account->cex_display_name,
                        'account_label' => $account->account_label,
                        'full_display_name' => $account->full_display_name,
                        'is_active' => $account->is_active,
                        'last_synced_at' => $account->last_synced_at?->toIso8601String(),
                        'created_at' => $account->created_at->toIso8601String(),
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $accounts
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to fetch CEX accounts: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch CEX accounts'
            ], 500);
        }
    }

    /**
     * Create new CEX account
     * 
     * POST /api/cex-accounts
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'cex_name' => 'required|string|in:' . implode(',', self::SUPPORTED_CEX),
            'account_label' => 'nullable|string|max:100',
            'api_key' => 'required|string',
            'api_secret' => 'required|string',
            'api_passphrase' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $user = $request->user();
            $cexName = strtolower($request->cex_name);
            
            // Validate passphrase requirement
            if (in_array($cexName, self::REQUIRES_PASSPHRASE) && !$request->api_passphrase) {
                return response()->json([
                    'success' => false,
                    'message' => ucfirst($cexName) . ' requires API passphrase'
                ], 422);
            }

            // Check for duplicate
            $accountLabel = $request->account_label ?: 'Main Account';
            $existing = UserCexAccount::where('user_id', $user->id)
                ->where('cex_name', $cexName)
                ->where('account_label', $accountLabel)
                ->first();

            if ($existing) {
                return response()->json([
                    'success' => false,
                    'message' => 'Account with this label already exists for this CEX'
                ], 422);
            }

            // Create account
            $account = UserCexAccount::create([
                'user_id' => $user->id,
                'cex_name' => $cexName,
                'account_label' => $accountLabel,
                'api_key' => $request->api_key,
                'api_secret' => $request->api_secret,
                'api_passphrase' => $request->api_passphrase,
                'is_active' => true,
            ]);

            Log::info("CEX account created: {$account->full_display_name} for user {$user->id}");

            return response()->json([
                'success' => true,
                'message' => 'CEX account added successfully',
                'data' => [
                    'id' => $account->id,
                    'cex_name' => $account->cex_name,
                    'cex_display_name' => $account->cex_display_name,
                    'account_label' => $account->account_label,
                    'full_display_name' => $account->full_display_name,
                    'is_active' => $account->is_active,
                ]
            ], 201);
        } catch (\Exception $e) {
            Log::error('Failed to create CEX account: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to create CEX account: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update CEX account
     * 
     * PUT /api/cex-accounts/{id}
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'account_label' => 'nullable|string|max:100',
            'api_key' => 'nullable|string',
            'api_secret' => 'nullable|string',
            'api_passphrase' => 'nullable|string',
            'is_active' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $user = $request->user();
            $account = UserCexAccount::where('id', $id)
                ->where('user_id', $user->id)
                ->first();

            if (!$account) {
                return response()->json([
                    'success' => false,
                    'message' => 'CEX account not found'
                ], 404);
            }

            // Update fields
            if ($request->has('account_label')) {
                $account->account_label = $request->account_label;
            }
            if ($request->has('api_key')) {
                $account->api_key = $request->api_key;
            }
            if ($request->has('api_secret')) {
                $account->api_secret = $request->api_secret;
            }
            if ($request->has('api_passphrase')) {
                $account->api_passphrase = $request->api_passphrase;
            }
            if ($request->has('is_active')) {
                $account->is_active = $request->is_active;
            }

            $account->save();

            Log::info("CEX account updated: {$account->full_display_name} for user {$user->id}");

            return response()->json([
                'success' => true,
                'message' => 'CEX account updated successfully',
                'data' => [
                    'id' => $account->id,
                    'cex_name' => $account->cex_name,
                    'cex_display_name' => $account->cex_display_name,
                    'account_label' => $account->account_label,
                    'full_display_name' => $account->full_display_name,
                    'is_active' => $account->is_active,
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to update CEX account: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to update CEX account'
            ], 500);
        }
    }

    /**
     * Delete CEX account
     * 
     * DELETE /api/cex-accounts/{id}
     */
    public function destroy(Request $request, $id)
    {
        try {
            $user = $request->user();
            $account = UserCexAccount::where('id', $id)
                ->where('user_id', $user->id)
                ->first();

            if (!$account) {
                return response()->json([
                    'success' => false,
                    'message' => 'CEX account not found'
                ], 404);
            }

            $displayName = $account->full_display_name;
            $account->delete();

            Log::info("CEX account deleted: {$displayName} for user {$user->id}");

            return response()->json([
                'success' => true,
                'message' => 'CEX account deleted successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to delete CEX account: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete CEX account'
            ], 500);
        }
    }

    /**
     * Test CEX account connection
     * 
     * POST /api/cex-accounts/{id}/test
     */
    public function testConnection(Request $request, $id)
    {
        try {
            $user = $request->user();
            $account = UserCexAccount::where('id', $id)
                ->where('user_id', $user->id)
                ->first();

            if (!$account) {
                return response()->json([
                    'success' => false,
                    'message' => 'CEX account not found'
                ], 404);
            }

            // Get exchange service
            $exchangeService = $this->getExchangeService($account->cex_name);
            
            if (!$exchangeService) {
                return response()->json([
                    'success' => false,
                    'message' => 'Exchange service not available for ' . $account->cex_display_name
                ], 400);
            }

            // Test connection by syncing account
            $result = $exchangeService->syncAccount(
                $account->api_key,
                $account->api_secret,
                $account->api_passphrase
            );

            Log::info("CEX connection test successful: {$account->full_display_name}");

            return response()->json([
                'success' => true,
                'message' => 'Connection successful',
                'data' => [
                    'total_balance' => $result['totalBalance'] ?? '$0.00'
                ]
            ]);
        } catch (\Exception $e) {
            Log::error("CEX connection test failed: " . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Connection failed: ' . $e->getMessage()
            ], 400);
        }
    }

    /**
     * Sync specific CEX account
     * 
     * POST /api/cex-accounts/{id}/sync
     */
    public function sync(Request $request, $id)
    {
        try {
            $user = $request->user();
            $account = UserCexAccount::where('id', $id)
                ->where('user_id', $user->id)
                ->first();

            if (!$account) {
                return response()->json([
                    'success' => false,
                    'message' => 'CEX account not found'
                ], 404);
            }

            // Get exchange service
            $exchangeService = $this->getExchangeService($account->cex_name);
            
            if (!$exchangeService) {
                return response()->json([
                    'success' => false,
                    'message' => 'Exchange service not available for ' . $account->cex_display_name
                ], 400);
            }

            // Sync account and get trade history
            $result = $exchangeService->syncAccount(
                $account->api_key,
                $account->api_secret,
                $account->api_passphrase,
                $user->id,  // Pass user ID
                $account->id // Pass CEX account ID
            );

            // Update last synced timestamp
            $account->last_synced_at = now();
            $account->save();

            Log::info("CEX account synced: {$account->full_display_name}");

            return response()->json([
                'success' => true,
                'message' => 'Sync successful',
                'data' => $result
            ]);
        } catch (\Exception $e) {
            Log::error("CEX sync failed: " . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Sync failed: ' . $e->getMessage()
            ], 400);
        }
    }

    /**
     * Sync all CEX accounts (Unified View)
     * 
     * POST /api/cex-accounts/sync-all
     */
    public function syncAll(Request $request)
    {
        try {
            $user = $request->user();
            $accounts = UserCexAccount::where('user_id', $user->id)
                ->where('is_active', true)
                ->get();

            if ($accounts->isEmpty()) {
                return response()->json([
                    'success' => true,
                    'message' => 'No active CEX accounts found',
                    'data' => null
                ]);
            }

            // Performance Optimization: Check if we can use "Fast Mode"
            // Fast mode only aggregates data already in DB without calling external APIs
            $fastMode = $request->boolean('fast_mode', false);
            
            // Auto-detect fast mode: if any account was synced in the last 5 minutes, 
            // and we didn't explicitly ask for a full sync, use fast mode for efficiency.
            if (!$fastMode && !$request->boolean('force_sync', false)) {
                $recentlySynced = UserCexAccount::where('user_id', $user->id)
                    ->where('last_synced_at', '>=', now()->subMinutes(5))
                    ->exists();
                
                if ($recentlySynced) {
                    $fastMode = true;
                    Log::info("Unified View: Using Fast Mode (recently synced)");
                }
            }

            $aggregatedResults = [
                'totalBalance' => 0,
                'activeDeployments' => [],
            ];

            if (!$fastMode) {
                foreach ($accounts as $account) {
                    try {
                        $exchangeService = $this->getExchangeService($account->cex_name);
                        if (!$exchangeService) continue;

                        $result = $exchangeService->syncAccount(
                            $account->api_key,
                            $account->api_secret,
                            $account->api_passphrase,
                            $user->id,
                            $account->id
                        );

                        $account->last_synced_at = now();
                        $account->save();

                        // Aggregate balance
                        $balance = (float) str_replace(['$', ','], '', $result['totalBalance'] ?? '0');
                        $aggregatedResults['totalBalance'] += $balance;

                        // Aggregate active deployments (live open positions)
                        if (isset($result['activeDeployments']) && is_array($result['activeDeployments'])) {
                            foreach ($result['activeDeployments'] as $deployment) {
                                // Add exchange name to each deployment for clarity in unified view
                                $deployment['exchange'] = $account->cex_display_name;
                                $aggregatedResults['activeDeployments'][] = $deployment;
                            }
                        }
                    } catch (\Exception $e) {
                        Log::error("Failed to sync account {$account->id}: " . $e->getMessage());
                    }
                }
            } else {
                foreach ($accounts as $account) {
                    try {
                        $exchangeService = $this->getExchangeService($account->cex_name);
                        if (!$exchangeService) continue;

                        $result = $exchangeService->syncAccount(
                            $account->api_key,
                            $account->api_secret,
                            $account->api_passphrase,
                            $user->id,
                            $account->id
                        );
                        
                        $balance = (float) str_replace(['$', ','], '', $result['totalBalance'] ?? '0');
                        $aggregatedResults['totalBalance'] += $balance;

                        // Even in fast mode, we want to see current open positions
                        if (isset($result['activeDeployments']) && is_array($result['activeDeployments'])) {
                            foreach ($result['activeDeployments'] as $deployment) {
                                $deployment['exchange'] = $account->cex_display_name;
                                $aggregatedResults['activeDeployments'][] = $deployment;
                            }
                        }
                    } catch (\Exception $e) {
                        Log::error("Fast Mode sync failed for {$account->id}: " . $e->getMessage());
                    }
                }
            }

            // After syncing all accounts, fetch all trades and calculate aggregated metrics
            $allTrades = \App\Models\Trade::where('user_id', $user->id)->get();
            
            // Transform Model to array compatible with TradeMetricsCalculator
            $formattedTrades = $allTrades->map(function($trade) {
                return [
                    'realizedPnl' => $trade->pnl_amount,
                    'timestamp' => strtotime($trade->trade_date) * 1000,
                ];
            })->toArray();

            $metrics = \App\Services\Exchanges\TradeMetricsCalculator::calculate(
                $formattedTrades, 
                $aggregatedResults['totalBalance']
            );

            // Add aggregated data
            $metrics['totalBalance'] = '$' . number_format($aggregatedResults['totalBalance'], 2);
            $metrics['activeDeployments'] = $aggregatedResults['activeDeployments'];

            return response()->json([
                'success' => true,
                'message' => 'Unified sync successful',
                'data' => $metrics
            ]);
        } catch (\Exception $e) {
            Log::error("Unified sync failed: " . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Unified sync failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get exchange service instance
     */
    private function getExchangeService($cexName)
    {
        $services = [
            'binance' => \App\Services\Exchanges\BinanceExchange::class,
            'bybit' => \App\Services\Exchanges\BybitExchange::class,
            'okx' => \App\Services\Exchanges\OKXExchange::class,
            'mexc' => \App\Services\Exchanges\MEXCExchange::class,
            'bitget' => \App\Services\Exchanges\BitgetExchange::class,
            'indodax' => \App\Services\Exchanges\IndodaxExchange::class,
            'tokocrypto' => \App\Services\Exchanges\TokocryptoExchange::class,
        ];

        if (!isset($services[$cexName])) {
            return null;
        }

        return new $services[$cexName]();
    }

    /**
     * Get list of supported CEX
     * 
     * GET /api/cex-accounts/supported
     */
    public function supported()
    {
        $cexList = [
            ['value' => 'binance', 'label' => 'Binance', 'requiresPassphrase' => false],
            ['value' => 'bybit', 'label' => 'Bybit', 'requiresPassphrase' => false],
            ['value' => 'okx', 'label' => 'OKX', 'requiresPassphrase' => true],
            ['value' => 'mexc', 'label' => 'MEXC', 'requiresPassphrase' => false],
            ['value' => 'bitget', 'label' => 'Bitget', 'requiresPassphrase' => true],
            ['value' => 'indodax', 'label' => 'Indodax', 'requiresPassphrase' => false],
            ['value' => 'tokocrypto', 'label' => 'Tokocrypto', 'requiresPassphrase' => false],
        ];

        return response()->json([
            'success' => true,
            'data' => $cexList
        ]);
    }

    /**
     * Sync trades from active deployments to database
     * 
     * POST /api/cex-accounts/{id}/sync-trades
     */
    public function syncTrades(Request $request, $id)
    {
        try {
            $user = $request->user();
            $account = UserCexAccount::where('id', $id)
                ->where('user_id', $user->id)
                ->first();

            if (!$account) {
                return response()->json([
                    'success' => false,
                    'message' => 'CEX account not found'
                ], 404);
            }

            // Get trades data from request (activeDeployments)
            $validator = Validator::make($request->all(), [
                'trades' => 'required|array',
                'trades.*.asset' => 'required|string',
                'trades.*.type' => 'required|string',
                'trades.*.entry' => 'required|string',
                'trades.*.size' => 'required|string',
                'trades.*.pnl' => 'required|string',
                'trades.*.percent' => 'required|string',
                'trades.*.positive' => 'required|boolean',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid trades data',
                    'errors' => $validator->errors()
                ], 400);
            }

            $trades = $request->input('trades');
            $savedCount = 0;
            $updatedCount = 0;

            foreach ($trades as $tradeData) {
                try {
                    // Parse data
                    $pnlStr = str_replace(['+', '$', ','], '', $tradeData['pnl']);
                    $pnlAmount = (float)$pnlStr;
                    
                    $entryStr = $tradeData['entry'] !== 'N/A' ? str_replace(['$', ','], '', $tradeData['entry']) : '0';
                    $entryPrice = (float)$entryStr;
                    
                    // Determine direction
                    $direction = 'BUY';
                    if (stripos($tradeData['type'], 'LONG') !== false) $direction = 'LONG';
                    elseif (stripos($tradeData['type'], 'SHORT') !== false) $direction = 'SHORT';
                    elseif (stripos($tradeData['type'], 'SELL') !== false) $direction = 'SELL';
                    
                    // Parse leverage
                    preg_match('/(\d+)x/', $tradeData['type'], $leverageMatch);
                    $leverage = isset($leverageMatch[1]) ? (float)$leverageMatch[1] : null;
                    
                    // Parse position size
                    $sizeStr = explode(' ', $tradeData['size'])[0];
                    $positionSize = (float)str_replace(',', '', $sizeStr);
                    
                    // Parse PnL percentage
                    $pnlPercentage = null;
                    if ($tradeData['percent'] !== '-') {
                        $pnlPercentage = (float)str_replace('%', '', $tradeData['percent']);
                    }
                    
                    $status = $tradeData['positive'] ? 'WIN' : 'LOSS';
                    
                    // Check if trade already exists (by pairs and entry price)
                    $existingTrade = \App\Models\Trade::where('user_id', $user->id)
                        ->where('cex_account_id', $account->id)
                        ->where('pairs', $tradeData['asset'])
                        ->where('entry_price', $entryPrice)
                        ->where('is_manual', false)
                        ->first();
                    
                    if ($existingTrade) {
                        // Update existing trade (only auto fields, preserve manual fields)
                        $existingTrade->update([
                            'direction' => $direction,
                            'leverage' => $leverage,
                            'position_size' => $positionSize,
                            'status' => $status,
                            'pnl_amount' => $pnlAmount,
                            'pnl_percentage' => $pnlPercentage,
                            'synced_at' => now(),
                        ]);
                        $updatedCount++;
                    } else {
                        // Create new trade
                        \App\Models\Trade::create([
                            'user_id' => $user->id,
                            'cex_account_id' => $account->id,
                            'trade_date' => now(),
                            'pairs' => $tradeData['asset'],
                            'direction' => $direction,
                            'leverage' => $leverage,
                            'position_size' => $positionSize,
                            'entry_price' => $entryPrice,
                            'exit_price' => null,
                            'status' => $status,
                            'pnl_amount' => $pnlAmount,
                            'pnl_percentage' => $pnlPercentage,
                            'is_manual' => false,
                            'synced_at' => now(),
                        ]);
                        $savedCount++;
                    }
                    
                } catch (\Exception $e) {
                    Log::warning("Failed to sync trade: " . $e->getMessage(), [
                        'trade' => $tradeData
                    ]);
                    continue;
                }
            }

            Log::info("Synced trades for CEX account {$account->id}: {$savedCount} new, {$updatedCount} updated");

            return response()->json([
                'success' => true,
                'message' => 'Trades synced successfully',
                'data' => [
                    'saved' => $savedCount,
                    'updated' => $updatedCount,
                    'total' => $savedCount + $updatedCount
                ]
            ]);

        } catch (\Exception $e) {
            Log::error("Failed to sync trades: " . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to sync trades: ' . $e->getMessage()
            ], 500);
        }
    }
}
