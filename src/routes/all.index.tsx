import { createInfoListQueryOptions } from "@/apis/vtbs/info";
import ConditionSelector from "@/features/all/components/ConditionSelector";
import LimitSelector from "@/features/all/components/LimitSelector";
import { List } from "@/features/all/components/List";
import Search from "@/features/all/components/Search";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/all/")({
  component: RankPage,
  loader: ({ context }) => {
    context.queryClient.prefetchQuery(createInfoListQueryOptions());
  },
});

function RankPage() {
  return (
    <>
      <div className="backdrop-blur-lg flex flex-col gap-4 sticky top-0 py-4 rounded-lg">
        <Search />
        <div className="flex gap-4">
          <ConditionSelector />
          <LimitSelector />
        </div>
      </div>
      <List />
    </>
  );
}
