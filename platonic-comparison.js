import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GraphGeometry, registerPreset } from 'three-graph-geometry';

const state = {
  scene: null,
  camera: null,
  renderer: null,
  controls: null,

  nativeGeometries: new THREE.Group(),
  graphGeometries: new THREE.Group(),
  groundPlane: null,
  grid: null,

  nativeMaterial: null,
  groundMaterial: null,

  frameCount: 0,
  lastTime: performance.now(),
  fps: 0,

  autoRotateSpeed: 0.008
};

function registerPlatonicPresets() {
  // Tetrahedron
  registerPreset('tetrahedron', (size = 2) => {
    const s = size;
    const nodes = [
      new THREE.Vector3(s, s, s),
      new THREE.Vector3(s, -s, -s),
      new THREE.Vector3(-s, s, -s),
      new THREE.Vector3(-s, -s, s)
    ];
    const edges = [
      [0, 1], [0, 2], [0, 3],
      [1, 2], [1, 3], [2, 3]
    ];
    return { nodes, edges };
  });

  // Dodecahedron
  registerPreset('dodecahedron', (size = 2) => {
    const phi = (1 + Math.sqrt(5)) / 2;
    const nodes = [];
    const edges = [];

    const coords = [
      [1, 1, 1], [1, 1, -1], [1, -1, 1], [1, -1, -1],
      [-1, 1, 1], [-1, 1, -1], [-1, -1, 1], [-1, -1, -1],
      [0, 1/phi, phi], [0, 1/phi, -phi], [0, -1/phi, phi], [0, -1/phi, -phi],
      [1/phi, phi, 0], [1/phi, -phi, 0], [-1/phi, phi, 0], [-1/phi, -phi, 0],
      [phi, 0, 1/phi], [phi, 0, -1/phi], [-phi, 0, 1/phi], [-phi, 0, -1/phi]
    ];

    coords.forEach(coord => {
      nodes.push(new THREE.Vector3(
        coord[0] * size,
        coord[1] * size,
        coord[2] * size
      ));
    });

    const edgeConnections = [
      [0, 16], [0, 12], [0, 8],
      [1, 17], [1, 12], [1, 9],
      [2, 16], [2, 13], [2, 10],
      [3, 17], [3, 13], [3, 11],
      [4, 18], [4, 14], [4, 8],
      [5, 19], [5, 14], [5, 9],
      [6, 18], [6, 15], [6, 10],
      [7, 19], [7, 15], [7, 11],
      [8, 10], [8, 12],
      [9, 11], [9, 14],
      [10, 13], [10, 18],
      [11, 13], [11, 19],
      [12, 16], [12, 17],
      [14, 15], [14, 18],
      [15, 19], [15, 16],
      [16, 17], [17, 19]
    ];

    edges.push(...edgeConnections);
    return { nodes, edges };
  });

  // Icosahedron
  registerPreset('icosahedron', (size = 2) => {
    const phi = (1 + Math.sqrt(5)) / 2;
    const nodes = [];
    const edges = [];

    const coords = [
      [0, 1, phi], [0, 1, -phi], [0, -1, phi], [0, -1, -phi],
      [1, phi, 0], [1, -phi, 0], [-1, phi, 0], [-1, -phi, 0],
      [phi, 0, 1], [phi, 0, -1], [-phi, 0, 1], [-phi, 0, -1]
    ];

    coords.forEach(coord => {
      const len = Math.sqrt(coord[0] * coord[0] + coord[1] * coord[1] + coord[2] * coord[2]);
      nodes.push(new THREE.Vector3(
        (coord[0] / len) * size,
        (coord[1] / len) * size,
        (coord[2] / len) * size
      ));
    });

    const edgeConnections = [
      [0, 2], [0, 4], [0, 6], [0, 8], [0, 10],
      [1, 3], [1, 4], [1, 6], [1, 9], [1, 11],
      [2, 5], [2, 7], [2, 8], [2, 10],
      [3, 5], [3, 7], [3, 9], [3, 11],
      [4, 6], [4, 8], [4, 9],
      [5, 7], [5, 8], [5, 9],
      [6, 10], [6, 11],
      [7, 10], [7, 11],
      [8, 9], [10, 11]
    ];

    edges.push(...edgeConnections);
    return { nodes, edges };
  });
}

