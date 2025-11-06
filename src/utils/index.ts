import { openUrl } from "@tauri-apps/plugin-opener";
import { Duration, isWithinInterval, sub } from "date-fns";

/** 使用默认浏览器打开 url */
export async function openUrlWithDefaultBrower(url: string) {
  await openUrl(url);
}

/**
 * 获取URL的协议和域名部分（协议://域名）
 * @param urlString 要解析的URL字符串
 * @returns 协议和域名组成的字符串，如果URL无效则返回null
 */
export function getProtocolAndDomain(urlString: string): string | null {
  try {
    const url = new URL(urlString);
    return `${url.protocol}//${url.hostname}`;
  } catch (error) {
    console.error("无效的URL:", error);
    return null;
  }
}

/**
 * 将大数字转换为短格式的带单位字符串（只支持万和亿单位）
 * @param value 要转换的数字
 * @param decimalPlaces 保留的小数位数，默认为1位
 * @returns 格式化后的字符串，如"10万", "150万", "1.5亿"等
 */
export function formatLargeNumber(
  value: number,
  decimalPlaces: number = 1,
): string {
  if (value === null || value === undefined || isNaN(value)) {
    return "";
  }

  // 处理负数
  if (value < 0) {
    return `-${formatLargeNumber(-value, decimalPlaces)}`;
  }

  // 万以下的数字直接返回原始数字
  if (value < 10000) {
    return value.toString();
  }

  // 亿以上的数字使用亿单位
  if (value >= 100000000) {
    const hundredMillionsValue = value / 100000000;
    let formattedNumber: string;

    if (Number.isInteger(hundredMillionsValue)) {
      formattedNumber = hundredMillionsValue.toFixed(0);
    } else {
      formattedNumber = hundredMillionsValue.toFixed(decimalPlaces);
      // 移除尾随的零和小数点（如果不需要）
      formattedNumber = formattedNumber.replace(/\.?0+$/, "");
    }

    return `${formattedNumber}亿`;
  }

  // 万到亿之间的数字使用万单位
  const tenThousandsValue = value / 10000;
  let formattedNumber: string;

  if (Number.isInteger(tenThousandsValue)) {
    formattedNumber = tenThousandsValue.toFixed(0);
  } else {
    formattedNumber = tenThousandsValue.toFixed(decimalPlaces);
    formattedNumber = formattedNumber.replace(/\.?0+$/, "");
  }

  return `${formattedNumber}万`;
}

interface SamplingConfig {
  /** 时间戳字段名，如 'time' */
  timeField: string;
  /** 时间范围，如 '7d'（7天）、'1y'（1年）；不填写则选择全部数据 */
  timeRange?: Duration;
  /** 最大数据点数 */
  maxDataPoints: number;
  /** 参考日期（默认为数据最新时间） */
  referenceDate?: Date;
  /** 确保包含首尾时间点 */
  ensureEndpoints?: boolean;
}

export interface DataPoint {
  [key: string]: unknown;
}

export function sampleTimeSeriesData(
  data: DataPoint[],
  config: SamplingConfig,
): DataPoint[] {
  const {
    timeField,
    timeRange,
    maxDataPoints,
    referenceDate,
    ensureEndpoints = true,
  } = config;

  if (!data || data.length === 0) return [];
  if (maxDataPoints <= 0) throw new Error("maxDataPoints必须为正整数");
  if (ensureEndpoints && maxDataPoints < 2) {
    throw new Error("当ensureEndpoints为true时，maxDataPoints至少为2");
  }

  // 排序数据
  const sortedData = [...data].sort(
    (a, b) => (a[timeField] as number) - (b[timeField] as number),
  );

  let startTime: number;
  let endTime: number;
  let filteredData: DataPoint[];

  // 数据过滤（如果指定了timeRange）
  if (timeRange) {
    endTime = referenceDate
      ? referenceDate.getTime()
      : (sortedData[sortedData.length - 1][timeField] as number);

    const endDate = new Date(endTime);
    const startDate = sub(endDate, timeRange);
    startTime = startDate.getTime();

    filteredData = sortedData.filter((point) => {
      const pointDate = new Date(point[timeField] as number);
      return isWithinInterval(pointDate, {
        start: startDate,
        end: endDate,
      });
    });
  } else {
    // 未指定timeRange，使用全部数据
    startTime = sortedData[0][timeField] as number;
    endTime = sortedData[sortedData.length - 1][timeField] as number;
    filteredData = sortedData;
  }

  if (filteredData.length <= maxDataPoints) {
    return filteredData;
  }

  // 包含端点
  const endpoints: DataPoint[] = [];
  if (ensureEndpoints) {
    const startPoint = findClosestPoint(filteredData, timeField, startTime);
    const endPoint = findClosestPoint(filteredData, timeField, endTime);

    if (startPoint) endpoints.push(startPoint);
    if (endPoint && endPoint !== startPoint) endpoints.push(endPoint);
  }

  const remainingPoints = maxDataPoints - endpoints.length;
  if (remainingPoints <= 0) return endpoints;

  // 对中间点进行抽样
  const middleData = filteredData.filter((point) => !endpoints.includes(point));

  if (middleData.length <= remainingPoints) {
    return [...endpoints, ...middleData].sort(
      (a, b) => (a[timeField] as number) - (b[timeField] as number),
    );
  }

  const sampledMiddlePoints = sampleEvenly(
    middleData,
    timeField,
    remainingPoints,
    startTime,
    endTime,
  );

  const result = [...endpoints, ...sampledMiddlePoints];
  return result.sort(
    (a, b) => (a[timeField] as number) - (b[timeField] as number),
  );
}

/**
 * 使用 date-fns 优化查找最近点
 */
function findClosestPoint(
  data: DataPoint[],
  timeField: string,
  targetTime: number,
): DataPoint | null {
  if (data.length === 0) return null;

  // const targetDate = new Date(targetTime);
  return data.reduce((closest, point) => {
    const currentDate = new Date(point[timeField] as number);
    const currentDiff = Math.abs(currentDate.getTime() - targetTime);
    const closestDiff = Math.abs(
      new Date(closest[timeField] as number).getTime() - targetTime,
    );

    return currentDiff < closestDiff ? point : closest;
  });
}

/**
 * 优化后的等间隔抽样
 */
function sampleEvenly(
  data: DataPoint[],
  timeField: string,
  maxPoints: number,
  startTime: number,
  endTime: number,
): DataPoint[] {
  if (data.length <= maxPoints) return data;

  const sampled: DataPoint[] = [];
  const timeInterval = (endTime - startTime) / (maxPoints + 1);

  for (let i = 1; i <= maxPoints; i++) {
    const targetTime = startTime + i * timeInterval;
    const closest = findClosestPoint(data, timeField, targetTime);
    if (closest && !sampled.includes(closest)) {
      sampled.push(closest);
    }
  }

  return sampled;
}
