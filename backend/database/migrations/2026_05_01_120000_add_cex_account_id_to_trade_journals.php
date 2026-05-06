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
        Schema::table('trade_journals', function (Blueprint $table) {
            // Drop old unique constraint (user_id + trade_date)
            $table->dropUnique(['user_id', 'trade_date']);
            
            // Add cex_account_id column
            $table->foreignId('cex_account_id')
                ->nullable()
                ->after('user_id')
                ->constrained('user_cex_accounts')
                ->onDelete('cascade');
            
            // Add new unique constraint (user_id + cex_account_id + trade_date)
            // One journal per user per CEX account per day
            $table->unique(['user_id', 'cex_account_id', 'trade_date'], 'journal_unique_per_cex_date');
            
            // Add index for faster queries
            $table->index(['cex_account_id', 'trade_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('trade_journals', function (Blueprint $table) {
            // Drop new unique constraint
            $table->dropUnique('journal_unique_per_cex_date');
            
            // Drop index
            $table->dropIndex(['cex_account_id', 'trade_date']);
            
            // Drop foreign key and column
            $table->dropForeign(['cex_account_id']);
            $table->dropColumn('cex_account_id');
            
            // Restore old unique constraint
            $table->unique(['user_id', 'trade_date']);
        });
    }
};
