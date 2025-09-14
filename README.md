# Three.js Graph Geometry

An extension for Three.js that turns graphs (nodes + edges) into reusable 3D geometries with a modular, extensible architecture.

## ✨ Features

- **🎯 14 Built-in Graph Presets**: From basic shapes (cube, pyramid) to complex networks (star, lattice, paths)
- **🎨 Customizable Styling**: Full control over node/edge colors, sizes, and materials
- **🏹 Directed Graph Support**: 3D arrow visualization for directed edges
- **🎛️ Interactive GUI**: Real-time parameter adjustment with lil-gui integration
- **🧩 Modular Architecture**: Clean separation of concerns with organized modules
- **🔧 Custom Preset System**: Register your own graph generation functions
- **📐 Per-Node Customization**: Individual node radii and colors
- **🎪 Path Merging**: Smart vertex merging for complex path networks

## 📦 Installation

```bash
npm install three-graph-geometry
```

## 🚀 Quick Start

### Basic Usage

```javascript
import * as THREE from 'three';
import { GraphGeometry } from 'three-graph-geometry';

const scene = new THREE.Scene();

// Create a cube graph
const cubeGraph = new GraphGeometry('cube', 1, { includeFaceCenters: true }, {
  nodeColor: 0x4ecdc4,
  edgeColor: 0x45b7d1,
  nodeRadius: 0.12,
  edgeRadius: 0.02
});
scene.add(cubeGraph);

// Create a star network with custom styling
const starGraph = new GraphGeometry('star', 8, 2, {
  nodeColor: 0xff6b6b,
  edgeColor: 0x4ecdc4,
  nodeRadius: 0.2,
  directed: true
});
scene.add(starGraph);
```

### With Full Demo Setup

```javascript
import { SceneManager } from 'three-graph-geometry/core/Scene';
import { GraphGeometry } from 'three-graph-geometry';
import { ParameterManager } from 'three-graph-geometry/gui/ParameterManager';
import { GUIController } from 'three-graph-geometry/gui/GUIController';

class GraphApp {
  constructor() {
    this.sceneManager = new SceneManager('canvas-id');
    this.parameterManager = new ParameterManager();
    this.guiController = new GUIController(
      this.parameterManager, 
      () => this.updateGraph()
    );
    
    this.updateGraph();
    this.sceneManager.start();
  }

  updateGraph() {
    // Remove old graph
    if (this.currentGraph) {
      this.sceneManager.remove(this.currentGraph);
      this.currentGraph.dispose();
    }

    // Create new graph
    this.parameterManager.allocatePerNodeArrays();
    const styleOptions = this.parameterManager.getStyleOptions();
    const presetParams = this.parameterManager.getPresetParameters();

    this.currentGraph = new GraphGeometry(
      this.parameterManager.params.preset,
      ...presetParams,
      styleOptions
    );

    this.sceneManager.add(this.currentGraph);
  }
}

new GraphApp();
```

## 📋 API Documentation

### GraphGeometry Class

```javascript
new GraphGeometry(type, ...params, options)
```

**Parameters:**
- `type` (string): Preset name or registered custom preset
- `...params`: Preset-specific parameters
- `options` (object): Styling and rendering options

**Options Object:**
```javascript
{
  nodeRadius: 0.12,      // Default node radius
  edgeRadius: 0.02,      // Default edge radius  
  nodeColor: 0x00ffff,   // Default node color (hex)
  edgeColor: 0xffffff,   // Default edge color (hex)
  nodeSegments: 16,      // Node sphere detail
  edgeSegments: 8,       // Edge cylinder detail
  directed: false,       // Enable 3D arrows
  arrowSize: 0.18,       // Arrow size multiplier
  arrowSegments: 8,      // Arrow cone detail
  nodeRadii: null,       // Per-node radius array
  nodeColors: null       // Per-node color array/function
}
```

### Custom Preset Registration

```javascript
import { registerPreset } from 'three-graph-geometry';

registerPreset('myCustomGraph', (param1, param2) => {
  const nodes = [
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(param1, 0, 0),
    new THREE.Vector3(0, param2, 0)
  ];
  
  const edges = [[0, 1], [1, 2], [2, 0]];
  
  return { nodes, edges };
});

// Use your custom preset
const customGraph = new GraphGeometry('myCustomGraph', 2, 3, {
  nodeColor: 0xff0000
});
```

## 🎨 Available Presets

### Basic Shapes
| Preset | Parameters | Description |
|--------|------------|-------------|
| `cube` | `size`, `options` | 8-node cube wireframe (supports `includeFaceCenters` option) |
| `pyramid` | `baseSize`, `height` | 5-node pyramid (4 base + 1 apex) |
| `prism` | `width`, `height`, `depth` | Rectangular prism wireframe |
| `octahedron` | `size` | 6-node octahedron |
| `triangle` | `size` | 3-node triangle |
| `line` | `length` | 2-node line segment |
| `cone` | `radius`, `height`, `baseSegments`, `options` | Cone with base ring (supports `includeFaceCenters` option) |

