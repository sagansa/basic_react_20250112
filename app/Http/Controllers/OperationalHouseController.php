<?php

namespace App\Http\Controllers;

use App\Models\OperationalHouse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OperationalHouseController extends Controller
{
    public function index()
    {

        $operationalHouses = OperationalHouse::with('user')->latest()->get();

        $summary = [
            'total_credit' => OperationalHouse::where('credit_debit', 'cr')->sum('amount'),
            'total_debit' => OperationalHouse::where('credit_debit', 'db')->sum('amount'),
        ];

        return Inertia::render('OperationalHouse/Index', [
            'operationalHouses' => $operationalHouses,
            'summary' => $summary,
        ]);
    }

    public function create()
    {
        return Inertia::render('OperationalHouse/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'image' => 'nullable|mimes:jpg,jpeg,png,gif',
            'date' => 'required|date',
            'month' => 'nullable|date',
            'amount' => 'required|numeric',
            'credit_debit' => 'required|string',
            'notes' => 'nullable|string'
        ]);

        $validated['user_id'] = auth()->id();

        $operationalHouse = OperationalHouse::create($validated);
        return redirect()->route('operational-houses.index');
    }

    public function edit(OperationalHouse $operationalHouse)
    {
        return Inertia::render('OperationalHouse/Edit', [
            'operationalHouse' => $operationalHouse,
            ]);
    }

    public function update(Request $request, OperationalHouse $operationalHouse)
    {
        $operationalHouse->update($request->all());
        return redirect()->route('operational-houses.index');
    }

    public function destroy(OperationalHouse $operationalHouse)
    {
        $operationalHouse->delete();
        return redirect()->route('operational-houses.index');
    }
}
