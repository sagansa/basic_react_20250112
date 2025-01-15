<?php

namespace App\Http\Controllers;

use App\Models\Grade;
use App\Models\GradeReward;
use App\Models\Subject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class RewardController extends Controller
{
    public function index()
    {
        $isAdmin = Auth::user()->hasRole(['admin', 'super-admin']);

        $rewardsQuery = GradeReward::with(['grade.subject', 'user']);

        // Jika bukan admin, filter berdasarkan user_id
        if (!$isAdmin) {
            $rewardsQuery->where('user_id', Auth::id());
        }

        $rewards = $rewardsQuery->latest()->get();

        // Summary juga perlu disesuaikan
        if ($isAdmin) {
            $summary = [
                'total_reward_amount' => GradeReward::sum('total_reward_amount'),
                'total_payment' => GradeReward::where('status', 'paid')
                    ->sum('total_payment'),
            ];
        } else {
            $summary = [
                'total_reward_amount' => GradeReward::where('user_id', Auth::id())
                    ->sum('total_reward_amount'),
                'total_payment' => GradeReward::where('user_id', Auth::id())
                    ->where('status', 'paid')
                    ->sum('total_payment'),
            ];
        }

        return Inertia::render('Reward/Index', [
            'rewards' => $rewards,
            'summary' => $summary,
            'isAdmin' => $isAdmin
        ]);
    }

    public function create()
    {
        // Pastikan hanya user yang bisa mengakses
        if (!Auth::user()->hasRole('user')) {
            return redirect()->route('rewards.index')
                ->with('error', 'Hanya user yang dapat membuat reward.');
        }

        $subjects = Subject::orderBy('name')->get();

        return Inertia::render('Reward/Create', [
            'subjects' => $subjects
        ]);
    }

    public function store(Request $request)
    {
        // Pastikan hanya user yang bisa store
        if (!Auth::user()->hasRole('user')) {
            abort(403, 'Hanya user yang dapat membuat reward.');
        }

        try {
            $validated = $request->validate([
                'user_id' => 'required|exists:users,id',
                'grades' => 'required|array|min:1',
                'grades.*.subject_id' => 'required|exists:subjects,id',
                'grades.*.type' => 'required|in:quiz,assignment,exam,other',
                'grades.*.grade' => 'required|numeric|min:0|max:100',
                'grades.*.kkm' => 'required|numeric|min:0|max:100',
                'grades.*.difference' => 'required|numeric|min:0',
                'grades.*.reward_amount' => 'required|numeric|min:0',
                'grades.*.date' => 'required|date',
                'total_reward_amount' => 'required|numeric|min:0',
                'status' => 'required|in:unpaid,paid,cancelled',
            ]);

            // Pastikan user hanya bisa membuat reward untuk dirinya sendiri
            if ($validated['user_id'] !== Auth::id()) {
                throw new \Exception('Anda hanya dapat membuat reward untuk diri sendiri.');
            }

            DB::beginTransaction();

            // Buat reward
            $reward = GradeReward::create([
                'user_id' => $validated['user_id'],
                'total_reward_amount' => $validated['total_reward_amount'],
                'total_payment' => 0,
                'status' => $validated['status'],
            ]);

            // Buat grade-grade yang terkait
            foreach ($validated['grades'] as $gradeData) {
                Grade::create([
                    'subject_id' => $gradeData['subject_id'],
                    'type' => $gradeData['type'],
                    'grade' => $gradeData['grade'],
                    'kkm' => $gradeData['kkm'],
                    'difference' => $gradeData['difference'],
                    'reward_amount' => $gradeData['reward_amount'],
                    'date' => $gradeData['date'],
                    'user_id' => $validated['user_id'],
                    'status' => 'verified',
                    'grade_reward_id' => $reward->id
                ]);
            }

            DB::commit();

            return redirect()->route('rewards.index')
                ->with('message', 'Reward berhasil dibuat.');

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()
                ->withErrors(['error' => $e->getMessage()])
                ->withInput();
        }
    }

    public function update(Request $request, GradeReward $reward)
    {
        $isAdmin = Auth::user()->hasRole('admin');

        // Jika bukan admin, pastikan hanya bisa update reward miliknya
        if (!$isAdmin && $reward->user_id !== Auth::id()) {
            abort(403, 'Anda hanya dapat mengupdate reward milik Anda sendiri.');
        }

        // Validasi yang sama untuk admin dan user
        $validated = $request->validate([
            'total_payment' => 'required|numeric|min:0',
            'status' => 'required|in:unpaid,paid,cancelled',
        ]);

        $reward->update($validated);

        return redirect()->route('rewards.index')
            ->with('message', 'Reward berhasil diupdate.');
    }

    public function destroy(GradeReward $reward)
    {
        $isAdmin = Auth::user()->hasRole(['admin', 'super-admin']);

        // Jika bukan admin dan status paid, tolak akses
        if (!$isAdmin && $reward->status === 'paid') {
            abort(403, 'Tidak dapat menghapus reward yang sudah dibayar.');
        }

        // Jika bukan admin dan bukan pemilik reward, tolak akses
        if (!$isAdmin && $reward->user_id !== Auth::id()) {
            abort(403, 'Anda hanya dapat menghapus reward milik Anda sendiri.');
        }

        $reward->delete();
        return redirect()->route('rewards.index')
            ->with('message', 'Reward berhasil dihapus.');
    }

    public function edit(GradeReward $reward)
    {
        $isAdmin = Auth::user()->hasRole(['admin', 'super-admin']);

        // Jika bukan admin dan status paid, tolak akses
        if (!$isAdmin && $reward->status === 'paid') {
            abort(403, 'Tidak dapat mengedit reward yang sudah dibayar.');
        }

        // Jika bukan admin dan bukan pemilik reward, tolak akses
        if (!$isAdmin && $reward->user_id !== Auth::id()) {
            abort(403, 'Anda hanya dapat mengedit reward milik Anda sendiri.');
        }

        return Inertia::render('Reward/Edit', [
            'reward' => $reward->load(['grade.subject', 'user']),
            'subjects' => Subject::orderBy('name')->get()
        ]);
    }
}
