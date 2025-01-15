<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Grade extends Model
{
    use HasFactory;

    protected $fillable = [
        'image',
        'subject_id',
        'grade_reward_id',
        'user_id',
        'type',
        'date',
        'grade',
        'kkm',
        'difference',
        'reward_amount',
        'status',
        'notes'
    ];

    const TYPES = ['Quiz', 'Assignment', 'Mid Test', 'Final Test'];
    const STATUSES = ['not_verified', 'verified', 'paid', 'rejected'];

    protected $casts = [
        'date' => 'date',
        'grade' => 'integer',
        'kkm' => 'integer',
        'difference' => 'integer',
    ];

    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function rewards()
    {
        return $this->belongsTo(GradeReward::class, 'grade_reward_id');
    }

    // Helper method untuk menghitung reward
    public static function calculateReward($difference, $grade): float
    {
        if ($grade = 100) {
            return 100000;
        }
        return $difference * 1000;
    }
}
