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
        $golds = Gold::with(['productGold'])
            ->where('user_id', auth()->user()->id)
            ->latest()
            ->get();

        // Menambahkan perhitungan harga beli per berat untuk setiap item
        foreach ($golds as $gold) {
            $weight = $gold->productGold->weight ?? 1; // Default ke 1 jika weight null
            $gold->buy_price_per_weight = $weight > 0 ? $gold->buy_price / $weight : 0; // Harga beli per berat
        }

        // Hitung total berat
        $totalWeight = $golds->sum(function ($gold) {
            return $gold->productGold->weight ?? 0; // Mengambil weight dari productGold
        });

        return Inertia::render('Gold/Index', [
            'golds' => $golds,
            'totalWeight' => $totalWeight, // Pastikan totalWeight dikirim
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
            'date' => 'nullable|date',
            'receipt_no' => 'nullable|string',
            'production_year' => 'nullable|integer',
            'buy_from' => 'nullable|string',
            'buy_price' => 'nullable|numeric',
            'stored_in' => 'required|string',
            'sn' => 'required|string',
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
            'date' => 'nullable|date',
            'production_year' => 'nullable|integer',
            'buy_from' => 'required|string',
            'buy_price' => 'required|numeric',
            'sell_price' => 'nullable|numeric',
            'sell_to' => 'nullable|string',
            'stored_in' => 'required|string',
            'sn' => 'required|string',
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
