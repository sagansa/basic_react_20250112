import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from '@inertiajs/react';
import AdminForm from './AdminForm';
import UserForm from './UserForm';

export default function Edit({ auth, reward, subjects }) {

    const { data, setData, put, processing, errors } = useForm({
        id: reward.id,
        user: reward.user,
        grades: reward.grade,
        total_reward_amount: reward.total_reward_amount,
        total_payment: reward.total_payment || 0,
        status: reward.status || 'unpaid',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('rewards.update', reward.id), {
            preserveScroll: true,
            onSuccess: () => {
            },
            onError: (errors) => {
                console.error('Update failed:', errors);
            }
        });
    };

    const isAdmin = auth.user.roles.includes('admin') || auth.user.roles.includes('super-admin');

    const renderForm = () => {
        if (isAdmin) {
            return (
                <AdminForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    submit={handleSubmit}
                />
            );
        } else {
            return (
                <UserForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    submit={handleSubmit}
                    subjects={subjects}
                />
            );
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                Edit Reward
            </h2>}
        >
            <Head title="Edit Reward" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            {renderForm()}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
