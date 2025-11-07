import { array, object, number, string, InferInput } from "valibot";
import { vtbsApiClient } from "../clients";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { safeParseInputAgainstSchema } from "@/utils";

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

async function getGuardsById(id: number): Promise<GuardsById> {
  const res = await vtbsApiClient.get(`v1/guard/${id}`).json();
  return safeParseInputAgainstSchema<GuardsById>(guardsByIdSchema, res);
}

export function createGuardsByIdQueryOptions(id: number) {
  return queryOptions({
    queryKey: ["guardsById", id],
    queryFn: () => getGuardsById(id),
  });
}

/** id 是用户 id 即 mid */
export function useGuardsByIdQuery(id: number) {
  return useQuery(createGuardsByIdQueryOptions(id));
}
