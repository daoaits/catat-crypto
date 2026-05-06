<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\UserProfile;
use App\Models\UserCexAccount;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * Migrate existing CEX accounts from user_profiles to user_cex_accounts
     */
    public function up(): void
    {
        // Get all user profiles that have API credentials
        $profiles = UserProfile::whereNotNull('api_key')
            ->whereNotNull('api_secret')
            ->whereNotNull('broker')
            ->get();

        foreach ($profiles as $profile) {
            // Check if account already exists in new table
            $exists = UserCexAccount::where('user_id', $profile->user_id)
                ->where('cex_name', strtolower($profile->broker))
                ->exists();

            if (!$exists) {
                // Create new CEX account entry
                UserCexAccount::create([
                    'user_id' => $profile->user_id,
                    'cex_name' => strtolower($profile->broker),
                    'account_label' => 'Main Account',
                    'api_key' => $profile->api_key,
                    'api_secret' => $profile->api_secret,
                    'api_passphrase' => $profile->api_passphrase,
                    'is_active' => true,
                    'created_at' => $profile->created_at,
                    'updated_at' => $profile->updated_at,
                ]);

                \Log::info("Migrated CEX account for user {$profile->user_id}: {$profile->broker}");
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Optional: Remove migrated accounts
        // UserCexAccount::where('account_label', 'Main Account')->delete();
    }
};
