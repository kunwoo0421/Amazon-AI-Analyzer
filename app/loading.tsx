export default function Loading() {
    return (
        <div className="flex h-[50vh] w-full items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
                <p className="text-slate-500 font-medium animate-pulse">Loading Seller Master...</p>
            </div>
        </div>
    );
}
