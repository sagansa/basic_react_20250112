import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import DangerButton from '@/Components/DangerButton';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { router } from '@inertiajs/react';
import React, { useState } from 'react';

export default function Index({ auth, units }) {
    const [search, setSearch] = useState('');

    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    const filteredUnits = units.filter(unit =>
        unit.name.toLowerCase().includes(search.toLowerCase())
    );

    const deleteUnit = (id) => {
        if (confirm('Are you sure you want to delete this unit?')) {
            router.delete(route('units.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">Units</h2>}
        >
            <Head title="Units" />

            <div className="py-12">
                <div className="mx-auto space-y-6 max-w-7xl sm:px-6 lg:px-8">
                    <div className="p-4 bg-white shadow sm:p-8 dark:bg-gray-800 sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="flex justify-between mb-6">
                                <div className="flex items-center w-1/3">
                                    <TextInput
                                        type="text"
                                        name="search"
                                        value={search}
                                        onChange={handleSearch}
                                        placeholder="Search units..."
                                        className="block w-full dark:bg-gray-900 dark:text-gray-100"
                                    />
                                </div>

                                <Link href={route('units.create')}>
                                    <PrimaryButton>
                                        <span className="mr-2">+</span>
                                        Create Unit
                                    </PrimaryButton>
                                </Link>
                            </div>

                            <div className="overflow-x-auto bg-white rounded shadow dark:bg-gray-800">
                                <table className="w-full whitespace-nowrap">
                                    <thead>
                                        <tr className="font-bold text-left bg-gray-50 dark:bg-gray-700">
                                            <th className="px-6 pt-5 pb-4 dark:text-gray-200">Name</th>
                                            <th className="px-6 pt-5 pb-4 dark:text-gray-200">Unit</th>
                                            <th className="px-6 pt-5 pb-4 dark:text-gray-200">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {units.map((unit) => (
                                            <tr key={unit.id} className="hover:bg-gray-50 focus-within:bg-gray-50 dark:hover:bg-gray-700 dark:focus-within:bg-gray-700">
                                                <td className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">{unit.name}</td>
                                                <td className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">{unit.unit}</td>
                                                <td className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                                                    <div className="flex gap-4 items-center">
                                                        <Link href={route('units.edit', unit.id)}>
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
