<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TradeJournal extends Model
{
    protected $fillable = [
        'user_id',
        'cex_account_id',
        'trade_date',
        'remarks',
        'screenshots',
        'mood',
        'pnl',
        'trades_count',
    ];

    protected $casts = [
        'trade_date' => 'date',
        'screenshots' => 'array',
        'pnl' => 'decimal:2',
        'trades_count' => 'integer',
    ];

    /**
     * Get the user that owns the journal entry
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the CEX account that this journal belongs to
     */
    public function cexAccount(): BelongsTo
    {
        return $this->belongsTo(UserCexAccount::class, 'cex_account_id');
    }
}
