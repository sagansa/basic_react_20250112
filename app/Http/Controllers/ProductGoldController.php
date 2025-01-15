<?php

namespace App\Http\Controllers;

use App\Models\ProductGold;
use App\Models\Unit;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductGoldController extends Controller
{
    public function index()
    {
        return Inertia::render('ProductGold/Index', [
            'productGolds' => ProductGold::with('unit')->latest()->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('ProductGold/Create', [
            'units' => Unit::orderBy('name')->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'unit_id' => 'required|exists:units,id',
        ]);

        ProductGold::create($validated);

        return redirect()->route('product-golds.index')
            ->with('message', 'Produk emas berhasil ditambahkan');
    }

    public function edit(ProductGold $productGold)
    {
        return Inertia::render('ProductGold/Edit', [
            'productGold' => $productGold,
            'units' => Unit::orderBy('name')->get()
        ]);
    }

    public function update(Request $request, ProductGold $productGold)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'unit_id' => 'required|exists:units,id',
        ]);

        $productGold->update($validated);

        return redirect()->route('product-golds.index')
            ->with('message', 'Produk emas berhasil diperbarui');
    }

    public function destroy(ProductGold $productGold)
    {
        $productGold->delete();

        return redirect()->route('product-golds.index')
            ->with('message', 'Produk emas berhasil dihapus');
    }
}
