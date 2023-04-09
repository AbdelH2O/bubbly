import Bull from "bull";
import { env } from "~/env.mjs";

const processQueue = new Bull("prc", env.EDIS_URL, {
    // redis: env.EDIS_URL,
});
console.log(env.EDIS_URL);
export default processQueue;
