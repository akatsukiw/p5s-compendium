import { FUSION_ROWS, PERSONA_META } from '../data/personaData';

export interface PathStep {
  from: {
    name: string;
    requiredLevel: number;
    baseLevel: number;
  };
  target: string;
  otherMaterials: Array<{
    name: string;
    requiredLevel: number;
    baseLevel: number;
  }>;
  targetLevel: number;
  targetArcana: string;
  recipeText: string;
}

export interface FusionPathResult {
  steps: PathStep[];
  totalSteps: number;
}

// Build inverted transition graph: Material -> Recipes that consume this material
// A can fuse with partner(s) to become target C
interface Edge {
  target: string;
  targetLevel: number;
  targetArcana: string;
  materials: Array<{
    name: string;
    requiredLevel: number;
    baseLevel: number;
  }>;
  recipeText: string;
}

let graphCache: Map<string, Edge[]> | null = null;

function getGraph(): Map<string, Edge[]> {
  if (graphCache) return graphCache;

  const map = new Map<string, Edge[]>();

  for (const r of FUSION_ROWS) {
    const target = r.name;
    for (const mat of r.materials) {
      if (!map.has(mat.name)) {
        map.set(mat.name, []);
      }
      map.get(mat.name)!.push({
        target,
        targetLevel: r.level,
        targetArcana: r.arcana,
        materials: r.materials.map(m => ({
          name: m.name,
          requiredLevel: m.requiredLevel ?? m.level,
          baseLevel: m.baseLevel ?? (PERSONA_META[m.name]?.level ?? m.level),
        })),
        recipeText: r.text,
      });
    }
  }

  graphCache = map;
  return map;
}

/**
 * BFS Path Finder from startPersona to targetPersona
 * Supports:
 * - strategy = 'bfs': returns top 1 shortest path
 * - strategy = 'all': returns top K diverse shortest/near-shortest paths
 */
export function findFusionPath(
  startName: string,
  targetName: string,
  strategy: 'bfs' | 'all' = 'all',
  maxResults: number = 4
): { paths: FusionPathResult[]; durationMs: number; nodeCount: number; edgeCount: number } {
  const t0 = performance.now();
  const graph = getGraph();
  const nodeCount = Object.keys(PERSONA_META).length;
  const edgeCount = FUSION_ROWS.length;

  if (!startName || !targetName || startName === targetName) {
    return { paths: [], durationMs: performance.now() - t0, nodeCount, edgeCount };
  }

  const queue: Array<{ current: string; steps: PathStep[] }> = [{ current: startName, steps: [] }];
  const bestDepth = new Map<string, number>();
  bestDepth.set(startName, 0);

  const foundPaths: FusionPathResult[] = [];
  const maxDepth = 6; // Max 6 fusion hops to ensure fast response & realistic chains

  while (queue.length > 0) {
    const { current, steps } = queue.shift()!;
    if (steps.length >= maxDepth) continue;

    const transitions = graph.get(current) || [];
    for (const edge of transitions) {
      // Prevent internal cycles in the same chain
      if (steps.some(s => s.target === edge.target || s.from.name === edge.target)) {
        continue;
      }

      const fromMat = edge.materials.find(m => m.name === current) || {
        name: current,
        requiredLevel: PERSONA_META[current]?.level ?? 1,
        baseLevel: PERSONA_META[current]?.level ?? 1,
      };
      const otherMaterials = edge.materials.filter(m => m !== fromMat);

      const newStep: PathStep = {
        from: fromMat,
        target: edge.target,
        otherMaterials,
        targetLevel: edge.targetLevel,
        targetArcana: edge.targetArcana,
        recipeText: edge.recipeText,
      };

      const newSteps = [...steps, newStep];

      if (edge.target === targetName) {
        foundPaths.push({
          steps: newSteps,
          totalSteps: newSteps.length,
        });

        if (strategy === 'bfs' || foundPaths.length >= maxResults) {
          const t1 = performance.now();
          return { paths: foundPaths, durationMs: t1 - t0, nodeCount, edgeCount };
        }
      } else {
        const nextDepth = newSteps.length;
        const currentBest = bestDepth.get(edge.target) ?? Infinity;

        // BFS pruning: allow equal depth or +1 depth for alternate routes in 'all' mode
        const allowedSlack = strategy === 'all' ? 1 : 0;
        if (nextDepth <= currentBest + allowedSlack) {
          if (nextDepth < currentBest) {
            bestDepth.set(edge.target, nextDepth);
          }
          queue.push({ current: edge.target, steps: newSteps });
        }
      }
    }
  }

  const t1 = performance.now();
  return { paths: foundPaths, durationMs: t1 - t0, nodeCount, edgeCount };
}
