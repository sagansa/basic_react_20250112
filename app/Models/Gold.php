<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;

class Gold extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_gold_id',
        'date',
        'buy_from',
        'buy_price',
        'sell_price',
        'sell_to',
        'stored_in',
        'user_id',
        'sn',
    ];

    protected $table = 'golds';

    protected static function booted()
    {
        static::creating(function ($gold) {
            if (!$gold->user_id) {
                $gold->user_id = Auth::id();
            }
        });

        // Opsional: Jika Anda ingin membatasi user hanya bisa melihat datanya sendiri
        static::addGlobalScope('user', function (Builder $builder) {
            if (!Auth::user()->hasRole('admin')) { // Jika menggunakan spatie/laravel-permission
                $builder->where('user_id', Auth::id());
            }
        });
    }

    public function productGold()
    {
        return $this->belongsTo(ProductGold::class, 'product_gold_id', 'id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    protected $with = ['productGold'];

    protected $casts = [
        'date' => 'date',
        'buy_price' => 'integer',
        'sell_price' => 'integer',
    ];
}
