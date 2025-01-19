import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { useEffect } from 'react';
import SelectInput from '@/Components/SelectInput';
import { formatRupiah, parseRupiah } from '@/Utils/currency';

export default function Form({ data, setData, errors, processing, submit, productGolds = [], isEdit = false }) {
    useEffect(() => {
        if (data.date) {
            const formattedDate = new Date(data.date).toISOString().split('T')[0];
            setData('date', formattedDate);
        }
    }, []);

    const handlePriceChange = (e, field) => {
        const value = parseRupiah(e.target.value);
        setData(field, value);
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            <div>
                <InputLabel htmlFor="product_gold_id" value="Produk Emas" className="dark:text-gray-200" />
                <SelectInput
                    id="product_gold_id"
                    name="product_gold_id"
                    value={data.product_gold_id || ''}
                    onChange={e => setData('product_gold_id', e.target.value)}
                    className="block mt-1 w-full dark:bg-gray-900 dark:text-gray-100"
                    disabled={isEdit}
                >
                    <option value="">Pilih Produk Emas</option>
                    {Array.isArray(productGolds) && productGolds.map(productGold => (
                        <option key={productGold.id} value={productGold.id}>
                            {productGold.name} ({productGold?.unit?.unit || 'No Unit'})
                        </option>
                    ))}
                </SelectInput>
                <InputError message={errors.product_gold_id} className="mt-2" />
            </div>

            <div>
                <InputLabel htmlFor="sn" value="Serial Number" className="dark:text-gray-200" />
                <TextInput
                    id="sn"
                    type="text"
                    name="sn"
                    value={data.sn}
                    onChange={e => setData('sn', e.target.value)}
                    className="block mt-1 w-full dark:bg-gray-900 dark:text-gray-100"
                />
                <InputError message={errors.sn} className="mt-2" />
            </div>

            <div>
                <InputLabel htmlFor="production_year" value="Produksi No" className="dark:text-gray-200" />
                <TextInput
                    id="production_year"
                    type="text"
                    name="production_year"
                    value={data.production_year}
                    onChange={e => setData('production_year', e.target.value)}
                    className="block mt-1 w-full dark:bg-gray-900 dark:text-gray-100"
                />
                <InputError message={errors.production_year} className="mt-2" />
            </div>

            <div>
                <InputLabel htmlFor="date" value="Tanggal" className="dark:text-gray-200" />
                <TextInput
                    id="date"
                    type="date"
                    name="date"
                    value={data.date}
                    onChange={e => setData('date', e.target.value)}
                    className="block mt-1 w-full dark:bg-gray-900 dark:text-gray-100"
                    // disabled={isEdit}
                />
                <InputError message={errors.date} className="mt-2" />
            </div>

            <div>
                <InputLabel htmlFor="receipt_no" value="Receipt No" className="dark:text-gray-200" />
                <TextInput
                    id="receipt_no"
                    type="text"
                    name="receipt_no"
                    value={data.receipt_no}
                    onChange={e => setData('sn', e.target.value)}
                    className="block mt-1 w-full dark:bg-gray-900 dark:text-gray-100"
                />
                <InputError message={errors.receipt_no} className="mt-2" />
            </div>

            <div>
                <InputLabel htmlFor="buy_from" value="Beli Dari" className="dark:text-gray-200" />
                <TextInput
                    id="buy_from"
                    type="text"
                    name="buy_from"
                    value={data.buy_from}
                    onChange={e => setData('buy_from', e.target.value)}
                    className="block mt-1 w-full dark:bg-gray-900 dark:text-gray-100"
                    // disabled={isEdit}
                />
                <InputError message={errors.buy_from} className="mt-2" />
            </div>

            <div>
                <InputLabel htmlFor="buy_price" value="Harga Beli" className="dark:text-gray-200" />
                <div className="relative">
                    <TextInput
                        id="buy_price"
                        type="text"
                        name="buy_price"
                        value={formatRupiah(data.buy_price)}
                        onChange={(e) => handlePriceChange(e, 'buy_price')}
                        className="block mt-1 w-full dark:bg-gray-900 dark:text-gray-100"
                        // disabled={isEdit}
                    />
                </div>
                <InputError message={errors.buy_price} className="mt-2" />
            </div>

            <div>
                <InputLabel htmlFor="stored_in" value="Lokasi Penyimpanan" className="dark:text-gray-200" />
                <TextInput
                    id="stored_in"
                    type="text"
                    name="stored_in"
                    value={data.stored_in}
                    onChange={e => setData('stored_in', e.target.value)}
                    className="block mt-1 w-full dark:bg-gray-900 dark:text-gray-100"
                />
                <InputError message={errors.stored_in} className="mt-2" />
            </div>

            {isEdit && (
                <>
                    <div>
                        <InputLabel htmlFor="sell_price" value="Harga Jual" className="dark:text-gray-200" />
                        <div className="relative">
                            <TextInput
                                id="sell_price"
                                type="text"
                                name="sell_price"
                                value={formatRupiah(data.sell_price)}
                                onChange={(e) => handlePriceChange(e, 'sell_price')}
                                className="block mt-1 w-full dark:bg-gray-900 dark:text-gray-100"
                            />
                        </div>
                        <InputError message={errors.sell_price} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="sell_to" value="Jual Kepada" className="dark:text-gray-200" />
                        <TextInput
                            id="sell_to"
                            type="text"
                            name="sell_to"
                            value={data.sell_to}
                            onChange={e => setData('sell_to', e.target.value)}
                            className="block mt-1 w-full dark:bg-gray-900 dark:text-gray-100"
                        />
                        <InputError message={errors.sell_to} className="mt-2" />
                    </div>
                </>
            )}

            <div className="flex justify-end">
                <PrimaryButton className="ml-4" disabled={processing}>
                    {processing ? 'Memproses...' : 'Simpan'}
                </PrimaryButton>
            </div>
        </form>
    );
}
