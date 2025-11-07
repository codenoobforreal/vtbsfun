import { vtbsApiClient } from "../clients";
import { object, string, number, array, InferInput, union } from "valibot";
import { safeParseInputAgainstSchema } from "@/utils";

const lastLiveSchema = object({
  online: number(),
  time: number(),
});

const detailSchema = object({
  mid: number(),
  uuid: string(),
  uname: string(),
  video: number(),
  roomid: number(),
  sign: string(),
  notice: string(),
  face: string(),
  rise: number(),
  topPhoto: string(),
  archiveView: number(),
  follower: number(),
  liveStatus: number(),
  recordNum: number(),
  guardNum: number(),
  /** 这个字段有返回空对象 {} 的情况 */
  lastLive: union([lastLiveSchema, object({})]),
  guardChange: number(),
  guardType: array(number()),
  online: number(),
  title: string(),
  time: number(),
  liveStartTime: number(),
});

type Detail = InferInput<typeof detailSchema>;

export async function getDetail(id: number): Promise<Detail> {
  const res = await vtbsApiClient.get(`v1/detail/${id}`).json();
  return safeParseInputAgainstSchema<Detail>(detailSchema, res);
}
