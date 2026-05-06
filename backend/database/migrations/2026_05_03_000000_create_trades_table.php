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
        Schema::create('trades', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('cex_account_id')->constrained('user_cex_accounts')->onDelete('cascade');
            
            // AUTO FIELDS (from API - Green in Excel)
            $table->timestamp('trade_date');
            $table->string('pairs'); // Symbol like BTC/USDT
            $table->enum('direction', ['LONG', 'SHORT', 'BUY', 'SELL'])->nullable();
            $table->decimal('leverage', 8, 2)->nullable();
            $table->decimal('position_size', 20, 8)->nullable();
            $table->decimal('entry_price', 20, 8)->nullable();
            $table->decimal('exit_price', 20, 8)->nullable();
            $table->enum('status', ['WIN', 'LOSE', 'OPEN'])->default('OPEN');
            $table->decimal('pnl_amount', 20, 8)->nullable();
            $table->decimal('pnl_percentage', 10, 4)->nullable();
            
            // MANUAL FIELDS (user input - Yellow in Excel)
            $table->enum('session', ['Asian Session', 'US Session', 'London Session'])->nullable();
            $table->enum('market_cap', ['High-Cap', 'Mid-Cap', 'Low-Cap'])->nullable();
            $table->enum('primary_setup_type', [
                'Breakout', 
                'Pullback', 
                'Reversal', 
                'Trend Continuation', 
                'Range Trade', 
                'News/Event'
            ])->nullable();
            $table->enum('key_indicators', [
                'EMA crossover',
                'RSI divergence',
                'Volume spike',
                'Order block',
                'Liquidity grab'
            ])->nullable();
            $table->string('timeframe_analysis')->nullable(); // e.g., "4H and Daily"
            $table->decimal('risk_percentage', 5, 2)->nullable();
            $table->integer('mid_trade_changes')->default(0);
            $table->integer('entry_window')->nullable(); // in minutes
            $table->integer('pre_trade_confidence')->nullable(); // 1-10
            $table->integer('emotional_load')->nullable(); // 1-10
            $table->string('photo_url')->nullable();
            $table->text('remarks')->nullable();
            
            // METADATA
            $table->boolean('is_manual')->default(false); // true if manually created
            $table->timestamp('synced_at')->nullable(); // last sync from API
            $table->timestamps();
            
            // Indexes
            $table->index(['user_id', 'cex_account_id', 'trade_date']);
            $table->index(['status']);
            $table->index(['pairs']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('trades');
    }
};
