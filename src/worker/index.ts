import Bull from 'bull';

import { prisma } from './db.js';  // TODO: share this with the server?
import scrapePage, { countTokens, createEmbeddings } from './services/process.js';

const processQueue = new Bull('process', process.env.REDIS_URL! );

console.log('Worker started');

void processQueue.process(1, async (job) => {
    const j = JSON.parse(job.data as string) as { id: string, type: string };
    const entity = await prisma.info_entity.findUnique({
        where: {
            id: j.id,
        },
    });
    if(!entity) {
        return Promise.reject(new Error('Entity not found'));
    }
    if(j.type === 'count') {
        console.log('Processing entity', entity);
        let text = entity.data;
        const tt: { data?: string } = {};
        if(entity.type === 'url') {
            text = await scrapePage(entity.data);
            tt.data = text;
        }
        const tokens = countTokens(text);
        await prisma.info_entity.update({
            where: {
                id: j.id,
            },
            data: {
                ...tt,
                tokens,
            },
        });
        return Promise.resolve();
    }
    // createEmbeddings
    const resp = await createEmbeddings(entity.data);
    console.log(resp);
    if(resp) {
        return Promise.resolve();
    }
    return Promise.reject(new Error('Failed to process entity'));
});