import { queryOptions, useQuery } from "@tanstack/react-query";
import { vtbsApiClient } from "../clients";
import { string, array, parse } from "valibot";

const liveRoomsSchema = array(string());

async function getLiveRooms() {
  const res = await vtbsApiClient.get(`v1/living`).json();
  return parse(liveRoomsSchema, res);
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