### Network Structures
| Preset | Parameters | Description |
|--------|------------|-------------|
| `circular` | `count`, `radius` | Nodes in circle, connected in ring |
| `star` | `count`, `radius` | Complete graph (all nodes connected) |
| `grid` | `rows`, `cols`, `spacing` | 2D grid network |
| `lattice` | `nx`, `ny`, `nz`, `spacing` | 3D lattice/grid |
| `spokes` | `count`, `length`, `angleOffset` | Hub with radiating spokes |

### Path-Based
| Preset | Parameters | Description |
|--------|------------|-------------|
| `polyline` | `points[]` | Connected line through points |
| `paths` | `paths[]`, `options` | Multiple polylines with merging |

### Usage Examples

```javascript
// Basic shapes
const cube = new GraphGeometry('cube', 2);
const cubeWithFaceCenters = new GraphGeometry('cube', 2, { includeFaceCenters: true });
const pyramid = new GraphGeometry('pyramid', 3, 2);
const cone = new GraphGeometry('cone', 2, 3, 8);
const coneWithBaseCenter = new GraphGeometry('cone', 2, 3, 8, { includeFaceCenters: true });

// Networks  
const star = new GraphGeometry('star', 6, 2);
const grid = new GraphGeometry('grid', 3, 3, 2);
const lattice3D = new GraphGeometry('lattice', 2, 2, 2, 1.5);

// Paths
const polyline = new GraphGeometry('polyline', [
  {x: 0, y: 0, z: 0},
  {x: 1, y: 1, z: 0}, 
  {x: 2, y: 0, z: 1}
]);

const paths = new GraphGeometry('paths', [
  [{x: 0, y: 0, z: 0}, {x: 1, y: 0, z: 0}],
  [{x: 1, y: 0, z: 0}, {x: 1, y: 1, z: 0}]
], { merge: true, mergeTolerance: 1e-6 });
```

## ⚙️ Configuration Options

### Per-Node Customization

```javascript
// Random node sizes
const nodeRadii = [0.1, 0.2, 0.15, 0.3];

// Alternating colors  
const nodeColors = [0xff0000, 0x00ff00, 0xff0000, 0x00ff00];

// Color function
const nodeColors = (index) => index % 2 ? 0xff0000 : 0x0000ff;

const graph = new GraphGeometry('cube', 2, {
  nodeRadii,
  nodeColors
});
```

### Directed Graphs

```javascript
const directedGraph = new GraphGeometry('grid', 3, 3, 2, {
  directed: true,
  arrowSize: 0.3,
  edgeColor: 0x00ff00
});
```

### Advanced Edge Styling

```javascript
// Edges can be objects with custom properties
const customEdges = [
  {a: 0, b: 1, color: 0xff0000, radius: 0.05},
  {a: 1, b: 2, color: 0x00ff00, radius: 0.02}
];
```

## 🏗️ Project Structure

```
src/
├── core/                    # Core system modules
│   ├── Scene.js            # Three.js scene management
│   ├── GraphRenderer.js    # Graph rendering engine
│   └── PresetManager.js    # Preset registration system
├── presets/                # Graph generation presets
│   ├── basic/BasicShapes.js      # Geometric shapes
│   ├── structures/Networks.js    # Network topologies  
│   └── paths/PathGeometry.js     # Path-based graphs
├── gui/                    # User interface
│   ├── ParameterManager.js # Parameter handling
│   └── GUIController.js    # lil-gui integration
├── materials/              # Material creation
│   └── MaterialFactory.js  # Material utilities
├── utils/                  # Utility functions
│   ├── MathHelpers.js      # Math utilities
│   └── GeometryUtils.js    # Three.js geometry helpers
├── GraphGeometry.js        # Main class
├── main.js                 # Demo application
└── index.js               # Package exports
```

## 🔧 Technical Requirements

- **Three.js**: >=0.170.0
- **lil-gui**: ^0.20.0 (optional, for demo GUI)
- **ES6+ Support**: Uses ES modules
- **WebGL**: Requires WebGL-capable browser

## 🎯 Development Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production  
npm run preview      # Preview build
npm run docs:dev     # Start documentation
npm run docs:build   # Build documentation
```

## 🤝 Contributing

### Architecture Guidelines

1. **Separation of Concerns**: Each module has a single responsibility
2. **Preset Pattern**: All graph types follow the same `{nodes, edges}` interface
3. **Extensibility**: New presets are easy to add via registration system
4. **Three.js Integration**: Seamless integration with existing Three.js workflows

### Adding New Presets

1. **Built-in Presets**: Add to appropriate module in `src/presets/`
2. **External Presets**: Use `registerPreset()` function
3. **Return Format**: Always return `{nodes: Vector3[], edges: [number, number][]}`

### Code Style

- Use ES6+ features
- Follow existing naming conventions  
- Document complex algorithms
- Keep preset functions pure (no side effects)

### Testing

- Test all presets with various parameters
- Verify edge cases (empty graphs, single nodes)
- Check memory cleanup (`dispose()` methods)

## 📄 License

MIT License - see LICENSE file for details.

## 👨‍💻 Author

Gonzalo Martinesse <devamartinese@gmail.com>

## 🔗 Links

- [Repository](https://github.com/DevMartinese/three-graph-geometry)
- [Issues](https://github.com/DevMartinese/three-graph-geometry/issues)
- [Three.js Documentation](https://threejs.org/docs/)