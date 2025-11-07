import { queryOptions } from "@tanstack/react-query";
import { getInfoList } from "./vtbs/info";
import { getDetail } from "./vtbs/detail";
import { getFollowHistory } from "./vtbs/followHistory";
import { getGuardHistory } from "./vtbs/guardHistory";

export const VtbQueries = {
  all: () => ["vtbs"],
  list: () =>
    queryOptions({
      queryKey: [...VtbQueries.all()],
      queryFn: getInfoList,
    }),
  details: () => [...VtbQueries.all(), "detail"],
  detail: (mId: number) =>
    queryOptions({
      queryKey: [...VtbQueries.details(), mId],
      queryFn: () => getDetail(mId),
    }),
  followHistory: (mId: number) =>
    queryOptions({
      queryKey: [...VtbQueries.all(), "followHistory", mId],
      queryFn: () => getFollowHistory(mId),
    }),
  guardHistory: (mId: number) =>
    queryOptions({
      queryKey: [...VtbQueries.all(), "guardHistory", mId],
      queryFn: () => getGuardHistory(mId),
    }),
};
