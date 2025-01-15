import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import DangerButton from '@/Components/DangerButton';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { router } from '@inertiajs/react';
import React, { useState } from 'react';

export default function Index({ auth, productGolds }) {
    const [search, setSearch] = useState('');

    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    const filteredProducts = productGolds.filter(product =>
        product.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">Produk Emas</h2>}
        >
            <Head title="Produk Emas" />

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
                                        placeholder="Cari produk..."
                                        className="block w-full dark:bg-gray-900 dark:text-gray-100"
                                    />
                                </div>

                                <Link href={route('product-golds.create')}>
                                    <PrimaryButton>
                                        <span className="mr-2">+</span>
                                        Tambah Produk
                                    </PrimaryButton>
                                </Link>
                            </div>

                            <div className="overflow-x-auto bg-white rounded shadow dark:bg-gray-800">
                                <table className="w-full whitespace-nowrap">
                                    <thead>
                                        <tr className="font-bold text-left bg-gray-50 dark:bg-gray-700">
                                            <th className="px-6 pt-5 pb-4 dark:text-gray-200">Nama</th>
                                            <th className="px-6 pt-5 pb-4 dark:text-gray-200">Unit</th>
                                            <th className="px-6 pt-5 pb-4 dark:text-gray-200">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredProducts.map((product) => (
                                            <tr key={product.id} className="hover:bg-gray-50 focus-within:bg-gray-50 dark:hover:bg-gray-700 dark:focus-within:bg-gray-700">
                                                <td className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                                                    {product.name}
                                                </td>
                                                <td className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                                                    {product.unit.name}
                                                </td>
                                                <td className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                                                    <div className="flex gap-4 items-center">
                                                        <Link href={route('product-golds.edit', product.id)}>
                                                            <SecondaryButton>
                                                                Edit
                                                            </SecondaryButton>
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {filteredProducts.length === 0 && (
                                            <tr>
                                                <td
                                                    colSpan="4"
                                                    className="px-6 py-4 text-center border-t border-gray-200 dark:border-gray-700"
                                                >
                                                    Tidak ada data produk
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
