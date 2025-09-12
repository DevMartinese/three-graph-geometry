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
      nodeRadius    = 0.12,
      edgeRadius    = 0.02,
      nodeColor     = 0x00ffff,
      edgeColor     = 0xffffff,
      nodeSegments  = 16,   // detalle esfera
      edgeSegments  = 8,    // detalle cilindro
      directed      = false, // flechas 3D
      arrowSize     = 0.18,
      arrowSegments = 8,
      // per-node
      nodeRadii     = null,  // number[] (opcional)
      nodeColors    = null   // number[] | (i)=>number (opcional)
    } = options;

    let nodes = [];
    let edges = [];

    switch (type) {
      // ----- Presets existentes -----
      case 'circular': {
        const [count = 12, radius = 3] = params;
        for (let i = 0; i < count; i++) {
          const angle = (i / count) * Math.PI * 2;
          nodes.push(new THREE.Vector3(
            radius * Math.cos(angle),
            radius * Math.sin(angle),
            0
          ));
        }
        for (let i = 0; i < count; i++) edges.push([i, (i + 1) % count]);
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
        const [baseSize = 2, height = 2] = params;
        nodes.push(new THREE.Vector3(0, height, 0));
        nodes.push(new THREE.Vector3(-baseSize, 0, -baseSize));
        nodes.push(new THREE.Vector3( baseSize, 0, -baseSize));
        nodes.push(new THREE.Vector3( baseSize, 0,  baseSize));
        nodes.push(new THREE.Vector3(-baseSize, 0,  baseSize));
        edges = [[0,1],[0,2],[0,3],[0,4],[1,2],[2,3],[3,4],[4,1]];
        break;
      }

      case 'cone': {
        const [radius = 2, height = 3, baseSegments = 8] = params;
        nodes.push(new THREE.Vector3(0, height * 0.5, 0));
        for (let i = 0; i < baseSegments; i++) {
          const a = (i / baseSegments) * Math.PI * 2;
          nodes.push(new THREE.Vector3(
            radius * Math.cos(a),
            -height * 0.5,
            radius * Math.sin(a)
          ));
          edges.push([0, i + 1]);
        }
        for (let i = 1; i <= baseSegments; i++) {
          edges.push([i, i === baseSegments ? 1 : i + 1]);
        }
        break;
      }

      case 'cube': {
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
          [0,1],[1,2],[2,3],[3,0],
          [4,5],[5,6],[6,7],[7,4],
          [0,4],[1,5],[2,6],[3,7]
        ];
        break;
      }

      case 'prism': {
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
        const [length = 2] = params;
        nodes = [
          new THREE.Vector3(-length/2, 0, 0),
          new THREE.Vector3( length/2, 0, 0)
        ];
        edges = [[0,1]];
        break;
      }

      case 'triangle': {
        const [size = 2] = params;
        nodes = [
          new THREE.Vector3(0,  size, 0),
          new THREE.Vector3(-size, -size, 0),
          new THREE.Vector3( size, -size, 0)
        ];
        edges = [[0,1],[1,2],[2,0]];
        break;
      }

      case 'lattice': {
        // (nx, ny, nz, spacing) — malla 3D de celdas
        const [nx = 2, ny = 1, nz = 1, spacing = 2] = params;
        const idx = (i, j, k) => i + (nx + 1) * (j + (ny + 1) * k);

        for (let k = 0; k <= nz; k++) {
          for (let j = 0; j <= ny; j++) {
            for (let i = 0; i <= nx; i++) {
              nodes.push(new THREE.Vector3(i * spacing, j * spacing, k * spacing));
            }
          }
        }
        for (let k = 0; k <= nz; k++) {
          for (let j = 0; j <= ny; j++) {
            for (let i = 0; i <= nx; i++) {
              const a = idx(i, j, k);
              if (i < nx) edges.push([a, idx(i + 1, j, k)]);
              if (j < ny) edges.push([a, idx(i, j + 1, k)]);
              if (k < nz) edges.push([a, idx(i, j, k + 1)]);
            }
          }
        }
        break;
      }

      // ----- NUEVOS basados en líneas -----
      case 'spokes': {
        // (count, length, angleOffset = 0)
        const [count = 4, length = 2, angleOffset = 0] = params;
        nodes.push(new THREE.Vector3(0, 0, 0)); // centro
        for (let i = 0; i < count; i++) {
          const a = angleOffset + (i / count) * Math.PI * 2;
          const p = new THREE.Vector3(Math.cos(a) * length, Math.sin(a) * length, 0);
          nodes.push(p);
          edges.push([0, i + 1]);
        }
        break;
      }

      case 'polyline': {
        // ([points])
        const [points = []] = params;
        if ((points || []).length < 2) break;
        nodes = points.map(p => (p.isVector3 ? p : new THREE.Vector3(p.x, p.y, p.z ?? 0)));
        for (let i = 0; i < nodes.length - 1; i++) edges.push([i, i + 1]);
        break;
      }

      case 'paths': {
        // ([paths], optionsPaths?)  paths = Array<Array<Vector3 | {x,y,z}>>
        const [paths = [], optionsPaths = {}] = params;
        const { merge = false, mergeTolerance = 1e-6 } = optionsPaths;

        const keyOf = (v) => {
          const kx = Math.round(v.x / mergeTolerance);
          const ky = Math.round(v.y / mergeTolerance);
          const kz = Math.round((v.z ?? 0) / mergeTolerance);
          return `${kx},${ky},${kz}`;
        };

        if (!merge) {
          for (const pts of paths) {
            const startIdx = nodes.length;
            const local = (pts || []).map(p => (p.isVector3 ? p : new THREE.Vector3(p.x, p.y, p.z ?? 0)));
            nodes.push(...local);
            for (let i = 0; i < local.length - 1; i++) edges.push([startIdx + i, startIdx + i + 1]);
          }
        } else {
          const map = new Map(); // key -> node index
          const getIndex = (v) => {
            const k = keyOf(v);
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
        break;
      }

      default:
        console.warn(`GraphGeometry: Unknown type "${type}"`);
        break;
    }

    // ====== MATERIALES / GEOMETRÍAS ======
    const nodeMaterial = new THREE.MeshStandardMaterial({ color: nodeColor });
    const edgeMaterial = new THREE.MeshStandardMaterial({ color: edgeColor });
    const nodeGeometry = new THREE.SphereGeometry(nodeRadius, nodeSegments, nodeSegments);

    // ====== NODOS (per-node radius/color opcional) ======
    nodes.forEach((pos, i) => {
      const sphere = new THREE.Mesh(nodeGeometry, nodeMaterial);

      if (nodeRadii && nodeRadii[i] != null) {
        const r = nodeRadii[i];
        sphere.scale.setScalar(r / nodeRadius);
      }

      if (nodeColors) {
        const col = (typeof nodeColors === 'function') ? nodeColors(i) : nodeColors[i];
        if (col != null) {
          sphere.material = nodeMaterial.clone();
          sphere.material.color = new THREE.Color(col);
        }
      }

      sphere.position.copy(pos);
      sphere.userData.index = i;
      this.add(sphere);
    });

    // ====== EDGES (acepta [a,b] o {a,b,radius,color}) ======
    const normalizedEdges = edges.map(e => {
      if (Array.isArray(e)) return { a: e[0], b: e[1], radius: edgeRadius, color: edgeColor };
      return {
        a: e.a, b: e.b,
        radius: e.radius ?? edgeRadius,
        color:  e.color  ?? edgeColor
      };
    });

    normalizedEdges.forEach(({ a, b, radius, color }) => {
      const start = nodes[a];
      const end   = nodes[b];
      const distance = start.distanceTo(end);
      const midpoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);

      const orientation = new THREE.Matrix4().lookAt(start, end, new THREE.Vector3(0, 1, 0));
      const rotX = new THREE.Matrix4().makeRotationX(Math.PI / 2);
      orientation.multiply(rotX);

      const mat = (color !== edgeColor) ? edgeMaterial.clone() : edgeMaterial;
      if (mat !== edgeMaterial) mat.color = new THREE.Color(color);

      const cylGeo = new THREE.CylinderGeometry(radius, radius, distance, edgeSegments);
      const cylinder = new THREE.Mesh(cylGeo, mat);
      cylinder.applyMatrix4(orientation);
      cylinder.position.copy(midpoint);
      cylinder.userData.indices = [a, b];
      this.add(cylinder);

      // Flecha 3D opcional
      if (directed) {
        const dir = new THREE.Vector3().subVectors(end, start).normalize();
        const destNodeR = nodeRadii && nodeRadii[b] != null ? nodeRadii[b] : nodeRadius;
        const tipOffset = destNodeR + arrowSize * 0.5;
        const tipPos = new THREE.Vector3().copy(end).addScaledVector(dir, -tipOffset);

        const aGeo = new THREE.ConeGeometry(radius * 2.2, arrowSize, arrowSegments);
        const aMesh = new THREE.Mesh(aGeo, mat);
        aMesh.applyMatrix4(orientation);
        aMesh.position.copy(tipPos);
        this.add(aMesh);
      }
    });

    // ====== Limpieza ======
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