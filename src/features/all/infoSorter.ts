import { Info } from "@/apis/vtbs/info";

// 排序条件类型：接受Info对象返回number的函数
export type SortCondition = (info: Info) => number;

/**
 * 多条件降序排序工具类
 */
export class MultiConditionSorter {
  /**
   * 多条件降序排序
   * @param data 待排序的数据数组
   * @param conditions 排序条件函数数组，按优先级顺序排列
   * @param limit 限制输出数量，不传或0表示返回全部
   * @returns 排序后的数据
   */
  static sortDescending(
    data: Info[],
    conditions: SortCondition[],
    limit?: number,
  ): Info[] {
    if (!data.length || !conditions.length) {
      return limit ? data.slice(0, limit) : data;
    }

    // 创建副本以避免修改原数组
    const sortedData = [...data];

    sortedData.sort((a, b) => {
      for (const getValue of conditions) {
        const valueA = getValue(a) || 0;
        const valueB = getValue(b) || 0;

        // 降序排序：如果b的值大于a的值，返回正数，b排在a前面
        if (valueB > valueA) {
          return 1;
        }
        if (valueB < valueA) {
          return -1;
        }
        // 如果相等，继续下一个排序条件
      }
      return 0;
    });

    return limit ? sortedData.slice(0, limit) : data;
  }

  /**
   * 快速排序方法 - 适用于大数据量
   */
  static quickSortDescending(
    data: Info[],
    conditions: SortCondition[],
    limit?: number,
  ): Info[] {
    if (data.length <= 1 || !conditions.length) {
      return limit ? data.slice(0, limit) : data;
    }

    const pivotIndex = Math.floor(data.length / 2);
    const pivot = data[pivotIndex];
    const left: Info[] = [];
    const right: Info[] = [];

    for (let i = 0; i < data.length; i++) {
      if (i === pivotIndex) continue;

      const comparison = this.compareItems(data[i], pivot, conditions);
      if (comparison >= 0) {
        left.push(data[i]);
      } else {
        right.push(data[i]);
      }
    }

    const sortedLeft = this.quickSortDescending(left, conditions);
    const sortedRight = this.quickSortDescending(right, conditions);
    const result = [...sortedLeft, pivot, ...sortedRight];

    return limit ? result.slice(0, limit) : result;
  }

  /**
   * 比较两个对象的多个字段
   */
  private static compareItems(
    a: Info,
    b: Info,
    conditions: SortCondition[],
  ): number {
    for (const getValue of conditions) {
      const valueA = getValue(a) || 0;
      const valueB = getValue(b) || 0;

      if (valueB > valueA) return 1;
      if (valueB < valueA) return -1;
    }
    return 0;
  }
}

// // 示例1：按follower降序，然后按rise降序
// const sorted1 = MultiConditionSorter.sortDescending(
//   data,
//   [
//     (info: Info) => info.follower, // 第一优先级：粉丝数
//     (info: Info) => info.rise, // 第二优先级：增长数
//   ],
//   10, // 限制10条
// );

// // 示例2：按guardType的第一个元素降序，然后按online降序
// const sorted2 = MultiConditionSorter.sortDescending(data, [
//   (info: Info) => info.guardType[0] || 0, // guardType数组的第一个元素
//   (info: Info) => info.online, // 在线人数
// ]);

// // 示例3：复杂条件 - 按lastLive.time降序，然后按archiveView降序
// const sorted3 = MultiConditionSorter.sortDescending(data, [
//   (info: Info) => info.lastLive.time, // 最后直播时间
//   (info: Info) => info.archiveView, // 归档查看数
// ]);

// // 示例4：使用快速排序处理大数据量
// const sorted4 = MultiConditionSorter.quickSortDescending(
//   data,
//   [(info: Info) => info.follower, (info: Info) => info.recordNum],
//   100,
// );
