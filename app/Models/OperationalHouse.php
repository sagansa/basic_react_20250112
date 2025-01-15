<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OperationalHouse extends Model
{
    use HasFactory;

    protected $fillable = [
        'image',
        'date',
        'month',
        'amount',
        'credit_debit',
        'notes',
        'user_id',
    ];

    protected $table = 'operational_houses';

    protected $casts = [
        'date' => 'date',
        'month' => 'date',
        'amount' => 'integer'
    ];
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
