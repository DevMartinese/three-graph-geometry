import * as THREE from 'three';

const graphPresets = new Map();

export function registerGraphPreset(name, generator) {
  graphPresets.set(name, generator);
}

function generatePresetGraph(preset) {
  if (graphPresets.has(preset)) {
    return graphPresets.get(preset)();
  }

  return { nodes: [], edges: [] };
}

function applyLayout(type, count, options = {}) {
  const nodes = [];

  
if (type === 'grid') {
  const rows = options.rows || 3;
  const cols = options.cols || 3;
  const spacing = options.spacing || 2;
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      nodes.push(new THREE.Vector3(j * spacing, -i * spacing, 0));
    }
  }
}

if (type === 'circular') {
    const radius = options.radius || 3;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);
      nodes.push(new THREE.Vector3(x, y, 0));
    }
  }

  // You can expand with more layouts here (e.g., grid, forceDirected, etc.)

  return nodes;
}

export class GraphObject extends THREE.Group {
  constructor(inputNodes = [], inputEdges = [], options = {}) {
    super();

    if (inputNodes && typeof inputNodes === 'object' && !Array.isArray(inputNodes)) {
      options = inputNodes;

      const preset = options.preset;
      const layout = options.layout;

      if (preset) {
        const { nodes, edges } = generatePresetGraph(preset);
        inputNodes = nodes;
        inputEdges = edges;
      } else if (layout) {
        const nodeCount = options.nodeCount || 10;
        inputNodes = applyLayout(layout, nodeCount, options.layoutOptions);
        inputEdges = options.edges || [];
      }
    }

    const {
      nodeRadius = 0.1,
      nodeColor = 0x00ffff,
      edgeRadius = 0.02,
      edgeColor = 0xffffff,
    } = options;

    const nodeMaterial = new THREE.MeshStandardMaterial({ color: nodeColor });
    const nodeGeometry = new THREE.SphereGeometry(nodeRadius, 16, 16);

    const usedIndices = new Set();
    inputEdges.forEach(([a, b]) => {
      usedIndices.add(a);
      usedIndices.add(b);
    });

    const maxIndex = Math.max(...usedIndices, inputNodes.length - 1);
    for (let i = inputNodes.length; i <= maxIndex; i++) {
      inputNodes[i] = new THREE.Vector3(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      );
    }

    usedIndices.forEach((i) => {
      const pos = inputNodes[i];
      const sphere = new THREE.Mesh(nodeGeometry, nodeMaterial);
      sphere.position.copy(pos);
      this.add(sphere);
    });

    const edgeMaterial = new THREE.MeshStandardMaterial({ color: edgeColor });
    inputEdges.forEach(([i1, i2]) => {
      const start = inputNodes[i1];
      const end = inputNodes[i2];

      const distance = start.distanceTo(end);
      const midpoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);

      const orientation = new THREE.Matrix4();
      orientation.lookAt(start, end, new THREE.Vector3(0, 1, 0));
      const rotation = new THREE.Matrix4().makeRotationX(Math.PI / 2);
      orientation.multiply(rotation);

      const cylinderGeometry = new THREE.CylinderGeometry(edgeRadius, edgeRadius, distance, 8);
      const cylinder = new THREE.Mesh(cylinderGeometry, edgeMaterial);

      cylinder.applyMatrix4(orientation);
      cylinder.position.copy(midpoint);

      this.add(cylinder);
    });
  }
}