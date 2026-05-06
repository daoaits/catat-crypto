<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Crypt;

class UserCexAccount extends Model
{
    protected $fillable = [
        'user_id',
        'cex_name',
        'account_label',
        'api_key',
        'api_secret',
        'api_passphrase',
        'is_active',
        'last_synced_at'
    ];

    protected $hidden = [
        'api_key',
        'api_secret',
        'api_passphrase'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'last_synced_at' => 'datetime',
    ];

    /**
     * Relationship with User
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Encrypt API Key before saving
     */
    public function setApiKeyAttribute($value)
    {
        $this->attributes['api_key'] = $value ? Crypt::encryptString($value) : null;
    }

    /**
     * Decrypt API Key when retrieving
     */
    public function getApiKeyAttribute($value)
    {
        try {
            return $value ? Crypt::decryptString($value) : null;
        } catch (\Exception $e) {
            return null;
        }
    }

    /**
     * Encrypt API Secret before saving
     */
    public function setApiSecretAttribute($value)
    {
        $this->attributes['api_secret'] = $value ? Crypt::encryptString($value) : null;
    }

    /**
     * Decrypt API Secret when retrieving
     */
    public function getApiSecretAttribute($value)
    {
        try {
            return $value ? Crypt::decryptString($value) : null;
        } catch (\Exception $e) {
            return null;
        }
    }

    /**
     * Encrypt API Passphrase before saving
     */
    public function setApiPassphraseAttribute($value)
    {
        $this->attributes['api_passphrase'] = $value ? Crypt::encryptString($value) : null;
    }

    /**
     * Decrypt API Passphrase when retrieving
     */
    public function getApiPassphraseAttribute($value)
    {
        try {
            return $value ? Crypt::decryptString($value) : null;
        } catch (\Exception $e) {
            return null;
        }
    }

    /**
     * Get display name for CEX
     */
    public function getCexDisplayNameAttribute()
    {
        $names = [
            'binance' => 'Binance',
            'bybit' => 'Bybit',
            'okx' => 'OKX',
            'mexc' => 'MEXC',
            'bitget' => 'Bitget',
            'indodax' => 'Indodax',
            'tokocrypto' => 'Tokocrypto',
        ];

        return $names[$this->cex_name] ?? ucfirst($this->cex_name);
    }

    /**
     * Get full account display name
     */
    public function getFullDisplayNameAttribute()
    {
        $label = $this->account_label ?: 'Main Account';
        return "{$this->cex_display_name} - {$label}";
    }

    /**
     * Check if CEX requires passphrase
     */
    public function requiresPassphrase()
    {
        return in_array($this->cex_name, ['okx', 'bitget']);
    }

    /**
     * Scope: Get active accounts only
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope: Get accounts for specific user
     */
    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }
}
