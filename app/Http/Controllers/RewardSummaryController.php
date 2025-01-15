<?php

namespace App\Http\Controllers;

use App\Models\GradeReward;
use App\Models\RewardSummary;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RewardSummaryController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        // Get or create summary
        $summary = RewardSummary::firstOrCreate(
            ['user_id' => $user->id],
            [
                'total_amount' => 0,
                'paid_amount' => 0,
                'pending_amount' => 0
            ]
        );

        // Calculate totals
        $total = GradeReward::where('user_id', $user->id)->sum('reward_amount');
        $paid = GradeReward::where('user_id', $user->id)
            ->where('status', 'approved')
            ->sum('reward_amount');
        $pending = GradeReward::where('user_id', $user->id)
            ->where('status', 'pending')
            ->sum('reward_amount');

        // Update summary
        $summary->update([
            'total_amount' => $total,
            'paid_amount' => $paid,
            'pending_amount' => $pending
        ]);

        // Get detailed rewards
        $rewards = GradeReward::with(['grade.subject'])
            ->where('user_id', $user->id)
            ->latest()
            ->get();

        return Inertia::render('Reward/Index', [
            'summary' => $summary,
            'rewards' => $rewards
        ]);
    }
}
