// main.js
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GraphGeometry } from './GraphGeometry.js';
import GUI from 'lil-gui';

const scene = new THREE.Scene();
scene.add(new THREE.AmbientLight(0xffffff, 0.6));
const light = new THREE.PointLight(0xffffff, 1);
light.position.set(5, 5, 5);
scene.add(light);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 6;

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('webgl'), antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// ---------------- GUI ----------------
const gui = new GUI();
const presets = [
  'cube', 'pyramid', 'prism', 'octahedron', 'triangle', 'line',
  'cone', 'star', 'circular', 'grid', 'lattice',
  'spokes', 'polyline', 'paths' // 👈 nuevos
];

const params = {
  preset: 'cube',

  // estilos
  nodeColor: 0xff66cc,
  edgeColor: 0x3333ff,
  nodeRadius: 0.15,
  edgeRadius: 0.03,
  nodeSegments: 16,
  edgeSegments: 8,

  // dirigido
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

let graph;
let currentNodeCount = 0;
let nodeRadiiArray = null;
let nodeColorsArray = null;

function rand(min, max) { return min + Math.random() * (max - min); }
function randomColor() { return (Math.random() * 0xffffff) << 0; }
function safeParse(str, fb) { try { return JSON.parse(str); } catch { return fb; } }

function allocatePerNodeArrays() {
  switch (params.preset) {
    case 'circular':
    case 'star':
      currentNodeCount = params.count;
      break;
    case 'grid':
      currentNodeCount = params.rows * params.cols;
      break;
    case 'lattice':
      currentNodeCount = (params.nx + 1) * (params.ny + 1) * (params.nz + 1);
      break;
    case 'spokes':
      currentNodeCount = 1 + params.spokesCount;
      break;
    case 'polyline':
      currentNodeCount = safeParse(params.polylineJSON, []).length;
      break;
    case 'paths': {
      const paths = safeParse(params.pathsJSON, []);
      currentNodeCount = params.merge
        ? new Set(paths.flat().map(p => `${p.x}|${p.y}|${p.z||0}`)).size
        : paths.flat().length;
      break;
    }
    case 'cube':       currentNodeCount = 8; break;
    case 'pyramid':    currentNodeCount = 5; break;
    case 'prism':      currentNodeCount = 8; break;
    case 'octahedron': currentNodeCount = 6; break;
    case 'triangle':   currentNodeCount = 3; break;
    case 'line':       currentNodeCount = 2; break;
    case 'cone':       currentNodeCount = 1 + params.baseSegments; break;
    default:           currentNodeCount = 0;
  }

  if (params.useNodeRadii) {
    nodeRadiiArray = Array.from({ length: currentNodeCount }, () =>
      rand(params.minNodeRadius, params.maxNodeRadius)
    );
  } else nodeRadiiArray = null;

  if (params.useNodeColors) {
    if (params.colorMode === 'alternate') {
      nodeColorsArray = Array.from({ length: currentNodeCount }, (_, i) =>
        (i % 2 ? 0x00e0ff : 0xff60cc)
      );
    } else {
      nodeColorsArray = Array.from({ length: currentNodeCount }, () => randomColor());
    }
  } else nodeColorsArray = null;
}

function buildGraph() {
  if (graph) {
    scene.remove(graph);
    if (graph.dispose) graph.dispose();
    graph = null;
  }

  allocatePerNodeArrays();

  const styleOpts = {
    nodeColor: params.nodeColor,
    edgeColor: params.edgeColor,
    nodeRadius: params.nodeRadius,
    edgeRadius: params.edgeRadius,
    nodeSegments: params.nodeSegments,
    edgeSegments: params.edgeSegments,
    directed: params.directed,
    arrowSize: params.arrowSize,
    nodeRadii: nodeRadiiArray,
    nodeColors: nodeColorsArray
  };

  switch (params.preset) {
    case 'cube':       graph = new GraphGeometry('cube', params.size, styleOpts); break;
    case 'pyramid':    graph = new GraphGeometry('pyramid', params.baseSize, params.height, styleOpts); break;
    case 'prism':      graph = new GraphGeometry('prism', params.width, params.pHeight, params.depth, styleOpts); break;
    case 'octahedron': graph = new GraphGeometry('octahedron', params.oSize, styleOpts); break;
    case 'triangle':   graph = new GraphGeometry('triangle', params.tSize, styleOpts); break;
    case 'line':       graph = new GraphGeometry('line', params.length, styleOpts); break;
    case 'cone':       graph = new GraphGeometry('cone', params.cRadius, params.cHeight, params.baseSegments, styleOpts); break;
    case 'star':       graph = new GraphGeometry('star', params.count, params.radius, styleOpts); break;
    case 'circular':   graph = new GraphGeometry('circular', params.count, params.radius, styleOpts); break;
    case 'grid':       graph = new GraphGeometry('grid', params.rows, params.cols, params.spacing, styleOpts); break;
    case 'lattice':    graph = new GraphGeometry('lattice', params.nx, params.ny, params.nz, params.lSpacing, styleOpts); break;

    // nuevos
    case 'spokes':
      graph = new GraphGeometry('spokes', params.spokesCount, params.spokesLen, params.spokesOffset, styleOpts);
      break;
    case 'polyline':
      graph = new GraphGeometry('polyline', safeParse(params.polylineJSON, []), styleOpts);
      break;
    case 'paths':
      graph = new GraphGeometry('paths', safeParse(params.pathsJSON, []), { ...styleOpts, merge: params.merge, mergeTolerance: params.mergeTol });
      break;

    default:
      graph = new GraphGeometry('cube', 2, styleOpts);
  }

  scene.add(graph);
}

// GUI
let folders = {};
function setupGUI() {
  gui.children.slice().forEach(c => gui.remove(c));

  gui.add(params, 'preset', presets).name('Preset').onChange(() => {
    updateVisibility();
    buildGraph();
  });

  const fStyle = gui.addFolder('Style');
  fStyle.addColor(params, 'nodeColor').onChange(buildGraph);
  fStyle.addColor(params, 'edgeColor').onChange(buildGraph);
  fStyle.add(params, 'nodeRadius', 0.02, 0.5, 0.01).onChange(buildGraph);
  fStyle.add(params, 'edgeRadius', 0.005, 0.2, 0.005).onChange(buildGraph);
  fStyle.add(params, 'nodeSegments', 6, 48, 1).onChange(buildGraph);
  fStyle.add(params, 'edgeSegments', 3, 32, 1).onChange(buildGraph);

  const fDirected = gui.addFolder('Directed');
  fDirected.add(params, 'directed').name('Arrows 3D').onChange(buildGraph);
  fDirected.add(params, 'arrowSize', 0.05, 0.6, 0.01).onChange(buildGraph);

  const fPerNode = gui.addFolder('Per-node');
  fPerNode.add(params, 'useNodeRadii').name('Custom radii').onChange(buildGraph);
  fPerNode.add(params, 'minNodeRadius', 0.05, 0.5, 0.01).onChange(buildGraph);
  fPerNode.add(params, 'maxNodeRadius', 0.05, 0.5, 0.01).onChange(buildGraph);
  fPerNode.add(params, 'useNodeColors').name('Custom colors').onChange(buildGraph);
  fPerNode.add(params, 'colorMode', ['alternate', 'random']).onChange(buildGraph);
  fPerNode.add({ randomize() { buildGraph(); } }, 'randomize').name('Randomize per-node');

  // folders por preset
  folders.cube = gui.addFolder('Cube');
  folders.cube.add(params, 'size', 0.5, 5, 0.1).onChange(buildGraph);

  folders.pyramid = gui.addFolder('Pyramid');
  folders.pyramid.add(params, 'baseSize', 0.5, 5, 0.1).onChange(buildGraph);
  folders.pyramid.add(params, 'height', 0.5, 6, 0.1).onChange(buildGraph);

  folders.prism = gui.addFolder('Prism');
  folders.prism.add(params, 'width', 0.5, 5, 0.1).onChange(buildGraph);
  folders.prism.add(params, 'pHeight', 0.2, 5, 0.1).name('height').onChange(buildGraph);
  folders.prism.add(params, 'depth', 0.2, 5, 0.1).onChange(buildGraph);

  folders.octahedron = gui.addFolder('Octahedron');
  folders.octahedron.add(params, 'oSize', 0.5, 5, 0.1).onChange(buildGraph);

  folders.triangle = gui.addFolder('Triangle');
  folders.triangle.add(params, 'tSize', 0.5, 5, 0.1).onChange(buildGraph);

  folders.line = gui.addFolder('Line');
  folders.line.add(params, 'length', 0.5, 20, 0.1).onChange(buildGraph);

  folders.cone = gui.addFolder('Cone');
  folders.cone.add(params, 'cRadius', 0.5, 6, 0.1).onChange(buildGraph);
  folders.cone.add(params, 'cHeight', 0.5, 8, 0.1).onChange(buildGraph);
  folders.cone.add(params, 'baseSegments', 3, 64, 1).onChange(buildGraph);

  folders.star = gui.addFolder('Star');
  folders.star.add(params, 'count', 3, 64, 1).onChange(buildGraph);
  folders.star.add(params, 'radius', 0.5, 10, 0.1).onChange(buildGraph);

  folders.circular = gui.addFolder('Circular');
  folders.circular.add(params, 'count', 3, 64, 1).onChange(buildGraph);
  folders.circular.add(params, 'radius', 0.5, 10, 0.1).onChange(buildGraph);

  folders.grid = gui.addFolder('Grid (2D)');
  folders.grid.add(params, 'rows', 1, 20, 1).onChange(buildGraph);
  folders.grid.add(params, 'cols', 1, 20, 1).onChange(buildGraph);
  folders.grid.add(params, 'spacing', 0.5, 5, 0.1).onChange(buildGraph);

  folders.lattice = gui.addFolder('Lattice (3D grid)');
  folders.lattice.add(params, 'nx', 1, 10, 1).name('nx (cells)').onChange(buildGraph);
  folders.lattice.add(params, 'ny', 1, 10, 1).name('ny (cells)').onChange(buildGraph);
  folders.lattice.add(params, 'nz', 1, 10, 1).name('nz (cells)').onChange(buildGraph);
  folders.lattice.add(params, 'lSpacing', 0.5, 5, 0.1).name('spacing').onChange(buildGraph);

  // ---- nuevos ----
  folders.spokes = gui.addFolder('Spokes');
  folders.spokes.add(params, 'spokesCount', 1, 16, 1).onChange(buildGraph);
  folders.spokes.add(params, 'spokesLen', 0.2, 10, 0.1).onChange(buildGraph);
  folders.spokes.add(params, 'spokesOffset', 0, Math.PI * 2, 0.01).onChange(buildGraph);

  folders.polyline = gui.addFolder('Polyline');
  folders.polyline.add(params, 'polylineJSON').onFinishChange(buildGraph);

  folders.paths = gui.addFolder('Paths');
  folders.paths.add(params, 'merge').onChange(buildGraph);
  folders.paths.add(params, 'mergeTol', 1e-6, 1e-1, 1e-6).onChange(buildGraph);
  folders.paths.add(params, 'pathsJSON').onFinishChange(buildGraph);

  updateVisibility();
}

function updateVisibility() {
  Object.values(folders).forEach(f => f.hide());
  switch (params.preset) {
    case 'cube': folders.cube.show(); break;
    case 'pyramid': folders.pyramid.show(); break;
    case 'prism': folders.prism.show(); break;
    case 'octahedron': folders.octahedron.show(); break;
    case 'triangle': folders.triangle.show(); break;
    case 'line': folders.line.show(); break;
    case 'cone': folders.cone.show(); break;
    case 'star': folders.star.show(); break;
    case 'circular': folders.circular.show(); break;
    case 'grid': folders.grid.show(); break;
    case 'lattice': folders.lattice.show(); break;
    case 'spokes': folders.spokes.show(); break;
    case 'polyline': folders.polyline.show(); break;
    case 'paths': folders.paths.show(); break;
  }
}

// init
setupGUI();
buildGraph();

// ---------------- Loop & resize ----------------
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();