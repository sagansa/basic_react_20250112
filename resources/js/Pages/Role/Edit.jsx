import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import Checkbox from '@/Components/Checkbox';

export default function Edit({ auth, role, permissions, rolePermissions }) {
    const { data, setData, patch, processing, errors } = useForm({
        name: role.name,
        permissions: rolePermissions,
    });

    const groupedPermissions = permissions.reduce((groups, permission) => {
        const [action, category] = permission.name.split('_');
        if (!groups[category]) {
            groups[category] = [];
        }
        groups[category].push(permission);
        return groups;
    }, {});

    const submit = (e) => {
        e.preventDefault();
        patch(route('roles.update', role.id));
    };

    const handlePermissionChange = (permissionId) => {
        const updatedPermissions = data.permissions.includes(permissionId)
            ? data.permissions.filter(id => id !== permissionId)
            : [...data.permissions, permissionId];

        setData('permissions', updatedPermissions);
    };

    const capitalizeFirstLetter = (string) => {
        return string ? string.charAt(0).toUpperCase() + string.slice(1) : '';
    };

    const formatPermissionName = (name) => {
        const [action] = name.split('_');
        return capitalizeFirstLetter(action);
    };

    const handleSelectAll = () => {
        const allPermissionIds = permissions.map(permission => permission.id);
        const isAllSelected = allPermissionIds.every(id => data.permissions.includes(id));

        if (isAllSelected) {
            // Unselect all permissions
            setData('permissions', []);
        } else {
            // Select all permissions
            setData('permissions', allPermissionIds);
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">Edit Role</h2>}
        >
            <Head title="Edit Role" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <form onSubmit={submit}>
                                <div className="mb-6">
                                    <InputLabel htmlFor="name" value="Name" className="dark:text-gray-200" />
                                    <TextInput
                                        id="name"
                                        type="text"
                                        name="name"
                                        value={data.name}
                                        className="block w-full mt-1 dark:bg-gray-900 dark:text-gray-100"
                                        onChange={(e) => setData('name', e.target.value)}
                                    />
                                    <InputError message={errors.name} className="mt-2" />
                                </div>

                                <div className="mb-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <InputLabel value="Permissions" className="dark:text-gray-200" />
                                        <button
                                            type="button"
                                            onClick={handleSelectAll}
                                            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                                        >
                                            {permissions.every(permission =>
                                                data.permissions.includes(permission.id)
                                            ) ? 'Unselect All' : 'Select All'}
                                        </button>
                                    </div>

                                    {Object.entries(groupedPermissions).map(([category, categoryPermissions]) => (
                                        <div key={category} className="mb-6">
                                            <h3 className="mb-3 text-lg font-medium text-gray-900 dark:text-gray-100">
                                                {capitalizeFirstLetter(category)}
                                            </h3>
                                            <div className="grid grid-cols-1 gap-4 pl-4 md:grid-cols-2 lg:grid-cols-4">
                                                {categoryPermissions.map((permission) => (
                                                    <label key={permission.id} className="flex items-center dark:text-gray-200">
                                                        <Checkbox
                                                            name="permissions"
                                                            value={permission.id}
                                                            checked={data.permissions.includes(permission.id)}
                                                            onChange={() => handlePermissionChange(permission.id)}
                                                        />
                                                        <span className="ml-2">
                                                            {formatPermissionName(permission.name)}
                                                        </span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                    <InputError message={errors.permissions} className="mt-2" />
                                </div>

                                <div className="flex items-center justify-end mt-4">
                                    <PrimaryButton className="ml-4" disabled={processing}>
                                        Update Role
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
