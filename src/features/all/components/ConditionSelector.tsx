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

interface ConditionConfig {
  label: string;
  selector: (info: Info) => number;
}

const conditionConfig: Record<ConditionKey, ConditionConfig> = {
  byFollower: {
    label: "关注",
    selector: (info: Info) => info.follower,
  },
  byVideo: {
    label: "视频",
    selector: (info: Info) => info.video,
  },
  byRise: {
    label: "关注变化",
    selector: (info: Info) => info.rise,
  },
  byLastLive: {
    label: "上次直播",
    selector: (info: Info) => info.lastLive.time,
  },
  byGuardNum: {
    label: "舰团",
    selector: (info: Info) => info.guardNum,
  },
  byGuardChange: {
    label: "舰团变化",
    selector: (info: Info) => info.guardChange,
  },
  byGovernor: {
    label: "总督",
    selector: (info: Info) => info.guardType[0],
  },
  byAdmiral: {
    label: "提督",
    selector: (info: Info) => info.guardType[1],
  },
  byCaptain: {
    label: "舰长",
    selector: (info: Info) => info.guardType[2],
  },
} as const;

export const conditionToSelectFn = Object.fromEntries(
  Object.entries(conditionConfig).map(([key, config]) => [
    key,
    config.selector,
  ]),
) as Record<ConditionKey, (info: Info) => number>;

export const conditionToLabel = Object.fromEntries(
  Object.entries(conditionConfig).map(([key, config]) => [key, config.label]),
) as Record<ConditionKey, string>;

const items = Object.entries(conditionConfig).map(([value, config]) => ({
  label: config.label,
  value: value as ConditionKey,
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
        onValueChange={(value) =>
          changeCondition(value as keyof typeof conditionToSelectFn)
        }
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
