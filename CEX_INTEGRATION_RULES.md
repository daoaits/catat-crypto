# CEX Integration Rules & Guidelines

## 📋 Overview
Setiap Centralized Exchange (CEX) memiliki struktur API yang berbeda-beda. Dokumen ini berisi aturan dan best practices untuk memastikan integrasi yang konsisten dan bebas error.

---

## 🎯 Core Principles

### 1. **Setiap CEX Itu Unik**
- ❌ **JANGAN** copy-paste implementasi dari CEX lain
- ✅ **HARUS** baca dokumentasi API resmi CEX tersebut
- ✅ **HARUS** test dengan akun real sebelum deploy
- ✅ **HARUS** handle edge cases spesifik per CEX

### 2. **Test-Driven Integration**
- ✅ Buat test script PHP standalone SEBELUM implementasi Laravel
- ✅ Test dengan API credentials real
- ✅ Verifikasi response structure
- ✅ Dokumentasikan findings

---

## 🔧 Implementation Checklist

### Phase 1: Research & Planning
- [ ] Baca dokumentasi API resmi
- [ ] Identifikasi endpoint yang dibutuhkan:
  - [ ] Account balance endpoint
  - [ ] Trade history endpoint
  - [ ] Ticker/price endpoint (jika ada)
- [ ] Catat authentication method (API Key, Secret, Passphrase, dll)
- [ ] Catat rate limits
- [ ] Catat response structure

### Phase 2: Standalone Testing
- [ ] Buat file `test_{exchange}_research.php`
- [ ] Test authentication
- [ ] Test account balance endpoint
- [ ] Test trade history endpoint
- [ ] Test pricing/ticker endpoint
- [ ] Dokumentasikan semua findings di `{EXCHANGE}_API_NOTES.md`

### Phase 3: Laravel Implementation
- [ ] Buat class di `backend/app/Services/Exchanges/{Exchange}Exchange.php`
- [ ] Implement `ExchangeInterface`
- [ ] Implement `syncAccount()` method
- [ ] Implement `getTradeHistory()` method
- [ ] Add proper logging
- [ ] Handle errors gracefully

### Phase 4: Integration Testing
- [ ] Test via Laravel tinker
- [ ] Test via API endpoint
- [ ] Test via frontend
- [ ] Verify data accuracy
- [ ] Test error scenarios

### Phase 5: Documentation
- [ ] Update `LIST_API.md`
- [ ] Create `{EXCHANGE}_INTEGRATION_COMPLETE.md`
- [ ] Document known issues/limitations
- [ ] Add to main README

---

## 📊 Common CEX API Patterns

### Pattern 1: Binance-Style (Binance, Tokocrypto, MEXC)
```php
// Authentication: HMAC SHA256 signature
$timestamp = round(microtime(true) * 1000);
$queryString = 'recvWindow=60000&timestamp=' . $timestamp;
$signature = hash_hmac('sha256', $queryString, $apiSecret);

// Headers
'X-MBX-APIKEY: {apiKey}'

// Common endpoints
GET /api/v3/account
GET /api/v3/myTrades
GET /api/v3/ticker/price
```

**CEX yang menggunakan pattern ini:**
- Binance
- Tokocrypto (dengan modifikasi)
- MEXC (dengan modifikasi)

### Pattern 2: OKX-Style
```php
// Authentication: HMAC SHA256 + Base64
$timestamp = gmdate('Y-m-d\TH:i:s.000\Z');
$prehash = $timestamp . 'GET' . '/api/v5/account/balance';
$signature = base64_encode(hash_hmac('sha256', $prehash, $apiSecret, true));

// Headers
'OK-ACCESS-KEY: {apiKey}'
'OK-ACCESS-SIGN: {signature}'
'OK-ACCESS-TIMESTAMP: {timestamp}'
'OK-ACCESS-PASSPHRASE: {passphrase}'
```

**CEX yang menggunakan pattern ini:**
- OKX
- Bitget (similar)

### Pattern 3: Bybit-Style
```php
// Authentication: HMAC SHA256
$timestamp = round(microtime(true) * 1000);
$params = ['api_key' => $apiKey, 'timestamp' => $timestamp];
ksort($params);
$queryString = http_build_query($params);
$signature = hash_hmac('sha256', $queryString, $apiSecret);

// Headers
'X-BAPI-API-KEY: {apiKey}'
'X-BAPI-TIMESTAMP: {timestamp}'
'X-BAPI-SIGN: {signature}'
```

**CEX yang menggunakan pattern ini:**
- Bybit

