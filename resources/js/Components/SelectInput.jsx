import React from 'react';

export default function SelectInput({ id, name, value, onChange, className, children }) {
    return (
        <select
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            className={`block mt-1 w-full rounded-md border-gray-300 shadow-sm dark:border-gray-600 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-900 dark:text-gray-100 ${className}`}
        >
            {children}
        </select>
    );
}
