import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { useEffect } from 'react';
import SelectInput from '@/Components/SelectInput';
import { formatRupiah, parseRupiah } from '@/Utils/currency';

export default function Form({ data, setData, errors, processing, submit, productGolds = [], priceSources = [], isEdit = false }) {
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

    const SectionHeader = ({ title, description }) => (
        <div className="mb-4 text-left">
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">{title}</h3>
            {description && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>}
            <div className="mt-2 border-b border-gray-200 dark:border-gray-700"></div>
        </div>
    );

    return (
        <form onSubmit={submit} className="space-y-8">
            {/* Section 1: Identitas Produk */}
            <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
                <SectionHeader
                    title="Identitas Emas"
                    description="Informasi utama mengenai produk emas fisik."
                />
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="col-span-1 md:col-span-2">
                        <InputLabel htmlFor="product_gold_id" value="Produk Emas" className="dark:text-gray-200" />
                        <SelectInput
                            id="product_gold_id"
                            name="product_gold_id"
                            value={data.product_gold_id || ''}
                            onChange={e => setData('product_gold_id', e.target.value)}
                            className="block mt-1 w-full"
                            disabled={isEdit}
                        >
                            <option value="">-- Pilih Produk / Varian --</option>
                            {Array.isArray(productGolds) && productGolds.map(productGold => (
                                <option key={productGold.id} value={productGold.id}>
                                    {productGold.name} ({productGold?.unit?.unit || 'No Unit'} - {productGold.weight}g)
                                </option>
                            ))}
                        </SelectInput>
                        <InputError message={errors.product_gold_id} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="sn" value="Serial Number (SN)" className="dark:text-gray-200" />
                        <TextInput
                            id="sn"
                            type="text"
                            name="sn"
                            value={data.sn}
                            onChange={e => setData('sn', e.target.value)}
                            className="block mt-1 w-full dark:bg-gray-900 dark:text-gray-100"
                            placeholder="Contoh: A12345678"
                        />
                        <InputError message={errors.sn} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="production_year" value="Tahun Produksi" className="dark:text-gray-200" />
                        <TextInput
                            id="production_year"
                            type="number"
                            name="production_year"
                            value={data.production_year}
                            onChange={e => setData('production_year', e.target.value)}
                            className="block mt-1 w-full dark:bg-gray-900 dark:text-gray-100"
                            placeholder="Contoh: 2023"
                        />
                        <InputError message={errors.production_year} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="gold_price_source_id" value="Sumber Harga" className="dark:text-gray-200" />
                        <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Digunakan untuk tracking nilai pasar (Market Value).</p>
                        <SelectInput
                            id="gold_price_source_id"
                            name="gold_price_source_id"
                            value={data.gold_price_source_id || ''}
                            onChange={e => setData('gold_price_source_id', e.target.value)}
                            className="block mt-1 w-full"
                        >
                            <option value="">Default (Sesuai Aturan Sistem)</option>
                            {Array.isArray(priceSources) && priceSources.map(source => (
                                <option key={source.id} value={source.id}>
                                    {source.name} ({source.code})
                                </option>
                            ))}
                        </SelectInput>
                        <InputError message={errors.gold_price_source_id} className="mt-2" />
                    </div>
                </div>
            </div>

            {/* Section 2: Data Pembelian */}
            <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
                <SectionHeader
                    title="Data Transaksi Beli"
                    description="Detail perolehan barang dan harga beli."
                />
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                        <InputLabel htmlFor="date" value="Tanggal Pembelian" className="dark:text-gray-200" />
                        <TextInput
                            id="date"
                            type="date"
                            name="date"
                            value={data.date}
                            onChange={e => setData('date', e.target.value)}
                            className="block mt-1 w-full dark:bg-gray-900 dark:text-gray-100"
                        />
                        <InputError message={errors.date} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="receipt_no" value="Nomor Nota / Kwitansi" className="dark:text-gray-200" />
                        <TextInput
                            id="receipt_no"
                            type="text"
                            name="receipt_no"
                            value={data.receipt_no}
                            onChange={e => setData('receipt_no', e.target.value)}
                            className="block mt-1 w-full dark:bg-gray-900 dark:text-gray-100"
                            placeholder="Opsional"
                        />
                        <InputError message={errors.receipt_no} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="buy_from" value="Beli Dari (Toko/Orang)" className="dark:text-gray-200" />
                        <TextInput
                            id="buy_from"
                            type="text"
                            name="buy_from"
                            value={data.buy_from}
                            onChange={e => setData('buy_from', e.target.value)}
                            className="block mt-1 w-full dark:bg-gray-900 dark:text-gray-100"
                            placeholder="Nama Toko atau Penjual"
                        />
                        <InputError message={errors.buy_from} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="buy_price" value="Harga Beli Total (IDR)" className="dark:text-gray-200" />
                        <div className="relative">
                            <TextInput
                                id="buy_price"
                                type="text"
                                name="buy_price"
                                value={formatRupiah(data.buy_price)}
                                onChange={(e) => handlePriceChange(e, 'buy_price')}
                                className="block mt-1 w-full font-semibold text-blue-600 dark:bg-gray-900 dark:text-blue-400"
                                placeholder="Rp 0"
                            />
                        </div>
                        <InputError message={errors.buy_price} className="mt-2" />
                    </div>
                </div>
            </div>

            {/* Section 3: Penyimpanan */}
            <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
                <SectionHeader
                    title="Lokasi Penyimpanan"
                    description="Dimana barang ini disimpan saat ini."
                />
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="col-span-1 md:col-span-2">
                        <InputLabel htmlFor="stored_in" value="Lokasi / Dompet / Brankas" className="dark:text-gray-200" />
                        <TextInput
                            id="stored_in"
                            type="text"
                            name="stored_in"
                            value={data.stored_in}
                            onChange={e => setData('stored_in', e.target.value)}
                            className="block mt-1 w-full dark:bg-gray-900 dark:text-gray-100"
                            placeholder="Contoh: Brankas Utama, Dompet Emas Hitam"
                        />
                        <InputError message={errors.stored_in} className="mt-2" />
                    </div>
                </div>
            </div>

            {/* Section 4: Penjualan (Hanya tampil jika Edit) */}
            {isEdit && (
                <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg shadow-sm dark:bg-gray-900 dark:border-gray-600">
                    <SectionHeader
                        title="Status Penjualan"
                        description="Isi bagian ini HANYA jika barang sudah terjual."
                    />
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <InputLabel htmlFor="sell_price" value="Harga Jual (IDR)" className="dark:text-gray-200" />
                            <div className="relative">
                                <TextInput
                                    id="sell_price"
                                    type="text"
                                    name="sell_price"
                                    value={formatRupiah(data.sell_price)}
                                    onChange={(e) => handlePriceChange(e, 'sell_price')}
                                    className="block mt-1 w-full font-semibold text-green-600 dark:bg-gray-800 dark:text-green-400"
                                    placeholder="Rp 0"
                                />
                            </div>
                            <InputError message={errors.sell_price} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="sell_to" value="Dijual Kepada" className="dark:text-gray-200" />
                            <TextInput
                                id="sell_to"
                                type="text"
                                name="sell_to"
                                value={data.sell_to}
                                onChange={e => setData('sell_to', e.target.value)}
                                className="block mt-1 w-full dark:bg-gray-800 dark:text-gray-100"
                                placeholder="Nama Pembeli"
                            />
                            <InputError message={errors.sell_to} className="mt-2" />
                        </div>
                    </div>
                </div>
            )}

            <div className="flex justify-end pt-4">
                <PrimaryButton className="px-6 py-3 text-base" disabled={processing}>
                    {processing ? 'Menyimpan...' : 'Simpan Data'}
                </PrimaryButton>
            </div>
        </form>
    );
}
