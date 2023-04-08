import Bull from "bull";
import { env } from "~/env.mjs";

// eslint-disable-next-line
const processQueue = new Bull("process", env.REDIS_URL);

export default processQueue;
