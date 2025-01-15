<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GradeReward extends Model
{
    const STATUSES = ['unpaid', 'paid'];

    protected $fillable = [
        'user_id',
        'total_reward_amount',
        'total_payment',
        'status'
    ];

    protected $attributes = [
        'status' => 'unpaid' // Set default status
    ];

    public function grade()
    {
        return $this->hasMany(Grade::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }


}
