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
        Schema::create('grades', function (Blueprint $table) {
            $table->id();
            $table->text('image')->nullable();
            $table->foreignId('subject_id')->constrained('subjects');
            $table->foreignId('grade_reward_id')->constrained('grade_rewards')->nullable();
            $table->foreignId('user_id')->constrained('users');
            $table->enum('type', ['quiz', 'assignment', 'exam', 'other'])->default('exam');
            $table->date('date');
            $table->integer('grade');
            $table->integer('kkm');
            $table->integer('difference');
            $table->integer('reward_amount');
            $table->enum('status', ['not_verified', 'verified', 'paid', 'rejected'])->default('not_verified');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('grades');
    }
};
