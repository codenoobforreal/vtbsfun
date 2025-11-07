import { queryOptions, useQuery } from "@tanstack/react-query";
import { InferInput, object, number, array } from "valibot";
import { vtbsApiClient } from "..";
import { safeParseInputAgainstSchema } from "@/utils";

const guardHistorySchema = array(
  object({
    guardNum: number(),
    time: number(),
  }),
);

type GuardHistory = InferInput<typeof guardHistorySchema>;

async function getGuardHistory(id: number): Promise<GuardHistory> {
  const res = await vtbsApiClient.get(`v2/bulkGuard/${id}`).json();
  return safeParseInputAgainstSchema<GuardHistory>(guardHistorySchema, res);
}

export function createGuardHistoryQueryOptions(id: number) {
  return queryOptions({
    queryKey: ["guardHistory", id],
    queryFn: () => getGuardHistory(id),
  });
}

/** id 是用户 id 即 mid */
export function useGuardHistoryQuery(id: number) {
  return useQuery(createGuardHistoryQueryOptions(id));
}
