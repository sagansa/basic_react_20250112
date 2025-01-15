import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import SelectInput from '@/Components/SelectInput';
import { useEffect } from 'react';
import { formatRupiah, parseRupiah } from '@/Utils/currency';

export default function Form({ data, setData, errors, processing, submit }) {
    useEffect(() => {
        if (data.for && !Array.isArray(data.for)) {
            setData('for', [data.for]);
        }
    }, []);

    const handleAmountChange = (e) => {
        const value = parseRupiah(e.target.value);
        setData('amount', value);
    };

    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        const currentFor = data.for || [];
        if (checked) {
            setData('for', [...currentFor, value]);
        } else {
            setData('for', currentFor.filter(item => item !== value));
        }
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            <div>
                <InputLabel htmlFor="image" value="Gambar Bukti" className="dark:text-gray-200" />
                <TextInput
                    id="image"
                    type="file"
                    name="image"
                    onChange={e => setData('image', e.target.files[0])}
                    className="block mt-1 w-full dark:bg-gray-900 dark:text-gray-100"
                />
                <InputError message={errors.image} className="mt-2" />
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
                />
                <InputError message={errors.date} className="mt-2" />
            </div>

            <div>
                <InputLabel htmlFor="month" value="Bulan" className="dark:text-gray-200" />
                <TextInput
                    id="month"
                    type="month"
                    name="month"
                    value={data.month}
                    onChange={e => setData('month', e.target.value)}
                    className="block mt-1 w-full dark:bg-gray-900 dark:text-gray-100"
                />
                <InputError message={errors.month} className="mt-2" />
            </div>

            <div>
                <InputLabel htmlFor="amount" value="Jumlah" className="dark:text-gray-200" />
                <TextInput
                    id="amount"
                    type="text"
                    name="amount"
                    value={formatRupiah(data.amount)}
                    onChange={handleAmountChange}
                    className="block mt-1 w-full dark:bg-gray-900 dark:text-gray-100"
                />
                <InputError message={errors.amount} className="mt-2" />
            </div>

            <div>
                <InputLabel htmlFor="credit_debit" value="Kredit/Debit" className="dark:text-gray-200" />
                <SelectInput
                    id="credit_debit"
                    name="credit_debit"
                    value={data.credit_debit}
                    onChange={e => setData('credit_debit', e.target.value)}
                    className="dark:bg-gray-900 dark:text-gray-100"
                >
                    <option value="">Pilih Jenis</option>
                    <option value="cr">Kredit</option>
                    <option value="db">Debit</option>
                </SelectInput>
                <InputError message={errors.credit_debit} className="mt-2" />
            </div>

            <div>
                <fieldset>
                    <legend className="text-sm font-medium text-gray-900 dark:text-gray-200">
                        Untuk
                    </legend>
                    <div className="mt-4 space-y-5">
                        <div className="flex gap-3">
                            <div className="flex items-center h-6 shrink-0">
                                <div className="grid grid-cols-1 group size-4">
                                    <input
                                        type="checkbox"
                                        id="bulanan"
                                        name="bulanan"
                                        value="bulanan"
                                        checked={data.for?.includes('bulanan')}
                                        onChange={handleCheckboxChange}
                                        className="col-start-1 row-start-1 bg-white rounded-sm border border-gray-300 appearance-none checked:border-indigo-600 checked:bg-indigo-600 dark:border-gray-600 dark:bg-gray-900 dark:checked:border-indigo-500 dark:checked:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                    />
                                    <svg
                                        fill="none"
                                        viewBox="0 0 14 14"
                                        className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white"
                                    >
                                        <path
                                            d="M3 8L6 11L11 3.5"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="opacity-0 group-has-checked:opacity-100"
                                        />
                                    </svg>
                                </div>
                            </div>
                            <div className="text-sm/6">
                                <label htmlFor="bulanan" className="font-medium text-gray-900 dark:text-gray-200">
                                    Bulanan
                                </label>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <div className="flex items-center h-6 shrink-0">
                                <div className="grid grid-cols-1 group size-4">
                                    <input
                                        type="checkbox"
                                        id="pbb"
                                        name="pbb"
                                        value="pbb"
                                        checked={data.for?.includes('pbb')}
                                        onChange={handleCheckboxChange}
                                        className="col-start-1 row-start-1 bg-white rounded-sm border border-gray-300 appearance-none checked:border-indigo-600 checked:bg-indigo-600 dark:border-gray-600 dark:bg-gray-900 dark:checked:border-indigo-500 dark:checked:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                    />
                                    <svg
                                        fill="none"
                                        viewBox="0 0 14 14"
                                        className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white"
                                    >
                                        <path
                                            d="M3 8L6 11L11 3.5"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="opacity-0 group-has-checked:opacity-100"
                                        />
                                    </svg>
                                </div>
                            </div>
                            <div className="text-sm/6">
                                <label htmlFor="pbb" className="font-medium text-gray-900 dark:text-gray-200">
                                    PBB
                                </label>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <div className="flex items-center h-6 shrink-0">
                                <div className="grid grid-cols-1 group size-4">
                                    <input
                                        type="checkbox"
                                        id="lainnya"
                                        name="lainnya"
                                        value="lainnya"
                                        checked={data.for?.includes('lainnya')}
                                        onChange={handleCheckboxChange}
                                        className="col-start-1 row-start-1 bg-white rounded-sm border border-gray-300 appearance-none checked:border-indigo-600 checked:bg-indigo-600 dark:border-gray-600 dark:bg-gray-900 dark:checked:border-indigo-500 dark:checked:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                    />
                                    <svg
                                        fill="none"
                                        viewBox="0 0 14 14"
                                        className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white"
                                    >
                                        <path
                                            d="M3 8L6 11L11 3.5"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="opacity-0 group-has-checked:opacity-100"
                                        />
                                    </svg>
                                </div>
                            </div>
                            <div className="text-sm/6">
                                <label htmlFor="lainnya" className="font-medium text-gray-900 dark:text-gray-200">
                                    Lainnya
                                </label>
                            </div>
                        </div>
                    </div>
                </fieldset>
                <InputError message={errors.for} className="mt-2" />
            </div>

            <div>
                <InputLabel htmlFor="notes" value="Catatan" className="dark:text-gray-200" />
                <TextInput
                    id="notes"
                    type="text"
                    name="notes"
                    value={data.notes}
                    onChange={e => setData('notes', e.target.value)}
                    className="block mt-1 w-full dark:bg-gray-900 dark:text-gray-100"
                />
                <InputError message={errors.notes} className="mt-2" />
            </div>

            <div className="flex justify-end">
                <PrimaryButton className="ml-4" disabled={processing}>
                    {processing ? 'Memproses...' : 'Simpan'}
                </PrimaryButton>
            </div>
        </form>
    );
}
