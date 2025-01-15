import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import TextInput from '@/Components/TextInput';
import SecondaryButton from '@/Components/SecondaryButton';

export default function Index({ auth, users }) {
    const [search, setSearch] = useState('');

    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    const filteredUsers = users.data.filter(user =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">Users</h2>}
        >
            <Head title="Users" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="flex items-center w-1/3 mb-6">
                                <TextInput
                                    type="text"
                                    name="search"
                                    value={search}
                                    onChange={handleSearch}
                                    placeholder="Search users..."
                                    className="block w-full dark:bg-gray-900 dark:text-gray-100"
                                />
                            </div>

                            <div className="overflow-x-auto bg-white rounded shadow dark:bg-gray-800">
                                <table className="w-full whitespace-nowrap">
                                    <thead>
                                        <tr className="font-bold text-left bg-gray-50 dark:bg-gray-700">
                                            <th className="px-6 pt-5 pb-4 dark:text-gray-200">Name</th>
                                            <th className="px-6 pt-5 pb-4 dark:text-gray-200">Email</th>
                                            <th className="px-6 pt-5 pb-4 dark:text-gray-200">Roles</th>
                                            <th className="px-6 pt-5 pb-4 dark:text-gray-200">Created At</th>
                                            <th className="px-6 pt-5 pb-4 dark:text-gray-200">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredUsers.map((user) => (
                                            <tr
                                                key={user.id}
                                                className="hover:bg-gray-50 focus-within:bg-gray-50 dark:hover:bg-gray-700 dark:focus-within:bg-gray-700"
                                            >
                                                <td className="px-6 py-4 border-t border-b border-gray-100 dark:border-gray-700">
                                                    {user.name}
                                                </td>
                                                <td className="px-6 py-4 border-t border-b border-gray-100 dark:border-gray-700">
                                                    {user.email}
                                                </td>
                                                <td className="px-6 py-4 border-t border-b border-gray-100 dark:border-gray-700">
                                                    {user.roles.map(role => role.name).join(', ')}
                                                </td>
                                                <td className="px-6 py-4 border-t border-b border-gray-100 dark:border-gray-700">
                                                    {user.created_at}
                                                </td>
                                                <td className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                                                    <div className="flex items-center gap-4">
                                                        <Link href={route('users.edit', user.id)}>
                                                            <SecondaryButton>
                                                                Edit
                                                            </SecondaryButton>
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
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
