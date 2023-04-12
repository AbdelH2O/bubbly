import { z } from "zod";

import {
    createTRPCRouter,
    publicProcedure,
    protectedProcedure,
} from "~/server/api/trpc";

import processQueue from "~/utils/redisClient";
import aiClient from "~/utils/openAIclient";
import uSBClient from "~/utils/utilitySupabase";
import { ChatCompletionRequestMessageRoleEnum } from "openai/dist/api";

// const CONDENSE_PROMPT = (history: string[], question: string) => {
//     return `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.

//     Chat History:
//     ${history.join("\n")}
//     Follow Up Input: ${question}
//     Standalone question:`
// };

// const QA_PROMPT = (context: string[], question: string) => {
//     return `You are an AI assistant providing helpful advice. You are given the following extracted parts of a long document and a question. Provide a conversational answer based on the context provided.
//     You should only provide hyperlinks that reference the context below. Do NOT make up hyperlinks.
//     If you can't find the answer in the context below, just say "Hmm, I'm not sure." Don't try to make up an answer.
//     If the question is not related to the context, politely respond that you are tuned to only answer questions that are related to the context.
    
//     Question: ${question}
//     =========
//     ${context.join("\n")}
//     =========
//     Answer in Markdown`
// };


export const resourceRouter = createTRPCRouter({
    process: protectedProcedure
        .input(z.object({ entity: z.string(), type: z.string() }))
        .mutation(async ({ input, ctx }) => {
            // eslint-disable-next-line
            const response = await processQueue.add({
                id: input.entity,
                type: "embed",
            });
            // console.log(response);
            const change = await ctx.prisma.info_entity.update({
                where: {
                    id: input.entity,
                },
                data: {
                    processed: 1,
                },
            });
            if (response && change.processed === 1) {
                return {
                    message: "success",
                };
            }
            return {
                message: "failed",
            };
        }),
    createEntity: protectedProcedure.input(
        z.object({
            bubble: z.string(),
            type: z.string(),
            url: z.string().optional(),
            data: z.string(),
        }))
        .mutation(async ({ input, ctx }) => {
            const entity = await ctx.prisma.info_entity.create({
                data: {
                    bubble: input.bubble,
                    type: input.type,
                    url: input.url,
                    data: input.data,
                },
            });
            console.log("entity", entity);
            
            await processQueue.add({
                id: entity.id,
                type: "count",
            });
            if(entity === null) {
                return {
                    message: "failed",
                    data: null,
                };
            }
            console.log('returning now');
            
            return {
                message: "success",
                data: entity,
            };
        }
    ),
    sendMessage: publicProcedure.input(
        z.object({
            messages: z.array(z.object({
                role: z.enum([ChatCompletionRequestMessageRoleEnum.Assistant, ChatCompletionRequestMessageRoleEnum.System, ChatCompletionRequestMessageRoleEnum.User]),
                content: z.string(),
            })).min(1),
            bubble_id: z.string(),
        })
    ).mutation(async ({ input, ctx }) => {
        const bubble = await ctx.prisma.bubble.findUnique({
            where: {
                id: input.bubble_id,
            },
        });
        console.log(bubble);
        
        if(!bubble || input.messages.length === 0) {
            console.log("no messages");
            
            return {
                message: "failed",
                data: null,
            };
        }
        const embeddingResponse = await aiClient.createEmbedding({
            model: 'text-embedding-ada-002',
            input: input.messages[input.messages.length - 1]!.content,
        });
        const embedding = embeddingResponse.data.data
            ? embeddingResponse.data.data[0]?.embedding
            : null;
        if(!embedding) {
            console.log("no embedding");
            return {
                message: "failed",
                data: null,
            };
        }
        // console.log(bubble.id, embedding);
        
        const { data: docs, error } = await uSBClient.rpc('match_documents', {
            query_embedding: embedding,
            similarity_threshold: 0.7, // Choose an appropriate threshold for your data
            match_count: 5, // Choose the number of matches
            bubble_id: bubble.id,
        });
        let documents = docs;
        // console.log(docs);
        // console.log(error);
        if(!documents) {
            console.log("no documents");
            documents = [];
        }
        try {

            const resp = await aiClient.createChatCompletion({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: ChatCompletionRequestMessageRoleEnum.System,
                        content: `You are an AI assistant providing helpful advice. You are given the following extracted parts of a long document and a question. Provide a conversational answer based on the context provided.
                        You should only provide hyperlinks that reference the context below. Do NOT make up hyperlinks.
                        Your name is ${bubble.name} and your description is ${bubble.description}.
                        If you can't find the answer in the context below, just say "Hmm, I'm not sure." Don't try to make up an answer.
                        If the question is not related to the context, politely respond that you are tuned to only answer questions that are related to the context.
                        Answer in Markdown.
                        Use the following context without explicitly mentioning it:
                        ${documents.map((doc) => doc.content).join("\n")}`,
                    },
                    ...input.messages,
                ],
                top_p: 1,
                temperature: 0.5,
    
            });
            if(resp.data.choices.length === 0) {
                console.log("no choices");
                return {
                    message: "failed",
                    data: null,
                };
            }
            const message = resp.data.choices[0]!.message;
            console.log(message);
            
            return {
                message: "success",
                data: {
                    message,
                },
            };
        } catch (err) {
            // const error = err as AxiosError;
            // if (err.response) {
            //     console.log(err.response.status);
            //     console.log(error.response.data);
            //   } else {
            //     console.log(error.message);
            //   }
            return {
                message: "failed",
                data: null,
            };
        // }
        // return {
        //     message: "success",
        //     data: {
        //         message: "Hello",
        //     },
        }

        
        // const resp = await aiClient.createChatCompletion({
        //     model
        // })
    }),
});
