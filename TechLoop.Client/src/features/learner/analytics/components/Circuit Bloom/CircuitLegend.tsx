export default function CircuitLegend() {
    return (
        <div className="flex flex-wrap items-center gap-5 text-[11px] text-[#7189a8]">
            <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#17D4C3]" />
                <span>Successful</span>
            </div>

            <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#e05c5c]" />
                <span>Failed</span>
            </div>

            <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full border border-[#29466d] bg-[#0d2931]" />
                <span>Technology</span>
            </div>
        </div>
    );
}