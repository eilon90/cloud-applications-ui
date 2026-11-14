export const GRAPH_WIDTH = 820;
export const GRAPH_HEIGHT = 560;
export const CENTER_X = GRAPH_WIDTH / 2;
export const CENTER_Y = GRAPH_HEIGHT / 2;
export const LABEL_LIMIT = 12;

export interface GraphNode {
  index: number;
  angle: number;
  x: number;
  y: number;
}

export function starRadius(count: number): number {
  return Math.min(210, Math.max(110, 70 + count * 11));
}

export function layoutStar(count: number): {
  radius: number;
  nodes: GraphNode[];
} {
  const radius = starRadius(count);

  const nodes = Array.from({ length: count }, (_, index) => {
    const angle = -Math.PI / 2 + (index * 2 * Math.PI) / count;
    return {
      index,
      angle,
      x: CENTER_X + radius * Math.cos(angle),
      y: CENTER_Y + radius * Math.sin(angle),
    };
  });

  return { radius, nodes };
}

export function labelAnchor(x: number): "start" | "middle" | "end" {
  const offset = x - CENTER_X;
  if (offset > 24) return "start";
  if (offset < -24) return "end";
  return "middle";
}

export function truncate(value: string, max: number): string {
  return value.length > max ? `${value.slice(0, max - 1)}…` : value;
}
