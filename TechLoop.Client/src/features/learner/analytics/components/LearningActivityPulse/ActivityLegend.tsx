export default function ActivityLegend() {
    return (
        <div className="flex flex-wrap items-center gap-4 text-[11px] text-[#7189a8]">
            <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full border border-[#29466d] bg-[#0b182b]" />
                <span>None</span>
            </div>

            <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#17454b]" />
                <span>Low</span>
            </div>

            <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#178f8a]" />
                <span>Medium</span>
            </div>

            <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#17D4C3]" />
                <span>High</span>
            </div>
        </div>
    );
}