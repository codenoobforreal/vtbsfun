import { queryOptions, UseQueryOptions } from "@tanstack/react-query";
import { string, safeParse, InferInput, object, number, array } from "valibot";
import { vtbsApiClient } from "..";

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
  const validation = safeParse(hawkSchema, res);
  if (validation.issues) {
    throw new Error(validation.issues.toString());
  }
  return validation.output;
}

export function createGetHawkQueryOptions<
  TData = Promise<Hawk>,
  TError = Error,
>(
  options?: Omit<
    UseQueryOptions<Promise<Hawk>, TError, TData>,
    "queryKey" | "queryFn"
  >,
) {
  return queryOptions({
    ...options,
    queryKey: ["hawk"],
    queryFn: getHawk,
  });
}
