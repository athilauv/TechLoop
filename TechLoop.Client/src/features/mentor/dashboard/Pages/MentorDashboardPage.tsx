import { useMemo } from "react";
import {
    AlertCircle,
    ArrowRight,
    BookOpen,
    BookOpenText,
    CheckCircle2,
    ChevronRight,
    CircleHelp,
    ClipboardCheck,
    Code2,
    FileCheck2,
    LayoutDashboard,
    MessageSquareText,
    Plus,
    RefreshCw,
    Sparkles,
    Users,
} from "lucide-react";
import { Link } from "react-router-dom";

import { useCurrentUser } from "../../../../hooks/useCurrentUser.ts";
import {
    useMentorPendingQueue,
} from "../../../../hooks/useMentorPendingQueue.ts";
import { formatRelativeTime } from "../../../../utils/formatRelativeTime.ts";

function StatCard({
    title,
    value,
    subtitle,
    icon,
    href,
    urgent = false,
}: {
    title: string;
    value: number;
    subtitle: string;
    icon: React.ReactNode;
    href: string;
    urgent?: boolean;
}) {
    return (
        <Link
            to={href}
            className={[
                "group relative overflow-hidden rounded-2xl border bg-[#0F1E35] p-5 transition-all duration-300",
                "hover:-translate-y-1 hover:border-[#17D4C3]/40 hover:shadow-[0_18px_50px_rgba(0,0,0,0.22)]",
                urgent
                    ? "border-[#17D4C3]/25"
                    : "border-[#1E3254]",
            ].join(" ")}
        >
            <div
                aria-hidden
                className="pointer-events-none absolute -right-12 -top-12 h-28 w-28 rounded-full bg-[#17D4C3]/8 blur-2xl transition-transform duration-500 group-hover:scale-150"
            />

            <div className="relative flex items-start justify-between gap-4">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.7px] text-[#6F89A8]">
                        {title}
                    </p>

                    <p className="mt-2 text-3xl font-bold tracking-tight text-[#E8F0FE]">
                        {value}
                    </p>

                    <p className="mt-1 text-xs text-[#607A99]">
                        {subtitle}
                    </p>
                </div>

                <div
                    className={[
                        "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
                        urgent
                            ? "bg-[#17D4C3]/15 text-[#17D4C3]"
                            : "bg-[#172B48] text-[#8CA3BF]",
                    ].join(" ")}
                >
                    {icon}
                </div>
            </div>

            <div className="relative mt-4 flex items-center gap-1 text-xs font-semibold text-[#17D4C3] opacity-80 transition-opacity group-hover:opacity-100">
                Open
                <ArrowRight
                    size={14}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                />
            </div>
        </Link>
    );
}

