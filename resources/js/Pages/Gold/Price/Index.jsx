import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import { useState, useEffect } from 'react';

export default function Index({ auth, sources, weights }) {
    const [selectedSource, setSelectedSource] = useState(sources.length > 0 ? sources[0].id : '');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    // Initialize prices state based on weights
    const initialPrices = {};
    weights.forEach(w => initialPrices[w] = '');

    const { data, setData, post, processing, errors, reset, recentlySuccessful } = useForm({
        gold_price_source_id: selectedSource,
        date: selectedDate,
        prices: [], // Will be transformed before submit
    });

    const [priceInputs, setPriceInputs] = useState(initialPrices);

    useEffect(() => {
        setData('gold_price_source_id', selectedSource);
    }, [selectedSource]);

    useEffect(() => {
        setData('date', selectedDate);
    }, [selectedDate]);

    const handlePriceChange = (weight, value) => {
        setPriceInputs(prev => ({
            ...prev,
            [weight]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Transform priceInputs to array format expected by controller
        const pricesArray = Object.entries(priceInputs)
            .filter(([_, price]) => price !== '' && price !== null)
            .map(([weight, price]) => ({
                weight: parseFloat(weight),
                price: parseInt(price.replace(/\D/g, ''), 10) // Remove non-digits
            }));

        setData('prices', pricesArray);
    };

    // Trigger actual submit when data.prices is updated
    useEffect(() => {
        if (data.prices.length > 0) {
            post(route('gold-prices.store'), {
                preserveScroll: true,
                onSuccess: () => {
                    // Optional: clear inputs or keep them? Keeping them might be better for bulk entry
                }
            });
        }
    }, [data.prices]);

    const formatRupiah = (number) => {
        if (!number) return '';
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(number);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">Input Harga Emas</h2>}
        >
            <Head title="Input Harga Emas" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">

                            {recentlySuccessful && (
                                <div className="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg dark:bg-green-200 dark:text-green-800" role="alert">
                                    <span className="font-medium">Success!</span> Harga berhasil disimpan.
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div>
                                        <InputLabel htmlFor="source" value="Sumber Harga" />
                                        <select
                                            id="source"
                                            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300"
                                            value={selectedSource}
                                            onChange={(e) => setSelectedSource(e.target.value)}
                                            required
                                        >
                                            {sources.map(source => (
                                                <option key={source.id} value={source.id}>{source.name}</option>
                                            ))}
                                        </select>
                                        <InputError message={errors.gold_price_source_id} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="date" value="Tanggal" />
                                        <TextInput
                                            id="date"
                                            type="date"
                                            className="block w-full mt-1"
                                            value={selectedDate}
                                            onChange={(e) => setSelectedDate(e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.date} className="mt-2" />
                                    </div>
                                </div>

                                <div className="mt-8">
                                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-gray-100">Input Harga per Gramasi</h3>
                                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                                        {weights.map((weight) => (
                                            <div key={weight} className="p-4 border rounded-lg dark:border-gray-700">
                                                <InputLabel htmlFor={`price-${weight}`} value={`${weight} gram`} />
                                                <TextInput
                                                    id={`price-${weight}`}
                                                    type="number"
                                                    className="block w-full mt-1"
                                                    value={priceInputs[weight]}
                                                    onChange={(e) => handlePriceChange(weight, e.target.value)}
                                                    placeholder="Rp"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <InputError message={errors.prices} className="mt-2" />
                                </div>

                                <div className="flex justify-end mt-6">
                                    <PrimaryButton disabled={processing}>
                                        Simpan Harga
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
