import { useInfiniteQuery } from "@tanstack/react-query";
import AdminPageHeader from "../../components/AdminPageHeader";
import AdminTable from "../../components/AdminTable";
import { getAdminCommunity } from "../../../../api/admin.api";
import InfiniteScrollTrigger from "../../../../shared/InfiniteScrollTrigger";

export default function AdminCommunityPage() {
 const query=useInfiniteQuery({queryKey:["admin-community-feed"],initialPageParam:1,queryFn:({pageParam})=>getAdminCommunity(pageParam,20),getNextPageParam:p=>p.hasNextPage?p.page+1:undefined});
 const data=query.data?.pages.flatMap(p=>p.items)??[];
 return <div className="p-6 lg:p-10"><AdminPageHeader eyebrow="Community" title="Community activity" description="Review the current community feed."/><AdminTable headers={["Post","Author","Created","Engagement"]} empty={!query.isLoading&&data.length===0?"No community posts found.":undefined}>{query.isLoading?<tr><td colSpan={4} className="px-5 py-10 text-center">Loading community...</td></tr>:data.map(item=><tr key={item.id}><td className="px-5 py-4"><p className="font-medium text-white">{item.title}</p><p className="max-w-xl truncate text-xs text-[#5C7394]">{item.content}</p></td><td className="px-5 py-4 text-sm text-[#8CA3BF]">{item.userName}</td><td className="px-5 py-4 text-sm text-[#8CA3BF]">{item.createdAt?new Date(item.createdAt).toLocaleDateString():"—"}</td><td className="px-5 py-4 text-sm text-[#8CA3BF]">{item.likeCount} likes</td></tr>)}</AdminTable><InfiniteScrollTrigger hasNextPage={!!query.hasNextPage} isFetchingNextPage={query.isFetchingNextPage} onLoadMore={()=>void query.fetchNextPage()}/></div>;
}
