import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface AdminBackLinkProps {
    to: string;
    label: string;
}

/**
 * Small "back to list" affordance used at the top of form and detail pages
 * so admins always have an obvious way back without relying on the browser
 * back button.
 */
export default function AdminBackLink({ to, label }: AdminBackLinkProps) {
    return (
        <Link
            to={to}
            className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-[#8CA3BF] transition-colors hover:text-white"
        >
            <ArrowLeft size={15} />
            {label}
        </Link>
    );
}
