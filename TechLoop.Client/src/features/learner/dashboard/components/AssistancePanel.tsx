import { Bot, MessagesSquare, UserRound, Clock } from "lucide-react";
import { Link } from "react-router-dom";

export default function AssistancePanel() {
    return (
        <section className="rounded-2xl border border-[#1e3254] bg-[#0f1e35] p-5 sm:p-6">
            <h2 className="text-sm font-semibold text-[#e8f0fe]">
                Need Help?
            </h2>

            <p className="mt-1 text-xs text-[#5f7898]">
                Ask the community now, or wait for AI and mentor support
            </p>

            <div className="mt-4 space-y-2">
                <Link
                    to="/learner/community"
                    className="group flex items-center gap-3 rounded-xl border border-[#1e3254] px-4 py-3 no-underline transition-colors hover:border-[#29466d] hover:bg-[#12243b]"
                >
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[#17D4C3]/15">
                        <MessagesSquare size={16} className="text-[#17D4C3]" />
                    </div>

                    <div className="min-w-0">
                        <p className="text-sm font-medium text-[#dce8f8]">
                            Ask the Community
                        </p>
                        <p className="text-xs text-[#5f7898]">
                            Post a question, get help from other learners
                        </p>
                    </div>
                </Link>

                <div className="flex items-center gap-3 rounded-xl border border-[#1e3254]/60 px-4 py-3 opacity-60">
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-white/5">
                        <Bot size={16} className="text-[#7a99bb]" />
                    </div>

                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-[#dce8f8]">
                            Ask AI
                        </p>
                        <p className="text-xs text-[#5f7898]">
                            AI doubt-solving is on the way
                        </p>
                    </div>

                    <Clock size={13} className="flex-shrink-0 text-[#5f7898]" />
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-[#1e3254]/60 px-4 py-3 opacity-60">
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-white/5">
                        <UserRound size={16} className="text-[#7a99bb]" />
                    </div>

                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-[#dce8f8]">
                            Find a Mentor
                        </p>
                        <p className="text-xs text-[#5f7898]">
                            Direct mentor matching is on the way
                        </p>
                    </div>

                    <Clock size={13} className="flex-shrink-0 text-[#5f7898]" />
                </div>
            </div>
        </section>
    );
}
