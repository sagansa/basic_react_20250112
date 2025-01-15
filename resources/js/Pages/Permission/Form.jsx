import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

export default function Form({ data, setData, errors, processing, submit }) {
    const actions = ['view', 'create', 'edit', 'delete'];
    const modules = ['users', 'roles', 'permissions', 'rewards', 'golds', 'product_golds'];

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
                <InputLabel htmlFor="action" value="Action" className="dark:text-gray-200" />
                <select
                    id="action"
                    name="action"
                    value={data.action}
                    onChange={handleActionChange}
                    className="mt-1 w-full rounded-md border-gray-300 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                >
                    <option value="">Select Action</option>
                    {actions.map(action => (
                        <option key={action} value={action}>
                            {action.charAt(0).toUpperCase() + action.slice(1)}
                        </option>
                    ))}
                </select>
                <InputError message={errors.action} className="mt-2" />
            </div>

            <div className="mb-6">
                <InputLabel htmlFor="module" value="Module" className="dark:text-gray-200" />
                <select
                    id="module"
                    name="module"
                    value={data.module}
                    onChange={handleModuleChange}
                    className="mt-1 w-full rounded-md border-gray-300 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                >
                    <option value="">Select Module</option>
                    {modules.map(module => (
                        <option key={module} value={module}>
                            {module.charAt(0).toUpperCase() + module.slice(1)}
                        </option>
                    ))}
                </select>
                <InputError message={errors.module} className="mt-2" />
            </div>

            <div className="mb-6">
                <InputLabel htmlFor="name" value="Permission Name" className="dark:text-gray-200" />
                <TextInput
                    id="name"
                    type="text"
                    name="name"
                    value={data.name}
                    className="block mt-1 w-full dark:bg-gray-900 dark:text-gray-100"
                    disabled
                />
                <InputError message={errors.name} className="mt-2" />
            </div>

            <div className="flex justify-end items-center mt-4">
                <PrimaryButton className="ml-4" disabled={processing}>
                    {processing ? 'Processing...' : 'Save'}
                </PrimaryButton>
            </div>
        </form>
    );
}
