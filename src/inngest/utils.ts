import { Connection, Node } from "@/generated/prisma/client";
import toposort from "toposort";

export const topologicalSort = (
  nodes: Node[],
  connections: Connection[],
): Node[] => {
  // If no connections, return nodes as-is (they're all independent)
  if (connections.length === 0) {
    return nodes;
  }

  // Create edges array for toposort
  const edges: [string, string][] = connections.map((connection) => [
    connection.source,
    connection.target,
  ]);

  // Get the sorted IDs
  const sortedIds = toposort(edges);

  // Map the sorted IDs back to the original node objects
  return sortedIds.map((id) => nodes.find((node) => node.id === id)!);
};