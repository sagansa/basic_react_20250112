<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GoldPriceSource extends Model
{
    protected $fillable = [
        'name',
        'code',
        'description',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    // Relationship: GoldPriceSource has many GoldPrices
    public function goldPrices()
    {
        return $this->hasMany(GoldPrice::class);
    }

    // Relationship: GoldPriceSource has many Golds
    public function golds()
    {
        return $this->hasMany(Gold::class);
    }

    // Get latest price for a specific weight
    public function getLatestPrice($weight)
    {
        return $this->goldPrices()
            ->where('weight', $weight)
            ->latest('date')
            ->first();
    }
}
