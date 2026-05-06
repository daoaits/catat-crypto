<?php

namespace App\Services\Exchanges;

interface ExchangeInterface
{
    /**
     * Sync account data from exchange
     * 
     * @param string $apiKey
     * @param string $apiSecret
     * @param string|null $apiPassphrase
     * @param int|null $userId User ID for saving trades to database
     * @param int|null $cexAccountId CEX Account ID for saving trades to database
     * @return array Portfolio data
     */
    public function syncAccount(string $apiKey, string $apiSecret, ?string $apiPassphrase = null, ?int $userId = null, ?int $cexAccountId = null): array;

    /**
     * Get trading history from exchange
     * 
     * @param string $apiKey
     * @param string $apiSecret
     * @param string|null $apiPassphrase
     * @param int $days Number of days to fetch (default 30)
     * @return array Trading history data
     */
    public function getTradeHistory(string $apiKey, string $apiSecret, ?string $apiPassphrase = null, int $days = 30): array;

    /**
     * Get exchange name
     * 
     * @return string
     */
    public function getName(): string;

    /**
     * Validate API credentials format
     * 
     * @param string $apiKey
     * @param string $apiSecret
     * @return bool
     */
    public function validateCredentials(string $apiKey, string $apiSecret): bool;
}
