import { vtbsApiClient } from "../clients";
import { safeParseInputAgainstSchema } from "@/utils";
import {
  object,
  number,
  string,
  array,
  union,
  InferOutput,
  length,
  pipe,
  boolean,
  literal,
} from "valibot";

const lastLiveSchema = object({
  online: number(),
  time: number(),
});

const InfoSchema = object({
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
  /** 接口返回的数据类型有 false 数字0 和 数字1 不清楚两个数字的意思 */
  liveStatus: union([boolean(), literal(0), literal(1)]),
  recordNum: number(),
  guardNum: number(),
  lastLive: union([lastLiveSchema, object({})]),
  guardChange: number(),
  guardType: pipe(array(number()), length(3)),
  online: number(),
  title: string(),
  time: number(),
  liveStartTime: number(),
});

const InfoListSchema = array(InfoSchema);

type InfoList = InferOutput<typeof InfoListSchema>;
export type Info = InferOutput<typeof InfoSchema>;
// type LastLive = InferOutput<typeof LastLiveSchema>;
// export type GuardTypeIndex = InferOutput<typeof GuardTypeIndexSchema>;

export async function getInfoList(): Promise<InfoList> {
  const res = await vtbsApiClient.get("v1/info").json();
  return safeParseInputAgainstSchema<InfoList>(InfoListSchema, res);
}
