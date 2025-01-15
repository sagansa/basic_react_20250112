<?php

namespace App\Http\Controllers;

use App\Models\Unit;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UnitController extends Controller
{
    public function index()
    {
        return Inertia::render('Unit/Index', [
            'units' => Unit::all(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Unit/Create');
    }

    public function store(Request $request)
    {
        Unit::create($request->all());
        return redirect()->route('units.index');
    }

    public function edit(Unit $unit)
    {
        return Inertia::render('Unit/Edit', [
            'unit' => $unit
        ]);
    }

    public function update(Request $request, Unit $unit)
    {
        $unit->update($request->all());
        return redirect()->route('units.index');
    }

    public function destroy(Unit $unit)
    {
        $unit->delete();
        return redirect()->route('units.index');
    }
}