function initScene() {
  state.scene = new THREE.Scene();
  state.scene.background = new THREE.Color(0x1a1a1a);

  state.camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  state.camera.position.set(25, 15, 25);

  state.renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('canvas'),
    antialias: true
  });
  state.renderer.setSize(window.innerWidth, window.innerHeight);
  state.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  state.renderer.shadowMap.enabled = true;
  state.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  state.controls = new OrbitControls(state.camera, state.renderer.domElement);
  state.controls.enableDamping = true;
  state.controls.dampingFactor = 0.05;
  state.controls.target.set(0, 2, 0);

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  state.scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(10, 15, 8);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048;
  state.scene.add(directionalLight);

  const redLight = new THREE.PointLight(0xff4444, 0.3, 30);
  redLight.position.set(-8, 6, 8);
  state.scene.add(redLight);

  const blueLight = new THREE.PointLight(0x4444ff, 0.3, 30);
  blueLight.position.set(8, 6, -8);
  state.scene.add(blueLight);

  // Materials
  state.nativeMaterial = new THREE.MeshStandardMaterial({
    color: 0xff6b6b,
    transparent: true,
    opacity: 0.7,
    metalness: 0.3,
    roughness: 0.4
  });

  state.groundMaterial = new THREE.MeshStandardMaterial({
    color: 0x96ceb4,
    transparent: true,
    opacity: 0.3
  });

  // Add groups
  state.scene.add(state.nativeGeometries);
  state.scene.add(state.graphGeometries);

  // Resizing
  window.addEventListener('resize', onWindowResize);
}

function createPlatonicComparisons() {
  const spacing = 9;
  const positions = [
    { x: -spacing * 2, z: spacing, name: 'Tetrahedron' },
    { x: -spacing, z: spacing, name: 'Cube' },
    { x: 0, z: spacing, name: 'Octahedron' },
    { x: spacing, z: spacing, name: 'Dodecahedron' },
    { x: spacing * 2, z: spacing, name: 'Icosahedron' }
  ];

  positions.forEach((pos, index) => {
    createPlatonicComparison(pos, index);
  });
}

function createPlatonicComparison(position, index) {
  const platonicTypes = ['tetrahedron', 'cube', 'octahedron', 'dodecahedron', 'icosahedron'];
  const type = platonicTypes[index];

  // Native Three.js geometry
  let nativeGeometry;
  switch(type) {
    case 'tetrahedron':
      nativeGeometry = new THREE.TetrahedronGeometry(1.5);
      break;
    case 'cube':
      nativeGeometry = new THREE.BoxGeometry(2.5, 2.5, 2.5);
      break;
    case 'octahedron':
      nativeGeometry = new THREE.OctahedronGeometry(1.8);
      break;
    case 'dodecahedron':
      nativeGeometry = new THREE.DodecahedronGeometry(1.8);
      break;
    case 'icosahedron':
      nativeGeometry = new THREE.IcosahedronGeometry(1.8);
      break;
    default:
      nativeGeometry = new THREE.BoxGeometry(1,1,1);
      break;
  }

  const nativeMesh = new THREE.Mesh(nativeGeometry, state.nativeMaterial);
  nativeMesh.position.set(position.x - 1.8, 3.5, position.z);
  nativeMesh.castShadow = true;
  nativeMesh.receiveShadow = true;
  nativeMesh.userData = { type: 'native' };
  state.nativeGeometries.add(nativeMesh);

  // GraphGeometry equivalent
  const graphGeom = new GraphGeometry(type, 1.5, {
    nodeColor: 0x4ecdc4,
    edgeColor: 0x45b7d1,
    nodeRadius: 0.08,
    edgeRadius: 0.025
  });
  graphGeom.position.set(position.x + 1.8, 3.5, position.z);
  graphGeom.userData = { type: 'graph' };
  state.graphGeometries.add(graphGeom);

  // Labels
  createLabel(`Native ${position.name}`, position.x - 1.8, 1.5, position.z);
  createLabel(`Graph ${position.name}`, position.x + 1.8, 1.5, position.z);
  createLabel(position.name, position.x, 0.5, position.z, '#ffff00');
}

