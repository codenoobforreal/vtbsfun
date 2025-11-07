import { queryOptions, useQuery } from "@tanstack/react-query";
import { string, InferInput, object, number } from "valibot";
import { vtbsApiClient } from "..";
import { safeParseInputAgainstSchema } from "@/utils";

const roomInfoSchema = object({
  uid: number(),
  roomId: number(),
  title: string(),
  poppopularity: number(),
  live_time: number(),
});

type RoomInfo = InferInput<typeof roomInfoSchema>;

async function getRoomInfo(id: number): Promise<RoomInfo> {
  const res = await vtbsApiClient.get(`v1/room/${id}`).json();
  return safeParseInputAgainstSchema<RoomInfo>(roomInfoSchema, res);
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
