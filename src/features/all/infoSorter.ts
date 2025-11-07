import { Info } from "@/apis/vtbs/info";

// 排序条件类型：接受Info对象返回number的函数
type SortCondition = (info: Info) => number | null | undefined;

/**
 * 多条件降序排序函数
 * @param data 要排序的数据数组
 * @param conditions 排序条件数组，按优先级顺序
 * @param limit 可选，返回结果数量的限制
 * @returns 排序后的新数组
 */
export function multiConditionSortDescending(
  data: Info[],
  conditions: SortCondition[],
  limit?: number,
): Info[] {
  if (!conditions.length) {
    return limit ? data.slice(0, limit) : data.slice();
  }

  // 使用原生sort方法
  const sorted = data.slice().sort((a, b) => {
    for (const getValue of conditions) {
      const valueA = getValue(a);
      const valueB = getValue(b);

      // 处理空值
      if (valueA == null && valueB == null) continue;
      if (valueA == null) return 1; // null排后面
      if (valueB == null) return -1; // null排前面

      if (typeof valueA === "number" && typeof valueB === "number") {
        if (valueA !== valueB) {
          // 降序：大的值排在前面
          return valueB - valueA;
        }
      }
    }
    return 0;
  });

  return limit ? sorted.slice(0, limit) : sorted;
}
