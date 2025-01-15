<?php

namespace App\Http\Controllers;

use App\Models\Subject;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SubjectController extends Controller
{
    public function index()
    {
        return Inertia::render('Subject/Index', [
            'subjects' => Subject::all()
        ]);
    }

    public function create()
    {
        return Inertia::render('Subject/Create');
    }

    public function store(Request $request)
    {
        Subject::create($request->all());
        return redirect()->route('subjects.index');
    }

    public function edit(Subject $subject)
    {
        return Inertia::render('Subject/Edit', [
            'subject' => $subject
        ]);
    }

    public function update(Request $request, Subject $subject)
    {
        $subject->update($request->all());
        return redirect()->route('subjects.index');
    }

    public function destroy(Subject $subject)
    {
        $subject->delete();
        return redirect()->route('subjects.index');
    }

}