### Pattern 4: Indodax-Style (Local Indonesian)
```php
// Authentication: HMAC SHA512
$data = ['method' => 'getInfo', 'timestamp' => time()];
$postData = http_build_query($data);
$signature = hash_hmac('sha512', $postData, $apiSecret);

// Headers
'Key: {apiKey}'
'Sign: {signature}'
```

**CEX yang menggunakan pattern ini:**
- Indodax

---

## ⚠️ Common Pitfalls & Solutions

### 1. **Pricing Data Issues**

#### Problem: CEX tidak menyediakan public ticker endpoint
**Example:** Tokocrypto

**Solution:**
```php
// Option A: Use totalOfBtc field + BTC price from reliable source
$btcPrice = getBtcPriceFromBinance();
$usdtValue = $balance['totalOfBtc'] * $btcPrice;

// Option B: Use quoteAssetValuation if available
$usdtValue = $balance['quoteAssetValuation'];

// Option C: Fetch from alternative source
$price = getCoinGeckoPrice($asset);
```

**CEX dengan issue ini:**
- ✅ Tokocrypto - Fixed dengan Option A

#### Problem: Ticker endpoint berbeda dari dokumentasi
**Example:** MEXC menggunakan `/api/v3/ticker/price` bukan `/open/api/v2/market/ticker`

**Solution:**
- Test multiple endpoint variations
- Check API version (v1, v2, v3)
- Try both `/api/` dan `/open/api/` prefixes

### 2. **Response Structure Differences**

#### Problem: Field names berbeda per CEX
```php
// Binance
$balance = $data['balances'];
$free = $balance['free'];
$locked = $balance['locked'];

// Tokocrypto
$balance = $data['data']['accountAssets'];
$free = $balance['free'];
$total = $balance['total']; // includes locked

// OKX
$balance = $data['data'][0]['details'];
$available = $balance['availBal'];
$frozen = $balance['frozenBal'];
```

**Solution:**
```php
// Always use null coalescing and provide fallbacks
$balances = $data['balances'] 
    ?? $data['data']['accountAssets'] 
    ?? $data['data'][0]['details'] 
    ?? [];

$free = (float)($balance['free'] 
    ?? $balance['available'] 
    ?? $balance['availBal'] 
    ?? 0);
```

### 3. **Authentication Variations**

#### Problem: Signature calculation berbeda
**Solutions per CEX:**

```php
// Binance-style: Query string
$signature = hash_hmac('sha256', $queryString, $apiSecret);

// OKX-style: Timestamp + Method + Path + Body
$prehash = $timestamp . 'GET' . '/api/v5/account/balance';
$signature = base64_encode(hash_hmac('sha256', $prehash, $apiSecret, true));

// Bitget-style: Timestamp + Method + Path + Body (with passphrase)
$prehash = $timestamp . 'GET' . '/api/v2/spot/account/assets';
$signature = base64_encode(hash_hmac('sha256', $prehash, $apiSecret, true));
```

### 4. **Timestamp Issues**

#### Problem: Clock skew / timestamp out of sync
**Solution:**
```php
// Always use large recvWindow for Binance-style
$recvWindow = 60000; // 60 seconds

// For OKX-style, use ISO 8601 format
$timestamp = gmdate('Y-m-d\TH:i:s.000\Z');

// For Unix timestamp, use milliseconds
$timestamp = round(microtime(true) * 1000);
```

### 5. **Rate Limiting**

#### Problem: Too many requests
**Solution:**
```php
// Add delays between requests
usleep(200000); // 200ms delay

// Implement exponential backoff
$retries = 0;
while ($retries < 3) {
    try {
        $response = makeRequest();
        break;
    } catch (RateLimitException $e) {
        $retries++;
        sleep(pow(2, $retries)); // 2s, 4s, 8s
    }
}
```

---

## 🧪 Testing Requirements

### Mandatory Tests for Each CEX

#### 1. Authentication Test
```php
// test_{exchange}_auth.php
// Verify API credentials work
// Expected: 200 OK response
```

#### 2. Balance Test
```php
// test_{exchange}_balance.php
// Fetch account balance
// Verify all assets are returned
// Verify USDT values are calculated correctly
```

#### 3. Trade History Test
```php
// test_{exchange}_trades.php
// Fetch recent trades
// Verify trade structure
// Verify PnL calculations
```

#### 4. Pricing Test
```php
// test_{exchange}_pricing.php
// Test ticker/price endpoint
// Verify prices are current
// Test fallback mechanisms
```

#### 5. Integration Test
```php
// test_{exchange}_laravel.php
// Test through Laravel framework
// Verify controller works
// Verify API endpoint returns correct JSON
```

---

## 📝 Documentation Requirements

### For Each New CEX Integration

#### 1. API Notes Document
**File:** `{EXCHANGE}_API_NOTES.md`

