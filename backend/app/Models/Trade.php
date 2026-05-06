<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Trade extends Model
{
    protected $fillable = [
        'user_id',
        'cex_account_id',
        'trade_date',
        'pairs',
        'direction',
        'leverage',
        'position_size',
        'entry_price',
        'exit_price',
        'status',
        'pnl_amount',
        'pnl_percentage',
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
        'is_manual',
        'synced_at',
    ];

    protected $casts = [
        'trade_date' => 'datetime',
        'leverage' => 'decimal:2',
        'position_size' => 'decimal:8',
        'entry_price' => 'decimal:8',
        'exit_price' => 'decimal:8',
        'pnl_amount' => 'decimal:8',
        'pnl_percentage' => 'decimal:4',
        'risk_percentage' => 'decimal:2',
        'mid_trade_changes' => 'integer',
        'entry_window' => 'integer',
        'pre_trade_confidence' => 'integer',
        'emotional_load' => 'integer',
        'is_manual' => 'boolean',
        'synced_at' => 'datetime',
    ];

    /**
     * Get the user that owns the trade
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the CEX account that this trade belongs to
     */
    public function cexAccount(): BelongsTo
    {
        return $this->belongsTo(UserCexAccount::class, 'cex_account_id');
    }
}
