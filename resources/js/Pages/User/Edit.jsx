import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import Checkbox from '@/Components/Checkbox';

export default function Edit({ auth, user, roles }) {
    const { data, setData, patch, processing, errors } = useForm({
        name: user.name,
        email: user.email,
        roles: user.roles.map(role => role.id)
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        patch(route('users.update', user.id));
    };

    const handleRoleChange = (roleId) => {
        const newRoles = data.roles.includes(roleId)
            ? data.roles.filter(id => id !== roleId)
            : [...data.roles, roleId];

        setData('roles', newRoles);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">Edit User</h2>}
        >
            <Head title="Edit User" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <form onSubmit={handleSubmit}>
                                <div className="mt-4">
                                    <InputLabel htmlFor="name" value="Name" />
                                    <TextInput
                                        id="name"
                                        type="text"
                                        name="name"
                                        value={data.name}
                                        className="block w-full mt-1"
                                        onChange={e => setData('name', e.target.value)}
                                    />
                                    <InputError message={errors.name} className="mt-2" />
                                </div>

                                <div className="mt-4">
                                    <InputLabel htmlFor="email" value="Email" />
                                    <TextInput
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        className="block w-full mt-1"
                                        onChange={e => setData('email', e.target.value)}
                                    />
                                    <InputError message={errors.email} className="mt-2" />
                                </div>

                                <div className="mt-4">
                                    <InputLabel value="Roles" />
                                    <div className="mt-2 space-y-2">
                                        {roles.map((role) => (
                                            <div key={role.id} className="flex items-center">
                                                <Checkbox
                                                    name="roles[]"
                                                    value={role.id}
                                                    checked={data.roles.includes(role.id)}
                                                    onChange={() => handleRoleChange(role.id)}
                                                />
                                                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                                                    {role.name}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                    <InputError message={errors.roles} className="mt-2" />
                                </div>

                                <div className="flex items-center justify-end mt-4">
                                    <PrimaryButton className="ml-4" disabled={processing}>
                                        Update
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
