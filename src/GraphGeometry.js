// GraphGeometry.js
import * as THREE from 'three';

export class GraphGeometry extends THREE.Group {
  constructor(type, ...params) {
    super();

    // Último parámetro opcional: opciones de apariencia / detalle
    const last = params[params.length - 1];
    const hasOptions = typeof last === 'object' && !Array.isArray(last);
    const options = hasOptions ? params.pop() : {};

    const {
      nodeRadius   = 0.12,
      edgeRadius   = 0.02,
      nodeColor    = 0x00ffff,
      edgeColor    = 0xffffff,
      nodeSegments = 16,   // detalle de la esfera
      edgeSegments = 8     // detalle del cilindro
    } = options;

    let nodes = [];
    let edges = [];

    switch (type) {
      case 'circular': {
        // (count, radius, [options])
        const [count = 12, radius = 3] = params;
        for (let i = 0; i < count; i++) {
          const angle = (i / count) * Math.PI * 2;
          nodes.push(new THREE.Vector3(
            radius * Math.cos(angle),
            radius * Math.sin(angle),
            0
          ));
        }
        // anillo
        for (let i = 0; i < count; i++) edges.push([i, (i + 1) % count]);
        break;
      }

      case 'grid': {
        // (rows, cols, spacing, [options])
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
        // (count, radius, [options]) — todos-contra-todos en círculo
        const [count = 8, radius = 2] = params;
        for (let i = 0; i < count; i++) {
          const angle = (i / count) * Math.PI * 2;
          nodes.push(new THREE.Vector3(
            radius * Math.cos(angle),
            radius * Math.sin(angle),
            0
          ));
        }
        for (let i = 0; i < count; i++) {
          for (let j = i + 1; j < count; j++) edges.push([i, j]);
        }
        break;
      }

      case 'pyramid': {
        // (baseSize, height, [options])
        const [baseSize = 2, height = 2] = params;
        nodes.push(new THREE.Vector3(0, height, 0)); // apex
        nodes.push(new THREE.Vector3(-baseSize, 0, -baseSize));
        nodes.push(new THREE.Vector3( baseSize, 0, -baseSize));
        nodes.push(new THREE.Vector3( baseSize, 0,  baseSize));
        nodes.push(new THREE.Vector3(-baseSize, 0,  baseSize));
        edges = [
          [0,1],[0,2],[0,3],[0,4], // lados
          [1,2],[2,3],[3,4],[4,1]  // base
        ];
        break;
      }

      case 'cone': {
        // (radius, height, baseSegments, [options])
        const [radius = 2, height = 3, baseSegments = 8] = params;
        // apex
        nodes.push(new THREE.Vector3(0, height * 0.5, 0));
        // base
        for (let i = 0; i < baseSegments; i++) {
          const a = (i / baseSegments) * Math.PI * 2;
          nodes.push(new THREE.Vector3(
            radius * Math.cos(a),
            -height * 0.5,
            radius * Math.sin(a)
          ));
          edges.push([0, i + 1]); // apex → punto de base
        }
        // círculo base
        for (let i = 1; i <= baseSegments; i++) {
          edges.push([i, i === baseSegments ? 1 : i + 1]);
        }
        break;
      }

      case 'cube': {
        // (size, [options]) — size = semi-extensión; tamaño total = 2*size
        const [size = 2] = params;
        nodes = [
          new THREE.Vector3(-size, -size, -size),
          new THREE.Vector3( size, -size, -size),
          new THREE.Vector3( size,  size, -size),
          new THREE.Vector3(-size,  size, -size),
          new THREE.Vector3(-size, -size,  size),
          new THREE.Vector3( size, -size,  size),
          new THREE.Vector3( size,  size,  size),
          new THREE.Vector3(-size,  size,  size),
        ];
        edges = [
          [0,1],[1,2],[2,3],[3,0], // base inferior
          [4,5],[5,6],[6,7],[7,4], // base superior
          [0,4],[1,5],[2,6],[3,7]  // verticales
        ];
        break;
      }

      case 'prism': {
        // (width, height, depth, [options]) — rectangular
        const [width = 2, height = 2, depth = 1] = params;
        nodes = [
          new THREE.Vector3(-width, -height, -depth),
          new THREE.Vector3( width, -height, -depth),
          new THREE.Vector3( width,  height, -depth),
          new THREE.Vector3(-width,  height, -depth),
          new THREE.Vector3(-width, -height,  depth),
          new THREE.Vector3( width, -height,  depth),
          new THREE.Vector3( width,  height,  depth),
          new THREE.Vector3(-width,  height,  depth),
        ];
        edges = [
          [0,1],[1,2],[2,3],[3,0],
          [4,5],[5,6],[6,7],[7,4],
          [0,4],[1,5],[2,6],[3,7]
        ];
        break;
      }

      case 'octahedron': {
        // (size, [options]) — size = semi-extensión
        const [size = 2] = params;
        nodes = [
          new THREE.Vector3(0,  size, 0),
          new THREE.Vector3(-size, 0, 0),
          new THREE.Vector3(0, 0,  size),
          new THREE.Vector3( size, 0, 0),
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
        // (length, [options])
        const [length = 2] = params;
        nodes = [
          new THREE.Vector3(-length/2, 0, 0),
          new THREE.Vector3( length/2, 0, 0)
        ];
        edges = [[0,1]];
        break;
      }

      case 'triangle': {
        // (size, [options]) — size = semi-extensión vertical
        const [size = 2] = params;
        nodes = [
          new THREE.Vector3(0,  size, 0),
          new THREE.Vector3(-size, -size, 0),
          new THREE.Vector3( size, -size, 0)
        ];
        edges = [[0,1],[1,2],[2,0]];
        break;
      }

      default:
        console.warn(`GraphGeometry: Unknown type "${type}"`);
        break;
    }

    // Materiales y geometría reusables para nodos
    const nodeMaterial = new THREE.MeshStandardMaterial({ color: nodeColor });
    const edgeMaterial = new THREE.MeshStandardMaterial({ color: edgeColor });
    const nodeGeometry = new THREE.SphereGeometry(nodeRadius, nodeSegments, nodeSegments);

    // Crear nodos (esferas)
    nodes.forEach((pos) => {
      const sphere = new THREE.Mesh(nodeGeometry, nodeMaterial);
      sphere.position.copy(pos);
      this.add(sphere);
    });

    // Crear aristas (cilindros individuales porque la altura varía)
    edges.forEach(([i1, i2]) => {
      const start = nodes[i1];
      const end   = nodes[i2];
      const distance = start.distanceTo(end);
      const midpoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);

      // Orientar cilindro: por defecto apunta en +Y; lo rotamos hacia (start→end)
      const orientation = new THREE.Matrix4().lookAt(start, end, new THREE.Vector3(0, 1, 0));
      const rotX = new THREE.Matrix4().makeRotationX(Math.PI / 2);
      orientation.multiply(rotX);

      const cylGeo = new THREE.CylinderGeometry(edgeRadius, edgeRadius, distance, edgeSegments);
      const cylinder = new THREE.Mesh(cylGeo, edgeMaterial);
      cylinder.applyMatrix4(orientation);
      cylinder.position.copy(midpoint);

      this.add(cylinder);
    });

    // Método para liberar recursos cuando remuevas el grafo de la escena
    this.dispose = () => {
      nodeGeometry.dispose();
      nodeMaterial.dispose();
      edgeMaterial.dispose();
      this.traverse(obj => {
        if (obj.isMesh && obj.geometry && obj.geometry !== nodeGeometry) {
          obj.geometry.dispose();
        }
      });
    };
  }
}