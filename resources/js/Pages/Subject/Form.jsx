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
    };

    const handleModuleChange = (e) => {
        setData('module', e.target.value);
        setData('name', `${data.action}_${e.target.value}`);
    };

    return (
        <form onSubmit={submit}>
            <div className="mb-6">
                <InputLabel htmlFor="name" value="Subject Name" className="dark:text-gray-200" />
                <TextInput
                    id="name"
                    type="text"
                    name="name"
                    value={data.name}
                    onChange={e => setData('name', e.target.value)}
                    className="block w-full mt-1 dark:bg-gray-900 dark:text-gray-100"
                />
                <InputError message={errors.name} className="mt-2" />
            </div>

            <div className="flex items-center justify-end mt-4">
                <PrimaryButton className="ml-4" disabled={processing}>
                    {processing ? 'Processing...' : 'Save'}
                </PrimaryButton>
            </div>
        </form>
    );
}
