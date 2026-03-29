import { create } from "zustand";
import type { Node, Edge } from "@xyflow/react";
import type { EntityData, Attribute } from "../types/diagram";

interface DiagramState {
  nodes: Node<EntityData>[];
  edges: Edge[];
  setNodes: (nodes: Node<EntityData>[]) => void;
  setEdges: (edges: Edge[]) => void;
  addEntity: (name: string, attributes: Attribute[]) => void;
  removeNode: (id: string) => void;
  updateEntity: (id: string, data: EntityData) => void;
  addEdge: (edge: Edge) => void;
  clear: () => void;
}

let nodeCounter = 0;

export const useDiagramStore = create<DiagramState>((set) => ({
  nodes: [],
  edges: [],

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),

  addEntity: (name, attributes) => {
    const id = `entity-${++nodeCounter}`;
    set((state) => ({
      nodes: [
        ...state.nodes,
        {
          id,
          type: "entity",
          position: { x: 100 + (nodeCounter % 4) * 280, y: 100 + Math.floor(nodeCounter / 4) * 250 },
          data: { name, attributes },
        },
      ],
    }));
  },

  removeNode: (id) =>
    set((state) => ({
      nodes: state.nodes.filter((n) => n.id !== id),
      edges: state.edges.filter((e) => e.source !== id && e.target !== id),
    })),

  updateEntity: (id, data) =>
    set((state) => ({
      nodes: state.nodes.map((n) => (n.id === id ? { ...n, data } : n)),
    })),

  addEdge: (edge) => set((state) => ({ edges: [...state.edges, edge] })),

  clear: () => set({ nodes: [], edges: [] }),
}));
