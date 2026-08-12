import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CommunityHeaderProps {
    showCreateButton?: boolean;
}

export default function CommunityHeader({
                                            showCreateButton = true,
                                        }: CommunityHeaderProps) {
    const navigate = useNavigate();

    return (
        <div className="flex items-end justify-between gap-4">
            <div>
                <p className="text-xs font-semibold uppercase tracking-[1px] text-[#17D4C3]">
                    Community
                </p>

                <h1 className="mt-2 text-2xl font-semibold text-white">
                    Learn together
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#7189a8]">
                    Share knowledge, ask questions, and learn from other developers.
                </p>
            </div>

            {showCreateButton && (
                <button
                    type="button"
                    onClick={() =>
                        navigate("/community/create-post")
                    }
                    className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#17D4C3] px-4 py-2.5 text-sm font-semibold text-[#06141f] transition hover:bg-[#35e2d3]"
                >
                    <Plus size={16} />
                    Create post
                </button>
            )}
        </div>
    );
}