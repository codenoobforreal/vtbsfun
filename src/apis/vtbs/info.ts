import { queryOptions, UseQueryOptions } from "@tanstack/react-query";
import { vtbsApiClient } from "..";

export enum GuardTypeIndex {
  /** 总督 */
  GOVERNOR = 0,
  /** 提督 */
  ADMIRAL = 1,
  /** 舰长 */
  CAPTAIN = 2,
}

export interface LastLive {
  online: number;
  time: number;
}

export interface Info {
  mid: number;
  uuid: string;
  uname: string;
  video: number;
  roomid: number;
  sign: string;
  notice: string;
  face: string;
  rise: number;
  topPhoto: string;
  archiveView: number;
  follower: number;
  liveStatus: number;
  recordNum: number;
  guardNum: number;
  lastLive: LastLive;
  guardChange: number;
  guardType: number[];
  online: number;
  title: string;
  time: number;
  liveStartTime: number;
}

async function getInfoList(): Promise<Info[]> {
  return await vtbsApiClient.get("v1/info").json();
}

export function createGetInfoListQueryOptions<TData = Info[], TError = Error>(
  options?: Omit<
    UseQueryOptions<Info[], TError, TData>,
    "queryKey" | "queryFn"
  >,
) {
  return queryOptions({
    ...options,
    queryKey: ["vtbsInfoList"],
    queryFn: getInfoList,
  });
}
