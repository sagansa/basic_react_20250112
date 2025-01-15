<?php

namespace App\Http\Controllers;

use App\Models\Grade;
use App\Models\Subject;
use App\Models\User;
use App\Models\GradeReward;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GradeController extends Controller
{
    public function index()
    {
        return Inertia::render('Grade/Index', [
            'grades' => Grade::with(['subject', 'user', 'reward'])
                ->where('user_id', auth()->user()->id)
                ->latest()
                ->get()
        ]);
    }

    public function create()
    {
        return Inertia::render('Grade/Create', [
            'subjects' => Subject::all(),
            'users' => User::all()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'subject_id' => 'required|exists:subjects,id',
            'type' => 'required|in:Quiz,Assignment,Mid Test,Final Test',
            'date' => 'required|date',
            'grade' => 'required|numeric|min:0|max:100',
            'kkm' => 'required|numeric|min:0|max:100',
            'notes' => 'nullable|string'
        ]);

        $validated['user_id'] = auth()->id();
        $validated['difference'] = $validated['grade'] >= $validated['kkm']
            ? $validated['grade'] - $validated['kkm']
            : 0;
        $validated['status'] = 'not_verified';

        $grade = Grade::create($validated);

        if ($validated['difference'] > 0) {
            GradeReward::create([
                'grade_id' => $grade->id,
                'user_id' => auth()->id(),
                'grade' => $validated['grade'],
                'difference' => $validated['difference'],
                'reward_amount' => GradeReward::calculateReward($validated['difference']),
                'status' => 'pending'
            ]);
        }

        return redirect()->route('grades.index')
            ->with('message', 'Grade created successfully.');
    }

    public function edit(Grade $grade)
    {
        return Inertia::render('Grade/Edit', [
            'grade' => $grade->load('subject'),
            'subjects' => Subject::all()
        ]);
    }

    public function update(Request $request, Grade $grade)
    {
        $validated = $request->validate([
            'subject_id' => 'required|exists:subjects,id',
            'type' => 'required|in:Quiz,Assignment,Mid Test,Final Test',
            'date' => 'required|date',
            'grade' => 'required|numeric|min:0|max:100',
            'kkm' => 'required|numeric|min:0|max:100',
            'notes' => 'nullable|string'
        ]);

        $validated['difference'] = $validated['grade'] >= $validated['kkm']
            ? $validated['grade'] - $validated['kkm']
            : 0;

        $grade->update($validated);

        return redirect()->route('grades.index')
            ->with('message', 'Grade updated successfully.');
    }

    public function destroy(Grade $grade)
    {
        $grade->delete();
        return redirect()->route('grades.index')
            ->with('message', 'Grade deleted successfully.');
    }
}
