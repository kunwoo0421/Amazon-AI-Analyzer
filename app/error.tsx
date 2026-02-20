"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex h-[50vh] w-full items-center justify-center">
            <div className="flex flex-col items-center gap-4 text-center">
                <div className="h-16 w-16 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-2">
                    <AlertCircle size={32} />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Something went wrong!</h2>
                <p className="text-slate-500 max-w-sm">We encountered an error while loading this page. Please try again.</p>
                <button
                    onClick={reset}
                    className="px-6 py-2.5 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors"
                >
                    Try again
                </button>
            </div>
        </div>
    );
}
