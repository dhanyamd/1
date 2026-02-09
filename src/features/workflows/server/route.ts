import prisma from "@/lib/db";
import {
  createTRPCRouter,
  premiumProcedure,
  protectedProcedure,
} from "@/trpc/init";
import {
  uniqueNamesGenerator,
  adjectives,
  animals,
} from "unique-names-generator";

export const workflowsRouter = createTRPCRouter({
  create: premiumProcedure.mutation(({ ctx }) => {
    const uniqueName = uniqueNamesGenerator({
      dictionaries: [adjectives, animals],
      separator: "-",
      style: "lowerCase",
    });

    return prisma.workflow.create({
      data: {
        name: uniqueName,
        userId: ctx.user.id,
      },
    });
  }),
});