import { array, object, number, string, InferInput, safeParse } from "valibot";
import { vtbsApiClient } from "..";
import { queryOptions, UseQueryOptions } from "@tanstack/react-query";

const guardsByIdSchema = array(
  object({
    mid: number(),
    uname: string(),
    face: string(),
    /** 0总督 1提督 2舰长 */
    level: number(),
  }),
);

type GuardsById = InferInput<typeof guardsByIdSchema>;

/** id 是用户 id 即 mid */
async function getGuardsById(id: number): Promise<GuardsById> {
  const res = await vtbsApiClient.get(`v1/guard/${id}`).json();
  const validation = safeParse(guardsByIdSchema, res);
  if (validation.issues) {
    throw new Error(validation.issues.toString());
  }
  return validation.output;
}

export function createGetGuardsByIdQueryOptions<
  TData = Promise<GuardsById>,
  TError = Error,
>(
  id: number,
  options?: Omit<
    UseQueryOptions<Promise<GuardsById>, TError, TData>,
    "queryKey" | "queryFn"
  >,
) {
  return queryOptions({
    ...options,
    queryKey: ["guards", id],
    queryFn: () => getGuardsById(id),
  });
}
