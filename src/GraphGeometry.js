import { GraphRenderer } from './core/GraphRenderer.js';
import { PresetManager } from './core/PresetManager.js';
import { BasicShapes } from './presets/basic/BasicShapes.js';
import { Networks } from './presets/structures/Networks.js';
import { PathGeometry } from './presets/paths/PathGeometry.js';

export class GraphGeometry extends GraphRenderer {
  constructor(type, ...params) {
    const last = params[params.length - 1];
    const hasOptions = typeof last === 'object' && !Array.isArray(last);
    const options = hasOptions ? params.pop() : {};

    super(options);

    let nodes = [];
    let edges = [];

    if (PresetManager.hasPreset(type)) {
      const { nodes: n = [], edges: e = [] } = PresetManager.getPreset(type)(...params) || {};
      nodes = n;
      edges = e;
    } else {
      const presetParams = [...params];
      const lastParam = presetParams[presetParams.length - 1];
      const isLastObject = typeof lastParam === 'object' && !Array.isArray(lastParam);

      if (isLastObject) {
        presetParams[presetParams.length - 1] = { ...lastParam, ...options };
      } else {
        presetParams.push({ ...options });
      }

      const result = this.generateBuiltInPreset(type, presetParams);
      nodes = result.nodes;
      edges = result.edges;
    }

    this.render(nodes, edges);
  }

  generateBuiltInPreset(type, params) {
    switch (type) {
      case 'cube': return BasicShapes.cube(...params);
      case 'pyramid': return BasicShapes.pyramid(...params);
      case 'prism': return BasicShapes.prism(...params);
      case 'octahedron': return BasicShapes.octahedron(...params);
      case 'triangle': return BasicShapes.triangle(...params);
      case 'line': return BasicShapes.line(...params);
      case 'cone': return BasicShapes.cone(...params);
      case 'circular': return Networks.circular(...params);
      case 'star': return Networks.star(...params);
      case 'grid': return Networks.grid(...params);
      case 'lattice': return Networks.lattice(...params);
      case 'spokes': return Networks.spokes(...params);
      case 'polyline': return PathGeometry.polyline(...params);
      case 'paths': return PathGeometry.paths(...params);
      default:
        console.warn(`GraphGeometry: Unknown type "${type}"`);
        return { nodes: [], edges: [] };
    }
  }
}

export { registerPreset, unregisterPreset, listPresets } from './core/PresetManager.js';