<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class GoldPriceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $sources = \App\Models\GoldPriceSource::where('is_active', true)->get();
        // Get unique weights from ProductGold to facilitate price entry
        $weights = \App\Models\ProductGold::select('weight')
            ->distinct()
            ->orderBy('weight')
            ->pluck('weight');

        // If no products yet, default to standard weights
        if ($weights->isEmpty()) {
            $weights = [0.1, 0.25, 0.5, 1, 2, 3, 4, 5, 10, 25, 50, 100];
        }

        return \Inertia\Inertia::render('Gold/Price/Index', [
            'sources' => $sources,
            'weights' => $weights
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'gold_price_source_id' => 'required|exists:gold_price_sources,id',
            'date' => 'required|date',
            'prices' => 'required|array',
            'prices.*.weight' => 'required|numeric',
            'prices.*.price' => 'required|numeric',
        ]);

        foreach ($validated['prices'] as $priceData) {
            \App\Models\GoldPrice::updateOrCreate(
                [
                    'gold_price_source_id' => $validated['gold_price_source_id'],
                    'date' => $validated['date'],
                    'weight' => $priceData['weight'],
                ],
                [
                    'price' => $priceData['price']
                ]
            );
        }

        return redirect()->back()->with('message', 'Harga emas berhasil disimpan');
    }
    
    public function getPrices(Request $request) 
    {
        // API endpoint to get prices for chart or table
        $prices = \App\Models\GoldPrice::with('goldPriceSource')
            ->when($request->source_id, function($q) use ($request) {
                return $q->where('gold_price_source_id', $request->source_id);
            })
            ->when($request->start_date, function($q) use ($request) {
                return $q->where('date', '>=', $request->start_date);
            })
            ->when($request->end_date, function($q) use ($request) {
                return $q->where('date', '<=', $request->end_date);
            })
            ->orderBy('date', 'desc')
            ->get();
            
        return response()->json($prices);
    }
}
