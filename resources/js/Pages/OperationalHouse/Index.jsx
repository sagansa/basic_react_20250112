import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { router } from '@inertiajs/react';
import React, { useState } from 'react';

export default function Index({ auth, summary, operationalHouses }) {
    const [search, setSearch] = useState('');

    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const formatMonth = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">Operasional Laweyan</h2>}
        >
            <Head title="Operational Houses" />

            <div className="py-12">
                <div className="mx-auto space-y-6 max-w-7xl sm:px-6 lg:px-8">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 gap-4 mb-8 md:grid-cols-2">
                        <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
                            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Credit</div>
                            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                {formatCurrency(summary.total_credit)}
                            </div>
                        </div>
                        <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
                            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Debit</div>
                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                {formatCurrency(summary.total_debit)}
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-white shadow sm:p-8 dark:bg-gray-800 sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="flex justify-between mb-6">
                                {/* <div className="flex items-center w-1/3">
                                    <TextInput
                                        type="text"
                                        name="search"
                                        value={search}
                                        onChange={handleSearch}
                                        placeholder="Cari produk..."
                                        className="block w-full dark:bg-gray-900 dark:text-gray-100"
                                    />
                                </div> */}

                                <Link href={route('operational-houses.create')}>
                                    <PrimaryButton>
                                        <span className="mr-2">+</span>
                                        Tambah Operasional
                                    </PrimaryButton>
                                </Link>
                            </div>

                            <div className="overflow-x-auto bg-white rounded shadow dark:bg-gray-800">
                                <table className="w-full whitespace-nowrap">
                                    <thead>
                                        <tr className="font-bold text-left bg-gray-50 dark:bg-gray-700">
                                            <th className="px-6 pt-5 pb-4 dark:text-gray-200">Image</th>
                                            <th className="px-6 pt-5 pb-4 dark:text-gray-200">Date</th>
                                            <th className="px-6 pt-5 pb-4 dark:text-gray-200">Payment Month</th>
                                            <th className="px-6 pt-5 pb-4 dark:text-gray-200">Amount</th>
                                            <th className="px-6 pt-5 pb-4 dark:text-gray-200">Cr/Db</th>
                                            <th className="px-6 pt-5 pb-4 dark:text-gray-200">Notes</th>
                                            <th className="px-6 pt-5 pb-4 dark:text-gray-200">User</th>
                                            <th className="px-6 pt-5 pb-4 dark:text-gray-200">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {operationalHouses.map((operationalHouse) => (
                                            <tr key={operationalHouse.id} className="hover:bg-gray-50 focus-within:bg-gray-50 dark:hover:bg-gray-700 dark:focus-within:bg-gray-700">
                                                <td className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                                                    {operationalHouse.image}
                                                </td>
                                                <td className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                                                    {new Date(operationalHouse.date).toLocaleDateString('id-ID')}
                                                </td>
                                                <td className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                                                    {formatMonth(operationalHouse.month)}
                                                </td>
                                                <td className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                                                    {formatCurrency(operationalHouse.amount)}
                                                </td>
                                                <td className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                                                    {operationalHouse.credit_debit}
                                                </td>
                                                <td className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                                                    {operationalHouse.notes}
                                                </td>
                                                <td className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                                                    {operationalHouse.user.name}
                                                </td>
                                                <td className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                                                    <div className="flex gap-4 items-center">
                                                        <Link href={route('operational-houses.edit', operationalHouse.id)}>
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
