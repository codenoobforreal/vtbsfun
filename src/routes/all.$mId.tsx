import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getProtocolAndDomain, openUrlWithDefaultBrower } from "@/utils";
import { createFileRoute, useParams } from "@tanstack/react-router";
import { ComponentPropsWithoutRef } from "react";
import { BILI_LIVE_ROOM_DOMAIN, BILI_PERSON_SPACE_DOMAIN } from "@/constants";
import { FollowHistoryChart } from "@/features/v-detail/components/FollowHistoryChart";
import { GuardHistoryChart } from "@/features/v-detail/components/GuardHistoryChart";
import { Skeleton } from "@/components/ui/skeleton";
import { timeFormatUtils } from "@/utils/time";
import { Badge } from "@/components/ui/badge";
import { VtbQueries } from "@/apis";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/all/$mId")({
  component: DetailPage,
  loader: ({ context, params }) => {
    const queryClient = context.queryClient;
    const { mId } = params;
    const mIdInNumber = Number(mId);

    queryClient.prefetchQuery(VtbQueries.detail(mIdInNumber));
    queryClient.prefetchQuery(VtbQueries.followHistory(mIdInNumber));
    queryClient.prefetchQuery(VtbQueries.guardHistory(mIdInNumber));
  },
});

function DetailPage() {
  return (
    <div className="space-y-4">
      <DetailSection />
      <DataAnalyzeSection />
    </div>
  );
}

function DetailSection() {
  const { mId } = useParams({ from: "/all/$mId" });
  const mIdInNumber = Number(mId);

  const {
    data,
    isPending,
    isError,
    error,
    isSuccess,
    isFetching,
    isStale,
    dataUpdatedAt,
  } = useQuery(VtbQueries.detail(mIdInNumber));

  const isFreshCachedData = isSuccess && !isFetching && !isStale;

  if (isPending) {
    return (
      <div className="space-y-4">
        <Skeleton className="w-full h-36" />
        <div className="grid gap-4 grid-cols-3 grid-flow-dense lg:grid-cols-4 lg:gap-4 xl:grid-cols-5 xl:gap-6">
          {new Array(9).fill(0).map((_, i) => {
            if (i === 1 || i === 3) {
              return (
                <DetailCard key={i} className="col-span-2">
                  <Skeleton className="size-full" />
                </DetailCard>
              );
            }
            return (
              <DetailCard key={i}>
                <Skeleton className="size-full" />
              </DetailCard>
            );
          })}
        </div>
      </div>
    );
  }

  if (isError) {
    return <div>{error.message}</div>;
  }

  const {
    topPhoto,
    face,
    notice,
    follower,
    sign,
    uname,
    title,
    roomid,
    lastLive,
    guardType: [governor, admiral, captain],
    video,
  } = data;

  const lastLiveTime =
    "time" in lastLive
      ? timeFormatUtils.formatShortChineseDate(lastLive.time)
      : "无时间数据";

  const topPhotoUrl =
    getProtocolAndDomain(face) === null
      ? ""
      : `${getProtocolAndDomain(face)}/${topPhoto}`;

  return (
    <div className="space-y-4">
      {topPhotoUrl !== "" && (
        <Card className="p-0 overflow-hidden">
          <img src={topPhotoUrl} alt="空间顶部图片" title="空间顶部图片" />
        </Card>
      )}

      {isFreshCachedData && (
        <Badge variant="success">
          当前数据已缓存于{" "}
          {timeFormatUtils.formatChineseDateTime(dataUpdatedAt)}
        </Badge>
      )}

      <div className="grid gap-4 grid-cols-3 grid-flow-dense lg:grid-cols-4 lg:gap-4 xl:grid-cols-5 xl:gap-6">
        <DetailCard className="p-0">
          <img
            src={`${face}@160w_160h`}
            alt="用户头像"
            className="size-40 object-cover cursor-pointer"
            title="前往个人空间"
            onClick={() =>
              openUrlWithDefaultBrower(
                `${BILI_PERSON_SPACE_DOMAIN}/${mIdInNumber}`,
              )
            }
          />
        </DetailCard>
        <DetailCard className="col-span-2">
          <span
            className="text-lg font-semibold hover:underline underline-offset-4 cursor-pointer"
            onClick={() =>
              openUrlWithDefaultBrower(
                `${BILI_PERSON_SPACE_DOMAIN}/${mIdInNumber}`,
              )
            }
          >
            {uname}
          </span>
          <span className="line-clamp-3 break-all">{sign}</span>
        </DetailCard>
        <DetailCard>
          <span className="text-lg font-semibold">关注</span>
          <span>{follower}</span>
          {/* <span>变化：{rise}</span> */}
        </DetailCard>
        <DetailCard className="col-span-2">
          <span className="text-lg font-semibold">公告</span>
          <span className="line-clamp-3 break-all">{notice}</span>
        </DetailCard>
        <DetailCard>
          {/* <span>{roomid}</span> */}
          <span
            className="truncate text-lg font-semibold hover:underline underline-offset-4 cursor-pointer"
            onClick={() =>
              openUrlWithDefaultBrower(`${BILI_LIVE_ROOM_DOMAIN}/${roomid}`)
            }
          >
            {title}
          </span>
          <div className="flex flex-col gap-1 items-center-safe">
            <span>上次直播</span>
            <span>{lastLiveTime}</span>
          </div>
        </DetailCard>
        <DetailCard>
          <span className="text-lg font-semibold">总督</span>
          <span>{governor}</span>
        </DetailCard>
        <DetailCard>
          <span className="text-lg font-semibold">提督</span>
          <span>{admiral}</span>
        </DetailCard>
        <DetailCard>
          <span className="text-lg font-semibold">舰长</span>
          <span>{captain}</span>
        </DetailCard>
        <DetailCard>
          <span className="text-lg font-semibold">视频</span>
          <span>{video}</span>
        </DetailCard>
      </div>
    </div>
  );
}

function DetailCard(props: ComponentPropsWithoutRef<"div">) {
  return (
    <Card
      className={cn(
        "py-2 px-2 md:px-4 overflow-hidden justify-evenly items-center-safe gap-2 min-w-32 md:min-w-40 min-h-32 md:min-h-40 select-none",
        props.className,
      )}
    >
      {props.children}
    </Card>
  );
}

function DataAnalyzeSection() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      <FollowHistoryChart />
      <GuardHistoryChart />
    </div>
  );
}
