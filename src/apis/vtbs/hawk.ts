import { queryOptions, useQuery } from "@tanstack/react-query";
import { string, InferInput, object, number, array } from "valibot";
import { vtbsApiClient } from "..";
import { safeParseInputAgainstSchema } from "@/utils";

const hawkSchema = object({
  day: array(
    object({
      word: string(),
      weight: number(),
    }),
  ),
  h: array(
    object({
      word: string(),
      weight: number(),
    }),
  ),
});

type Hawk = InferInput<typeof hawkSchema>;

async function getHawk(): Promise<Hawk> {
  const res = await vtbsApiClient.get(`v1/hawk`).json();
  return safeParseInputAgainstSchema<Hawk>(hawkSchema, res);
}

export function createHawkQueryOptions() {
  return queryOptions({
    queryKey: ["hawk"],
    queryFn: getHawk,
  });
}

export function useHawkQuery() {
  return useQuery(createHawkQueryOptions());
}
