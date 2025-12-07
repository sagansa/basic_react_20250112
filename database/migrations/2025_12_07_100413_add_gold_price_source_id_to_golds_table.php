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
        Schema::table('golds', function (Blueprint $table) {
            $table->foreignId('gold_price_source_id')->nullable()->constrained('gold_price_sources')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('golds', function (Blueprint $table) {
            $table->dropForeign(['gold_price_source_id']);
            $table->dropColumn('gold_price_source_id');
        });
    }
};
