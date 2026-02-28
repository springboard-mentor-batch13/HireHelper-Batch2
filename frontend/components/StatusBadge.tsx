import React from 'react';

type Status = 'pending' | 'accepted' | 'rejected' | string;

export default function StatusBadge({ status }: { status: Status }) {
    const normalized = status.toLowerCase();

    if (normalized === 'pending') {
        return (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 border border-yellow-200 inline-flex items-center">
                Pending
            </span>
        );
    }
    if (normalized === 'accepted') {
        return (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200 inline-flex items-center">
                Accepted
            </span>
        );
    }
    if (normalized === 'rejected') {
        return (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-200 inline-flex items-center">
                Rejected
            </span>
        );
    }

    return (
        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800 border border-gray-200 inline-flex items-center capitalize">
            {status}
        </span>
    );
}
