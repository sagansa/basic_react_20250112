import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

export default function Form({ data, setData, errors, processing, submit }) {
    const actions = ['view', 'create', 'edit', 'delete'];
    const modules = ['users', 'roles', 'permissions'];

    const handleActionChange = (e) => {
        setData('action', e.target.value);
        setData('name', `${e.target.value}_${data.module}`);
        setData('unit', `${e.target.value}_${data.module}`);
    };

    const handleModuleChange = (e) => {
        setData('module', e.target.value);
        setData('name', `${data.action}_${e.target.value}`);
        setData('unit', `${data.action}_${e.target.value}`);
    };

    return (
        <form onSubmit={submit}>
            <div className="mb-6">
                <InputLabel htmlFor="name" value="Unit Name" className="dark:text-gray-200" />
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

            <div className="mb-6">
                <InputLabel htmlFor="unit" value="Unit Unit" className="dark:text-gray-200" />
                <TextInput
                    id="unit"
                    type="text"
                    name="unit"
                    value={data.unit}
                    onChange={e => setData('unit', e.target.value)}
                    className="block mt-1 w-full dark:bg-gray-900 dark:text-gray-100"
                />
                <InputError message={errors.unit} className="mt-2" />
            </div>

            <div className="flex justify-end items-center mt-4">
                <PrimaryButton className="ml-4" disabled={processing}>
                    {processing ? 'Processing...' : 'Save'}
                </PrimaryButton>
            </div>
        </form>
    );
}
