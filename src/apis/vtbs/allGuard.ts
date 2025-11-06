import { queryOptions, UseQueryOptions } from "@tanstack/react-query";
import { vtbsApiClient } from "..";
import {
  object,
  string,
  number,
  array,
  safeParse,
  InferInput,
  tuple,
  record,
} from "valibot";

const allGuardSchema = record(
  string(),
  object({
    uname: string(),
    face: string(),
    mid: number(),
    dd: tuple([array(number()), array(number()), array(number())]),
  }),
);

type AllGuard = InferInput<typeof allGuardSchema>;

/** id 是用户 id 即 mid */
async function getAllGuard(): Promise<AllGuard> {
  const res = await vtbsApiClient.get(`v1/guard/all`).json();
  const validation = safeParse(allGuardSchema, res);
  if (validation.issues) {
    throw new Error(validation.issues.toString());
  }
  return validation.output;
}

export function createGetAllGuardQueryOptions<
  TData = Promise<AllGuard>,
  TError = Error,
>(
  options?: Omit<
    UseQueryOptions<Promise<AllGuard>, TError, TData>,
    "queryKey" | "queryFn"
  >,
) {
  return queryOptions({
    ...options,
    queryKey: ["allGuard"],
    queryFn: getAllGuard,
  });
}
