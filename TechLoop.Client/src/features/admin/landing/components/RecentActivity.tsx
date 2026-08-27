import { Boxes, FileText, ListChecks, MessagesSquare, Clock, type LucideIcon } from "lucide-react";
import { useScrollReveal } from "../../../../hooks/useScrollReveal.ts";
import type { RecentActivityItem } from "../../../../types/admin-landing.types.ts";

interface RecentActivityProps {
    items: RecentActivityItem[] | null;
    isLoading: boolean;
}

const iconByType: Record<RecentActivityItem["type"], LucideIcon> = {
    technology: Boxes,
    content: FileText,
    question: ListChecks,
    discussion: MessagesSquare,
};

const RecentActivity = ({ items, isLoading }: RecentActivityProps) => {
    const { ref, inView } = useScrollReveal<HTMLDivElement>();

    if (!isLoading && (!items || items.length === 0)) {
        return null;
    }

    return (
        <section className="px-6 py-16 lg:px-10">
            <div ref={ref} className="mx-auto max-w-4xl">
                <div
                    className={`mb-8 transition-all duration-700 ease-out ${
                        inView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                    }`}
                >
                    <span className="text-xs font-semibold uppercase tracking-widest text-[#00E8C2]">
                        Recent Activity
                    </span>
                    <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
                        What's happening on the platform
                    </h2>
                </div>

                <div className="overflow-hidden rounded-2xl border border-[#223A59] bg-[#12233B]">
                    {isLoading || !items
                        ? Array.from({ length: 3 }).map((_, index) => (
                              <div
                                  key={index}
                                  className="flex items-center gap-3 border-b border-[#223A59]/60 p-4 last:border-b-0"
                              >
                                  <div className="h-9 w-9 shrink-0 animate-pulse rounded-lg bg-[#101C30]" />
                                  <div className="flex-1 space-y-2">
                                      <div className="h-3 w-2/3 animate-pulse rounded bg-[#101C30]" />
                                      <div className="h-2.5 w-1/3 animate-pulse rounded bg-[#101C30]" />
                                  </div>
                              </div>
                          ))
                        : items.map((item, index) => {
                              const Icon = iconByType[item.type];
                              return (
                                  <div
                                      key={item.id}
                                      style={{ transitionDelay: inView ? `${index * 70}ms` : "0ms" }}
                                      className={`flex items-center gap-3 border-b border-[#223A59]/60 p-4 transition-all duration-700 ease-out last:border-b-0 hover:bg-[#101C30]/60 ${
                                          inView ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                                      }`}
                                  >
                                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#223A59] bg-[#101C30] text-[#00E8C2]">
                                          <Icon size={15} />
                                      </div>
                                      <div className="min-w-0 flex-1">
                                          <p className="truncate text-sm font-medium text-white">
                                              {item.title}
                                          </p>
                                          <p className="mt-0.5 text-xs text-[#8CA3BF]">
                                              {item.actorName ? `${item.actorName} · ` : ""}
                                              {item.createdAt}
                                          </p>
                                      </div>
                                      <Clock size={13} className="shrink-0 text-[#5C7394]" />
                                  </div>
                              );
                          })}
                </div>
            </div>
        </section>
    );
};

export default RecentActivity;
