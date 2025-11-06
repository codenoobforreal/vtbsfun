import { DEFAULT_RANK_CONDITION, DEFAULT_RANK_LIMIT } from "@/constants";
import { ConditionKey } from "@/features/all/components/ConditionSelector";
import { create } from "zustand";

interface RankState {
  search: string;
  limit: number;
  condition: ConditionKey;
  changeSearch: (search: string) => void;
  changeLimit: (limit: number) => void;
  changeCondition: (condition: ConditionKey) => void;
}

export const useRankStore = create<RankState>()((set) => ({
  search: "",
  limit: DEFAULT_RANK_LIMIT,
  condition: DEFAULT_RANK_CONDITION,
  changeSearch: (search) => set(() => ({ search })),
  changeLimit: (limit) => set(() => ({ limit })),
  changeCondition: (condition) => set(() => ({ condition })),
}));
