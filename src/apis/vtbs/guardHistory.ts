import { InferInput, object, number, array } from "valibot";
import { vtbsApiClient } from "../clients";
import { safeParseInputAgainstSchema } from "@/utils";

const guardHistorySchema = array(
  object({
    guardNum: number(),
    time: number(),
  }),
);

type GuardHistory = InferInput<typeof guardHistorySchema>;

export async function getGuardHistory(id: number): Promise<GuardHistory> {
  const res = await vtbsApiClient.get(`v2/bulkGuard/${id}`).json();
  return safeParseInputAgainstSchema<GuardHistory>(guardHistorySchema, res);
}
