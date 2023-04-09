import Bull from "bull";
import { env } from "~/env.mjs";

// eslint-disable-next-line
const processQueue = new Bull("process", env.EDIS_URL);
console.log(env.EDIS_URL);
export default processQueue;
