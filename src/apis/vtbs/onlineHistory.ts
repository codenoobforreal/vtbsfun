import { queryOptions, UseQueryOptions } from "@tanstack/react-query";
import { safeParse, InferInput, object, number, array } from "valibot";
import { vtbsApiClient } from "..";

const onlineHistorySchema = array(
  object({
    liveStatus: number(),
    /** 总人气 */
    online: number(),
    time: number(),
  }),
);

type onlineHistory = InferInput<typeof onlineHistorySchema>;

async function getOnlineHistory(): Promise<onlineHistory> {
  const res = await vtbsApiClient.get(`v2/bulkOnline`).json();
  const validation = safeParse(onlineHistorySchema, res);
  if (validation.issues) {
    throw new Error(validation.issues.toString());
  }
  return validation.output;
}

export function createGetOnlineHistoryQueryOptions<
  TData = Promise<onlineHistory>,
  TError = Error,
>(
  options?: Omit<
    UseQueryOptions<Promise<onlineHistory>, TError, TData>,
    "queryKey" | "queryFn"
  >,
) {
  return queryOptions({
    ...options,
    queryKey: ["onlineHistory"],
    queryFn: getOnlineHistory,
  });
}
