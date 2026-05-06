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
        // Change remarks column to support large HTML content with images
        // PostgreSQL TEXT type can store up to 1GB, so no need for MEDIUMTEXT equivalent
        // MySQL MEDIUMTEXT = 16MB, PostgreSQL TEXT = 1GB
        Schema::table('trade_journals', function (Blueprint $table) {
            $table->text('remarks')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No need to revert as TEXT is the standard type
        Schema::table('trade_journals', function (Blueprint $table) {
            $table->text('remarks')->nullable()->change();
        });
    }
};
