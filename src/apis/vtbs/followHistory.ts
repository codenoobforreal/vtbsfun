import { queryOptions, useQuery } from "@tanstack/react-query";
import { InferInput, object, number, array } from "valibot";
import { vtbsApiClient } from "..";
import { safeParseInputAgainstSchema } from "@/utils";

const followHistorySchema = array(
  object({
    archiveView: number(),
    follower: number(),
    time: number(),
  }),
);

type FollowHistory = InferInput<typeof followHistorySchema>;

async function getFollowHistory(id: number): Promise<FollowHistory> {
  const res = await vtbsApiClient.get(`v2/bulkActive/${id}`).json();
  return safeParseInputAgainstSchema<FollowHistory>(followHistorySchema, res);
}

export function createFollowHistoryQueryOptions(id: number) {
  return queryOptions({
    queryKey: ["followHistory", id],
    queryFn: () => getFollowHistory(id),
  });
}

/** id 是用户 id 即 mid */
export function useFollowHistoryQuery(id: number) {
  return useQuery(createFollowHistoryQueryOptions(id));
}
