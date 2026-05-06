<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\UserProfile;
use App\Models\UserCexAccount;
use Illuminate\Support\Facades\Hash;

class OnboardingController extends Controller
{
    public function checkEmail(Request $request)
    {
        $request->validate([
            'email' => 'required|email|unique:users',
        ]);

        return response()->json(['message' => 'Email is available']);
    }

    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users',
            'password' => 'required|string',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        return response()->json([
            'message' => 'Registration successful',
            'user' => ['id' => $user->id, 'name' => $user->name, 'email' => $user->email]
        ]);
    }

    public function registerComplete(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users',
            'password' => 'required|string',
            'trader_type' => 'nullable|string',
            'gender' => 'nullable|string',
            'birth_year' => 'nullable|string',
            'primary_goal' => 'nullable|string',
            'acquisition_sources' => 'nullable|array',
            'subscription_plan' => 'nullable|string',
            'broker' => 'nullable|string',
            'sync_method' => 'nullable|string',
            'api_key' => 'nullable|string',
            'api_secret' => 'nullable|string',
            'api_passphrase' => 'nullable|string',
        ]);

        \DB::beginTransaction();
        try {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);

            $profile = UserProfile::create([
                'user_id' => $user->id,
                'trader_type' => $request->trader_type,
                'gender' => $request->gender,
                'birth_year' => $request->birth_year,
                'primary_goal' => $request->primary_goal,
                'acquisition_sources' => $request->acquisition_sources,
                'subscription_plan' => $request->subscription_plan,
                'broker' => $request->broker, // Keep for backward compatibility
                'sync_method' => $request->sync_method,
                // ❌ Removed: api_key, api_secret, api_passphrase (moved to user_cex_accounts)
            ]);

            // ✅ NEW SYSTEM: Create CEX account if API credentials provided
            if ($request->broker && $request->api_key && $request->api_secret) {
                UserCexAccount::create([
                    'user_id' => $user->id,
                    'cex_name' => $request->broker, // e.g., 'binance', 'tokocrypto'
                    'account_label' => 'Main Account',
                    'api_key' => $request->api_key,
                    'api_secret' => $request->api_secret,
                    'api_passphrase' => $request->api_passphrase,
                    'is_active' => true,
                ]);
            }

            \DB::commit();

            // Generate Sanctum token for auto-login after registration
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'message' => 'Registration and onboarding complete',
                'user' => ['id' => $user->id, 'name' => $user->name, 'email' => $user->email],
                'profile' => $profile,
                'token' => $token
            ]);
        } catch (\Exception $e) {
            \DB::rollBack();
            return response()->json(['message' => 'Registration failed: ' . $e.getMessage()], 500);
        }
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        // Generate Sanctum token
        $token = $user->createToken('auth_token')->plainTextToken;

        $profile = UserProfile::where('user_id', $user->id)->first();

        return response()->json([
            'message' => 'Login successful',
            'user' => ['id' => $user->id, 'name' => $user->name, 'email' => $user->email],
            'profile' => $profile,
            'token' => $token
        ]);
    }

    public function updateProfile(Request $request)
    {
        $request->validate([
            'userId' => 'required|exists:users,id',
        ]);

        $profile = UserProfile::updateOrCreate(
            ['user_id' => $request->userId],
            $request->only([
                'trader_type', 'gender', 'birth_year', 
                'primary_goal', 'acquisition_sources', 
                'subscription_plan', 'broker', 'sync_method'
                // ❌ Removed: api_key, api_secret, api_passphrase
                // Use /api/cex-accounts endpoint to manage CEX accounts
            ])
        );

        return response()->json([
            'message' => 'Profile updated successfully',
            'profile' => $profile
        ]);
    }

    public function users()
    {
        $users = User::select('id', 'name', 'email')->get();
        return response()->json($users);
    }
}
