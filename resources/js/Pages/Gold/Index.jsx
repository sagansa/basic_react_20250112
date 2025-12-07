import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, usePage } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton';
import TextInput from '@/Components/TextInput';
import { router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ auth, golds, totalWeight, totalBuyPrice, ...props }) {
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

    const goldsData = Array.isArray(golds?.data) ? golds.data : [];

    const filteredGolds = goldsData.filter(gold => {
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

    // Hitung total per halaman (page totals)
    const pageTotalBuyPrice = sortedGolds.reduce((total, gold) => total + (gold.buy_price || 0), 0);
    const pageTotalWeight = sortedGolds.reduce((total, gold) => total + (parseFloat(gold.product_gold?.weight) || 0), 0);
    const totalSellPrice = sortedGolds.reduce((total, gold) => total + (gold.sell_price || 0), 0);
    const pageTotalMarketValue = sortedGolds.reduce((total, gold) => total + (gold.market_value || 0), 0);

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
                    {/* Price Source Info Alert - UPDATED: Now per item */}
                    <div className="p-4 mb-4 text-sm text-blue-700 bg-blue-100 rounded-lg dark:bg-blue-200 dark:text-blue-800" role="alert">
                        <span className="font-medium">Info:</span> Market Value dihitung berdasarkan sumber harga masing-masing item (atau Default jika tidak diset).
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 gap-4 mb-8 md:grid-cols-4">
                        <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
                            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Berat</div>
                            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                {totalWeight ? `${totalWeight} gram` : '0 gram'}
                            </div>
                        </div>
                        <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
                            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Harga Beli</div>
                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                {formatCurrency(totalBuyPrice || 0)}
                            </div>
                        </div>
                        <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
                            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Est. Market Value</div>
                            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                {formatCurrency(props.totalMarketValue || 0)}
                            </div>
                        </div>
                        <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
                            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Harga Jual</div>
                            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                {formatCurrency(totalSellPrice)}
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
                                        placeholder="Cari..."
                                        className="block w-full dark:bg-gray-900 dark:text-gray-100"
                                    />
                                </div>

                                <div className="flex gap-2">
                                    <Link
                                        href={route('product-golds.index')}
                                        className="inline-flex items-center px-4 py-2 text-xs font-semibold tracking-widest text-gray-700 uppercase transition duration-150 ease-in-out bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-25 dark:bg-gray-800 dark:border-gray-500 dark:text-gray-300 dark:hover:bg-gray-700"
                                    >
                                        Daftar Produk
                                    </Link>
                                    <Link
                                        href={route('gold-prices.index')}
                                        className="inline-flex items-center px-4 py-2 text-xs font-semibold tracking-widest text-gray-700 uppercase transition duration-150 ease-in-out bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-25 dark:bg-gray-800 dark:border-gray-500 dark:text-gray-300 dark:hover:bg-gray-700"
                                    >
                                        Input Harga Harian
                                    </Link>
                                    <Link
                                        href={route('gold-price-sources.index')}
                                        className="inline-flex items-center px-4 py-2 text-xs font-semibold tracking-widest text-gray-700 uppercase transition duration-150 ease-in-out bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-25 dark:bg-gray-800 dark:border-gray-500 dark:text-gray-300 dark:hover:bg-gray-700"
                                    >
                                        Sumber Harga
                                    </Link>
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
                            </div>

                            <table className="w-full whitespace-nowrap">
                                <thead>
                                    <tr className="font-bold text-left bg-gray-50 dark:bg-gray-700">
                                        <th onClick={() => handleSort('sn')} className="px-6 pt-5 pb-4 cursor-pointer dark:text-gray-200">
                                            Serial No
                                            {sortColumn === 'sn' && (sortDirection === 'asc' ? ' 🔼' : ' 🔽')}
                                        </th>
                                        <th onClick={() => handleSort('product_gold.name')} className="px-6 pt-5 pb-4 cursor-pointer dark:text-gray-200">
                                            Produk
                                            {sortColumn === 'product_gold.name' && (sortDirection === 'asc' ? ' 🔼' : ' 🔽')}
                                        </th>
                                        <th className="px-6 pt-5 pb-4 dark:text-gray-200">
                                            Berat
                                        </th>
                                        <th onClick={() => handleSort('buy_price')} className="px-6 pt-5 pb-4 cursor-pointer dark:text-gray-200">
                                            Harga Beli
                                            {sortColumn === 'buy_price' && (sortDirection === 'asc' ? ' 🔼' : ' 🔽')}
                                        </th>
                                        <th className="px-6 pt-5 pb-4 dark:text-gray-200">
                                            Market Value
                                        </th>
                                        <th onClick={() => handleSort('date')} className="px-6 pt-5 pb-4 cursor-pointer dark:text-gray-200">
                                            Tanggal
                                            {sortColumn === 'date' && (sortDirection === 'asc' ? ' 🔼' : ' 🔽')}
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
                                                {gold.product_gold?.name}
                                                <div className="text-xs text-gray-500">{gold.production_year}</div>
                                            </td>
                                            <td className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 dark:text-gray-200">
                                                {gold.product_gold?.weight ? `${gold.product_gold.weight} gram` : '-'}
                                                {gold.gold_price_source && (
                                                    <div className="mt-1">
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                                                            {gold.gold_price_source.code}
                                                        </span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-blue-600 border-t border-gray-200 dark:border-gray-700 dark:text-blue-400">
                                                {formatCurrency(gold.buy_price)}
                                                <div className="text-xs font-normal text-gray-500">
                                                    {formatCurrency(gold.buy_price_per_weight)} /g
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-purple-600 border-t border-gray-200 dark:border-gray-700 dark:text-purple-400">
                                                {formatCurrency(gold.market_value || 0)}
                                            </td>
                                            <td className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 dark:text-gray-200">
                                                {new Date(gold.date).toLocaleDateString('id-ID')}
                                                <div className="text-xs text-gray-500">{gold.buy_from}</div>
                                            </td>

                                            <td className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                                                <div className="flex gap-2 items-center">
                                                    {hasPermission('edit_golds') && (
                                                        <Link href={route('golds.edit', gold.id)}>
                                                            <PrimaryButton className="px-2 py-1 text-xs">Edit</PrimaryButton>
                                                        </Link>
                                                    )}
                                                    {hasPermission('delete_golds') && (
                                                        <DangerButton
                                                            onClick={() => deleteGold(gold.id)}
                                                            className="px-2 py-1 text-xs"
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
                                                colSpan="7"
                                                className="px-6 py-4 text-center border-t border-gray-200 dark:border-gray-700 dark:text-gray-400"
                                            >
                                                Tidak ada data emas.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                                <tfoot className="bg-gray-100 dark:bg-gray-700">
                                    <tr className="font-bold">
                                        <td colSpan="2" className="px-6 py-4 text-right border-t-2 border-gray-300 dark:border-gray-600 dark:text-gray-200">
                                            Total Halaman Ini:
                                        </td>
                                        <td className="px-6 py-4 border-t-2 border-gray-300 dark:border-gray-600 dark:text-gray-200">
                                            {pageTotalWeight ? `${pageTotalWeight} gram` : '0 gram'}
                                        </td>
                                        <td className="px-6 py-4 text-blue-600 border-t-2 border-gray-300 dark:border-gray-600 dark:text-blue-400">
                                            {formatCurrency(pageTotalBuyPrice)}
                                        </td>
                                        <td className="px-6 py-4 text-purple-600 border-t-2 border-gray-300 dark:border-gray-600 dark:text-purple-400">
                                            {formatCurrency(pageTotalMarketValue)}
                                        </td>
                                        <td colSpan="2" className="border-t-2 border-gray-300 dark:border-gray-600"></td>
                                    </tr>
                                </tfoot>
                            </table>

                            {/* Pagination Controls */}
                            {golds.last_page > 1 && (
                                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                                    <div className="text-sm text-gray-700 dark:text-gray-300">
                                        Showing {golds.from} to {golds.to} of {golds.total} results
                                    </div>
                                    <div className="flex gap-2">
                                        {golds.links.map((link, index) => {
                                            if (link.url === null) {
                                                return (
                                                    <span
                                                        key={index}
                                                        className="px-3 py-1 text-sm text-gray-400 bg-gray-100 rounded dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed"
                                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                                    />
                                                );
                                            }
                                            return (
                                                <Link
                                                    key={index}
                                                    href={link.url}
                                                    className={`px-3 py-1 text-sm rounded ${link.active
                                                        ? 'bg-blue-600 text-white font-semibold'
                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                                                        }`}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
