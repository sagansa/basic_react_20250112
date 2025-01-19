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
        $golds = Gold::with(['productGold', 'user'])
            ->where('user_id', auth()->user()->id)
            ->latest()
            ->get();

        // Hitung total per produk
        $productTotals = $golds->groupBy('product_gold.name')
            ->map(function ($items) {
                $firstItem = $items->first();
                $weight = $firstItem->product_gold->weight ?? 1; // Default ke 1 jika weight null
                $totalBuyPrice = $items->sum('buy_price');

                return [
                    'count' => $items->count(),
                    'total_buy_price' => $totalBuyPrice,
                    'unit' => $firstItem->product_gold->unit->unit ?? '-',
                    'weight' => $weight,
                    'price_per_weight' => $weight > 0 ? $totalBuyPrice / ($weight * $items->count()) : 0, // Harga per satuan berat
                ];
            });

        // $buyPriceWeight = $golds-

        return Inertia::render('Gold/Index', [
            'golds' => $golds,
            'productTotals' => $productTotals,
            // 'buyPricePerWeight' => $buyPriceWeight,
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
            'production_year' => 'nullable|date',
            'buy_from' => 'required|string',
            'buy_price' => 'required|numeric',
            'sell_price' => 'required|numeric',
            'sell_to' => 'required|string',
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
