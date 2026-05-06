<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Trade;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class TradeController extends Controller
{
    /**
     * Get all trades for authenticated user
     */
    public function index(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'cex_account_id' => 'nullable|integer|exists:user_cex_accounts,id',
            'status' => 'nullable|in:WIN,LOSE,OPEN',
            'direction' => 'nullable|in:LONG,SHORT,BUY,SELL',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid parameters',
                'errors' => $validator->errors()
            ], 400);
        }

        $user = Auth::user();
        $query = Trade::where('user_id', $user->id);

        // Apply filters
        if ($request->has('cex_account_id')) {
            $query->where('cex_account_id', $request->cex_account_id);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('direction')) {
            $query->where('direction', $request->direction);
        }

        if ($request->has('start_date')) {
            $query->whereDate('trade_date', '>=', $request->start_date);
        }

        if ($request->has('end_date')) {
            $query->whereDate('trade_date', '<=', $request->end_date);
        }

        $trades = $query->with('cexAccount')
            ->orderBy('trade_date', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $trades
        ]);
    }

    /**
     * Get single trade detail
     */
    public function show($id)
    {
        $user = Auth::user();
        $trade = Trade::where('user_id', $user->id)
            ->where('id', $id)
            ->with('cexAccount')
            ->first();

        if (!$trade) {
            return response()->json([
                'success' => false,
                'message' => 'Trade not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $trade
        ]);
    }

    /**
     * Update trade (manual fields only)
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'session' => 'nullable|in:Asian Session,US Session,London Session',
            'market_cap' => 'nullable|in:High-Cap,Mid-Cap,Low-Cap',
            'primary_setup_type' => 'nullable|in:Breakout,Pullback,Reversal,Trend Continuation,Range Trade,News/Event',
            'key_indicators' => 'nullable|in:EMA crossover,RSI divergence,Volume spike,Order block,Liquidity grab',
            'timeframe_analysis' => 'nullable|string|max:255',
            'risk_percentage' => 'nullable|numeric|min:0|max:100',
            'mid_trade_changes' => 'nullable|integer|min:0',
            'entry_window' => 'nullable|integer|min:0',
            'pre_trade_confidence' => 'nullable|integer|min:1|max:10',
            'emotional_load' => 'nullable|integer|min:1|max:10',
            'photo_url' => 'nullable|string|max:500',
            'remarks' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 400);
        }

        $user = Auth::user();
        $trade = Trade::where('user_id', $user->id)
            ->where('id', $id)
            ->first();

        if (!$trade) {
            return response()->json([
                'success' => false,
                'message' => 'Trade not found'
            ], 404);
        }

        // Update only manual fields
        $trade->update($request->only([
            'session',
            'market_cap',
            'primary_setup_type',
            'key_indicators',
            'timeframe_analysis',
            'risk_percentage',
            'mid_trade_changes',
            'entry_window',
            'pre_trade_confidence',
            'emotional_load',
            'photo_url',
            'remarks',
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Trade updated successfully',
            'data' => $trade
        ]);
    }

    /**
     * Delete trade
     */
    public function destroy($id)
    {
        $user = Auth::user();
        $trade = Trade::where('user_id', $user->id)
            ->where('id', $id)
            ->first();

        if (!$trade) {
            return response()->json([
                'success' => false,
                'message' => 'Trade not found'
            ], 404);
        }

        $trade->delete();

        return response()->json([
            'success' => true,
            'message' => 'Trade deleted successfully'
        ]);
    }

    /**
     * Create manual trade
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'cex_account_id' => 'required|integer|exists:user_cex_accounts,id',
            'trade_date' => 'required|date',
            'pairs' => 'required|string|max:50',
            'direction' => 'required|in:LONG,SHORT,BUY,SELL',
            'leverage' => 'nullable|numeric|min:1',
            'position_size' => 'nullable|numeric|min:0',
            'entry_price' => 'nullable|numeric|min:0',
            'exit_price' => 'nullable|numeric|min:0',
            'status' => 'required|in:WIN,LOSE,OPEN',
            'pnl_amount' => 'nullable|numeric',
            'pnl_percentage' => 'nullable|numeric',
            // Manual fields
            'session' => 'nullable|in:Asian Session,US Session,London Session',
            'market_cap' => 'nullable|in:High-Cap,Mid-Cap,Low-Cap',
            'primary_setup_type' => 'nullable|in:Breakout,Pullback,Reversal,Trend Continuation,Range Trade,News/Event',
            'key_indicators' => 'nullable|in:EMA crossover,RSI divergence,Volume spike,Order block,Liquidity grab',
            'timeframe_analysis' => 'nullable|string|max:255',
            'risk_percentage' => 'nullable|numeric|min:0|max:100',
            'mid_trade_changes' => 'nullable|integer|min:0',
            'entry_window' => 'nullable|integer|min:0',
            'pre_trade_confidence' => 'nullable|integer|min:1|max:10',
            'emotional_load' => 'nullable|integer|min:1|max:10',
            'photo_url' => 'nullable|string|max:500',
            'remarks' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 400);
        }

        $user = Auth::user();

        // Verify CEX account belongs to user
        $cexAccount = \App\Models\UserCexAccount::where('id', $request->cex_account_id)
            ->where('user_id', $user->id)
            ->first();

        if (!$cexAccount) {
            return response()->json([
                'success' => false,
                'message' => 'CEX account not found or does not belong to you'
            ], 403);
        }

        $trade = Trade::create(array_merge(
            $request->all(),
            [
                'user_id' => $user->id,
                'is_manual' => true,
            ]
        ));

        return response()->json([
            'success' => true,
            'message' => 'Trade created successfully',
            'data' => $trade
        ], 201);
    }
}
