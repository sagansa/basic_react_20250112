import { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Dialog } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import PrimaryButton from '@/Components/PrimaryButton';

const navigation = [
    { name: 'Golds', href: route('golds.index') },
    { name: 'Rewards', href: route('rewards.index') },
];

export default function Welcome({ auth }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }, []);

    return (
        <>
            <Head title="Selamat Datang" />
            <div className="bg-gradient-custom">
                <header className="absolute inset-x-0 top-0 z-50">
                    <nav className="flex justify-between items-center p-6 mx-auto max-w-7xl lg:px-8" aria-label="Global">
                        <div className="flex lg:flex-1">
                            <Link href="/" className="-m-1.5 p-1.5">
                                <span className="text-2xl font-bold text-gray-900 dark:text-white">Keluarga Gargar</span>
                            </Link>
                        </div>
                        <div className="flex lg:hidden">
                            <button
                                type="button"
                                className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 dark:text-gray-200"
                                onClick={() => setMobileMenuOpen(true)}
                            >
                                <span className="sr-only">Buka menu utama</span>
                                <Bars3Icon className="w-6 h-6" aria-hidden="true" />
                            </button>
                        </div>
                        {auth.user && (
                            <div className="hidden lg:flex lg:gap-x-12">
                                {navigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className="text-sm font-semibold leading-6 text-gray-900 hover:text-gray-600 dark:text-gray-200 dark:hover:text-gray-400"
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </nav>
                    <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
                        <div className="fixed inset-0 z-50" />
                        <Dialog.Panel className="overflow-y-auto fixed inset-y-0 right-0 z-50 px-6 py-6 w-full bg-white dark:bg-gray-800 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                            <div className="flex justify-between items-center">
                                <Link href="/" className="-m-1.5 p-1.5">
                                    <span className="text-xl font-bold text-gray-900 dark:text-white">Keluarga Kami</span>
                                </Link>
                                <button
                                    type="button"
                                    className="-m-2.5 rounded-md p-2.5 text-gray-700 dark:text-gray-200"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <span className="sr-only">Tutup menu</span>
                                    <XMarkIcon className="w-6 h-6" aria-hidden="true" />
                                </button>
                            </div>
                            <div className="flow-root mt-6">
                                <div className="-my-6 divide-y divide-gray-500/10">
                                    <div className="py-6 space-y-2">
                                        {navigation.map((item) => (
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                className="block px-3 py-2 -mx-3 text-base font-semibold leading-7 text-gray-900 rounded-lg hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700"
                                            >
                                                {item.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Dialog.Panel>
                    </Dialog>
                </header>

                <div className="isolate relative pt-14">
                    <div className="px-6 py-32 mx-auto max-w-7xl sm:py-40 lg:px-8">
                        <div className="mx-auto max-w-2xl lg:mx-0 lg:grid lg:max-w-none lg:grid-cols-2 lg:gap-x-16 lg:gap-y-8">
                            <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:col-span-2 dark:text-white">
                                Selamat Datang di Keluarga Gargar
                            </h1>
                            <div className="mt-6 max-w-xl lg:mt-0">
                                <p className="text-lg text-gray-600 dark:text-gray-300">
                                    Kami dengan bangga mempersembahkan aplikasi pencatatan kebutuhan keluarga.
                                    Salah satunya, kami mengelola dan mencatat setiap momen dalam perjalanan investasi emas kami serta hal-hal lainnya terkait kebutuhan keluarga.
                                </p>
                                <div className="flex gap-x-2 items-center mt-10">
                                    {!auth.user && (
                                        <Link
                                            href={route('register')}
                                            className="inline-flex items-center"
                                        >
                                            <PrimaryButton>
                                               Register
                                            </PrimaryButton>
                                        </Link>
                                    )}
                                    {!auth.user && (
                                        <Link
                                            href={route('login')}
                                            className="inline-flex items-center"
                                        >
                                            <PrimaryButton>
                                               Login
                                            </PrimaryButton>
                                        </Link>
                                    )}
                                    {auth.user && (
                                        <Link
                                            href={route('dashboard')}
                                            className="inline-flex items-center"
                                        >
                                            <PrimaryButton>
                                               Dashboard
                                            </PrimaryButton>
                                        </Link>
                                    )}
                                </div>
                            </div>
                            <img
                                src="/images/family.jpg"
                                alt="Foto Keluarga"
                                className="mt-10 aspect-[6/5] w-full max-w-lg rounded-2xl object-cover sm:mt-16 lg:mt-0 lg:max-w-none"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
