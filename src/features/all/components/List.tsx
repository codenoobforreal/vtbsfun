import { Info } from "@/apis/vtbs/info";
import { useRankStore } from "@/store";
import { useDeferredValue, useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { Charset, Document, DocumentData } from "flexsearch";
import { multiConditionSortDescending } from "../infoSorter";
import { conditionConfig } from "./ConditionSelector";
import { Card } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import { Skeleton } from "@/components/ui/skeleton";
import { openUrlWithDefaultBrower } from "@/utils";
import { BILI_LIVE_ROOM_DOMAIN, BILI_PERSON_SPACE_DOMAIN } from "@/constants";
import { timeFormatUtils } from "@/utils/time";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { VtbQueries } from "@/apis";

export function List() {
  const { data, isError, error, isPending, dataUpdatedAt } = useQuery(
    VtbQueries.list(),
  );

  const { search, limit, condition } = useRankStore(
    useShallow(({ search, limit, condition }) => ({
      search,
      limit,
      condition,
    })),
  );

  const deferredSearch = useDeferredValue(search);

  const vtbListIndex = useMemo(() => {
    if (!data) return null;

    const index = new Document({
      document: {
        id: "mid",
        store: true,
        index: [
          {
            field: "uname",
            tokenize: "tolerant",
            encoder: Charset.CJK,
          },
        ],
      },
    });

    for (let i = 0; i < data.length; i++) {
      index.add(data[i] as unknown as DocumentData);
    }
    return index;
  }, [data]);

  // 搜索过滤排序
  const searchFilterData = useMemo(() => {
    // 提前返回：如果数据不存在
    if (!data) {
      return [];
    }

    let searchedData: Info[] = [];

    if (deferredSearch === "") {
      searchedData = data;
    } else {
      // 确保索引存在
      if (!vtbListIndex) {
        searchedData = data;
      } else {
        searchedData = vtbListIndex
          .search({
            query: deferredSearch,
            /** 当进行多字段搜索时才需要打开这个设置使得结果不重复。merge参数用于控制如何合并来自不同字段的搜索结果
             */
            merge: true,
            enrich: true,
          })
          .map((result) => result.doc as unknown as Info);
      }
    }

    return multiConditionSortDescending(
      searchedData,
      [conditionConfig[condition]["selector"]],
      limit,
    );
  }, [condition, data, limit, deferredSearch, vtbListIndex]);

  if (isPending) {
    return (
      <div className="grid grid-cols-1 justify-items-center-safe 2xl:grid-cols-2 2xl:justify-items-stretch gap-4">
        {new Array(limit).fill(0).map((_, index) => {
          return <Skeleton key={index} className="w-[540px] h-40" />;
        })}
      </div>
    );
  }

  if (isError) {
    return <div>{error.message}</div>;
  }

  return (
    <div className="space-y-2">
      <Badge variant="success">
        当前数据更新于：{timeFormatUtils.formatChineseDateTime(dataUpdatedAt)}
      </Badge>
      <div className="grid grid-cols-1 justify-items-center-safe 2xl:grid-cols-2 2xl:justify-items-stretch">
        {searchFilterData.map((item) => {
          return <Item data={item} key={item.mid} />;
        })}
      </div>
    </div>
  );
}

function Item(props: { data: Info }) {
  const condition = useRankStore((s) => s.condition);
  const { face, uname, title, sign, mid, roomid } = props.data;
  const avatarSrc = `${face}@160h_160w`;
  const conditionLabel = conditionConfig[condition]["label"];
  const conditionValue = conditionConfig[condition]["selector"](props.data);
  const displayConditionValue = conditionConfig[condition]["formatValue"](
    conditionValue as number,
  );

  return (
    <Card className="flex-row gap-4 my-4 w-[540px] p-0 overflow-hidden">
      <Link to="/all/$mId" params={{ mId: mid.toString() }}>
        <div className="shrink-0 size-40">
          <img
            src={avatarSrc}
            alt="用户头像"
            title="前往详情页"
            className="object-cover size-full"
          />
        </div>
      </Link>
      <div className="flex flex-1 flex-col justify-center-safe items-center-safe gap-2 py-2">
        <span
          title="前往个人空间"
          className="text-lg font-semibold hover:underline underline-offset-4 cursor-pointer"
          onClick={() =>
            openUrlWithDefaultBrower(`${BILI_PERSON_SPACE_DOMAIN}/${mid}`)
          }
        >
          {uname}
        </span>
        <span
          title="前往直播间"
          className="text-md font-semibold hover:underline underline-offset-2 cursor-pointer"
          onClick={() =>
            openUrlWithDefaultBrower(`${BILI_LIVE_ROOM_DOMAIN}/${roomid}`)
          }
        >
          {title}
        </span>
        <span className="line-clamp-3 break-all">{sign}</span>
      </div>
      <div className="flex flex-col shrink-0 justify-center items-center pr-2">
        <span>{conditionLabel}</span>
        <span>{displayConditionValue}</span>
      </div>
    </Card>
  );
}
