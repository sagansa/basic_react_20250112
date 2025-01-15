<?php

namespace App\Http\Controllers;

use App\Models\Gold;
use App\Models\ProductGold;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class GoldController extends Controller
{
    public function index()
    {
        return Inertia::render('Gold/Index', [
            'golds' => Gold::with(['productGold', 'user'])
                ->where('user_id', auth()->user()->id)
                ->latest()
                ->get()
        ]);
    }

    public function create()
    {
        $productGolds = ProductGold::with('unit')->orderBy('name')->get();

        return Inertia::render('Gold/Create', [
            'productGolds' => $productGolds
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_gold_id' => 'required|exists:product_golds,id',
            'date' => 'required|date',
            'buy_from' => 'required|string',
            'buy_price' => 'required|numeric',
            'stored_in' => 'required|string',
            'sn' => 'nullable|string',
        ]);

        $validated['user_id'] = Auth::id();

        Gold::create($validated);

        return redirect()->route('golds.index')
            ->with('message', 'Data emas berhasil ditambahkan');
    }

    public function edit(Gold $gold)
    {
        $gold->load(['productGold', 'user']);

        $productGolds = ProductGold::with('unit')->orderBy('name')->get();

        return Inertia::render('Gold/Edit', [
            'gold' => $gold,
            'productGolds' => $productGolds
        ]);
    }

    public function update(Request $request, Gold $gold)
    {
        $validated = $request->validate([
            'product_gold_id' => 'required|exists:product_golds,id',
            'date' => 'required|date',
            'buy_from' => 'required|string',
            'buy_price' => 'required|numeric',
            'sell_price' => 'required|numeric',
            'sell_to' => 'required|string',
            'stored_in' => 'required|string',
            'sn' => 'nullable|string',
        ]);

        $gold->update($validated);

        return redirect()->route('golds.index')
            ->with('message', 'Data emas berhasil diperbarui');
    }

    public function destroy(Gold $gold)
    {
        $gold->delete();

        return redirect()->route('golds.index')->with('success', 'Gold deleted successfully.');
    }
}
