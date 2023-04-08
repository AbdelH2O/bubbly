import { z } from "zod";

import {
    createTRPCRouter,
    publicProcedure,
    protectedProcedure,
} from "~/server/api/trpc";

import processQueue from "~/utils/redisClient";

export const resourceRouter = createTRPCRouter({
    process: protectedProcedure
        .input(z.object({ entity: z.string(), type: z.string() }))
        .mutation(async ({ input, ctx }) => {
            // eslint-disable-next-line
            const response = await processQueue.add({
                id: input.entity,
                type: input.type,
            });
            const change = await ctx.prisma.info_entity.update({
                where: {
                    id: input.entity,
                },
                data: {
                    processed: 1,
                },
            });
            if(response && change.processed === 1) {
                return {
                    message: "success",
                };
            }
            return {
                message: "failed",
            };
        }),
});
