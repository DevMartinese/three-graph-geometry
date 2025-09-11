import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GraphGeometry } from './GraphGeometry';
import GUI from 'lil-gui';

const scene = new THREE.Scene();
scene.add(new THREE.AmbientLight(0xffffff, 0.6));
const light = new THREE.PointLight(0xffffff, 1);
light.position.set(5, 5, 5);
scene.add(light);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 6;

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('webgl') });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// ---------------- GUI ----------------
const gui = new GUI();
const presets = [
  'cube', 'pyramid', 'prism', 'octahedron', 'triangle', 'line',
  'cone', 'star', 'circular', 'grid'
];

const params = {
  // preset + args por preset
  preset: 'cube',

  // comunes de estilo
  nodeColor: 0xff66cc,
  edgeColor: 0x3333ff,
  nodeRadius: 0.15,
  edgeRadius: 0.03,
  nodeSegments: 16,
  edgeSegments: 8,

  // cube
  size: 2,

  // pyramid
  baseSize: 2,
  height: 3,

  // prism
  width: 2,
  pHeight: 1,     // (renombrado para no pisar "height" de pyramid)
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

  // grid
  rows: 3,
  cols: 3,
  spacing: 2,
};

let graph;

// helpers: crear/actualizar grafo según preset
function buildGraph() {
  // remover anterior
  if (graph) {
    scene.remove(graph);
    if (graph.dispose) graph.dispose();
    graph = null;
  }

  const styleOpts = {
    nodeColor: params.nodeColor,
    edgeColor: params.edgeColor,
    nodeRadius: params.nodeRadius,
    edgeRadius: params.edgeRadius,
    nodeSegments: params.nodeSegments,
    edgeSegments: params.edgeSegments
  };

  switch (params.preset) {
    case 'cube':
      graph = new GraphGeometry('cube', params.size, styleOpts);
      break;

    case 'pyramid':
      graph = new GraphGeometry('pyramid', params.baseSize, params.height, styleOpts);
      break;

    case 'prism':
      graph = new GraphGeometry('prism', params.width, params.pHeight, params.depth, styleOpts);
      break;

    case 'octahedron':
      graph = new GraphGeometry('octahedron', params.oSize, styleOpts);
      break;

    case 'triangle':
      graph = new GraphGeometry('triangle', params.tSize, styleOpts);
      break;

    case 'line':
      graph = new GraphGeometry('line', params.length, styleOpts);
      break;

    case 'cone':
      graph = new GraphGeometry('cone', params.cRadius, params.cHeight, params.baseSegments, styleOpts);
      break;

    case 'star':
      graph = new GraphGeometry('star', params.count, params.radius, styleOpts);
      break;

    case 'circular':
      graph = new GraphGeometry('circular', params.count, params.radius, styleOpts);
      break;

    case 'grid':
      graph = new GraphGeometry('grid', params.rows, params.cols, params.spacing, styleOpts);
      break;

    default:
      graph = new GraphGeometry('cube', 2, styleOpts);
  }

  scene.add(graph);
}

// Mostrar/ocultar controles según preset elegido
let folders = {};
function setupGUI() {
  // limpia GUI (except theme)
  gui.children.slice().forEach(c => gui.remove(c));

  // preset selector
  gui.add(params, 'preset', presets).name('Preset').onChange(() => {
    updateVisibility();
    buildGraph();
  });

  // estilo común
  const fStyle = gui.addFolder('Style');
  fStyle.addColor(params, 'nodeColor').onChange(buildGraph);
  fStyle.addColor(params, 'edgeColor').onChange(buildGraph);
  fStyle.add(params, 'nodeRadius', 0.02, 0.5, 0.01).onChange(buildGraph);
  fStyle.add(params, 'edgeRadius', 0.005, 0.2, 0.005).onChange(buildGraph);
  fStyle.add(params, 'nodeSegments', 6, 48, 1).onChange(buildGraph);
  fStyle.add(params, 'edgeSegments', 3, 32, 1).onChange(buildGraph);

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

  folders.grid = gui.addFolder('Grid');
  folders.grid.add(params, 'rows', 1, 20, 1).onChange(buildGraph);
  folders.grid.add(params, 'cols', 1, 20, 1).onChange(buildGraph);
  folders.grid.add(params, 'spacing', 0.5, 5, 0.1).onChange(buildGraph);

  updateVisibility();
}

function updateVisibility() {
  // ocultar todo
  Object.values(folders).forEach(f => f.hide());

  // mostrar solo el del preset
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