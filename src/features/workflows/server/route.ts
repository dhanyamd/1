import prisma from "@/lib/db";
import {
  createTRPCRouter,
  premiumProcedure,
} from "@/trpc/init";
import {
  uniqueNamesGenerator,
  adjectives,
  animals,
} from "unique-names-generator";
import { NodeType } from "@/generated/prisma/client";

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
        // Create an initial node so the editor has something to render
        nodes: {
          create: {
            type: NodeType.INITIAL,
            position: { x: 0, y: 0 },
            name: NodeType.INITIAL,
          },
        },
      },
    });
  }),
});