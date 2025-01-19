<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ProductGold extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'weight',
        'unit_id'
    ];

    protected $with = ['unit'];

    protected $table = 'product_golds';

    public function unit()
    {
        return $this->belongsTo(Unit::class);
    }

    public function golds()
    {
        return $this->hasMany(Gold::class);
    }
}
