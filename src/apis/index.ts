import ky from "ky";

/** https://api.vtbs.moe */
export const vtbsApiClient = ky.create({
  prefixUrl: "https://api.vtbs.moe/",
  retry: {
    limit: 0,
  },
  referrerPolicy: "no-referrer",
  timeout: false,
});
