import { object, number, array, parse } from "valibot";
import { vtbsApiClient } from "../clients";

const followHistorySchema = array(
  object({
    archiveView: number(),
    follower: number(),
    time: number(),
  }),
);

export async function getFollowHistory(id: number) {
  const res = await vtbsApiClient.get(`v2/bulkActive/${id}`).json();
  return parse(followHistorySchema, res);
}
