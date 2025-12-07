import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, router } from '@inertiajs/react'; // Added router import
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import Modal from '@/Components/Modal';
import { useState } from 'react';

export default function Index({ auth, sources }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSource, setEditingSource] = useState(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        name: '',
        code: '',
        description: '',
        is_active: true,
    });

    const openModal = (source = null) => {
        if (source) {
            setEditingSource(source);
            setData({
                name: source.name,
                code: source.code,
                description: source.description || '',
                is_active: source.is_active,
            });
        } else {
            setEditingSource(null);
            reset();
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingSource) {
            put(route('gold-price-sources.update', editingSource.id), {
                onSuccess: closeModal,
            });
        } else {
            post(route('gold-price-sources.store'), {
                onSuccess: closeModal,
            });
        }
    };

    const deleteSource = (id) => {
        if (confirm('Are you sure you want to delete this source?')) {
            router.delete(route('gold-price-sources.destroy', id)); // Use router.delete
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">Manage Price Sources</h2>}
        >
            <Head title="Price Sources" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="flex justify-end mb-6">
                        <PrimaryButton onClick={() => openModal()}>
                            Add New Source
                        </PrimaryButton>
                    </div>

                    <div className="overflow-hidden bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr>
                                        <th className="p-4 border-b dark:border-gray-700">Name</th>
                                        <th className="p-4 border-b dark:border-gray-700">Code</th>
                                        <th className="p-4 border-b dark:border-gray-700">Description</th>
                                        <th className="p-4 border-b dark:border-gray-700">Status</th>
                                        <th className="p-4 border-b dark:border-gray-700">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sources.map((source) => (
                                        <tr key={source.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <td className="p-4 border-b dark:border-gray-700">{source.name}</td>
                                            <td className="p-4 border-b dark:border-gray-700">{source.code}</td>
                                            <td className="p-4 border-b dark:border-gray-700">{source.description}</td>
                                            <td className="p-4 border-b dark:border-gray-700">
                                                <span className={`px-2 py-1 rounded text-xs ${source.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {source.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="p-4 border-b dark:border-gray-700">
                                                <SecondaryButton onClick={() => openModal(source)} className="mr-2">
                                                    Edit
                                                </SecondaryButton>
                                                <DangerButton onClick={() => deleteSource(source.id)}>
                                                    Delete
                                                </DangerButton>
                                            </td>
                                        </tr>
                                    ))}
                                    {sources.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="p-4 text-center text-gray-500 border-b dark:border-gray-700">
                                                No price sources found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={isModalOpen} onClose={closeModal}>
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        {editingSource ? 'Edit Price Source' : 'Add New Price Source'}
                    </h2>

                    <form onSubmit={handleSubmit} className="mt-6">
                        <div className="mb-4">
                            <InputLabel htmlFor="name" value="Name" />
                            <TextInput
                                id="name"
                                type="text"
                                className="block w-full mt-1"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        <div className="mb-4">
                            <InputLabel htmlFor="code" value="Code" />
                            <TextInput
                                id="code"
                                type="text"
                                className="block w-full mt-1"
                                value={data.code}
                                onChange={(e) => setData('code', e.target.value)}
                                required
                            />
                            <InputError message={errors.code} className="mt-2" />
                        </div>

                        <div className="mb-4">
                            <InputLabel htmlFor="description" value="Description" />
                            <TextInput
                                id="description"
                                type="text"
                                className="block w-full mt-1"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                            />
                            <InputError message={errors.description} className="mt-2" />
                        </div>

                        <div className="flex items-center mb-4">
                            <input
                                id="is_active"
                                type="checkbox"
                                className="text-blue-600 border-gray-300 rounded shadow-sm focus:ring-blue-500 dark:bg-gray-900 dark:border-gray-700"
                                checked={data.is_active}
                                onChange={(e) => setData('is_active', e.target.checked)}
                            />
                            <label htmlFor="is_active" className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                                Active
                            </label>
                        </div>

                        <div className="flex justify-end mt-6">
                            <SecondaryButton onClick={closeModal} className="mr-3">
                                Cancel
                            </SecondaryButton>
                            <PrimaryButton disabled={processing}>
                                {editingSource ? 'Update' : 'Save'}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
