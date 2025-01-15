import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import Form from './Form';

export default function Edit({ auth, gold, productGolds }) {
    const { data, setData, patch, processing, errors } = useForm({
        product_gold_id: gold.product_gold_id || '',
        date: gold.date || '',
        buy_from: gold.buy_from || '',
        buy_price: gold.buy_price || '',
        sell_price: gold.sell_price || '',
        sell_to: gold.sell_to || '',
        stored_in: gold.stored_in || '',
        sn: gold.sn || '',
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('golds.update', gold.id));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">Edit Emas</h2>}
        >
            <Head title="Edit Emas" />

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
                                productGolds={productGolds}
                                isEdit={true}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
