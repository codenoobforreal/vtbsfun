import { queryOptions, UseQueryOptions } from "@tanstack/react-query";
import { vtbsApiClient } from "..";
// 导入 Valibot 函数
import { object, string, number, array, safeParse, InferInput } from "valibot";

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
  lastLive: lastLiveSchema,
  guardChange: number(),
  guardType: array(number()),
  online: number(),
  title: string(),
  time: number(),
  liveStartTime: number(),
});

type Detail = InferInput<typeof detailSchema>;

/** id 是用户 id 即 mid */
async function getDetail(id: number): Promise<Detail> {
  const res = await vtbsApiClient.get(`v1/detail/${id}`).json();
  const validation = safeParse(detailSchema, res);
  if (validation.issues) {
    throw new Error(validation.issues.toString());
  }
  return validation.output;
}

export function createGetDetailQueryOptions<TData = Detail, TError = Error>(
  id: number,
  options?: Omit<
    UseQueryOptions<Detail, TError, TData>,
    "queryKey" | "queryFn"
  >,
) {
  return queryOptions({
    ...options,
    queryKey: ["detail", id],
    queryFn: () => getDetail(id),
  });
}
