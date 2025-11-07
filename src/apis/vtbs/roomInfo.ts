import { queryOptions, useQuery } from "@tanstack/react-query";
import { string, parse, object, number } from "valibot";
import { vtbsApiClient } from "../clients";

const roomInfoSchema = object({
  uid: number(),
  roomId: number(),
  title: string(),
  poppopularity: number(),
  live_time: number(),
});

async function getRoomInfo(id: number) {
  const res = await vtbsApiClient.get(`v1/room/${id}`).json();
  return parse(roomInfoSchema, res);
}

export function createRoomInfoQueryOptions(id: number) {
  return queryOptions({
    queryKey: ["roomInfo", id],
    queryFn: () => getRoomInfo(id),
  });
}

/** id 是 roomid */
export function useRoomInfoQuery(id: number) {
  return useQuery(createRoomInfoQueryOptions(id));
}