function createSceneExtras() {
  // Ground plane
  const groundGeometry = new THREE.PlaneGeometry(45, 20);
  state.groundPlane = new THREE.Mesh(groundGeometry, state.groundMaterial);
  state.groundPlane.rotation.x = -Math.PI / 2;
  state.groundPlane.position.y = -0.5;
  state.groundPlane.receiveShadow = true;
  state.scene.add(state.groundPlane);

  // Grid helper
  state.grid = new THREE.GridHelper(45, 45, 0x444444, 0x222222);
  state.grid.position.y = -0.49;
  state.scene.add(state.grid);
}

function createLabel(text, x, y, z, color = 'white') {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = 300;
  canvas.height = 80;

  context.fillStyle = 'rgba(0, 0, 0, 0.8)';
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = color;
  context.font = 'bold 24px Arial';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(text, canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.SpriteMaterial({ map: texture });
  const sprite = new THREE.Sprite(material);
  sprite.position.set(x, y, z);
  sprite.scale.set(3, 0.8, 1);

  state.scene.add(sprite);
}

function setupControls() {
  const autoRotateCheckbox = document.getElementById('autoRotate');
  autoRotateCheckbox.addEventListener('change', e => {
    state.controls.autoRotate = e.target.checked;
  });
  state.controls.autoRotate = true;
  state.controls.autoRotateSpeed = 0.5;

  const showGridCheckbox = document.getElementById('showGrid');
  showGridCheckbox.addEventListener('change', e => {
    state.grid.visible = e.target.checked;
    state.groundPlane.visible = e.target.checked;
  });

  const nativeWireframeCheckbox = document.getElementById('nativeWireframe');
  nativeWireframeCheckbox.addEventListener('change', e => {
    state.nativeMaterial.wireframe = e.target.checked;
  });

  const nativeOpacitySlider = document.getElementById('nativeOpacity');
  const nativeOpacityValue = document.getElementById('nativeOpacityValue');
  nativeOpacitySlider.addEventListener('input', e => {
    const value = parseFloat(e.target.value);
    state.nativeMaterial.opacity = value;
    nativeOpacityValue.textContent = value.toFixed(1);
  });

  const nativeSizeSlider = document.getElementById('nativeSize');
  const nativeSizeValue = document.getElementById('nativeSizeValue');
  nativeSizeSlider.addEventListener('input', e => {
    const value = parseFloat(e.target.value);
    state.nativeGeometries.children.forEach(child => {
      if (child.userData.type === 'native') {
        child.scale.setScalar(value);
      }
    });
    nativeSizeValue.textContent = value.toFixed(1);
  });

  const showNodesCheckbox = document.getElementById('showNodes');
  showNodesCheckbox.addEventListener('change', e => {
    toggleNodesVisibility(e.target.checked);
  });

  const showEdgesCheckbox = document.getElementById('showEdges');
  showEdgesCheckbox.addEventListener('change', e => {
    toggleEdgesVisibility(e.target.checked);
  });

  const nodeSizeSlider = document.getElementById('nodeSize');
  const nodeSizeValue = document.getElementById('nodeSizeValue');
  nodeSizeSlider.addEventListener('input', e => {
    const value = parseFloat(e.target.value);
    updateNodeSizes(value);
    nodeSizeValue.textContent = value.toFixed(2);
  });

  const edgeSizeSlider = document.getElementById('edgeSize');
  const edgeSizeValue = document.getElementById('edgeSizeValue');
  edgeSizeSlider.addEventListener('input', e => {
    const value = parseFloat(e.target.value);
    updateEdgeSizes(value);
    edgeSizeValue.textContent = value.toFixed(3);
  });

  const resetCameraButton = document.getElementById('resetCamera');
  resetCameraButton.addEventListener('click', () => {
    state.camera.position.set(25, 15, 25);
    state.controls.target.set(0, 2, 0);
    state.controls.update();
  });
}

function toggleNodesVisibility(visible) {
  state.graphGeometries.traverse(child => {
    if (child.isMesh && child.geometry.type === 'SphereGeometry') {
      child.visible = visible;
    }
  });
}

function toggleEdgesVisibility(visible) {
  state.graphGeometries.traverse(child => {
    if (child.isMesh &&
        (child.geometry.type === 'CylinderGeometry' ||
         child.geometry.type === 'ConeGeometry')) {
      child.visible = visible;
    }
  });
}

function updateNodeSizes(newSize) {
  const baseSize = 0.08;
  const scale = newSize / baseSize;
  state.graphGeometries.traverse(child => {
    if (child.isMesh && child.geometry.type === 'SphereGeometry') {
      child.scale.setScalar(scale);
    }
  });
}

function updateEdgeSizes(newSize) {
  const baseSize = 0.025;
  const scale = newSize / baseSize;
  state.graphGeometries.traverse(child => {
    if (child.isMesh &&
        (child.geometry.type === 'CylinderGeometry' ||
         child.geometry.type === 'ConeGeometry')) {
      // Escalado solo en X y Z para los bordes (el grosor)
      child.scale.x = scale;
      child.scale.z = scale;
    }
  });
}

function updateStats() {
  state.frameCount++;
  const currentTime = performance.now();
  if (currentTime >= state.lastTime + 1000) {
    state.fps = Math.round((state.frameCount * 1000) / (currentTime - state.lastTime));
    state.frameCount = 0;
    state.lastTime = currentTime;
  }

  let objectCount = 0;
  let triangleCount = 0;
  let vertexCount = 0;

  state.scene.traverse(child => {
    if (child.isMesh) {
      objectCount++;
      const geometry = child.geometry;
      if (geometry.index) {
        triangleCount += geometry.index.count / 3;
      } else if (geometry.attributes.position) {
        triangleCount += geometry.attributes.position.count / 3;
      }
      if (geometry.attributes.position) {
        vertexCount += geometry.attributes.position.count;
      }
    }
  });

  // Actualizar DOM (asumo que ya tenés estos spans / elementos con esos IDs)
  const fpsEl = document.getElementById('fps');
  if (fpsEl) fpsEl.textContent = state.fps;
  const objEl = document.getElementById('objectCount');
  if (objEl) objEl.textContent = objectCount;
  const triEl = document.getElementById('triangleCount');
  if (triEl) triEl.textContent = Math.round(triangleCount);
  const vertEl = document.getElementById('vertexCount');
  if (vertEl) vertEl.textContent = vertexCount;
}

function onWindowResize() {
  state.camera.aspect = window.innerWidth / window.innerHeight;
  state.camera.updateProjectionMatrix();
  state.renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);

  // Auto-rotación
  const autoRotateCheckbox = document.getElementById('autoRotate');
  if (autoRotateCheckbox && autoRotateCheckbox.checked) {
    state.nativeGeometries.children.forEach((child, index) => {
      if (child.userData.type === 'native') {
        child.rotation.y += state.autoRotateSpeed * (1 + index * 0.1);
        child.rotation.x += state.autoRotateSpeed * 0.3;
      }
    });
    state.graphGeometries.children.forEach((child, index) => {
      if (child.userData.type === 'graph') {
        child.rotation.y += state.autoRotateSpeed * (1 + index * 0.1);
        child.rotation.x += state.autoRotateSpeed * 0.3;
      }
    });
  }

  state.controls.update();
  updateStats();
  state.renderer.render(state.scene, state.camera);
}

// Punto de partida
function start() {
  registerPlatonicPresets();
  initScene();
  createPlatonicComparisons();
  createSceneExtras();
  setupControls();
  animate();
}

start();