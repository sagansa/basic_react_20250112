import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import Form from './Form';

export default function Edit({ auth, operationalHouse }) {
    const { data, setData, put, processing, errors } = useForm({
        image: operationalHouse.image || null,
        date: operationalHouse.date,
        month: operationalHouse.month,
        amount: operationalHouse.amount,
        credit_debit: operationalHouse.credit_debit,
        for: operationalHouse.for || [],
        notes: operationalHouse.notes,
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('operational-houses.update', operationalHouse.id));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">Edit Operasional Laweyan</h2>}
        >
            <Head title="Edit Operasional Laweyan" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <Form
                                data={data}
                                setData={setData}
                                errors={errors}
                                processing={processing}
                                submit={submit}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
