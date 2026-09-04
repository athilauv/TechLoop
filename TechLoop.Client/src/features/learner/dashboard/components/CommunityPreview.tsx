import { useQuery } from "@tanstack/react-query";
import { ArrowRight, MessagesSquare, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { getCommunityFeed } from "../../../../api/mentorCommunity.api.ts";
import { communityQueryKeys } from "../../../../hooks/queryKeys.tsx";
import { formatRelativeTime } from "../../../../utils/formatRelativeTime.ts";

const PREVIEW_COUNT = 3;

export default function CommunityPreview() {
    const { data, isLoading } = useQuery({
        queryKey: communityQueryKeys.feed("learner"),
        queryFn: () => getCommunityFeed("learner"),
    });

    const posts = (data?.items ?? []).slice(0, PREVIEW_COUNT);

    return (
        <section className="rounded-2xl border border-[#1e3254] bg-[#0f1e35] p-5 sm:p-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <MessagesSquare size={18} className="text-[#17D4C3]" />

                    <div>
                        <h2 className="text-sm font-semibold text-[#e8f0fe]">
                            From the Community
                        </h2>

                        <p className="mt-1 text-xs text-[#5f7898]">
                            What other developers are discussing
                        </p>
                    </div>
                </div>

                <Link
                    to="/learner/community"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#17D4C3] hover:underline"
                >
                    View all
                    <ArrowRight size={13} />
                </Link>
            </div>

            {isLoading ? (
                <div className="mt-5 space-y-2">
                    {[1, 2, 3].map((item) => (
                        <div
                            key={item}
                            className="h-16 animate-pulse rounded-xl border border-[#1e3254] bg-[#0c1a2e]"
                        />
                    ))}
                </div>
            ) : posts.length === 0 ? (
                <div className="mt-5 rounded-xl border border-[#1e3254] bg-[#0c1a2e] px-5 py-8 text-center">
                    <p className="text-sm text-[#7a99bb]">
                        No community activity yet.
                    </p>

                    <Link
                        to="/learner/community"
                        className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#17D4C3] hover:underline"
                    >
                        Start a discussion
                        <ArrowRight size={13} />
                    </Link>
                </div>
            ) : (
                <div className="mt-4 space-y-2">
                    {posts.map((post) => (
                        <Link
                            key={post.id}
                            to={`/learner/community/posts/${post.id}`}
                            className="block rounded-xl border border-[#1e3254] px-4 py-3 no-underline transition-colors hover:border-[#29466d] hover:bg-[#12243b]"
                        >
                            <p className="truncate text-sm font-medium text-[#dce8f8]">
                                {post.title}
                            </p>

                            <div className="mt-1.5 flex items-center gap-3 text-xs text-[#5f7898]">
                                <span>{post.userName}</span>
                                <span>•</span>
                                <span>
                                    {formatRelativeTime(post.createdAt)}
                                </span>
                                <span className="ml-auto flex items-center gap-1">
                                    <Heart size={12} />
                                    {post.likeCount}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </section>
    );
}
