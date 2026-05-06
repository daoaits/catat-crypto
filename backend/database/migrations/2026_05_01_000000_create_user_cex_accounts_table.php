<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('user_cex_accounts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('cex_name', 50); // 'binance', 'bybit', 'okx', etc.
            $table->string('account_label', 100)->nullable(); // "My Binance Main", etc.
            $table->text('api_key'); // Encrypted
            $table->text('api_secret'); // Encrypted
            $table->text('api_passphrase')->nullable(); // Encrypted, for OKX, Bitget
            $table->boolean('is_active')->default(true);
            $table->timestamp('last_synced_at')->nullable();
            $table->timestamps();
            
            // Ensure unique combination of user_id, cex_name, and account_label
            $table->unique(['user_id', 'cex_name', 'account_label'], 'unique_user_cex_label');
            
            // Index for faster queries
            $table->index(['user_id', 'is_active']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_cex_accounts');
    }
};
