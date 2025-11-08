import { Field, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Info } from "@/apis/vtbs/info";
import { useRankStore } from "@/store";
import { useShallow } from "zustand/react/shallow";
import { timeFormatUtils } from "@/utils/time";

export type ConditionKey =
  | "byFollower"
  | "byVideo"
  | "byRise"
  | "byLastLive"
  | "byGuardNum"
  | "byGuardChange"
  | "byGovernor"
  | "byAdmiral"
  | "byCaptain";

const defaultFormatValue = (value: number) => value;

const formatRelativeTime = (value: number) =>
  timeFormatUtils.formatRelativeTime(value);

interface ConditionConfig {
  label: string;
  selector: (info: Info) => number | undefined;
  formatValue: (value: number) => number | string;
}

export const conditionConfig = {
  byFollower: {
    label: "关注",
    selector: (info: Info) => info.follower,
    formatValue: defaultFormatValue,
  },
  byVideo: {
    label: "视频",
    selector: (info: Info) => info.video,
    formatValue: defaultFormatValue,
  },
  byRise: {
    label: "关注变化",
    selector: (info: Info) => info.rise,
    formatValue: defaultFormatValue,
  },
  byLastLive: {
    label: "上次直播",
    selector: (info: Info) =>
      "time" in info.lastLive ? info.lastLive.time : undefined,
    formatValue: formatRelativeTime,
  },
  byGuardNum: {
    label: "舰团",
    selector: (info: Info) => info.guardNum,
    formatValue: defaultFormatValue,
  },
  byGuardChange: {
    label: "舰团变化",
    selector: (info: Info) => info.guardChange,
    formatValue: defaultFormatValue,
  },
  byGovernor: {
    label: "总督",
    selector: (info: Info) => info.guardType[0],
    formatValue: defaultFormatValue,
  },
  byAdmiral: {
    label: "提督",
    selector: (info: Info) => info.guardType[1],
    formatValue: defaultFormatValue,
  },
  byCaptain: {
    label: "舰长",
    selector: (info: Info) => info.guardType[2],
    formatValue: defaultFormatValue,
  },
} as const satisfies Record<ConditionKey, ConditionConfig>;

const items = (Object.keys(conditionConfig) as ConditionKey[]).map((key) => ({
  label: conditionConfig[key].label,
  value: key,
}));

export default function ConditionSelector() {
  const { condition, changeCondition } = useRankStore(
    useShallow(({ condition, changeCondition }) => ({
      condition,
      changeCondition,
    })),
  );

  return (
    <Field>
      <FieldLabel>排序条件（仅降序</FieldLabel>
      <Select
        items={items}
        value={condition}
        onValueChange={(value) => changeCondition(value)}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectPopup alignItemWithTrigger={false}>
          {items.map(({ label, value }) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectPopup>
      </Select>
    </Field>
  );
}
