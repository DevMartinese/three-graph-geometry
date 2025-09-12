import * as THREE from 'three';

export class Networks {
  static circular(count = 12, radius = 3) {
    const nodes = [];
    const edges = [];

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      nodes.push(new THREE.Vector3(
        radius * Math.cos(angle),
        radius * Math.sin(angle),
        0
      ));
    }
    
    for (let i = 0; i < count; i++) {
      edges.push([i, (i + 1) % count]);
    }

    return { nodes, edges };
  }

  static star(count = 8, radius = 2) {
    const nodes = [];
    const edges = [];

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      nodes.push(new THREE.Vector3(
        radius * Math.cos(angle),
        radius * Math.sin(angle),
        0
      ));
    }
    
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        edges.push([i, j]);
      }
    }

    return { nodes, edges };
  }

  static grid(rows = 3, cols = 3, spacing = 2) {
    const nodes = [];
    const edges = [];

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

    return { nodes, edges };
  }

  static lattice(nx = 2, ny = 1, nz = 1, spacing = 2) {
    const nodes = [];
    const edges = [];
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

    return { nodes, edges };
  }

  static spokes(count = 4, length = 2, angleOffset = 0) {
    const nodes = [new THREE.Vector3(0, 0, 0)]; // center
    const edges = [];

    for (let i = 0; i < count; i++) {
      const a = angleOffset + (i / count) * Math.PI * 2;
      const p = new THREE.Vector3(Math.cos(a) * length, Math.sin(a) * length, 0);
      nodes.push(p);
      edges.push([0, i + 1]);
    }

    return { nodes, edges };
  }
}