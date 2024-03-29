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
import sendTicketNotification from "~/utils/mailer";

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
            const usage = await ctx.prisma.public_users.findUnique({
                where: {
                    id: ctx.session.user.id,
                },
            });
            const entity = await ctx.prisma.info_entity.findUnique({
                where: {
                    id: input.entity,
                },
            });
            if (!entity) {
                return {
                    message: "entity_not_found",
                };
            }
            if (entity.processed === 1) {
                return {
                    message: "already_processed",
                };
            }
            if( Number(usage?.usage) + Number(entity.tokens) > Number(usage?.max_usage)) {
                return {
                    message: "usage_limit_exceeded",
                };
            }

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
            await ctx.prisma.public_users.update({
                where: {
                    id: ctx.session.user.id,
                },
                data: {
                    usage: {
                        increment: Math.floor(Number(entity.tokens)),
                    },
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
            const numberOfEntities = await ctx.prisma.info_entity.count({
                where: {
                    bubble_info_entity_bubbleTobubble: {
                        owner: ctx.session.user.id
                    },
                },
            });
            
            const maxx = await ctx.prisma.public_users.findUnique({
                where: {
                    id: ctx.session.user.id,
                }
            });
            // maxx.
            if (numberOfEntities >= (maxx?.max_entities || 0)) {
                return {
                    message: "max_entities",
                    data: null,
                };
            }
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
            fingerprint: z.string().optional(),
        })
    ).mutation(async ({ input, ctx }) => {
        const bubble = await ctx.prisma.bubble.findUnique({
            where: {
                id: input.bubble_id,
            },
        });
        console.log(bubble);

        // count sum of tokens across processed documents plus current usage of the owner and compare it to max_usage
        // if it's over, return error
        // if it's under, continue

        
        
        if(!bubble || input.messages.length === 0) {
            console.log("no messages");
            
            return {
                message: "failed",
                data: null,
            };
        }
        const usage = await ctx.prisma.info_entity.aggregate({
            where: {
                processed: 2,
                bubble_info_entity_bubbleTobubble: {
                    owner: bubble.owner,
                }
            },
            _sum: {
                tokens: true,
            },
        });
        console.log(usage);
        const previousUsage = await ctx.prisma.public_users.findUnique({
            where: {
                id: bubble.owner ? bubble.owner : "",
            },
            select: {
                usage: true,
                max_usage: true,
            },
        });
        console.log(previousUsage);
        if(Number(usage._sum.tokens) + input.messages[input.messages.length - 1]!.content.length/4 + (Number(previousUsage?.usage) || 0) > Number(previousUsage?.max_usage)) {
            console.log("over usage");
            return {
                message: "over_usage",
                data: null,
            };
        }
        await ctx.prisma.public_users.update({
            where: {
                id: bubble.owner ? bubble.owner : "",
            },
            data: {
                usage: Math.floor(Number(usage._sum.tokens) + input.messages[input.messages.length - 1]!.content.length/4 + (Number(previousUsage?.usage) || 0)),
            },
        });
        if(input.fingerprint){
            let chat = await ctx.prisma.chat.findUnique({
                where: {
                    fingerprint: input.fingerprint || "",
                },
            });
            if(!chat) {
                chat = await ctx.prisma.chat.create({
                    data: {
                        fingerprint: input.fingerprint,
                        bubble: bubble.id,
                    },
                });
            }
            await ctx.prisma.message.create({
                data: {
                    chat: chat.fingerprint,
                    content: input.messages[input.messages.length - 1]!.content,
                    sender: input.messages[input.messages.length - 1]!.role,
                },
            })
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
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
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
            const content = `You are an AI assistant providing helpful advice. You are given the following extracted parts of a long document and a question. Provide a conversational answer based on the context provided.
            You should only provide hyperlinks that reference the context below. Do NOT make up hyperlinks.
            Your name is ${bubble.name} and your description is ${bubble.description}.
            If you can't find the answer in the context below, just say "Hmm, I'm not sure." Don't try to make up an answer.
            If the question is not related to the context or description, politely respond that you are tuned to only answer questions that are related to the context.
            Answer in Markdown.
            Use the following context without explicitly mentioning it:
            ${documents.map((doc) => doc.content).join("\n")}`;
            if(Number(usage._sum.tokens) + content.length/4 + (Number(previousUsage?.usage) || 0) > Number(previousUsage?.max_usage)) {
                console.log("over usage");
                return {
                    message: "over_usage",
                    data: null,
                };
            }
            const resp = await aiClient.createChatCompletion({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: ChatCompletionRequestMessageRoleEnum.System,
                        content,
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
            await ctx.prisma.public_users.update({
                where: {
                    id: bubble.owner ? bubble.owner : "",
                },
                data: {
                    usage: {
                        increment: Math.floor(content.length/4),
                    },
                },
            });
            if(input.fingerprint && message){
                await ctx.prisma.message.create({
                    data: {
                        chat: input.fingerprint,
                        content: message.content,
                        sender: ChatCompletionRequestMessageRoleEnum.System,
                    },
                })
            }
            
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

    raiseTicket: publicProcedure.input(z.object({
        bubble_id: z.string(),
        message: z.string(),
        email: z.string().email(),
        fingerprint: z.string().optional(),
    })).mutation(async ({ input, ctx }) => {
        const bubble = await ctx.prisma.bubble.findUnique({
            where: {
                id: input.bubble_id,
            },
        });
        if(!bubble) {
            return {
                message: "failed",
                data: null,
            };
        }
        const ticket = await ctx.prisma.ticket.create({
            data: {
                bubble: bubble.id,
                message: input.message,
                email: input.email,
                chat: input.fingerprint,
            },
        });
        const t: Ticket = {
            ...ticket,
            id: Number(ticket.id),
            created_at: ticket.created_at ? ticket.created_at.toISOString() : "",
            chat: ticket.chat ? ticket.chat : "",
        }
        await sendTicketNotification(t, bubble.ticket_email ? bubble.ticket_email : "");
        return {
            message: "success",
            data: {
                ticket,
            },
        };
    }),

});
