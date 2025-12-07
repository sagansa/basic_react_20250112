<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class GoldPriceSourceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $sources = \App\Models\GoldPriceSource::latest()->get();
        return \Inertia\Inertia::render('Gold/PriceSource/Index', [
            'sources' => $sources
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:gold_price_sources,code',
            'description' => 'nullable|string',
            'is_active' => 'boolean'
        ]);

        \App\Models\GoldPriceSource::create($validated);

        return redirect()->back()->with('message', 'Sumber harga berhasil ditambahkan');
    }

    public function update(Request $request, $id)
    {
        $source = \App\Models\GoldPriceSource::findOrFail($id);
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:gold_price_sources,code,'.$id,
            'description' => 'nullable|string',
            'is_active' => 'boolean'
        ]);

        $source->update($validated);

        return redirect()->back()->with('message', 'Sumber harga berhasil diperbarui');
    }

    public function destroy($id)
    {
        $source = \App\Models\GoldPriceSource::findOrFail($id);
        $source->delete();
        
        return redirect()->back()->with('message', 'Sumber harga berhasil dihapus');
    }
}
