import { queryOptions, useQuery } from "@tanstack/react-query";
import { string, parse, object, number, array } from "valibot";
import { vtbsApiClient } from "../clients";

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

async function getHawk() {
  const res = await vtbsApiClient.get(`v1/hawk`).json();
  return parse(hawkSchema, res);
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
