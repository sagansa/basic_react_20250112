import React, { useState } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import SelectInput from '@/Components/SelectInput';
import DangerButton from '@/Components/DangerButton';

export default function UserForm({ data, setData, errors, processing, submit, subjects }) {
    // Separate state for input form
    const [formInput, setFormInput] = useState({
        subject_id: '',
        type: '',
        grade: '',
        kkm: '',
        date: '',
    });

    const calculateDifference = (grade, kkm) => {
        if (!grade || !kkm) return '';
        return Math.max(0, parseInt(grade) - parseInt(kkm));
    };

    const calculateRewardAmount = (grade, difference) => {
        if (parseInt(grade) === 100) {
            return 100000;
        }
        return parseInt(difference) * 1000;
    };

    const handleGradeChange = (index, field, value) => {
        const updatedGrades = [...data.grades];
        updatedGrades[index] = {
            ...updatedGrades[index],
            [field]: value
        };

        if (field === 'grade' || field === 'kkm') {
            const grade = field === 'grade' ? value : updatedGrades[index].grade;
            const kkm = field === 'kkm' ? value : updatedGrades[index].kkm;
            const difference = calculateDifference(grade, kkm);
            updatedGrades[index].difference = difference;
            if (difference !== '') {
                updatedGrades[index].reward_amount = calculateRewardAmount(grade, difference);
            }
        }

        setData('grades', updatedGrades);

        const totalReward = updatedGrades.reduce((sum, grade) =>
            sum + (grade.reward_amount || 0), 0
        );
        setData('total_reward_amount', totalReward);
    };

    const handleInputChange = (field, value) => {
        setFormInput(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const addGrade = () => {
        if (!formInput.subject_id || !formInput.type || !formInput.grade || !formInput.kkm || !formInput.date) {
            return;
        }

        const difference = calculateDifference(formInput.grade, formInput.kkm);
        const reward_amount = difference !== '' ? calculateRewardAmount(formInput.grade, difference) : '';

        const newGrade = {
            id: Date.now(),
            ...formInput,
            difference,
            reward_amount,
            created_at: new Date().toISOString()
        };

        const updatedGrades = [...data.grades, newGrade];
        setData(prevData => ({
            ...prevData,
            grades: updatedGrades,
            total_reward_amount: updatedGrades.reduce((sum, grade) => sum + (grade.reward_amount || 0), 0)
        }));

        // Reset form
        setFormInput({
            subject_id: '',
            type: '',
            grade: '',
            kkm: '',
            date: ''
        });
    };

    const removeGrade = (index) => {
        const updatedGrades = data.grades.filter((_, i) => i !== index);
        setData('grades', updatedGrades);

        const totalReward = updatedGrades.reduce((sum, grade) =>
            sum + (grade.reward_amount || 0), 0
        );
        setData('total_reward_amount', totalReward);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount || 0);
    };

    return (
        <form onSubmit={submit} className="container mx-auto">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Left Column - Grade Input Form */}
                <div className="space-y-4 lg:col-span-2">
                    <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
                        <h2 className="mb-4 text-xl font-semibold">Tambah Nilai Baru</h2>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {/* Subject */}
                            <div className="md:col-span-2">
                                <InputLabel htmlFor="subject" value="Mata Pelajaran" />
                                <SelectInput
                                    id="subject"
                                    value={formInput.subject_id}
                                    onChange={(e) => handleInputChange('subject_id', e.target.value)}
                                    className="mt-1 w-full"
                                >
                                    <option value="">Pilih Mata Pelajaran</option>
                                    {subjects.map(subject => (
                                        <option key={subject.id} value={subject.id}>
                                            {subject.name}
                                        </option>
                                    ))}
                                </SelectInput>
                                <InputError message={errors['subject_id']} className="mt-2" />
                            </div>

                            {/* Type */}
                            <div>
                                <InputLabel htmlFor="type" value="Tipe" />
                                <SelectInput
                                    id="type"
                                    value={formInput.type}
                                    onChange={(e) => handleInputChange('type', e.target.value)}
                                    className="mt-1 w-full"
                                >
                                    <option value="">Pilih Tipe</option>
                                    <option value="quiz">Kuis</option>
                                    <option value="assignment">Tugas</option>
                                    <option value="exam">Ujian</option>
                                    <option value="other">Lainnya</option>
                                </SelectInput>
                                <InputError message={errors['type']} className="mt-2" />
                            </div>

                            {/* Grade */}
                            <div>
                                <InputLabel htmlFor="grade" value="Nilai" />
                                <TextInput
                                    id="grade"
                                    type="number"
                                    value={formInput.grade}
                                    onChange={(e) => handleInputChange('grade', e.target.value)}
                                    className="mt-1 w-full"
                                />
                                <InputError message={errors['grade']} className="mt-2" />
                            </div>

                            {/* KKM */}
                            <div>
                                <InputLabel htmlFor="kkm" value="KKM" />
                                <TextInput
                                    id="kkm"
                                    type="number"
                                    value={formInput.kkm}
                                    onChange={(e) => handleInputChange('kkm', e.target.value)}
                                    className="mt-1 w-full"
                                />
                                <InputError message={errors['kkm']} className="mt-2" />
                            </div>

                            {/* Date */}
                            <div>
                                <InputLabel htmlFor="date" value="Tanggal" />
                                <TextInput
                                    id="date"
                                    type="date"
                                    value={formInput.date}
                                    onChange={(e) => handleInputChange('date', e.target.value)}
                                    className="mt-1 w-full"
                                />
                                <InputError message={errors['date']} className="mt-2" />
                            </div>

                            {/* Add Grade Button */}
                            <div className="md:col-span-2">
                                <PrimaryButton
                                    type="button"
                                    onClick={addGrade}
                                    className="w-full"
                                    disabled={!formInput.subject_id || !formInput.type || !formInput.grade || !formInput.kkm || !formInput.date}
                                >
                                    Tambah Nilai
                                </PrimaryButton>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Reward Summary */}
                <div className="lg:col-span-1">
                    <div className="sticky top-4 p-6 bg-white rounded-lg shadow dark:bg-gray-800">
                        <h2 className="mb-4 text-xl font-semibold">Ringkasan Reward</h2>
                        <div className="space-y-4">
                            {data.grades.map((grade, index) => (
                                <div key={grade.id} className="p-4 bg-gray-50 rounded-lg dark:bg-gray-700">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-grow">
                                            <div className="flex justify-between items-center">
                                                <h3 className="font-medium text-gray-900 dark:text-white">
                                                    {subjects.find(s => s.id === parseInt(grade.subject_id))?.name || 'Mata Pelajaran'}
                                                </h3>
                                                <DangerButton
                                                    type="button"
                                                    onClick={() => removeGrade(index)}
                                                    className="px-2 py-1"
                                                >
                                                    Hapus
                                                </DangerButton>
                                            </div>
                                            <div className="mt-2 space-y-1">
                                                <div className="grid grid-cols-2 gap-2 text-sm">
                                                    <div className="font-medium capitalize">{grade.type}</div>
                                                    <div className="text-right font-medium">{new Date(grade.date).toLocaleDateString()}</div>

                                                    <div className="font-medium">Nilai: {grade.grade}</div>
                                                    <div className="text-right font-medium">KKM: {grade.kkm}</div>

                                                    <div className="col-span-2 text-right font-medium text-green-600 dark:text-green-400">
                                                        +{grade.difference} poin = {formatCurrency(grade.reward_amount)}
                                                    </div>
                                                </div>
                                                <div className="pt-2 mt-2 border-t border-gray-200 dark:border-gray-600">
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600 dark:text-gray-400">Total:</span>
                                                        <span className="font-medium text-green-600 dark:text-green-400">
                                                            {formatCurrency(grade.reward_amount)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div className="pt-4 mt-4 border-t">
                                <div className="flex justify-between items-center font-semibold">
                                    <span>Total Reward:</span>
                                    <span className="text-lg text-green-600 dark:text-green-400">
                                        {formatCurrency(data.total_reward_amount)}
                                    </span>
                                </div>
                            </div>

                            <PrimaryButton
                                className="mt-4 w-full"
                                disabled={processing || data.grades.length === 0}
                            >
                                {processing ? 'Menyimpan...' : 'Simpan Reward'}
                            </PrimaryButton>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