**Contents:**
- API documentation URL
- Authentication method
- Required credentials (API Key, Secret, Passphrase, etc.)
- Base URL
- Endpoint list with examples
- Response structure examples
- Known issues/limitations
- Rate limits

#### 2. Integration Complete Document
**File:** `{EXCHANGE}_INTEGRATION_COMPLETE.md`

**Contents:**
- Problem statement
- Solution approach
- Test results
- API response examples
- Files modified
- Verification steps
- Known limitations

#### 3. Update LIST_API.md
Add entry with:
- Exchange name
- Status (✅ Working / ⚠️ Partial / ❌ Not Working)
- Special notes
- Test credentials (if applicable)

---

## 🔍 Code Review Checklist

Before merging CEX integration:

### Code Quality
- [ ] No hardcoded credentials
- [ ] Proper error handling with try-catch
- [ ] Logging for debugging (use `Log::info()`, `Log::warning()`, `Log::error()`)
- [ ] No syntax errors or corrupted files
- [ ] Follows PSR-12 coding standards

### Functionality
- [ ] Implements `ExchangeInterface` correctly
- [ ] `syncAccount()` returns correct structure
- [ ] `getTradeHistory()` returns correct structure
- [ ] Handles empty responses gracefully
- [ ] Handles API errors gracefully

### Data Accuracy
- [ ] Balance calculations are correct
- [ ] USDT conversions are accurate
- [ ] Trade PnL calculations are correct
- [ ] Timestamps are handled correctly

### Testing
- [ ] All standalone tests pass
- [ ] Laravel integration test passes
- [ ] API endpoint test passes
- [ ] Frontend displays data correctly

### Documentation
- [ ] API notes documented
- [ ] Integration complete document created
- [ ] LIST_API.md updated
- [ ] Code comments added for complex logic

---

## 🚨 Red Flags to Watch For

### During Development
1. ⚠️ **Copy-pasting from another CEX** without understanding
2. ⚠️ **Skipping standalone tests** and going straight to Laravel
3. ⚠️ **Not reading API documentation** thoroughly
4. ⚠️ **Assuming response structure** without verifying
5. ⚠️ **Not handling errors** properly

### During Testing
1. ⚠️ **Balance showing $0** when account has funds
2. ⚠️ **All metrics showing errors** - likely authentication issue
3. ⚠️ **Inconsistent values** between refreshes - pricing issue
4. ⚠️ **Missing assets** - filtering issue
5. ⚠️ **Syntax errors** - file corruption or typos

### During Code Review
1. ⚠️ **No logging statements** - hard to debug
2. ⚠️ **No error handling** - will crash on API errors
3. ⚠️ **Hardcoded values** - not flexible
4. ⚠️ **No documentation** - hard to maintain
5. ⚠️ **No tests** - can't verify it works

---

## 📚 Reference Implementation

### Good Example: BinanceExchange.php
```php
class BinanceExchange implements ExchangeInterface
{
    private string $baseUrl = 'https://api.binance.com';

    public function syncAccount(string $apiKey, string $apiSecret, ?string $apiPassphrase = null): array
    {
        try {
            // 1. Prepare authentication
            $timestamp = round(microtime(true) * 1000);
            $recvWindow = 60000;
            $queryString = 'recvWindow=' . $recvWindow . '&timestamp=' . $timestamp;
            $signature = hash_hmac('sha256', $queryString, $apiSecret);

            // 2. Fetch account data
            $response = Http::withHeaders([
                'X-MBX-APIKEY' => $apiKey
            ])->get("{$this->baseUrl}/api/v3/account", [
                'recvWindow' => $recvWindow,
                'timestamp' => $timestamp,
                'signature' => $signature
            ]);

            // 3. Handle errors
            if (!$response->successful()) {
                Log::error('Binance API Error: ' . $response->body());
                throw new \Exception('Failed to fetch account data');
            }

            // 4. Process data
            $data = $response->json();
            $balances = $data['balances'] ?? [];
            
            // 5. Calculate values
            $totalUsdt = 0;
            foreach ($balances as $balance) {
                $asset = $balance['asset'];
                $free = (float)($balance['free'] ?? 0);
                $locked = (float)($balance['locked'] ?? 0);
                $total = $free + $locked;
                
                if ($total > 0) {
                    $usdtValue = $this->calculateUsdtValue($asset, $total);
                    $totalUsdt += $usdtValue;
                }
            }

            // 6. Return standardized format
            return [
                'totalBalance' => '$' . number_format($totalUsdt, 2),
                'netPnl' => '$0.00',
                'netPnlPercent' => '0.0%',
                // ... other fields
            ];

        } catch (\Exception $e) {
            Log::error('Binance Sync Error: ' . $e->getMessage());
            throw $e;
        }
    }
}
```

