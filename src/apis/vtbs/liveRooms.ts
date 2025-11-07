import { queryOptions, useQuery } from "@tanstack/react-query";
import { vtbsApiClient } from "..";
import { string, array, InferInput } from "valibot";
import { safeParseInputAgainstSchema } from "@/utils";

const liveRoomsSchema = array(string());

type LiveRooms = InferInput<typeof liveRoomsSchema>;

async function getLiveRooms(): Promise<LiveRooms> {
  const res = await vtbsApiClient.get(`v1/living`).json();
  return safeParseInputAgainstSchema<LiveRooms>(liveRoomsSchema, res);
}

export function createLiveRoomsQueryOptions() {
  return queryOptions({
    queryKey: ["liveRooms"],
    queryFn: getLiveRooms,
  });
}

export function useLiveRoomsQuery() {
  return useQuery(createLiveRoomsQueryOptions());
}
