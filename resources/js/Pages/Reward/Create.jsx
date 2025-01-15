import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from '@inertiajs/react';
import UserForm from './UserForm';

export default function Create({ auth, subjects = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        user_id: auth.user.id,
        grades: [],
        total_reward_amount: 0,
        total_payment: 0,
        status: 'unpaid'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('rewards.store'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">Tambah Reward Baru</h2>}
        >
            <Head title="Tambah Reward" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <UserForm
                                data={data}
                                setData={setData}
                                errors={errors}
                                subjects={subjects}
                                processing={processing}
                                submit={handleSubmit}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
