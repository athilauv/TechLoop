import type { ReactNode } from "react";
import { Inbox } from "lucide-react";

interface AdminTableProps {
    headers: string[];
    children: ReactNode;
    empty?: string;
    /** When true, renders a single loading row spanning all columns instead of `children`. */
    isLoading?: boolean;
    /** Optional label shown while `isLoading` is true. */
    loadingLabel?: string;
}

export default function AdminTable({ headers, children, empty, isLoading, loadingLabel = "Loading…" }: AdminTableProps) {
    const columnCount = headers.length;

    return (
        <div className="overflow-hidden rounded-2xl border border-[#223A59] bg-[#12233B]">
            <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                    <thead className="border-b border-[#223A59] bg-[#101C30]">
                        <tr>
                            {headers.map((header) => (
                                <th
                                    key={header}
                                    className="whitespace-nowrap px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#5C7394]"
                                >
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#223A59]/70">
                        {isLoading ? (
                            <tr>
                                <td colSpan={columnCount} className="px-5 py-14 text-center text-sm text-[#8CA3BF]">
                                    {loadingLabel}
                                </td>
                            </tr>
                        ) : (
                            children
                        )}
                    </tbody>
                </table>
            </div>
            {!isLoading && empty && (
                <div className="flex flex-col items-center gap-2.5 px-5 py-14 text-center">
                    <Inbox size={22} className="text-[#5C7394]" />
                    <p className="text-sm text-[#8CA3BF]">{empty}</p>
                </div>
            )}
        </div>
    );
}
