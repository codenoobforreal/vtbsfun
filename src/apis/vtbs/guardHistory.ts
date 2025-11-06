import { queryOptions, UseQueryOptions } from "@tanstack/react-query";
import { safeParse, InferInput, object, number, array } from "valibot";
import { vtbsApiClient } from "..";

const guardHistorySchema = array(
  object({
    guardNum: number(),
    time: number(),
  }),
);

type guardHistory = InferInput<typeof guardHistorySchema>;

/** mid */
async function getGuardHistory(id: number): Promise<guardHistory> {
  const res = await vtbsApiClient.get(`v2/bulkGuard/${id}`).json();
  const validation = safeParse(guardHistorySchema, res);
  if (validation.issues) {
    throw new Error(validation.issues.toString());
  }
  return validation.output;
}

export function createGetGuardHistoryQueryOptions<
  TData = guardHistory,
  TError = Error,
>(
  id: number,
  options?: Omit<
    UseQueryOptions<guardHistory, TError, TData>,
    "queryKey" | "queryFn"
  >,
) {
  return queryOptions({
    ...options,
    queryKey: ["guardHistory", id],
    queryFn: () => getGuardHistory(id),
  });
}
