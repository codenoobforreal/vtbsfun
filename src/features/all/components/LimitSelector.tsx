import { Field, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRankStore } from "@/store";
import { useShallow } from "zustand/react/shallow";

const items: { label: string; value: number }[] = [
  { label: "10", value: 10 },
  { label: "20", value: 20 },
  { label: "50", value: 50 },
  { label: "100", value: 100 },
];

export default function LimitSelector() {
  const { limit, changeLimit } = useRankStore(
    useShallow(({ limit, changeLimit }) => ({
      limit,
      changeLimit,
    })),
  );

  return (
    <Field>
      <FieldLabel>展示数量</FieldLabel>
      <Select items={items} value={limit} onValueChange={changeLimit}>
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
