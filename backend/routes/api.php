<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\OnboardingController;
use App\Http\Controllers\Api\ExchangeSyncController;
use App\Http\Controllers\Api\TradeJournalController;
use App\Http\Controllers\Api\CexAccountController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/register', [OnboardingController::class, 'register']);
Route::post('/register-complete', [OnboardingController::class, 'registerComplete']);
Route::post('/check-email', [OnboardingController::class, 'checkEmail']);
Route::post('/login', [OnboardingController::class, 'login']);
Route::post('/onboarding', [OnboardingController::class, 'updateProfile']);
Route::get('/users', [OnboardingController::class, 'users']);

// Exchange Sync Endpoints - Specific per exchange
Route::post('/sync/binance', [ExchangeSyncController::class, 'syncBinance']);
Route::post('/sync/bybit', [ExchangeSyncController::class, 'syncBybit']);
Route::post('/sync/okx', [ExchangeSyncController::class, 'syncOKX']);
Route::post('/sync/mexc', [ExchangeSyncController::class, 'syncMEXC']);
Route::post('/sync/bitget', [ExchangeSyncController::class, 'syncBitget']);
Route::post('/sync/indodax', [ExchangeSyncController::class, 'syncIndodax']);
Route::post('/sync/tokocrypto', [ExchangeSyncController::class, 'syncTokocrypto']);

// Trade Journal Endpoints
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/journals', [TradeJournalController::class, 'index']); // Get journals for a month
    Route::get('/journal', [TradeJournalController::class, 'show']); // Get specific journal
    Route::post('/journal', [TradeJournalController::class, 'store']); // Create/Update journal
    Route::delete('/journal', [TradeJournalController::class, 'destroy']); // Delete journal
    
    // Trade Endpoints (NEW)
    Route::get('/trades', [\App\Http\Controllers\Api\TradeController::class, 'index']); // Get all trades
    Route::get('/trades/{id}', [\App\Http\Controllers\Api\TradeController::class, 'show']); // Get trade detail
    Route::post('/trades', [\App\Http\Controllers\Api\TradeController::class, 'store']); // Create manual trade
    Route::put('/trades/{id}', [\App\Http\Controllers\Api\TradeController::class, 'update']); // Update trade
    Route::delete('/trades/{id}', [\App\Http\Controllers\Api\TradeController::class, 'destroy']); // Delete trade
    
    // CEX Account Management Endpoints
    Route::get('/cex-accounts', [CexAccountController::class, 'index']); // Get all user's CEX accounts
    Route::post('/cex-accounts', [CexAccountController::class, 'store']); // Add new CEX account
    Route::put('/cex-accounts/{id}', [CexAccountController::class, 'update']); // Update CEX account
    Route::delete('/cex-accounts/{id}', [CexAccountController::class, 'destroy']); // Delete CEX account
    Route::post('/cex-accounts/{id}/test', [CexAccountController::class, 'testConnection']); // Test connection
    Route::post('/cex-accounts/{id}/sync', [CexAccountController::class, 'sync']); // Sync specific account
    Route::post('/cex-accounts/sync-all', [CexAccountController::class, 'syncAll']); // Sync all accounts (Unified View)
    Route::post('/cex-accounts/{id}/sync-trades', [CexAccountController::class, 'syncTrades']); // Sync trades to database
});

// Public CEX endpoints (no auth required)
Route::get('/cex-accounts/supported', [CexAccountController::class, 'supported']); // Get supported CEX list
