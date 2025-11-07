import { object, number, array, parse } from "valibot";
import { vtbsApiClient } from "../clients";

const guardHistorySchema = array(
  object({
    guardNum: number(),
    time: number(),
  }),
);

export async function getGuardHistory(id: number) {
  const res = await vtbsApiClient.get(`v2/bulkGuard/${id}`).json();
  return parse(guardHistorySchema, res);
}
