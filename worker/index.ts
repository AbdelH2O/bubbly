import * as dotenv from 'dotenv';
dotenv.config();

import Bull from 'bull';

import { prisma } from './db.js';  // TODO: share this with the server?
import scrapePage, { countTokens, createEmbeddings } from './services/process.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
const processQueue = new Bull('process', {
    settings: {
        stalledInterval: 3000, // How often check for stalled jobs (use 0 for never checking).
        guardInterval: 2000, // Poll interval for delayed jobs and added jobs.
        drainDelay: 300 // A timeout for when the queue is in drained state (empty waiting for jobs).
    },
    redis: process.env.EDIS_URL,
});
console.log(process.env.EDIS_URL);

console.log('Worker started');

void processQueue.process(async (job, done) => {
    // console.log(job);
    
    const j = job.data as { id: string, type: string };
    const entity = await prisma.info_entity.findUnique({
        where: {
            id: j.id,
        },
    });
    if(!entity) {
        return done(new Error('Entity not found'));
        // return Promise.reject(new Error('Entity not found'));
    }
    if(j.type === 'count') {
        console.log('Processing entity', entity);
        let text = entity.data;
        const tt: { data?: string } = {};
        if(entity.type === 'URL' && entity.url) {
            text = await scrapePage(entity.url);
            tt.data = text;
        }
        const tokens = countTokens(text);
        console.log('Tokens', tokens);
        await prisma.info_entity.update({
            where: {
                id: j.id,
            },
            data: {
                ...tt,
                tokens,
            },
        });
        return done();
        // return Promise.resolve();
    }
    // createEmbeddings
    const resp = await createEmbeddings(entity.data, entity.id, entity.bubble);
    console.log(resp);
    if(resp) {
        await prisma.info_entity.update({
            where: {
                id: j.id,
            },
            data: {
                processed: 2,
            },
        });
        // return Promise.resolve();
        return done();
    }
    // return Promise.reject(new Error('Failed to process entity'));
    return done(new Error('Failed to process entity'));
});

// processQueue.on('completed', (job, result: string) => {
//     console.log(`Job completed with result ${result}`);
// });

// processQueue.on('failed', (job, err) => {
//     console.log(`Job failed with reason ${err.message}`);
// });

// processQueue.on('error', (err) => {
//     console.log(`Queue error: ${err.message}`);
// });

// processQueue.on('stalled', (job) => {
//     console.log(`Job stalled: ${job.id}`);
// });

// processQueue.on('waiting', (jobId) => {
//     console.log(`Job waiting: ${jobId}`);
// });

// processQueue.on('active', (job, jobPromise: string) => {
//     console.log(`Job active: ${job.id}, ${jobPromise}`);
// })

// processQueue.on('stalled-check', (job: { id: string }, lastMoveAt: string) => {
//     console.log(`Job stalled-check: ${job.id}, ${lastMoveAt}`);
// });