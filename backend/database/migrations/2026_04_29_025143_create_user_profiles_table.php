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
        Schema::create('user_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('trader_type')->nullable(); // day, swing, long
            $table->enum('gender', ['Male', 'Female'])->nullable();
            $table->integer('birth_year')->nullable();
            $table->string('primary_goal')->nullable();
            $table->json('acquisition_sources')->nullable(); // Simpan array sosmed
            $table->string('subscription_plan')->default('free');
            $table->string('broker')->nullable();
            $table->string('sync_method')->nullable(); // auto, manual
            $table->string('api_key')->nullable();
            $table->string('api_secret')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_profiles');
    }
};
