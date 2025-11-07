import { queryOptions, useQuery } from "@tanstack/react-query";
import { parse, object, number, array } from "valibot";
import { vtbsApiClient } from "../clients";

const onlineHistorySchema = array(
  object({
    liveStatus: number(),
    /** 总人气 */
    online: number(),
    time: number(),
  }),
);

async function getOnlineHistory() {
  const res = await vtbsApiClient.get(`v2/bulkOnline`).json();
  return parse(onlineHistorySchema, res);
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
