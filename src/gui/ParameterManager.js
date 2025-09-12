import { MathHelpers } from '../utils/MathHelpers.js';
import { PresetManager } from '../core/PresetManager.js';

export class ParameterManager {
  constructor() {
    this.params = {
      preset: 'cube',

      // styles
      nodeColor: 0xff66cc,
      edgeColor: 0x3333ff,
      nodeRadius: 0.15,
      edgeRadius: 0.03,
      nodeSegments: 16,
      edgeSegments: 8,

      // directed
      directed: false,
      arrowSize: 0.22,

      // per-node
      useNodeRadii: false,
      minNodeRadius: 0.10,
      maxNodeRadius: 0.24,
      useNodeColors: false,
      colorMode: 'alternate', // 'alternate' | 'random'

      // cube
      size: 2,

      // pyramid
      baseSize: 2,
      height: 3,

      // prism
      width: 2,
      pHeight: 1,
      depth: 0.5,

      // octahedron / triangle / line
      oSize: 2,
      tSize: 2,
      length: 6,

      // cone
      cRadius: 2,
      cHeight: 3,
      baseSegments: 8,

      // star / circular
      count: 10,
      radius: 3,

      // grid (2D)
      rows: 3,
      cols: 3,
      spacing: 2,

      // lattice (3D)
      nx: 2,
      ny: 1,
      nz: 1,
      lSpacing: 2,

      // spokes
      spokesCount: 4,
      spokesLen: 2,
      spokesOffset: Math.PI * 0.25,

      // polyline / paths (JSON)
      polylineJSON: JSON.stringify([
        {x:-2,y:0,z:0}, {x:-0.8,y:0.6,z:0}, {x:0.4,y:1.2,z:0}
      ], null, 2),
      pathsJSON: JSON.stringify([
        [ {x:-2,y:0,z:0}, {x:-0.8,y:0.6,z:0}, {x:0.4,y:1.2,z:0} ],
        [ {x:-0.8,y:0.6,z:0}, {x:-0.8,y:2.0,z:0} ],
        [ {x:0.4,y:1.2,z:0}, {x:1.6,y:1.2,z:0} ]
      ], null, 2),
      merge: true,
      mergeTol: 1e-4
    };

    this.currentNodeCount = 0;
    this.nodeRadiiArray = null;
    this.nodeColorsArray = null;
  }

  getStyleOptions() {
    return {
      nodeColor: this.params.nodeColor,
      edgeColor: this.params.edgeColor,
      nodeRadius: this.params.nodeRadius,
      edgeRadius: this.params.edgeRadius,
      nodeSegments: this.params.nodeSegments,
      edgeSegments: this.params.edgeSegments,
      directed: this.params.directed,
      arrowSize: this.params.arrowSize,
      nodeRadii: this.nodeRadiiArray,
      nodeColors: this.nodeColorsArray
    };
  }

  getPresetParameters() {
    const preset = this.params.preset;
    
    if (!PresetManager.getBuiltInPresets().includes(preset)) {
      return []; // external preset, no parameters needed
    }

    switch (preset) {
      case 'cube': return [this.params.size];
      case 'pyramid': return [this.params.baseSize, this.params.height];
      case 'prism': return [this.params.width, this.params.pHeight, this.params.depth];
      case 'octahedron': return [this.params.oSize];
      case 'triangle': return [this.params.tSize];
      case 'line': return [this.params.length];
      case 'cone': return [this.params.cRadius, this.params.cHeight, this.params.baseSegments];
      case 'star': return [this.params.count, this.params.radius];
      case 'circular': return [this.params.count, this.params.radius];
      case 'grid': return [this.params.rows, this.params.cols, this.params.spacing];
      case 'lattice': return [this.params.nx, this.params.ny, this.params.nz, this.params.lSpacing];
      case 'spokes': return [this.params.spokesCount, this.params.spokesLen, this.params.spokesOffset];
      case 'polyline': return [MathHelpers.safeParse(this.params.polylineJSON, [])];
      case 'paths': return [
        MathHelpers.safeParse(this.params.pathsJSON, []), 
        { merge: this.params.merge, mergeTolerance: this.params.mergeTol }
      ];
      default: return [];
    }
  }

  allocatePerNodeArrays() {
    this.currentNodeCount = this.calculateNodeCount();

    if (this.params.useNodeRadii) {
      this.nodeRadiiArray = Array.from({ length: this.currentNodeCount }, () =>
        MathHelpers.rand(this.params.minNodeRadius, this.params.maxNodeRadius)
      );
    } else {
      this.nodeRadiiArray = null;
    }

    if (this.params.useNodeColors) {
      if (this.params.colorMode === 'alternate') {
        this.nodeColorsArray = Array.from({ length: this.currentNodeCount }, (_, i) =>
          (i % 2 ? 0x00e0ff : 0xff60cc)
        );
      } else {
        this.nodeColorsArray = Array.from({ length: this.currentNodeCount }, () => MathHelpers.randomColor());
      }
    } else {
      this.nodeColorsArray = null;
    }
  }

  calculateNodeCount() {
    switch (this.params.preset) {
      case 'circular':
      case 'star':
        return this.params.count;
      case 'grid':
        return this.params.rows * this.params.cols;
      case 'lattice':
        return (this.params.nx + 1) * (this.params.ny + 1) * (this.params.nz + 1);
      case 'spokes':
        return 1 + this.params.spokesCount;
      case 'polyline':
        return MathHelpers.safeParse(this.params.polylineJSON, []).length;
      case 'paths': {
        const paths = MathHelpers.safeParse(this.params.pathsJSON, []);
        return this.params.merge
          ? new Set(paths.flat().map(p => `${p.x}|${p.y}|${p.z||0}`)).size
          : paths.flat().length;
      }
      case 'cube': return 8;
      case 'pyramid': return 5;
      case 'prism': return 8;
      case 'octahedron': return 6;
      case 'triangle': return 3;
      case 'line': return 2;
      case 'cone': return 1 + this.params.baseSegments;
      default: return 0;
    }
  }
}