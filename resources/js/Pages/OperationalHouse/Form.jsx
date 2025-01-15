import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import SelectInput from '@/Components/SelectInput';
import { useEffect } from 'react';
import { formatRupiah, parseRupiah } from '@/Utils/currency';

export default function Form({ data, setData, errors, processing, submit }) {
    useEffect(() => {
        if (data.date) {
            const formattedDate = new Date(data.date).toISOString().split('T')[0];
            setData('date', formattedDate);
        }
        if (data.month) {
            const date = new Date(data.month);
            const formattedMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            setData('month', formattedMonth);
        }
    }, []);

    const handleAmountChange = (e) => {
        const value = parseRupiah(e.target.value);
        setData('amount', value);
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
                    className="block mt-1 w-full dark:bg-gray-900 dark:text-gray-100"
                >
                    <option value="">Pilih Jenis</option>
                    <option value="cr">Kredit</option>
                    <option value="db">Debit</option>
                </SelectInput>
                <InputError message={errors.credit_debit} className="mt-2" />
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
