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
        Schema::create('trade_journals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->date('trade_date'); // Tanggal trading
            $table->text('remarks')->nullable(); // Catatan/journal text
            $table->json('screenshots')->nullable(); // Array of screenshot URLs
            $table->string('mood')->nullable(); // Mood/psychology state
            $table->decimal('pnl', 15, 2)->nullable(); // P&L for that day
            $table->integer('trades_count')->default(0); // Number of trades
            $table->timestamps();
            
            // Index untuk query cepat
            $table->index(['user_id', 'trade_date']);
            $table->unique(['user_id', 'trade_date']); // One journal per user per day
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('trade_journals');
    }
};
