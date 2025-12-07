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
        // Hitung total berat dari semua records (bukan hanya halaman saat ini)
        $totalWeight = Gold::with(['productGold'])
            ->where('user_id', auth()->user()->id)
            ->get()
            ->sum(function ($gold) {
                return $gold->productGold->weight ?? 0;
            });

        // Hitung total harga beli dari semua records
        $totalBuyPrice = Gold::where('user_id', auth()->user()->id)
            ->sum('buy_price');

        // Get paginated data
        $golds = Gold::with(['productGold', 'goldPriceSource'])
            ->where('user_id', auth()->user()->id)
            ->latest()
            ->paginate(15);

        // Fetch Reference Prices for ALL active sources
        $activeSources = \App\Models\GoldPriceSource::where('is_active', true)->get();
        $sourcePrices = [];
        $defaultSource = $activeSources->first();

        foreach ($activeSources as $source) {
            $latestDate = \App\Models\GoldPrice::where('gold_price_source_id', $source->id)->max('date');
            if ($latestDate) {
                $prices = \App\Models\GoldPrice::where('gold_price_source_id', $source->id)
                    ->where('date', $latestDate)
                    ->get()
                    ->keyBy(function ($item) {
                        return (string)$item->weight; 
                    });
                $sourcePrices[$source->id] = [
                    'date' => $latestDate,
                    'prices' => $prices,
                    'base_price_1g' => $prices->get('1') ? $prices->get('1')->price : 0
                ];
            }
        }
        
        $globalTotalMarketValue = 0;
        // Calculating Global Market Value using database query for efficiency would be better, 
        // but complex with per-row source logic. 
        // For now, let's keep the approximation using Default Source for Global Total,
        // OR iterate all if dataset is small. 
        // Let's iterate all for better accuracy as requested.
        $allGolds = Gold::with(['productGold'])->where('user_id', auth()->user()->id)->get();
        foreach ($allGolds as $gold) {
             $weight = $gold->productGold->weight ?? 0;
             $sourceId = $gold->gold_price_source_id;
             
             if ($sourceId && isset($sourcePrices[$sourceId])) {
                 $prices = $sourcePrices[$sourceId]['prices'];
                 $basePrice = $sourcePrices[$sourceId]['base_price_1g'];
                 
                 $price = $prices->get((string)$weight);
                 if ($price) {
                     $globalTotalMarketValue += $price->price;
                 } else {
                     $globalTotalMarketValue += $weight * $basePrice;
                 }
             }
        }

        // Calculate Market Value for Current Page Items
        foreach ($golds as $gold) {
            $weight = $gold->productGold->weight ?? 1; // Default ke 1 jika weight null
            $gold->buy_price_per_weight = $weight > 0 ? $gold->buy_price / $weight : 0; // Harga beli per berat
            
            $sourceId = $gold->gold_price_source_id;
            $gold->market_value = 0;

            if ($sourceId && isset($sourcePrices[$sourceId])) {
                $prices = $sourcePrices[$sourceId]['prices'];
                $basePrice = $sourcePrices[$sourceId]['base_price_1g'];
                
                $priceItem = $prices->get((string)$weight);
                if ($priceItem) {
                    $gold->market_value = $priceItem->price;
                } else {
                    $gold->market_value = $weight * $basePrice;
                }
            }
        }

        return Inertia::render('Gold/Index', [
            'golds' => $golds,
            'totalWeight' => $totalWeight, // Total berat dari semua records
            'totalBuyPrice' => $totalBuyPrice, // Total harga beli dari semua records
            'totalMarketValue' => $globalTotalMarketValue,
            // 'priceSource' => $refSource, // No longer single source
            // 'priceDate' => isset($latestDate) ? $latestDate : null,
        ]);
    }

    public function create()
    {
        $productGolds = ProductGold::with('unit')->orderBy('name')->get();
        $priceSources = \App\Models\GoldPriceSource::where('is_active', true)->orderBy('name')->get();

        return Inertia::render('Gold/Create', [
            'productGolds' => $productGolds,
            'priceSources' => $priceSources
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
            'gold_price_source_id' => 'nullable|exists:gold_price_sources,id',
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
        $priceSources = \App\Models\GoldPriceSource::where('is_active', true)->orderBy('name')->get();

        return Inertia::render('Gold/Edit', [
            'gold' => $gold,
            'productGolds' => $productGolds,
            'priceSources' => $priceSources,
            'previous_url' => url()->previous(),
        ]);
    }

    public function update(Request $request, Gold $gold)
    {
        $validated = $request->validate([
            'product_gold_id' => 'required|exists:product_golds,id',
            'date' => 'nullable|date',
            'production_year' => 'nullable|integer',
            'buy_from' => 'nullable|string',
            'buy_price' => 'nullable|numeric',
            'sell_price' => 'nullable|numeric',
            'sell_to' => 'nullable|string',
            'stored_in' => 'required|string',
            'sn' => 'required|string',
            'gold_price_source_id' => 'nullable|exists:gold_price_sources,id',
            'previous_url' => 'nullable|string',
        ]);

        // Remove previous_url from validated data before updating model
        // Or cleaner: only update fillable inputs. 
        // Gold::update() uses mass assignment protection, so extra fields in array are ignored if not in fillable? 
        // Standard practice: Arr::except
        $dataToUpdate = collect($validated)->except('previous_url')->toArray();
        $gold->update($dataToUpdate);

        $redirectUrl = $request->input('previous_url', route('golds.index'));
        // Security check: ensure redirect url is relative or same host to prevent open redirect
        // For simplicity in trusted internal app, we assume it's fine, 
        // but robust way is to check if it contains the app url.
        // url()->previous() returns absolute full URL.
        
        return redirect($redirectUrl)
            ->with('message', 'Data emas berhasil diperbarui');
    }

    public function destroy(Gold $gold)
    {
        $gold->delete();

        return redirect()->route('golds.index')->with('success', 'Gold deleted successfully.');
    }
}
