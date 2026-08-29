import type { ReactNode } from "react";

interface AdminTableProps {
    headers: string[];
    children: ReactNode;
    empty?: string;
}

export default function AdminTable({ headers, children, empty }: AdminTableProps) {
    return (
        <div className="overflow-hidden rounded-2xl border border-[#223A59] bg-[#12233B]">
            <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                    <thead className="border-b border-[#223A59] bg-[#101C30]">
                        <tr>
                            {headers.map((header) => (
                                <th key={header} className="whitespace-nowrap px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#5C7394]">{header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#223A59]/70">
                        {children}
                    </tbody>
                </table>
            </div>
            {empty && <div className="px-5 py-10 text-center text-sm text-[#8CA3BF]">{empty}</div>}
        </div>
    );
}
