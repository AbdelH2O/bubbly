import { Configuration, OpenAIApi } from "openai";
// import { env } from "./env.js";
// console.log(env);


// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY as string });

const aiClient = new OpenAIApi(configuration);

export default aiClient;