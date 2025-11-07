import { queryOptions, useQuery } from "@tanstack/react-query";
import { vtbsApiClient } from "..";
import {
  object,
  string,
  number,
  array,
  InferInput,
  tuple,
  record,
} from "valibot";
import { safeParseInputAgainstSchema } from "@/utils";

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

async function getAllGuard(): Promise<AllGuard> {
  const res = await vtbsApiClient.get(`v1/guard/all`).json();
  return safeParseInputAgainstSchema<AllGuard>(allGuardSchema, res);
}

export function createAllGuardQueryOptions() {
  return queryOptions({
    queryKey: ["allGuard"],
    queryFn: getAllGuard,
  });
}

export function useAllGuardQuery() {
  return useQuery(createAllGuardQueryOptions());
}
