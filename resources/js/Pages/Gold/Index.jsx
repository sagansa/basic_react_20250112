import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, usePage } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton';
import TextInput from '@/Components/TextInput';
import { router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ auth, golds, productTotals }) {
    const { user } = auth;
    const hasPermission = (permission) => {
        return user?.all_permissions?.includes(permission);
    };

    const [search, setSearch] = useState('');
    const [sortColumn, setSortColumn] = useState('date');
    const [sortDirection, setSortDirection] = useState('asc');

    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    const handleSort = (column) => {
        const direction = sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc';
        setSortColumn(column);
        setSortDirection(direction);
    };

    const filteredGolds = golds.filter(gold => {
        const productName = gold.product_gold?.name?.toLowerCase() || '';
        const buyFrom = gold.buy_from?.toLowerCase() || '';
        const sellTo = gold.sell_to?.toLowerCase() || '';
        const storedIn = gold.stored_in?.toLowerCase() || '';

        const matchesSearch =
            productName.includes(search.toLowerCase()) ||
            buyFrom.includes(search.toLowerCase()) ||
            sellTo.includes(search.toLowerCase()) ||
            storedIn.includes(search.toLowerCase());

        return matchesSearch;
    });

    const sortedGolds = filteredGolds.sort((a, b) => {
        const aValue = sortColumn === 'date' ? new Date(a.date) : (sortColumn === 'product_gold.name' ? a.product_gold?.name?.toLowerCase() : a[sortColumn]);
        const bValue = sortColumn === 'date' ? new Date(b.date) : (sortColumn === 'product_gold.name' ? b.product_gold?.name?.toLowerCase() : b[sortColumn]);

        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    });

    // Hitung total
    const totalBuyPrice = sortedGolds.reduce((total, gold) => total + (gold.buy_price || 0), 0);
    const totalSellPrice = sortedGolds.reduce((total, gold) => total + (gold.sell_price || 0), 0);
    const totalProducts = sortedGolds.length;

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const deleteGold = (id) => {
        if (!hasPermission('delete_golds')) {
            alert('Anda tidak memiliki izin untuk menghapus data');
            return;
        }

        if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
            router.delete(route('golds.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">Data Emas</h2>}
        >
            <Head title="Data Emas" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 gap-4 mb-8 md:grid-cols-3">
                        <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
                            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Produk</div>
                            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                {totalProducts} Item
                            </div>
                        </div>
                        <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
                            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Harga Beli</div>
                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                {formatCurrency(totalBuyPrice)}
                            </div>
                        </div>
                        <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
                            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Harga Jual</div>
                            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                {formatCurrency(totalSellPrice)}
                            </div>
                        </div>
                    </div>

                    {/* Product Summary */}
                    <div className="overflow-hidden mb-8 bg-white rounded-lg shadow dark:bg-gray-800">
                        <div className="p-6">
                            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                                Ringkasan per Produk
                            </h3>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-left bg-gray-50 dark:bg-gray-700">
                                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                                                Nama Produk
                                            </th>
                                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                                                Jumlah
                                            </th>
                                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                                                Berat
                                            </th>
                                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                                                Satuan
                                            </th>
                                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                                                Total Harga Beli
                                            </th>
                                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                                                Harga/Gram
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {Object.entries(productTotals).map(([productName, data]) => (
                                            <tr key={productName} className="dark:bg-gray-800">
                                                <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                                                    {productName}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                                                    {data.count}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                                                    {data.weight}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                                                    {data.unit}
                                                </td>
                                                <td className="px-6 py-4 text-sm font-semibold text-blue-600 dark:text-blue-400">
                                                    {formatCurrency(data.total_buy_price)}
                                                </td>
                                                <td className="px-6 py-4 text-sm font-semibold text-purple-600 dark:text-purple-400">
                                                    {formatCurrency(data.price_per_weight)}/{data.unit}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Table Container */}
                    <div className="overflow-x-auto bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="flex justify-between mb-6">
                                <div className="flex items-center w-1/3">
                                    <TextInput
                                        type="text"
                                        name="search"
                                        value={search}
                                        onChange={handleSearch}
                                        placeholder="Cari Beli Dari, Jual Ke, atau Disimpan Di..."
                                        className="block w-full dark:bg-gray-900 dark:text-gray-100"
                                    />
                                </div>

                                {hasPermission('create_golds') && (
                                    <Link
                                        href={route('golds.create')}
                                        className="inline-flex items-center"
                                    >
                                        <PrimaryButton>
                                            <span className="mr-2">+</span>
                                            Tambah Data
                                        </PrimaryButton>
                                    </Link>
                                )}
                            </div>

                            <table className="w-full whitespace-nowrap">
                                <thead>
                                    <tr className="font-bold text-left bg-gray-50 dark:bg-gray-700">
                                        <th onClick={() => handleSort('sn')} className="px-6 pt-5 pb-4 cursor-pointer dark:text-gray-200">
                                            Serial No
                                            {sortColumn === 'sn' && (sortDirection === 'asc' ? ' 🔼' : ' 🔽')}
                                        </th>
                                        <th onClick={() => handleSort('production_year')} className="px-6 pt-5 pb-4 cursor-pointer dark:text-gray-200">
                                            Tahun Produksi
                                            {sortColumn === 'production_year' && (sortDirection === 'asc' ? ' 🔼' : ' 🔽')}
                                        </th>
                                        <th onClick={() => handleSort('product_gold.name')} className="px-6 pt-5 pb-4 cursor-pointer dark:text-gray-200">
                                            Produk
                                            {sortColumn === 'product_gold.name' && (sortDirection === 'asc' ? ' 🔼' : ' 🔽')}
                                        </th>
                                        <th onClick={() => handleSort('date')} className="px-6 pt-5 pb-4 cursor-pointer dark:text-gray-200">
                                            Tanggal
                                            {sortColumn === 'date' && (sortDirection === 'asc' ? ' 🔼' : ' 🔽')}
                                        </th>
                                        <th onClick={() => handleSort('buy_from')} className="px-6 pt-5 pb-4 cursor-pointer dark:text-gray-200">
                                            Beli Dari
                                            {sortColumn === 'buy_from' && (sortDirection === 'asc' ? ' 🔼' : ' 🔽')}
                                        </th>
                                        <th onClick={() => handleSort('buy_price')} className="px-6 pt-5 pb-4 cursor-pointer dark:text-gray-200">
                                            Harga Beli
                                            {sortColumn === 'buy_price' && (sortDirection === 'asc' ? ' 🔼' : ' 🔽')}
                                        </th>
                                        <th onClick={() => handleSort('sell_price')} className="px-6 pt-5 pb-4 cursor-pointer dark:text-gray-200">
                                            Harga Jual
                                            {sortColumn === 'sell_price' && (sortDirection === 'asc' ? ' 🔼' : ' 🔽')}
                                        </th>
                                        <th onClick={() => handleSort('sell_to')} className="px-6 pt-5 pb-4 cursor-pointer dark:text-gray-200">
                                            Jual Ke
                                            {sortColumn === 'sell_to' && (sortDirection === 'asc' ? ' 🔼' : ' 🔽')}
                                        </th>
                                        <th onClick={() => handleSort('stored_in')} className="px-6 pt-5 pb-4 cursor-pointer dark:text-gray-200">
                                            Disimpan Di
                                            {sortColumn === 'stored_in' && (sortDirection === 'asc' ? ' 🔼' : ' 🔽')}
                                        </th>
                                        <th className="px-6 pt-5 pb-4 cursor-pointer dark:text-gray-200">
                                            Harga Beli / gram
                                        </th>
                                        <th className="px-6 pt-5 pb-4 dark:text-gray-200">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedGolds.map((gold) => (
                                        <tr key={gold.id} className="hover:bg-gray-50 focus-within:bg-gray-50 dark:hover:bg-gray-700 dark:focus-within:bg-gray-700">
                                            <td className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 dark:text-gray-200">
                                                {gold.sn}
                                            </td>
                                            <td className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 dark:text-gray-200">
                                                {gold.production_year}
                                            </td>
                                            <td className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 dark:text-gray-200">
                                                {gold.product_gold?.name}
                                            </td>
                                            <td className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 dark:text-gray-200">
                                                {new Date(gold.date).toLocaleDateString('id-ID')}
                                            </td>
                                            <td className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 dark:text-gray-200">
                                                {gold.buy_from}
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-blue-600 border-t border-gray-200 dark:border-gray-700 dark:text-blue-400">
                                                {formatCurrency(gold.buy_price)}
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-green-600 border-t border-gray-200 dark:border-gray-700 dark:text-green-400">
                                                {formatCurrency(gold.sell_price)}
                                            </td>
                                            <td className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 dark:text-gray-200">
                                                {gold.sell_to}
                                            </td>

                                            <td className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 dark:text-gray-200">
                                                {gold.stored_in}
                                            </td>
                                            <td className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                                                <div className="flex gap-4 items-center">
                                                    {hasPermission('edit_golds') && (
                                                        <Link href={route('golds.edit', gold.id)}>
                                                            <PrimaryButton>
                                                                Edit
                                                            </PrimaryButton>
                                                        </Link>
                                                    )}
                                                    {hasPermission('delete_golds') && (
                                                        <DangerButton
                                                            onClick={() => deleteGold(gold.id)}
                                                        >
                                                            Hapus
                                                        </DangerButton>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {sortedGolds.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan="8"
                                                className="px-6 py-4 text-center border-t border-gray-200 dark:border-gray-700 dark:text-gray-400"
                                            >
                                                Tidak ada data emas.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
