import { queryOptions, UseQueryOptions } from "@tanstack/react-query";
import { safeParse, InferInput, object, number, array } from "valibot";
import { vtbsApiClient } from "..";

const followHistorySchema = array(
  object({
    archiveView: number(),
    follower: number(),
    time: number(),
  }),
);

type FollowHistory = InferInput<typeof followHistorySchema>;

/** mid */
async function getFollowHistory(id: number): Promise<FollowHistory> {
  const res = await vtbsApiClient.get(`v2/bulkActive/${id}`).json();
  const validation = safeParse(followHistorySchema, res);
  if (validation.issues) {
    throw new Error(validation.issues.toString());
  }
  return validation.output;
}

export function createGetFollowHistoryQueryOptions<
  TData = FollowHistory,
  TError = Error,
>(
  id: number,
  options?: Omit<
    UseQueryOptions<FollowHistory, TError, TData>,
    "queryKey" | "queryFn"
  >,
) {
  return queryOptions({
    ...options,
    queryKey: ["followHistory", id],
    queryFn: () => getFollowHistory(id),
  });
}
