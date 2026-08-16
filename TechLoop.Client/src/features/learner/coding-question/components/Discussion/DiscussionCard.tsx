import { useState } from "react";
import { MoreVertical, Pencil, Trash2, X, Check } from "lucide-react";
import { toast } from "react-toastify";
import type { Discussion } from "../../../../../types/discussion.types.ts";
import {updateDiscussion} from "../../../../../api/discussion.api.ts";
import {formatRelativeTime,} from "../../../../../utils/formatRelativeTime.ts";
import DiscussionCommentsSection from "./DiscussionCommentsSection";

interface DiscussionCardProps {
    discussion: Discussion;
    currentUserId?: string | null;
    menuOpen: boolean;
    deleting: boolean;
    onMenu: () => void;
    onDelete: () => void;
    onRefresh: () => Promise<unknown>;
}

function getTokenUserId(): string | null {
    try {
        const token =
            localStorage.getItem("accessToken");

        if (!token) return null;

        const payload =
            token.split(".")[1];

        if (!payload) return null;

        const decoded = JSON.parse(
            atob(
                payload
                    .replace(/-/g, "+")
                    .replace(/_/g, "/")
            )
        );

        return (
            decoded.sub ??
            decoded.userId ??
            decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] ??
            decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/nameidentifier"] ??
            null
        );
    } catch {
        return null;
    }
}

export default function DiscussionCard({
                                           discussion,
                                           currentUserId,
                                           menuOpen,
                                           deleting,
                                           onMenu,
                                           onDelete,
                                           onRefresh,
                                       }: DiscussionCardProps) {
    const tokenUserId = getTokenUserId();
    const loggedInUserId = currentUserId || tokenUserId;

    const isOwner = Boolean(loggedInUserId && discussion.userId && loggedInUserId
                .toString()
                .trim()
                .toLowerCase() === discussion.userId
                .toString()
                .trim()
                .toLowerCase()
        );

    const [editing, setEditing] = useState(false);
    const [title, setTitle] = useState(discussion.title);
    const [content, setContent] = useState(discussion.content);
    const [saving, setSaving] = useState(false);
    const handleEdit = async () => {
        const trimmedTitle = title.trim();
        const trimmedContent = content.trim();

        if (!trimmedTitle || !trimmedContent || saving) {
            return;
        }

        try {
            setSaving(true);
            await updateDiscussion({
                id: discussion.id,
                title: trimmedTitle,
                content: trimmedContent,
            });

            setEditing(false);
            await onRefresh();
            toast.success("Discussion updated successfully.");
        } catch (error: unknown) {
            console.error("Failed to update discussion:", error);
            toast.error(error instanceof Error ? error.message : "Failed to update discussion."
            );
        } finally {
            setSaving(false);
        }
    };

    const cancelEdit = () => {
        setTitle(discussion.title);
        setContent(discussion.content);
        setEditing(false);
    };

    return (
        <article className="relative rounded-xl border border-[#1e3254] bg-[#0E1B2E] p-5 transition hover:border-[#29476d]">
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">

                    {/* User */}
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#17D4C3]/20 font-semibold text-[#17D4C3]">
                            {discussion.userName?.charAt(0).toUpperCase() || "U"}
                        </div>

                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-white">
                                {discussion.userName}
                            </p>

                            <p className="text-xs text-slate-500">
                                {formatRelativeTime(discussion.createdAt)}
                            </p>

                        </div>
                    </div>

                    {/* Edit */}
                    {editing ? (
                        <div className="mt-4 space-y-3">
                            <input value={title}
                                onChange={(event) => setTitle(event.target.value)}
                                maxLength={200}
                                className="w-full rounded-lg border border-[#1e3254] bg-[#06111f] px-3 py-2.5 text-sm font-semibold text-white outline-none focus:border-[#17D4C3]"
                            />

                            <textarea
                                value={content}
                                onChange={(event) => setContent(event.target.value)}
                                rows={5} maxLength={5000}
                                className="w-full resize-none rounded-lg border border-[#1e3254] bg-[#06111f] px-3 py-2.5 text-sm leading-6 text-white outline-none focus:border-[#17D4C3]"
                            />

                            <div className="flex justify-end gap-2">

                                <button
                                    type="button"
                                    onClick={cancelEdit}
                                    disabled={saving}
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#1e3254] px-3 py-2 text-xs text-slate-400 transition hover:text-white disabled:opacity-50">
                                    <X size={13} />
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    onClick={() => void handleEdit()}
                                    disabled={saving || !title.trim() || !content.trim()}
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#17D4C3] px-3 py-2 text-xs font-semibold text-[#06131f] transition hover:bg-[#20e5d3] disabled:cursor-not-allowed disabled:opacity-50">
                                    <Check size={13} />

                                    {saving ? "Saving..." : "Save"}
                                </button>

                            </div>
                        </div>
                    ) : (
                        <>
                            <h2 className="mt-4 text-base font-semibold text-white">
                                {discussion.title}
                            </h2>

                            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-400">
                                {discussion.content}
                            </p>
                        </>
                    )}

                </div>

                {/* THREE DOTS */}
                {isOwner && !editing && (
                    <div className="relative shrink-0">

                        <button
                            type="button"
                            onClick={(event) => {
                                event.stopPropagation();
                                onMenu();
                            }}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-[#10283e] hover:text-white"
                            aria-label="Discussion options"
                            aria-expanded={menuOpen}>
                            <MoreVertical size={18}/>
                        </button>

                        {menuOpen && (
                            <div className="absolute right-0 top-9 z-50 w-32 overflow-hidden rounded-lg border border-[#1e3254] bg-[#081423] shadow-2xl">

                                {/* EDIT */}
                                <button
                                    type="button"
                                    onClick={() => {
                                        onMenu();
                                        setEditing(true);
                                    }}
                                    className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-xs text-slate-300 transition hover:bg-[#10283e] hover:text-white"
                                >
                                    <Pencil size={13}/>
                                    Edit
                                </button>

                                {/* DELETE */}
                                <button type="button" disabled={deleting} onClick={onDelete}
                                    className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-xs text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50">
                                    <Trash2 size={13}/>

                                    {deleting ? "Deleting..." : "Delete"}
                                </button>

                            </div>
                        )}

                    </div>
                )}

            </div>

            {/* COMMENTS */}
            <DiscussionCommentsSection discussionId={discussion.id}
                currentUserId={loggedInUserId ?? undefined}/>

        </article>
    );
}