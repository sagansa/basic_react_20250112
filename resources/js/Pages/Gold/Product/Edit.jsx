import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import Form from './Form';

export default function Edit({ auth, productGold, units }) {
    const { data, setData, patch, processing, errors } = useForm({
        name: productGold.name,
        weight: productGold.weight,
        unit_id: productGold.unit_id,
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('product-golds.update', productGold.id));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">Edit Produk Emas</h2>}
        >
            <Head title="Edit Produk Emas" />

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
                                units={units}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
