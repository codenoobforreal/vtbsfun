import { InferInput, object, number, array } from "valibot";
import { vtbsApiClient } from "../clients";
import { safeParseInputAgainstSchema } from "@/utils";

const followHistorySchema = array(
  object({
    archiveView: number(),
    follower: number(),
    time: number(),
  }),
);

type FollowHistory = InferInput<typeof followHistorySchema>;

export async function getFollowHistory(id: number): Promise<FollowHistory> {
  const res = await vtbsApiClient.get(`v2/bulkActive/${id}`).json();
  return safeParseInputAgainstSchema<FollowHistory>(followHistorySchema, res);
}
