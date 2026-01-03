export type NodeType = 'statement' | 'sequence' | 'if' | 'loop' | 'switch' | 'function';

export interface DiagramNode {
  id: string;
  type: NodeType;
  text?: string; // Content of the node (condition, statement, etc.)
  children?: DiagramNode[]; // For sequences or general blocks
  trueBlock?: DiagramNode[]; // For if/else (then) - Array for sequence
  falseBlock?: DiagramNode[]; // For if/else (else) - Array for sequence
  condition?: string;
}

export interface Diagram {
  title: string;
  root: DiagramNode;
}

export interface DiagramResponse {
  diagrams: Diagram[];
}