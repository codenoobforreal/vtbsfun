import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { formatLargeNumber, sampleTimeSeriesData } from "@/utils";
import { useParams } from "@tanstack/react-router";
import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatTimestamp } from "@/utils/time";
import { VtbQueries } from "@/apis";
import { useQuery } from "@tanstack/react-query";

export function FollowHistoryChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>关注历史</CardTitle>
      </CardHeader>
      <CardContent>
        <Chart />
      </CardContent>
    </Card>
  );
}

function Chart() {
  const { mId } = useParams({ from: "/all/$mId" });
  const mIdInNumber = Number(mId);

  const { data, isPending, isError, error } = useQuery(
    VtbQueries.followHistory(mIdInNumber),
  );

  const chartData = useMemo(() => {
    if (!data) return [];
    return sampleTimeSeriesData(data, {
      timeField: "time",
      maxDataPoints: 10,
    });
  }, [data]);

  if (isPending) {
    return (
      <div className="size-full">
        <Skeleton className="size-full h-[400px] xl:h-80" />
      </div>
    );
  }

  if (isError) {
    return <div>{error.message}</div>;
  }

  const chartConfig = {
    follower: {
      label: "关注",
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig;

  return (
    <ChartContainer config={chartConfig}>
      <LineChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="time"
          interval={"preserveStartEnd"}
          angle={30}
          tickMargin={10}
          tickFormatter={(value) => {
            return formatTimestamp(value, "yy/MM");
          }}
        />
        <YAxis
          dataKey="follower"
          interval={"preserveStartEnd"}
          tickMargin={8}
          tickFormatter={(value) => formatLargeNumber(value)}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Line
          dataKey="follower"
          type="bump"
          stroke="var(--chart-5)"
          dot={false}
          strokeWidth={2}
          filter="url(#rainbow-line-glow)"
        />
        <defs>
          <filter
            id="rainbow-line-glow"
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
            <feGaussianBlur stdDeviation="10" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
      </LineChart>
    </ChartContainer>
  );
}
