import type { IRetrievalAdapter, RetrievalRequest, RetrievalResult, ScripturePassage } from '@/types';
import { SEED_PASSAGES } from '@/data/seed';
import { openEmbeddingsDB, getAllNodes, putNode } from '../storage/embeddingsDB';

// ─── CSP/Worker fallback registry ────────────────────────────────────────────
// Set from adapters.ts after instances are created to avoid circular imports.
let _localFallback: IRetrievalAdapter | null = null;
export function setGraphRAGFallback(adapter: IRetrievalAdapter) {
  _localFallback = adapter;
}

function cosineSim(a: number[], b: number[]): number {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return (normA === 0 || normB === 0) ? 0 : dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

class EmbeddingWorkerClient {
  private worker: Worker | null = null;
  private reqId = 0;
  private pending = new Map<number, { resolve: (val?: unknown) => void; reject: (err: Error) => void }>();

  init() {
    if (this.worker) return;
    this.worker = new Worker(new URL('../../workers/ai.worker.ts', import.meta.url), { type: 'module' });
    this.worker.onmessage = (e) => {
      const { id, type, payload } = e.data;
      const p = this.pending.get(id);
      if (p) {
        if (type === 'ERROR') p.reject(new Error(payload));
        else p.resolve(payload);
        this.pending.delete(id);
      }
    };
  }

  async getEmbedding(text: string): Promise<number[]> {
    if (!this.worker) this.init();
    return new Promise((resolve, reject) => {
      const id = ++this.reqId;
      this.pending.set(id, { resolve: resolve as (val?: unknown) => void, reject });
      this.worker!.postMessage({ id, type: 'GET_EMBEDDING', payload: text });
    });
  }
  
  async initModel(): Promise<void> {
    if (!this.worker) this.init();
    return new Promise((resolve, reject) => {
      const id = ++this.reqId;
      this.pending.set(id, { resolve: resolve as (val?: unknown) => void, reject });
      this.worker!.postMessage({ id, type: 'INIT' });
    });
  }
}

export const workerClient = new EmbeddingWorkerClient();

export class GraphRAGAdapter implements IRetrievalAdapter {
  private initialized = false;

  async initialize() {
    if (this.initialized) return;
    await workerClient.initModel();
    const db = await openEmbeddingsDB();
    const existing = await getAllNodes(db);
    
    if (existing.length < SEED_PASSAGES.length) {
      for (const passage of SEED_PASSAGES) {
        // Construct edges based on same book or similar themes
        const edges = SEED_PASSAGES
          .filter(p => p.book === passage.book && p.id !== passage.id)
          .map(p => p.id);
          
        const textToEmbed = `${passage.book} ${passage.reference} ${passage.text}`;
        const embedding = await workerClient.getEmbedding(textToEmbed);
        
        await putNode(db, { id: passage.id, embedding, edges });
      }
    }
    this.initialized = true;
  }

  async search(req: RetrievalRequest): Promise<RetrievalResult> {
    try {
      await this.initialize();
      
      const queryEmb = await workerClient.getEmbedding(req.query);
      
      const db = await openEmbeddingsDB();
      const nodes = await getAllNodes(db);
      
      const scored = nodes.map(n => ({ id: n.id, score: cosineSim(queryEmb, n.embedding) }));
      scored.sort((a, b) => b.score - a.score);
      
      const topHits = scored.slice(0, 3);
      const relatedScores = new Map<string, number>();
      
      for (const hit of topHits) {
        const node = nodes.find(n => n.id === hit.id);
        if (node && node.edges) {
          for (const edgeId of node.edges) {
            const edgeNode = nodes.find(n => n.id === edgeId);
            if (edgeNode) {
              const edgeScore = cosineSim(queryEmb, edgeNode.embedding) * 0.9;
              const existing = relatedScores.get(edgeId) || 0;
              relatedScores.set(edgeId, Math.max(existing, edgeScore));
            }
          }
        }
      }
      
      const combinedScores = new Map<string, number>();
      for (const hit of scored) combinedScores.set(hit.id, hit.score);
      for (const [id, score] of relatedScores.entries()) {
        combinedScores.set(id, Math.max(score, combinedScores.get(id) || 0));
      }
      
      const finalRanked = Array.from(combinedScores.entries())
        .map(([id, score]) => ({ id, score }))
        .sort((a, b) => b.score - a.score);
        
      const topK = req.topK || 5;
      const finalIds = finalRanked.slice(0, topK).map(r => r.id);
      
      const passages = finalIds.map(id => SEED_PASSAGES.find(p => p.id === id)).filter(Boolean) as ScripturePassage[];
      
      return {
        passages,
        confidence: finalRanked[0]?.score || 0,
        source: 'local-graph-rag'
      };
    } catch (err) {
      console.error('GraphRAG retrieval failed (CSP or worker error), falling back', err);
      // CSP or worker failure — fall back to deterministic local retrieval
      if (_localFallback) return _localFallback.search(req);
      // Ultimate fallback: return a seed passage
      return { passages: [SEED_PASSAGES[0]], confidence: 0.1, source: 'emergency-fallback' };
    }
  }
  
  async getByReference(ref: string): Promise<ScripturePassage | null> {
    const normalised = ref.trim().toLowerCase();
    return (
      SEED_PASSAGES.find(p => p.reference.toLowerCase() === normalised) ??
      SEED_PASSAGES.find(p => p.reference.toLowerCase().includes(normalised)) ??
      null
    );
  }
}
