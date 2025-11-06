import { queryOptions, UseQueryOptions } from "@tanstack/react-query";
import { vtbsApiClient } from "..";
import { string, array, safeParse, InferInput } from "valibot";

const liveRoomsSchema = array(string());

type LiveRooms = InferInput<typeof liveRoomsSchema>;

async function getLiveRooms(): Promise<LiveRooms> {
  const res = await vtbsApiClient.get(`v1/living`).json();
  const validation = safeParse(liveRoomsSchema, res);
  if (validation.issues) {
    throw new Error(validation.issues.toString());
  }
  return validation.output;
}

export function createGetLiveRoomsQueryOptions<
  TData = Promise<LiveRooms>,
  TError = Error,
>(
  options?: Omit<
    UseQueryOptions<Promise<LiveRooms>, TError, TData>,
    "queryKey" | "queryFn"
  >,
) {
  return queryOptions({
    ...options,
    queryKey: ["liveRooms"],
    queryFn: getLiveRooms,
  });
}
