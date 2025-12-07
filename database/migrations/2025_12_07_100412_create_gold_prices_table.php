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
        Schema::create('gold_prices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('gold_price_source_id')->constrained('gold_price_sources')->onDelete('cascade');
            $table->date('date'); // Tanggal harga
            $table->decimal('weight', 10, 3); // Berat dalam gram (misal: 5, 10, 25)
            $table->integer('price'); // Harga untuk weight tersebut
            $table->timestamps();
            
            // Unique constraint: satu source, satu tanggal, satu weight = satu harga
            $table->unique(['gold_price_source_id', 'date', 'weight']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('gold_prices');
    }
};
