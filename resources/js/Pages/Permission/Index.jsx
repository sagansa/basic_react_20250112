import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import DangerButton from '@/Components/DangerButton';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { router } from '@inertiajs/react';
import React, { useState } from 'react';

export default function Index({ auth, permissions }) {
    const [search, setSearch] = useState('');

    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    const filteredPermissions = permissions.filter(permission =>
        permission.name.toLowerCase().includes(search.toLowerCase())
    );

    const deletePermission = (id) => {
        if (confirm('Are you sure you want to delete this permission?')) {
            router.delete(route('permissions.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">Permissions</h2>}
        >
            <Head title="Permissions" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="flex justify-between mb-6">
                                <div className="flex items-center w-1/3">
                                    <TextInput
                                        type="text"
                                        name="search"
                                        value={search}
                                        onChange={handleSearch}
                                        placeholder="Search permissions..."
                                        className="block w-full dark:bg-gray-900 dark:text-gray-100"
                                    />
                                </div>

                                <Link href={route('permissions.create')}>
                                    <PrimaryButton>
                                        <span className="mr-2">+</span>
                                        Create Permission
                                    </PrimaryButton>
                                </Link>
                            </div>

                            <div className="overflow-x-auto bg-white rounded shadow dark:bg-gray-800">
                                <table className="w-full whitespace-nowrap">
                                    <thead>
                                        <tr className="font-bold text-left bg-gray-50 dark:bg-gray-700">
                                            <th className="px-6 pt-5 pb-4 dark:text-gray-200">Name</th>
                                            <th className="px-6 pt-5 pb-4 dark:text-gray-200">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredPermissions.map((permission) => (
                                            <tr
                                                key={permission.id}
                                                className="hover:bg-gray-50 focus-within:bg-gray-50 dark:hover:bg-gray-700 dark:focus-within:bg-gray-700"
                                            >
                                                <td className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 dark:text-gray-200">
                                                    {permission.name}
                                                </td>
                                                <td className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                                                    <div className="flex items-center gap-4">
                                                        <Link href={route('permissions.edit', permission.id)}>
                                                            <SecondaryButton>
                                                                Edit
                                                            </SecondaryButton>
                                                        </Link>

                                                        <DangerButton
                                                            onClick={() => deletePermission(permission.id)}
                                                        >
                                                            Delete
                                                        </DangerButton>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {filteredPermissions.length === 0 && (
                                            <tr>
                                                <td
                                                    className="px-6 py-4 text-center border-t border-gray-200 dark:border-gray-700 dark:text-gray-400"
                                                    colSpan="2"
                                                >
                                                    No permissions found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
