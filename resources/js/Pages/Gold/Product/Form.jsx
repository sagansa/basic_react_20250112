import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import SelectInput from '@/Components/SelectInput';

export default function Form({ data, setData, errors, processing, submit, units = [] }) {
    return (
        <form onSubmit={submit} className="space-y-6">
            <div>
                <InputLabel htmlFor="name" value="Nama Produk" className="dark:text-gray-200" />
                <TextInput
                    id="name"
                    type="text"
                    name="name"
                    value={data.name}
                    onChange={e => setData('name', e.target.value)}
                    className="block mt-1 w-full dark:bg-gray-900 dark:text-gray-100"
                />
                <InputError message={errors.name} className="mt-2" />
            </div>

            <div>
                <InputLabel htmlFor="weight" value="Berat" className="dark:text-gray-200" />
                <TextInput
                    id="weight"
                    type="text"
                    name="weight"
                    value={data.weight}
                    onChange={e => setData('weight', e.target.value)}
                    className="block mt-1 w-full dark:bg-gray-900 dark:text-gray-100"
                />
                <InputError message={errors.weight} className="mt-2" />
            </div>

            <div>
                <InputLabel htmlFor="unit_id" value="Unit" className="dark:text-gray-200" />
                <SelectInput
                    id="unit_id"
                    name="unit_id"
                    value={data.unit_id}
                    onChange={e => setData('unit_id', e.target.value)}
                    className="block mt-1 w-full dark:bg-gray-900 dark:text-gray-100"
                >
                    <option value="">Pilih Unit</option>
                    {units.map(unit => (
                        <option key={unit.id} value={unit.id}>
                            {unit.name} ({unit.unit})
                        </option>
                    ))}
                </SelectInput>
                <InputError message={errors.unit_id} className="mt-2" />
            </div>

            <div className="flex justify-end">
                <PrimaryButton className="ml-4" disabled={processing}>
                    {processing ? 'Memproses...' : 'Simpan'}
                </PrimaryButton>
            </div>
        </form>
    );
}
