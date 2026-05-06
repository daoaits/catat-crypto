<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TradeJournal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class TradeJournalController extends Controller
{
    /**
     * Get journal entries for a specific month
     */
    public function index(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'year' => 'required|integer|min:2020|max:2100',
            'month' => 'required|integer|min:1|max:12',
            'cex_account_id' => 'nullable|integer|exists:user_cex_accounts,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid parameters',
                'errors' => $validator->errors()
            ], 400);
        }

        $user = Auth::user();
        $year = $request->input('year');
        $month = $request->input('month');
        $cexAccountId = $request->input('cex_account_id');

        // Build query
        $query = TradeJournal::where('user_id', $user->id)
            ->whereYear('trade_date', $year)
            ->whereMonth('trade_date', $month);

        // Filter by CEX account if provided
        if ($cexAccountId) {
            $query->where('cex_account_id', $cexAccountId);
        }

        $journals = $query->orderBy('trade_date', 'asc')->get();

        return response()->json([
            'success' => true,
            'data' => $journals
        ]);
    }

    /**
     * Get journal entry for a specific date
     */
    public function show(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'date' => 'required|date',
            'cex_account_id' => 'nullable|integer|exists:user_cex_accounts,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid date',
                'errors' => $validator->errors()
            ], 400);
        }

        $user = Auth::user();
        $date = $request->input('date');
        $cexAccountId = $request->input('cex_account_id');

        $query = TradeJournal::where('user_id', $user->id)
            ->where('trade_date', $date);

        // Filter by CEX account if provided
        if ($cexAccountId) {
            $query->where('cex_account_id', $cexAccountId);
        }

        $journal = $query->first();

        if (!$journal) {
            return response()->json([
                'success' => false,
                'message' => 'Journal entry not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $journal
        ]);
    }

    /**
     * Create or update journal entry
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'cex_account_id' => 'required|integer|exists:user_cex_accounts,id',
            'trade_date' => 'required|date',
            'remarks' => 'nullable|string|max:16777215', // MEDIUMTEXT max size
            'screenshots' => 'nullable|array',
            'screenshots.*' => 'nullable|string',
            'mood' => 'nullable|string|max:50',
            'pnl' => 'nullable|numeric',
            'trades_count' => 'nullable|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 400);
        }

        $user = Auth::user();

        // Verify that the CEX account belongs to the user
        $cexAccount = \App\Models\UserCexAccount::where('id', $request->input('cex_account_id'))
            ->where('user_id', $user->id)
            ->first();

        if (!$cexAccount) {
            return response()->json([
                'success' => false,
                'message' => 'CEX account not found or does not belong to you'
            ], 403);
        }

        // Create or update journal entry
        $journal = TradeJournal::updateOrCreate(
            [
                'user_id' => $user->id,
                'cex_account_id' => $request->input('cex_account_id'),
                'trade_date' => $request->input('trade_date'),
            ],
            [
                'remarks' => $request->input('remarks'),
                'screenshots' => $request->input('screenshots', []),
                'mood' => $request->input('mood'),
                'pnl' => $request->input('pnl'),
                'trades_count' => $request->input('trades_count', 0),
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Journal entry saved successfully',
            'data' => $journal
        ]);
    }

    /**
     * Delete journal entry
     */
    public function destroy(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'date' => 'required|date',
            'cex_account_id' => 'nullable|integer|exists:user_cex_accounts,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid date',
                'errors' => $validator->errors()
            ], 400);
        }

        $user = Auth::user();
        $date = $request->input('date');
        $cexAccountId = $request->input('cex_account_id');

        $query = TradeJournal::where('user_id', $user->id)
            ->where('trade_date', $date);

        // Filter by CEX account if provided
        if ($cexAccountId) {
            $query->where('cex_account_id', $cexAccountId);
        }

        $journal = $query->first();

        if (!$journal) {
            return response()->json([
                'success' => false,
                'message' => 'Journal entry not found'
            ], 404);
        }

        $journal->delete();

        return response()->json([
            'success' => true,
            'message' => 'Journal entry deleted successfully'
        ]);
    }
}
