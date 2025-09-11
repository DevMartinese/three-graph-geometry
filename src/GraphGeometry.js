import * as THREE from 'three';

export class GraphGeometry extends THREE.Group {
  constructor(type, ...params) {
    super();

    let nodes = [];
    let edges = [];

    switch (type) {
      case 'circular': {
        const [count = 12, radius = 3] = params;
        for (let i = 0; i < count; i++) {
          const angle = (i / count) * Math.PI * 2;
          const x = radius * Math.cos(angle);
          const y = radius * Math.sin(angle);
          nodes.push(new THREE.Vector3(x, y, 0));
        }

        for (let i = 0; i < count; i++) {
          edges.push([i, (i + 1) % count]);
        }
        break;
      }

      case 'grid': {
        const [rows = 3, cols = 3, spacing = 2] = params;
        for (let i = 0; i < rows; i++) {
          for (let j = 0; j < cols; j++) {
            nodes.push(new THREE.Vector3(j * spacing, -i * spacing, 0));
          }
        }

        for (let i = 0; i < rows; i++) {
          for (let j = 0; j < cols; j++) {
            const idx = i * cols + j;
            if (j < cols - 1) edges.push([idx, idx + 1]);
            if (i < rows - 1) edges.push([idx, idx + cols]);
          }
        }
        break;
      }

      case 'star': {
        const [count = 8, radius = 2] = params;
        for (let i = 0; i < count; i++) {
          const angle = (i / count) * Math.PI * 2;
          const x = radius * Math.cos(angle);
          const y = radius * Math.sin(angle);
          nodes.push(new THREE.Vector3(x, y, 0));
        }

        for (let i = 0; i < count; i++) {
          for (let j = i + 1; j < count; j++) {
            edges.push([i, j]);
          }
        }
        break;
      }

      case 'pyramid': {
        const [baseSize = 2, height = 2] = params;
        nodes.push(new THREE.Vector3(0, height, 0)); // top
        nodes.push(new THREE.Vector3(-baseSize, 0, -baseSize));
        nodes.push(new THREE.Vector3(baseSize, 0, -baseSize));
        nodes.push(new THREE.Vector3(baseSize, 0, baseSize));
        nodes.push(new THREE.Vector3(-baseSize, 0, baseSize));

        edges = [
          [0, 1], [0, 2], [0, 3], [0, 4],
          [1, 2], [2, 3], [3, 4], [4, 1]
        ];
        break;
      }

      case 'cube': {
        const [size = 2] = params;
        // 8 vértices del cubo
        nodes = [
          new THREE.Vector3(-size, -size, -size),
          new THREE.Vector3(size, -size, -size),
          new THREE.Vector3(size, size, -size),
          new THREE.Vector3(-size, size, -size),
          new THREE.Vector3(-size, -size, size),
          new THREE.Vector3(size, -size, size),
          new THREE.Vector3(size, size, size),
          new THREE.Vector3(-size, size, size),
        ];
        // 12 aristas del cubo
        edges = [
          [0,1],[1,2],[2,3],[3,0], // base inferior
          [4,5],[5,6],[6,7],[7,4], // base superior
          [0,4],[1,5],[2,6],[3,7]  // verticales
        ];
        break;
      }
      case 'prism': {
        const [width = 2, height = 2, depth = 1] = params;
        // 8 vértices del prisma rectangular
        nodes = [
          new THREE.Vector3(-width, -height, -depth),
          new THREE.Vector3(width, -height, -depth),
          new THREE.Vector3(width, height, -depth),
          new THREE.Vector3(-width, height, -depth),
          new THREE.Vector3(-width, -height, depth),
          new THREE.Vector3(width, -height, depth),
          new THREE.Vector3(width, height, depth),
          new THREE.Vector3(-width, height, depth),
        ];
        edges = [
          [0,1],[1,2],[2,3],[3,0],
          [4,5],[5,6],[6,7],[7,4],
          [0,4],[1,5],[2,6],[3,7]
        ];
        break;
      }
      case 'octahedron': {
        const [size = 2] = params;
        nodes = [
          new THREE.Vector3(0, size, 0),
          new THREE.Vector3(-size, 0, 0),
          new THREE.Vector3(0, 0, size),
          new THREE.Vector3(size, 0, 0),
          new THREE.Vector3(0, 0, -size),
          new THREE.Vector3(0, -size, 0),
        ];
        edges = [
          [0,1],[0,2],[0,3],[0,4],
          [5,1],[5,2],[5,3],[5,4],
          [1,2],[2,3],[3,4],[4,1]
        ];
        break;
      }
      case 'line': {
        const [length = 2] = params;
        nodes = [
          new THREE.Vector3(-length/2, 0, 0),
          new THREE.Vector3(length/2, 0, 0)
        ];
        edges = [[0,1]];
        break;
      }
      case 'triangle': {
        const [size = 2] = params;
        nodes = [
          new THREE.Vector3(0, size, 0),
          new THREE.Vector3(-size, -size, 0),
          new THREE.Vector3(size, -size, 0)
        ];
        edges = [[0,1],[1,2],[2,0]];
        break;
      }

      default:
        console.warn(`GraphGeometry: Unknown type "${type}"`);
        break;
    }

    const nodeMaterial = new THREE.MeshStandardMaterial({ color: 0x00ffff });
    const edgeMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const nodeGeometry = new THREE.SphereGeometry(0.1, 16, 16);

    nodes.forEach((pos) => {
      const sphere = new THREE.Mesh(nodeGeometry, nodeMaterial);
      sphere.position.copy(pos);
      this.add(sphere);
    });

    edges.forEach(([i1, i2]) => {
      const start = nodes[i1];
      const end = nodes[i2];
      const distance = start.distanceTo(end);
      const midpoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);

      const orientation = new THREE.Matrix4();
      orientation.lookAt(start, end, new THREE.Vector3(0, 1, 0));
      const rotation = new THREE.Matrix4().makeRotationX(Math.PI / 2);
      orientation.multiply(rotation);

      const cylinderGeometry = new THREE.CylinderGeometry(0.02, 0.02, distance, 8);
      const cylinder = new THREE.Mesh(cylinderGeometry, edgeMaterial);
      cylinder.applyMatrix4(orientation);
      cylinder.position.copy(midpoint);

      this.add(cylinder);
    });
  }
}