---

## 🎓 Learning from Past Issues

### Case Study 1: Tokocrypto File Corruption
**Problem:** File had `</content>` characters in the middle of code

**Root Cause:** Unknown - possibly editor issue or copy-paste error

**Prevention:**
- Always validate PHP syntax after editing: `php -l filename.php`
- Use proper IDE with syntax checking
- Review diffs before committing
- Run tests after any file modification

### Case Study 2: Tokocrypto Pricing Issue
**Problem:** Tried to use non-existent ticker endpoint

**Root Cause:** Assumed Tokocrypto had same endpoints as Binance

**Prevention:**
- Always test endpoints in standalone script first
- Read API documentation thoroughly
- Have fallback pricing mechanisms
- Document which endpoints work and which don't

### Case Study 3: MEXC Endpoint Confusion
**Problem:** Documentation showed `/open/api/v2/` but actual endpoint was `/api/v3/`

**Root Cause:** Outdated documentation

**Prevention:**
- Test multiple endpoint variations
- Check API version numbers
- Look for community examples
- Document actual working endpoints

---

## 🔄 Maintenance Guidelines

### Regular Checks
- [ ] Monthly: Verify all CEX integrations still work
- [ ] After API updates: Re-test affected CEX
- [ ] After Laravel updates: Test all integrations
- [ ] After major changes: Full regression testing

### When CEX Updates Their API
1. Check changelog/announcement
2. Identify breaking changes
3. Update implementation
4. Re-run all tests
5. Update documentation
6. Deploy with caution

### Monitoring
- Set up alerts for API errors
- Log all API responses for debugging
- Track success/failure rates
- Monitor response times

---

## 📞 Support & Resources

### Official API Documentation Links
- **Binance:** https://binance-docs.github.io/apidocs/spot/en/
- **Bybit:** https://bybit-exchange.github.io/docs/v5/intro
- **OKX:** https://www.okx.com/docs-v5/en/
- **MEXC:** https://mexcdevelop.github.io/apidocs/spot_v3_en/
- **Bitget:** https://www.bitget.com/api-doc/spot/intro
- **Indodax:** https://github.com/btcid/indodax-official-api-docs
- **Tokocrypto:** https://www.tokocrypto.com/apidocs/

### Community Resources
- GitHub Issues for each CEX
- Trading API Discord/Telegram groups
- Stack Overflow
- Reddit r/algotrading

### Internal Resources
- `LIST_API.md` - Status of all integrations
- `{EXCHANGE}_API_NOTES.md` - Detailed API notes
- `test_*.php` files - Working examples
- Laravel logs - `storage/logs/laravel.log`

---

## ✅ Success Criteria

A CEX integration is considered **complete and production-ready** when:

1. ✅ All standalone tests pass
2. ✅ Laravel integration test passes
3. ✅ API endpoint returns correct JSON
4. ✅ Frontend displays data correctly
5. ✅ Balance matches actual account balance (±1% tolerance)
6. ✅ All documentation is complete
7. ✅ Code review checklist is satisfied
8. ✅ No known critical bugs
9. ✅ Error handling is robust
10. ✅ Logging is comprehensive

---

## 📋 Quick Reference

### New CEX Integration Workflow
```
1. Research (1-2 hours)
   └─ Read docs, identify endpoints
   
2. Standalone Testing (2-4 hours)
   └─ Create test scripts, verify responses
   
3. Documentation (30 mins)
   └─ Create API notes document
   
4. Laravel Implementation (2-3 hours)
   └─ Create Exchange class, implement interface
   
5. Integration Testing (1-2 hours)
   └─ Test via Laravel, API, Frontend
   
6. Final Documentation (30 mins)
   └─ Create integration complete document
   
7. Code Review (30 mins)
   └─ Self-review using checklist
   
Total: ~8-12 hours per CEX
```

### Emergency Debugging Steps
```
1. Check Laravel logs: tail -f storage/logs/laravel.log
2. Test authentication: php test_{exchange}_auth.php
3. Test endpoint directly: curl with proper headers
4. Verify response structure: print_r($response->json())
5. Check for typos in API keys
6. Verify timestamp is correct
7. Check rate limits
8. Try with different recvWindow values
```

---

**Last Updated:** April 30, 2026  
**Version:** 1.0  
**Maintainer:** Development Team

---

## 🎯 Remember

> "Setiap CEX itu unik. Jangan asumsikan, selalu verifikasi!"

> "Test dulu, implement kemudian. Bukan sebaliknya!"

> "Dokumentasi yang baik = maintenance yang mudah!"
