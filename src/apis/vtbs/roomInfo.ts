import { queryOptions, UseQueryOptions } from "@tanstack/react-query";
import { string, safeParse, InferInput, object, number } from "valibot";
import { vtbsApiClient } from "..";

const roomInfoSchema = object({
  uid: number(),
  roomId: number(),
  title: string(),
  poppopularity: number(),
  live_time: number(),
});

type RoomInfo = InferInput<typeof roomInfoSchema>;

/** 这里的 id 是 roomId */
async function getRoomInfo(id: number): Promise<RoomInfo> {
  const res = await vtbsApiClient.get(`v1/room/${id}`).json();
  const validation = safeParse(roomInfoSchema, res);
  if (validation.issues) {
    throw new Error(validation.issues.toString());
  }
  return validation.output;
}

export function createGetRoomInfoQueryOptions<
  TData = Promise<RoomInfo>,
  TError = Error,
>(
  id: number,
  options?: Omit<
    UseQueryOptions<Promise<RoomInfo>, TError, TData>,
    "queryKey" | "queryFn"
  >,
) {
  return queryOptions({
    ...options,
    queryKey: ["roomInfo", id],
    queryFn: () => getRoomInfo(id),
  });
}
