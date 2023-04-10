import aiClient from "../openAIclient.js";
import {
    RecursiveCharacterTextSplitter,
    // SpacyTextSplitter
} from "langchain/text_splitter";
import { supabase } from "../db.js";

import { TextLoader } from "langchain/document_loaders";
// import {  } from "gpt3-tokenizer";
import { encode } from "gpt-3-encoder";
// import statement for puppeteer
import puppeteer from "puppeteer";
// import { load } from "cheerio"; "cheerio";

const scrapePage = async (url: string) => {
    // scrape page for text using puppeteer in a headless browser and cheerio
    const browser = await puppeteer.launch({ headless: true});
    const page = await browser.newPage();
    await page.goto(url);

    const text = await page.evaluate(() => {
        return document.body.innerText;
    });
    await browser.close();
    return text;
};

const CHUNK_SIZE = 500;
const SLICE_SIZE = 100;

export const countTokens = (text: string) => {
    // const tokenizer = new GPT3Tokenizer({ type: "gpt3" });
    // const tokens = tokenizer.encode(text);
    // return tokens.bpe.length;
    const tokens = encode(text);
    return tokens.length;
};

export const createEmbeddings = async (text: string, entity: string, bubble: string) => {
    const loader = new TextLoader(new Blob([text]));
    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: CHUNK_SIZE,
        chunkOverlap: CHUNK_SIZE / 5,
    });
    const rawDocs = await loader.load();
    const docs = await textSplitter.splitDocuments(rawDocs);
    const chunks = [];

    // split docs into chunks of SLICE_SIZE tokens
    for (let i = 0; i < docs.length; i += SLICE_SIZE) {
        chunks.push(docs.slice(i, i + SLICE_SIZE));
    }

    for (const chunk of chunks) {
        const input = chunk
            .map((doc) => doc.pageContent)
            .join(" ")
            .replace(/\n/g, " ");
        const embeddingResp = await aiClient.createEmbedding({
            input,
            model: "text-embedding-ada-002",
        });
        // console.log(embeddingResp.data.data);

        const embedding = embeddingResp.data.data
            ? embeddingResp.data.data[0]?.embedding
            : null;
        if (embedding) {
            console.log(embedding);
            const resp = await supabase.from("embeddings").insert({
                content: input,
                embedding,
                entity,
                bubble
            });
            console.log(resp);
        }
    }
    return true;
    // const chunks = textSplitter.split(text);
    // aiClient.
};

export default scrapePage;
