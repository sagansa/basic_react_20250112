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
        Schema::create('operational_houses', function (Blueprint $table) {
            $table->id();
            $table->string('image')->nullable();
            $table->date('date');
            $table->date('month');
            $table->bigInteger('amount');
            $table->enum('credit_debit',['cr', 'db']);
            $table->text('notes')->nullable();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('operational_houses');
    }
};
