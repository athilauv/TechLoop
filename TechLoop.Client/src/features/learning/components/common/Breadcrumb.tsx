import { Fragment } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
    showHome?: boolean;
}

export default function Breadcrumb({ items, showHome = true }: BreadcrumbProps) {
    return (
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm">
            {showHome && (
                <>
                    <Link
                        to="/"
                        className="flex items-center gap-1 text-[#8CA3BF] transition-colors duration-150 hover:text-[#00E8C2]"
                    >
                        <Home className="h-3.5 w-3.5" />
                    </Link>
                    {items.length > 0 && (
                        <ChevronRight className="h-3.5 w-3.5 text-[#5C7394]" />
                    )}
                </>
            )}

            {items.map((item, index) => {
                const isLast = index === items.length - 1;

                return (
                    <Fragment key={`${item.label}-${index}`}>
                        {item.href && !isLast ? (
                            <Link
                                to={item.href}
                                className="text-[#8CA3BF] transition-colors duration-150 hover:text-[#00E8C2]"
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <span
                                className={isLast ? "font-medium text-white" : "text-[#8CA3BF]"}
                                aria-current={isLast ? "page" : undefined}
                            >
                                {item.label}
                            </span>
                        )}

                        {!isLast && <ChevronRight className="h-3.5 w-3.5 text-[#5C7394]" />}
                    </Fragment>
                );
            })}
        </nav>
    );
}