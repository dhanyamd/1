import { z } from 'zod';
import {generateText} from "ai"
import { baseProcedure, createTRPCRouter, premiumProcedure, protectedProcedure } from '../init';
import prisma from '@/lib/db';
import { inngest } from '@/inngest/client';
import { google } from '@ai-sdk/google'
import { workflowsRouter } from '@/features/workflows/server/route';
import { PAGINATION } from '@/config/constants';

export const appRouter = createTRPCRouter({
  workflows: workflowsRouter,
  testAi: premiumProcedure.mutation(async () => {
    await inngest.send({
      name: "execute/ai"
    });
    return {success: true, message: "job queued"}
  }),
  // Get all workflows for the authenticated user
  getWorkflows: protectedProcedure
    .input(
      z.object({
        page: z.number().default(PAGINATION.DEFAULT_PAGE),
        pageSize: z
          .number()
          .min(PAGINATION.MIN_PAGE_SIZE)
          .max(PAGINATION.MAX_PAGE_SIZE)
          .default(PAGINATION.DEFAULT_PAGE_SIZE),
        search: z.string().default(""),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, pageSize, search } = input;
      const [items, totalCount] = await Promise.all([
        prisma.workflow.findMany({
          skip: (page -1)*pageSize,
          take: pageSize,
          where: {
            userId: ctx.user.id,
            name: {
              contains: search,
              mode: "insensitive"
            }
          },
          orderBy: {
            updatedAt: "desc" 
          }
        }),

        prisma.workflow.count({
          where: {
            userId: ctx.user.id,
            name: {
              contains: search,
              mode: "insensitive"
            }
          },
        }),
      ]);
      const totalPages = Math.ceil(totalCount /pageSize)
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;
      return { items: items, page, pageSize, totalCount, totalPages, hasNextPage, hasPreviousPage };
    }),

  // Create a new workflow (requires authentication)
  createWorkflow: premiumProcedure
    .input(z.object({
      name: z.string().min(1, "Workflow name is required").max(100, "Name too long")
    }))
    .mutation(async ({ ctx, input }) => {
      return prisma.workflow.create({
        data: {
          name: input.name,
          userId: ctx.user.id // Associate with the authenticated user
        }
      });
    }),

  // Get a specific workflow by ID (requires authentication and ownership)
  getWorkflow: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const workflow = await prisma.workflow.findFirst({
        where: {
          id: input.id,
          userId: ctx.user.id // Ensure user owns the workflow
        }
      });

      if (!workflow) {
        throw new Error('Workflow not found');
      }

      return workflow;
    }),

  // Update a workflow (requires authentication and ownership)
  updateWorkflow: protectedProcedure
    .input(z.object({
      id: z.string(),
      name: z.string().min(1).max(100).optional()
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;

      // First check if the workflow exists and belongs to the user
      const existingWorkflow = await prisma.workflow.findFirst({
        where: {
          id,
          userId: ctx.user.id
        }
      });

      if (!existingWorkflow) {
        throw new Error('Workflow not found');
      }

      return prisma.workflow.update({
        where: { id },
        data: updateData
      });
    }),

  // Delete a workflow (requires authentication and ownership)
  deleteWorkflow: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // First check if the workflow exists and belongs to the user
      const existingWorkflow = await prisma.workflow.findFirst({
        where: {
          id: input.id,
          userId: ctx.user.id
        }
      });

      if (!existingWorkflow) {
        throw new Error('Workflow not found');
      }

      return prisma.workflow.delete({
        where: { id: input.id, userId: ctx.user.id }
      });
    }),
});

export type AppRouter = typeof appRouter;