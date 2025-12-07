<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GoldPrice extends Model
{
    protected $fillable = [
        'gold_price_source_id',
        'date',
        'weight',
        'price',
    ];

    protected $casts = [
        'date' => 'date',
        'weight' => 'decimal:3',
        'price' => 'integer',
    ];

    // Relationship: GoldPrice belongs to GoldPriceSource
    public function goldPriceSource()
    {
        return $this->belongsTo(GoldPriceSource::class);
    }
}