function QuickAction({
    title,
    description,
    href,
    icon,
}: {
    title: string;
    description: string;
    href: string;
    icon: React.ReactNode;
}) {
    return (
        <Link
            to={href}
            className="group flex items-center gap-4 rounded-xl border border-[#1E3254] bg-[#0B192E] p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#17D4C3]/35 hover:bg-[#10233D]"
        >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#17D4C3]/10 text-[#17D4C3]">
                {icon}
            </div>

            <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-[#E8F0FE]">
                    {title}
                </p>

                <p className="mt-0.5 truncate text-xs text-[#607A99]">
                    {description}
                </p>
            </div>

            <ChevronRight
                size={17}
                className="shrink-0 text-[#526D8E] transition-transform duration-200 group-hover:translate-x-1 group-hover:text-[#17D4C3]"
            />
        </Link>
    );
}

export default function MentorDashboardPage() {
    const { username } = useCurrentUser();
    const { data, isLoading, isError, refetch, isFetching } =
        useMentorPendingQueue();

    const firstName = username?.split(/[\s._-]/)[0] || "Mentor";

    const recentContributions = useMemo(
        () =>
            [...(data?.pendingContributions ?? [])]
                .sort(
                    (a, b) =>
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime(),
                )
                .slice(0, 5),
        [data?.pendingContributions],
    );

    const totalAttentionItems =
        (data?.pendingContributions?.length ?? 0) +
        (data?.unpublishedTopics?.length ?? 0) +
        (data?.unpublishedSubTopics?.length ?? 0) +
        (data?.unpublishedQuestions?.length ?? 0);

    return (
        <div className="min-h-[calc(100vh-64px)] text-[#E8F0FE]">
            {/* Header */}
            <section className="relative overflow-hidden rounded-2xl border border-[#1E3254] bg-gradient-to-br from-[#0F1E35] via-[#0E1C32] to-[#0B2B2A] p-6 sm:p-8">
                <div
                    aria-hidden
                    className="pointer-events-none absolute -right-24 -top-32 h-72 w-72 rounded-full bg-[#17D4C3]/10 blur-3xl"
                />

                <div
                    aria-hidden
                    className="pointer-events-none absolute -bottom-24 left-1/3 h-52 w-52 rounded-full bg-cyan-400/5 blur-3xl"
                />

                <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 rounded-full border border-[#17D4C3]/20 bg-[#17D4C3]/10 px-3 py-1.5 text-xs font-semibold text-[#17D4C3]">
                            <Sparkles size={13} />
                            Mentor workspace
                        </div>

                        <h1 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
                            Welcome back, {firstName}
                        </h1>

                        <p className="mt-2 text-sm leading-6 text-[#8CA3BF]">
                            Review learner contributions, manage learning
                            content, and keep your TechLoop workspace moving.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <Link
                            to="/mentor/contributions"
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#17D4C3] px-4 py-2.5 text-sm font-semibold text-[#081423] transition hover:brightness-105"
                        >
                            <ClipboardCheck size={16} />
                            Review contributions
                        </Link>

                        <Link
                            to="/mentor/content"
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#17D4C3]/25 bg-[#0B192E]/70 px-4 py-2.5 text-sm font-semibold text-[#17D4C3] transition hover:bg-[#17D4C3]/10"
                        >
                            Manage content
                            <ArrowRight size={15} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Error state */}
            {isError && (
                <section className="mt-5 flex items-center justify-between gap-4 rounded-xl border border-red-400/20 bg-red-400/5 p-4">
                    <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-400/10 text-red-300">
                            <AlertCircle size={18} />
                        </div>

                        <div>
                            <p className="text-sm font-semibold text-red-200">
                                Dashboard data could not be loaded.
                            </p>
                            <p className="mt-0.5 text-xs text-red-200/60">
                                Check the API and try again.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => void refetch()}
                        disabled={isFetching}
                        className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-red-300/20 px-3 py-2 text-xs font-semibold text-red-100 transition hover:bg-red-300/10 disabled:opacity-50"
                    >
                        <RefreshCw
                            size={14}
                            className={isFetching ? "animate-spin" : ""}
                        />
                        Retry
                    </button>
                </section>
            )}

            {/* Stats */}
            <section className="mt-6">
                <div className="mb-3 flex items-end justify-between gap-4">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.8px] text-[#526D8E]">
                            Overview
                        </p>
                        <h2 className="mt-1 text-lg font-semibold">
                            Your work queue
                        </h2>
                    </div>

                    {!isLoading && (
                        <span className="text-xs text-[#607A99]">
                            {totalAttentionItems} item
                            {totalAttentionItems === 1 ? "" : "s"} needing attention
                        </span>
                    )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard
                        title="Pending Reviews"
                        value={data?.pendingContributions.length ?? 0}
                        subtitle="Learner contributions"
                        icon={<FileCheck2 size={20} />}
                        href="/mentor/contributions"
                        urgent
                    />

                    <StatCard
                        title="Draft Topics"
                        value={data?.unpublishedTopics.length ?? 0}
                        subtitle="Topics to publish"
                        icon={<BookOpenText size={20} />}
                        href="/mentor/content"
                    />

                    <StatCard
                        title="Draft SubTopics"
                        value={data?.unpublishedSubTopics.length ?? 0}
                        subtitle="SubTopics to publish"
                        icon={<BookOpen size={20} />}
                        href="/mentor/content"
                    />

                    <StatCard
                        title="Draft Questions"
                        value={data?.unpublishedQuestions.length ?? 0}
                        subtitle="Questions to publish"
                        icon={<CircleHelp size={20} />}
                        href="/mentor/questions"
                    />
                </div>
            </section>

            {/* Loading skeleton */}
            {isLoading && (
                <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {[1, 2, 3, 4].map((item) => (
                        <div
                            key={item}
                            className="h-36 animate-pulse rounded-2xl border border-[#1E3254] bg-[#0F1E35]"
                        />
                    ))}
                </section>
            )}

            {/* Main content */}
            <section className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_1fr]">
                {/* Review queue */}
                <div className="rounded-2xl border border-[#1E3254] bg-[#0F1E35]">
                    <div className="flex items-center justify-between border-b border-[#1E3254] px-5 py-4">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.7px] text-[#526D8E]">
                                Review queue
                            </p>
                            <h2 className="mt-1 text-base font-semibold">
                                Contributions waiting for you
                            </h2>
                        </div>

                        <Link
                            to="/mentor/contributions"
                            className="text-xs font-semibold text-[#17D4C3] hover:underline"
                        >
                            View all
                        </Link>
                    </div>

                    <div className="divide-y divide-[#1E3254]">
                        {!isLoading && recentContributions.length === 0 ? (
                            <div className="px-5 py-12 text-center">
                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#17D4C3]/10 text-[#17D4C3]">
                                    <CheckCircle2 size={22} />
                                </div>

                                <h3 className="mt-4 text-sm font-semibold text-[#E8F0FE]">
                                    Nothing waiting for review
                                </h3>

                                <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-[#607A99]">
                                    You are all caught up. New learner
                                    contributions will appear here.
                                </p>
                            </div>
                        ) : (
                            recentContributions.map((contribution) => (
                                <Link
                                    key={contribution.id}
                                    to={`/mentor/contributions/${contribution.id}`}
                                    className="group flex items-center gap-4 px-5 py-4 transition hover:bg-[#10233D]"
                                >
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#172B48] text-[#17D4C3]">
                                        <FileCheck2 size={18} />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="rounded-md border border-[#17D4C3]/15 bg-[#17D4C3]/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#17D4C3]">
                                                {contribution.contributionType}
                                            </span>

                                            <span className="text-[11px] text-[#526D8E]">
                                                #{contribution.id}
                                            </span>
                                        </div>

                                        <p className="mt-1 truncate text-sm font-semibold text-[#DCE7F7]">
                                            {contribution.title}
                                        </p>

                                        <div className="mt-1 flex items-center gap-2 text-[11px] text-[#607A99]">
                                            <Users size={12} />
                                            <span>
                                                Learner contribution
                                            </span>
                                            <span>•</span>
                                            <span>
                                                {formatRelativeTime(
                                                    contribution.createdAt,
                                                )}
                                            </span>
                                        </div>
                                    </div>

                                    <ChevronRight
                                        size={18}
                                        className="shrink-0 text-[#526D8E] transition-transform group-hover:translate-x-1 group-hover:text-[#17D4C3]"
                                    />
                                </Link>
                            ))
                        )}
                    </div>
                </div>

                {/* Quick actions */}
                <div className="rounded-2xl border border-[#1E3254] bg-[#0F1E35]">
                    <div className="border-b border-[#1E3254] px-5 py-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.7px] text-[#526D8E]">
                            Workspace
                        </p>
                        <h2 className="mt-1 text-base font-semibold">
                            Quick actions
                        </h2>
                    </div>

                    <div className="space-y-3 p-4">
                        <QuickAction
                            title="Review contributions"
                            description="Approve or reject learner submissions"
                            href="/mentor/contributions"
                            icon={<ClipboardCheck size={19} />}
                        />

                        <QuickAction
                            title="Manage content"
                            description="Create, edit, and publish topics"
                            href="/mentor/content"
                            icon={<BookOpenText size={19} />}
                        />

                        <QuickAction
                            title="Manage questions"
                            description="Create and publish MCQ or coding questions"
                            href="/mentor/questions"
                            icon={<Code2 size={19} />}
                        />

                        <QuickAction
                            title="Open community"
                            description="View posts and mentor discussions"
                            href="/mentor/community"
                            icon={<MessageSquareText size={19} />}
                        />
                    </div>
                </div>
            </section>

            {/* Content status + actions */}
            <section className="mt-6 grid gap-6 lg:grid-cols-3">
                <div className="rounded-2xl border border-[#1E3254] bg-[#0F1E35] p-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#17D4C3]/10 text-[#17D4C3]">
                            <LayoutDashboard size={19} />
                        </div>

                        <div>
                            <p className="text-xs uppercase tracking-[0.7px] text-[#526D8E]">
                                Content
                            </p>
                            <h3 className="mt-1 text-sm font-semibold">
                                Publishing status
                            </h3>
                        </div>
                    </div>

                    <div className="mt-5 space-y-3">
                        <StatusRow
                            label="Topics"
                            value={data?.allTopics.length ?? 0}
                            draftCount={data?.unpublishedTopics.length ?? 0}
                        />
                        <StatusRow
                            label="SubTopics"
                            value={data?.allSubTopics.length ?? 0}
                            draftCount={data?.unpublishedSubTopics.length ?? 0}
                        />
                        <StatusRow
                            label="Questions"
                            value={data?.allQuestions.length ?? 0}
                            draftCount={data?.unpublishedQuestions.length ?? 0}
                        />
                    </div>
                </div>

                <div className="rounded-2xl border border-[#1E3254] bg-[#0F1E35] p-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#17D4C3]/10 text-[#17D4C3]">
                            <Plus size={19} />
                        </div>

                        <div>
                            <p className="text-xs uppercase tracking-[0.7px] text-[#526D8E]">
                                Create
                            </p>
                            <h3 className="mt-1 text-sm font-semibold">
                                Add learning content
                            </h3>
                        </div>
                    </div>

                    <div className="mt-5 grid gap-2">
                        <Link
                            to="/mentor/content"
                            className="flex items-center justify-between rounded-lg border border-[#1E3254] px-3 py-2.5 text-xs font-semibold text-[#C7D5E8] transition hover:border-[#17D4C3]/30 hover:text-[#17D4C3]"
                        >
                            Create topic
                            <ArrowRight size={14} />
                        </Link>

                        <Link
                            to="/mentor/questions"
                            className="flex items-center justify-between rounded-lg border border-[#1E3254] px-3 py-2.5 text-xs font-semibold text-[#C7D5E8] transition hover:border-[#17D4C3]/30 hover:text-[#17D4C3]"
                        >
                            Create question
                            <ArrowRight size={14} />
                        </Link>
                    </div>
                </div>

                <div className="rounded-2xl border border-[#1E3254] bg-gradient-to-br from-[#0F1E35] to-[#0B2530] p-5">
                    <div className="flex h-full flex-col">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#17D4C3]/10 text-[#17D4C3]">
                                <MessageSquareText size={19} />
                            </div>

                            <div>
                                <p className="text-xs uppercase tracking-[0.7px] text-[#526D8E]">
                                    Community
                                </p>
                                <h3 className="mt-1 text-sm font-semibold">
                                    Stay connected
                                </h3>
                            </div>
                        </div>

                        <p className="mt-4 text-xs leading-5 text-[#7088A6]">
                            Answer learner discussions, review community posts,
                            and keep the learning space active.
                        </p>

                        <Link
                            to="/mentor/community"
                            className="mt-auto inline-flex items-center gap-2 pt-5 text-xs font-semibold text-[#17D4C3] hover:underline"
                        >
                            Go to community
                            <ArrowRight size={14} />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

function StatusRow({
    label,
    value,
    draftCount,
}: {
    label: string;
    value: number;
    draftCount: number;
}) {
    const publishedCount = Math.max(value - draftCount, 0);

    return (
        <div className="flex items-center justify-between rounded-lg bg-[#0B192E] px-3 py-2.5">
            <div>
                <p className="text-xs font-medium text-[#C7D5E8]">
                    {label}
                </p>
                <p className="mt-0.5 text-[11px] text-[#526D8E]">
                    {publishedCount} published
                </p>
            </div>

            <div className="text-right">
                <p className="text-sm font-bold text-[#E8F0FE]">
                    {value}
                </p>
                <p className="text-[10px] text-amber-300/80">
                    {draftCount} draft
                </p>
            </div>
        </div>
    );
}
