import { ListTodo } from "lucide-react";

export default function LearningRightSidebar() {
    return (
        <div className="p-6">
            <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#223A59] bg-[#12233B]">
                    <ListTodo className="h-4 w-4 text-[#00E8C2]" />
                </span>
                <h2 className="text-base font-semibold text-white">Lesson Progress</h2>
            </div>

            <div className="mt-5 rounded-2xl border border-dashed border-[#223A59] bg-[#101C30] px-4 py-8 text-center">
                <p className="text-sm leading-6 text-[#5C7394]">
                    Progress, bookmarks and notes will appear here.
                </p>
            </div>
        </div>
    );
}