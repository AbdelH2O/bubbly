import aiClient from "../openAI";
import {
    RecursiveCharacterTextSplitter,
    // SpacyTextSplitter
} from 'langchain/text_splitter';

import {
    TextLoader,

} from 'langchain/document_loaders';
import GPT3Tokenizer from 'gpt3-tokenizer';

const scrapePage = async (url: string) => {
    const response = await fetch(url);
    const html = await response.text();
    return html;
}

const CHUNK_SIZE = 5000;
const SLICE_SIZE = 100;

export const countTokens = (text: string) => {
    const tokenizer = new GPT3Tokenizer({ type: 'gpt3' });
    const tokens = tokenizer.encode(text);
    return tokens.bpe.length;
}

export const createEmbeddings = async (text: string) => {
    // const loader = new TextLoader(text);
    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: CHUNK_SIZE,
        chunkOverlap: CHUNK_SIZE / 5,
    });
    // const chunks = textSplitter.split(text);
    // aiClient.
}

export default scrapePage;
