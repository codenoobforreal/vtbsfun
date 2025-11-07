import { queryOptions, useQuery } from "@tanstack/react-query";
import { vtbsApiClient } from "../clients";
import { object, string, number, array, tuple, record, parse } from "valibot";

const allGuardSchema = record(
  string(),
  object({
    uname: string(),
    face: string(),
    mid: number(),
    dd: tuple([array(number()), array(number()), array(number())]),
  }),
);

async function getAllGuard() {
  const res = await vtbsApiClient.get(`v1/guard/all`).json();
  return parse(allGuardSchema, res);
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
