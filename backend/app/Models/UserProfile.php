<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserProfile extends Model
{
    protected $fillable = [
        'user_id', 'trader_type', 'gender', 'birth_year', 
        'primary_goal', 'acquisition_sources', 'subscription_plan',
        'broker', 'sync_method', 'api_key', 'api_secret', 'api_passphrase'
    ];

    protected function casts(): array
    {
        return [
            'acquisition_sources' => 'array',
        ];
    }
}
