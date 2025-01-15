export const formatRupiah = (number) => {
    if (!number) return 'Rp 0';

    const formatted = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(number);

    return formatted;
};

export const parseRupiah = (rupiahString) => {
    if (!rupiahString) return '';
    return rupiahString.replace(/[^0-9]/g, '');
};
