import * as THREE from 'three';
import { MathHelpers } from '../../utils/MathHelpers.js';

export class PathGeometry {
  static polyline(points = []) {
    if ((points || []).length < 2) {
      return { nodes: [], edges: [] };
    }

    const nodes = points.map(p => (p.isVector3 ? p : new THREE.Vector3(p.x, p.y, p.z ?? 0)));
    const edges = [];
    
    for (let i = 0; i < nodes.length - 1; i++) {
      edges.push([i, i + 1]);
    }

    return { nodes, edges };
  }

  static paths(paths = [], options = {}) {
    const { merge = false, mergeTolerance = 1e-6 } = options;
    const nodes = [];
    const edges = [];

    if (!merge) {
      for (const pts of paths) {
        const startIdx = nodes.length;
        const local = (pts || []).map(p => (p.isVector3 ? p : new THREE.Vector3(p.x, p.y, p.z ?? 0)));
        nodes.push(...local);
        for (let i = 0; i < local.length - 1; i++) {
          edges.push([startIdx + i, startIdx + i + 1]);
        }
      }
    } else {
      const map = new Map();
      const getIndex = (v) => {
        const k = MathHelpers.keyOf(v, mergeTolerance);
        if (map.has(k)) return map.get(k);
        const idx = nodes.length;
        nodes.push(v.clone ? v.clone() : new THREE.Vector3(v.x, v.y, v.z ?? 0));
        map.set(k, idx);
        return idx;
      };
      
      for (const pts of paths) {
        const local = (pts || []).map(p => (p.isVector3 ? p : new THREE.Vector3(p.x, p.y, p.z ?? 0)));
        for (let i = 0; i < local.length - 1; i++) {
          const a = getIndex(local[i]);
          const b = getIndex(local[i + 1]);
          if (a !== b) edges.push([a, b]);
        }
      }
    }

    return { nodes, edges };
  }
}