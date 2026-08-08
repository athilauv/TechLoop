export default function TechCardSkeleton() {
    return (
        <div className="flex animate-pulse flex-col rounded-2xl border border-slate-700 bg-slate-900 p-6">
            <div className="flex items-start justify-between">
                <div className="h-14 w-14 rounded-xl bg-slate-800" />
                <div className="h-6 w-20 rounded-full bg-slate-800" />
            </div>

            <div className="mt-6 flex-1 space-y-3">
                <div className="h-5 w-2/3 rounded bg-slate-800" />
                <div className="h-3 w-1/3 rounded bg-slate-800" />
                <div className="space-y-2 pt-1">
                    <div className="h-3 w-full rounded bg-slate-800" />
                    <div className="h-3 w-5/6 rounded bg-slate-800" />
                    <div className="h-3 w-2/3 rounded bg-slate-800" />
                </div>
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-slate-800 pt-5">
                <div className="h-4 w-24 rounded bg-slate-800" />
                <div className="h-5 w-5 rounded bg-slate-800" />
            </div>
        </div>
    );
}