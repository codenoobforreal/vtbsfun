import {
  format,
  getUnixTime,
  isValid,
  isWithinInterval,
  addDays,
  subDays,
  addMonths,
  addYears,
  differenceInDays,
} from "date-fns";
import { zhCN } from "date-fns/locale";

/**
 * 标准化时间戳输入（处理秒级和毫秒级时间戳）
 */
export function normalizeTimestamp(timestamp: number | string): Date {
  let timestampNum =
    typeof timestamp === "string" ? parseInt(timestamp, 10) : timestamp;

  // 判断是否为秒级时间戳（10位数字）
  if (timestampNum.toString().length === 10) {
    timestampNum *= 1000;
  }

  const date = new Date(timestampNum);
  if (!isValid(date)) {
    throw new Error(`无效的时间戳: ${timestamp}`);
  }
  return date;
}

/**
 * 时间戳格式化基础函数
 */
export function formatTimestamp(
  timestamp: number | string,
  formatStr: string,
): string {
  try {
    const date = normalizeTimestamp(timestamp);
    return format(date, formatStr, { locale: zhCN });
  } catch (error) {
    console.error("时间戳格式化错误:", error);
    return "无效日期";
  }
}

export const timeFormatUtils = {
  /** 格式化为日期（年月日） */
  formatDate: (timestamp: number | string) =>
    formatTimestamp(timestamp, "yyyy-MM-dd"),

  /** 格式化为时间（时分秒） */
  formatTime: (timestamp: number | string) =>
    formatTimestamp(timestamp, "HH:mm:ss"),

  /** 格式化为日期时间（包含毫秒） */
  formatDateTimeWithMs: (timestamp: number | string) =>
    formatTimestamp(timestamp, "yyyy-MM-dd HH:mm:ss.SSS"),

  /** 格式化为中文日期 */
  formatChineseDate: (timestamp: number | string) =>
    formatTimestamp(timestamp, "yyyy年MM月dd日"),

  /** 格式化为简短中文日期 */
  formatShortChineseDate: (timestamp: number | string) =>
    formatTimestamp(timestamp, "yy年MM月dd日"),

  /** 格式化为中文日期时间 */
  formatChineseDateTime: (timestamp: number | string) =>
    formatTimestamp(timestamp, "yyyy年MM月dd日 HH时mm分ss秒"),

  /** 相对时间（例如："3天前"） */
  formatRelativeTime: (timestamp: number | string) => {
    const date = normalizeTimestamp(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffMinutes < 1) {
      return "刚刚"; // 小于1分钟的场景
    }
    if (diffMinutes < 60) {
      return `${diffMinutes}分钟前`;
    }
    if (diffHours < 24) {
      return `${diffHours}小时前`;
    }

    // 原有日历天逻辑（保持不变）
    const diffDays = differenceInDays(now, date);
    if (diffDays === 0) return "今天";
    if (diffDays === 1) return "昨天";
    if (diffDays === 2) return "前天";
    if (diffDays < 7) return `${diffDays}天前`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}周前`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}个月前`;
    return `${Math.floor(diffDays / 365)}年前`;
  },
};

export const dateCalcUtils = {
  /** 添加天数 */
  addDays: (timestamp: number | string, days: number): number => {
    const date = normalizeTimestamp(timestamp);
    return getUnixTime(addDays(date, days));
  },

  /** 减去天数 */
  subDays: (timestamp: number | string, days: number): number => {
    const date = normalizeTimestamp(timestamp);
    return getUnixTime(subDays(date, days));
  },

  /** 添加月份 */
  addMonths: (timestamp: number | string, months: number): number => {
    const date = normalizeTimestamp(timestamp);
    return getUnixTime(addMonths(date, months));
  },

  /** 添加年份 */
  addYears: (timestamp: number | string, years: number): number => {
    const date = normalizeTimestamp(timestamp);
    return getUnixTime(addYears(date, years));
  },

  /** 获取两个日期之间的天数差 */
  getDaysDifference: (
    startTimestamp: number | string,
    endTimestamp: number | string,
  ): number => {
    const startDate = normalizeTimestamp(startTimestamp);
    const endDate = normalizeTimestamp(endTimestamp);
    return differenceInDays(endDate, startDate);
  },

  /** 检查日期是否在范围内 */
  isDateInRange: (
    timestamp: number | string,
    startTimestamp: number | string,
    endTimestamp: number | string,
  ): boolean => {
    const date = normalizeTimestamp(timestamp);
    const startDate = normalizeTimestamp(startTimestamp);
    const endDate = normalizeTimestamp(endTimestamp);

    return isWithinInterval(date, { start: startDate, end: endDate });
  },
};
