import prisma from "@/lib/db";
import { createTRPCRouter, premiumProcedure, protectedProcedure } from "@/trpc/init";

export const workflowsRouter = createTRPCRouter({
    create: premiumProcedure.mutation(({ctx}) => {
        return prisma.workflow.create({
            data: {
                name: "TODO",
                userId: ctx.user.id
            }
        })
    })
})