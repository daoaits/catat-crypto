<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Services\Exchanges\BinanceExchange;
use App\Services\Exchanges\BybitExchange;
use App\Services\Exchanges\OKXExchange;
use App\Services\Exchanges\MEXCExchange;
use App\Services\Exchanges\BitgetExchange;
use App\Services\Exchanges\IndodaxExchange;
use App\Services\Exchanges\TokocryptoExchange;

class ExchangeSyncController extends Controller
{
    public function syncBinance(Request $request)
    {
        $request->validate([
            'api_key' => 'required|string',
            'api_secret' => 'required|string',
        ]);

        try {
            $exchange = new BinanceExchange();
            $data = $exchange->syncAccount($request->api_key, $request->api_secret);
            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 400);
        }
    }

    public function syncBybit(Request $request)
    {
        $request->validate([
            'api_key' => 'required|string',
            'api_secret' => 'required|string',
        ]);

        try {
            $exchange = new BybitExchange();
            $data = $exchange->syncAccount($request->api_key, $request->api_secret);
            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 400);
        }
    }

    public function syncOKX(Request $request)
    {
        $request->validate([
            'api_key' => 'required|string',
            'api_secret' => 'required|string',
        ]);

        try {
            $exchange = new OKXExchange();
            $data = $exchange->syncAccount($request->api_key, $request->api_secret);
            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 400);
        }
    }

    public function syncMEXC(Request $request)
    {
        $request->validate([
            'api_key' => 'required|string',
            'api_secret' => 'required|string',
        ]);

        try {
            $exchange = new MEXCExchange();
            $data = $exchange->syncAccount($request->api_key, $request->api_secret);
            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 400);
        }
    }

    public function syncBitget(Request $request)
    {
        $request->validate([
            'api_key' => 'required|string',
            'api_secret' => 'required|string',
            'api_passphrase' => 'required|string',
        ]);

        try {
            $exchange = new BitgetExchange();
            $data = $exchange->syncAccount($request->api_key, $request->api_secret, $request->api_passphrase);
            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 400);
        }
    }

    public function syncIndodax(Request $request)
    {
        $request->validate([
            'api_key' => 'required|string',
            'api_secret' => 'required|string',
        ]);

        try {
            $exchange = new IndodaxExchange();
            $data = $exchange->syncAccount($request->api_key, $request->api_secret);
            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 400);
        }
    }

    public function syncTokocrypto(Request $request)
    {
        $request->validate([
            'api_key' => 'required|string',
            'api_secret' => 'required|string',
        ]);

        try {
            $exchange = new TokocryptoExchange();
            $data = $exchange->syncAccount($request->api_key, $request->api_secret);
            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 400);
        }
    }
}
