import { z } from 'zod';
import { baseProcedure, createTRPCRouter, premiumProcedure, protectedProcedure } from '../init';
import prisma from '@/lib/db';
import { inngest } from '@/inngest/client';
import { workflowsRouter } from '@/features/workflows/server/route';
import { PAGINATION } from '@/config/constants';
import { NodeType } from '@/generated/prisma/client';
import type { Node, Edge } from '@xyflow/react';
export const appRouter = createTRPCRouter({
  execute: protectedProcedure
      .input(z.object({id: z.string()})) 
      .mutation(async ({input, ctx}) => {
          const workflow = await prisma.workflow.findUnique({
            where: {
              id: input.id,
              userId: ctx.user.id
            }
          })
          await inngest.send({
            name: "workflows/execute.workflow",
            data: {workflowId: input.id}
          })
          return workflow;
        }),
  workflows: workflowsRouter,
  testAi: premiumProcedure.mutation(async () => {
    await inngest.send({
      name: "execute/ai"
    });
    return { success: true, message: "job queued" }
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
          skip: (page - 1) * pageSize,
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
      const totalPages = Math.ceil(totalCount / pageSize)
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
          userId: ctx.user.id,
          nodes: {
            create: {
              type: NodeType.INITIAL,
              position: { x: 0, y: 0 },
              name: NodeType.INITIAL
            }
          }
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
          userId: ctx.user.id, // Ensure user owns the workflow
        },
        include: { nodes: true, connections: true },
      });

      const dbNodes = workflow?.nodes ?? [];

      // Always return at least one visible node so the editor is never empty.
      const nodes: Node[] =
        dbNodes.length > 0
          ? dbNodes.map((node) => ({
              id: node.id,
              // Use the Prisma node type so it matches our custom nodeTypes map.
              type: node.type as string,
              position: node.position as { x: number; y: number },
              // Pass through any stored data; InitialNode renders its own Plus icon.
              data: (node.data as Record<string, unknown>) || {},
            }))
          : [
              {
                id: "initial",
                type: NodeType.INITIAL,
                position: { x: 0, y: 0 },
                data: {},
              },
            ];

      const edges: Edge[] = workflow?.connections.map((connection) => ({
        id: connection.id,
        source: connection.fromNodeId,
        target: connection.toNodeId,
        sourceHandle: connection.fromOutput,
        targetHandle: connection.toInput
      })) || []

      return {
        id: workflow?.id,
        name: workflow?.name,
        nodes,
        edges
      };
    }),

  // Update a workflow (requires authentication and ownership)
  updateWorkflow: protectedProcedure
    .input(z.object({
      id: z.string(),
      nodes: z.array(
        z.object({
          id: z.string(),
          type: z.string(),
          position: z.object({x: z.number(), y:z.number()}),
          data: z.record(z.string(), z.any()).optional()
        })
      ),
      edges: z.array(
        z.object({
          source: z.string(),
          target: z.string(),
          sourceHandle: z.string().nullish(),
          targetHandle: z.string().nullish()
        })
      )
    }))
    .mutation(async ({ ctx, input }) => {
      const {id, nodes, edges} = input;
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where: {id, userId: ctx.user.id}
      })
      return await prisma.$transaction(async (tx) => {
        await tx.node.deleteMany({
          where: {workflowId: id}
        })
        await tx.node.createMany({
          data: nodes.map((node) => ({
            id: node.id,
            workflowId: id,
            name: node.type || "unknown",
            type: node.type as NodeType,
            position: node.position,
            data: node.data || {}
          }))
        })
        await tx.connection.createMany({
          data: edges.map((edge) => ({
              workflowId: id,
              fromNodeId: edge.source,
              toNodeId: edge.target,
              fromOutput: edge.sourceHandle || "main",
              toInput: edge.targetHandle || "main",
          })),
      });
       await tx.workflow.update({
        where: {id} ,
        data: {updatedAt: new Date()}
       })
       return workflow;
      })
      
      
    }),
  updateName: protectedProcedure
    .input(z.object({id: z.string(), name: z.string().min(1)}))
    .mutation(({ctx, input}) => {
      return prisma.workflow.update({
        where: {id : ctx.user.id},
        data : {name: input.name}
      })
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