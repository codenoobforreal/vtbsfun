import { queryOptions, useQuery } from "@tanstack/react-query";
import { InferInput, object, number, array } from "valibot";
import { vtbsApiClient } from "../clients";
import { safeParseInputAgainstSchema } from "@/utils";

const onlineHistorySchema = array(
  object({
    liveStatus: number(),
    /** 总人气 */
    online: number(),
    time: number(),
  }),
);

type OnlineHistory = InferInput<typeof onlineHistorySchema>;

async function getOnlineHistory(): Promise<OnlineHistory> {
  const res = await vtbsApiClient.get(`v2/bulkOnline`).json();
  return safeParseInputAgainstSchema<OnlineHistory>(onlineHistorySchema, res);
}

export function createOnlineHistoryQueryOptions() {
  return queryOptions({
    queryKey: ["onlineHistory"],
    queryFn: getOnlineHistory,
  });
}

export function useOnlineHistoryQuery() {
  return useQuery(createOnlineHistoryQueryOptions());
}
