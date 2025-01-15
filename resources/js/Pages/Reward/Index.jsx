import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton';
import { router } from '@inertiajs/react';

export default function Index({ auth, summary, rewards }) {
    const isAdmin = auth.user.roles.includes('admin') || auth.user.roles.includes('super-admin');

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const deleteReward = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus reward ini?')) {
            router.delete(route('rewards.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">Ringkasan Reward</h2>}
        >
            <Head title="Ringkasan Reward" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 gap-4 mb-8 md:grid-cols-2">
                        <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
                            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Reward</div>
                            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                {formatCurrency(summary.total_reward_amount)}
                            </div>
                        </div>
                        <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
                            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Pembayaran</div>
                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                {formatCurrency(summary.total_payment)}
                            </div>
                        </div>
                    </div>

                    {/* Rewards Table */}
                    <div className="overflow-x-auto bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            {!isAdmin && (
                                <div className="flex justify-between mb-6">
                                    <Link href={route('rewards.create')}>
                                        <PrimaryButton>
                                            Tambah Reward
                                        </PrimaryButton>
                                    </Link>
                                </div>
                            )}

                            <table className="w-full whitespace-nowrap">
                                <thead>
                                    <tr className="font-bold text-left bg-gray-50 dark:bg-gray-700">
                                        {isAdmin && <th className="px-6 pt-5 pb-4">Pengguna</th>}
                                        <th className="px-6 pt-5 pb-4">Mata Pelajaran</th>
                                        <th className="px-6 pt-5 pb-4">Tipe</th>
                                        <th className="px-6 pt-5 pb-4">Nilai</th>
                                        <th className="px-6 pt-5 pb-4">KKM</th>
                                        <th className="px-6 pt-5 pb-4">Selisih</th>
                                        <th className="px-6 pt-5 pb-4">Total Reward</th>
                                        <th className="px-6 pt-5 pb-4">Pembayaran</th>
                                        <th className="px-6 pt-5 pb-4">Status</th>
                                        <th className="px-6 pt-5 pb-4">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rewards.map((reward) => (
                                        <tr key={reward.id} className="border-t hover:bg-gray-50 dark:hover:bg-gray-700">

                                            {isAdmin && (
                                                <td className="px-6 py-4">
                                                    {reward.user.name}
                                                </td>
                                            )}
                                            <td className="px-6 py-4">
                                                <ul className="space-y-1">
                                                    {reward.grade.map(grade => (
                                                        <li key={grade.id}>
                                                            {grade.subject.name}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </td>
                                            <td className="px-6 py-4">
                                                <ul className="space-y-1">
                                                    {reward.grade.map(grade => (
                                                        <li key={grade.id} className="capitalize">
                                                            {grade.type}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </td>
                                            <td className="px-6 py-4">
                                                <ul className="space-y-1">
                                                    {reward.grade.map(grade => (
                                                        <li key={grade.id}>
                                                            {grade.grade}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </td>
                                            <td className="px-6 py-4">
                                                <ul className="space-y-1">
                                                    {reward.grade.map(grade => (
                                                        <li key={grade.id}>
                                                            {grade.kkm}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </td>
                                            <td className="px-6 py-4">
                                                <ul className="space-y-1">
                                                    {reward.grade.map(grade => (
                                                        <li key={grade.id}>
                                                            {grade.difference}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-green-600 dark:text-green-400">
                                                {formatCurrency(reward.total_reward_amount)}
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-blue-600 dark:text-blue-400">
                                                {formatCurrency(reward.total_payment)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 text-sm rounded ${
                                                    reward.status === 'paid'
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                                                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                                                }`}>
                                                    {reward.status === 'paid' ? 'Dibayar' : 'Belum Dibayar'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-4 items-center">
                                                    {(isAdmin || reward.status !== 'paid') && (
                                                        <>
                                                            <Link
                                                                href={route('rewards.edit', reward.id)}
                                                            >
                                                                <PrimaryButton>
                                                                    Edit
                                                                </PrimaryButton>
                                                            </Link>
                                                            {/* <DangerButton
                                                                onClick={() => deleteReward(reward.id)}
                                                            >
                                                                Hapus
                                                            </DangerButton> */}
                                                        </>
                                                    )}
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
        </AuthenticatedLayout>
    );
}
