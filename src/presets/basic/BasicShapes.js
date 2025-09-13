import * as THREE from 'three';

export class BasicShapes {
  static cube(size = 2, options = {}) {
    const { includeFaceCenters = false } = options;
  
    const nodes = [
      new THREE.Vector3(-size, -size, -size),
      new THREE.Vector3( size, -size, -size),
      new THREE.Vector3( size,  size, -size),
      new THREE.Vector3(-size,  size, -size),
      new THREE.Vector3(-size, -size,  size),
      new THREE.Vector3( size, -size,  size),
      new THREE.Vector3( size,  size,  size),
      new THREE.Vector3(-size,  size,  size),
    ];
  
    const edges = [
      [0,1],[1,2],[2,3],[3,0],
      [4,5],[5,6],[6,7],[7,4],
      [0,4],[1,5],[2,6],[3,7]
    ];
  
    if (includeFaceCenters) {
      const faceCenters = [
        [0,1,2,3], [4,5,6,7],
        [0,1,5,4], [3,2,6,7],
        [1,2,6,5], [0,3,7,4]
      ];
      faceCenters.forEach(face => {
        const center = new THREE.Vector3();
        face.forEach(i => center.add(nodes[i]));
        center.divideScalar(4);
        const idx = nodes.length;
        nodes.push(center);
        face.forEach(i => edges.push([idx, i]));
      });
    }
  
    return { nodes, edges };
  }

  static pyramid(baseSize = 2, height = 2) {
    const nodes = [
      new THREE.Vector3(0, height, 0),
      new THREE.Vector3(-baseSize, 0, -baseSize),
      new THREE.Vector3( baseSize, 0, -baseSize),
      new THREE.Vector3( baseSize, 0,  baseSize),
      new THREE.Vector3(-baseSize, 0,  baseSize)
    ];
    
    const edges = [[0,1],[0,2],[0,3],[0,4],[1,2],[2,3],[3,4],[4,1]];

    return { nodes, edges };
  }

  static prism(width = 2, height = 2, depth = 1) {
    const nodes = [
      new THREE.Vector3(-width, -height, -depth),
      new THREE.Vector3( width, -height, -depth),
      new THREE.Vector3( width,  height, -depth),
      new THREE.Vector3(-width,  height, -depth),
      new THREE.Vector3(-width, -height,  depth),
      new THREE.Vector3( width, -height,  depth),
      new THREE.Vector3( width,  height,  depth),
      new THREE.Vector3(-width,  height,  depth),
    ];
    
    const edges = [
      [0,1],[1,2],[2,3],[3,0],
      [4,5],[5,6],[6,7],[7,4],
      [0,4],[1,5],[2,6],[3,7]
    ];

    return { nodes, edges };
  }

  static octahedron(size = 2) {
    const nodes = [
      new THREE.Vector3(0,  size, 0),
      new THREE.Vector3(-size, 0, 0),
      new THREE.Vector3(0, 0,  size),
      new THREE.Vector3( size, 0, 0),
      new THREE.Vector3(0, 0, -size),
      new THREE.Vector3(0, -size, 0),
    ];
    
    const edges = [
      [0,1],[0,2],[0,3],[0,4],
      [5,1],[5,2],[5,3],[5,4],
      [1,2],[2,3],[3,4],[4,1]
    ];

    return { nodes, edges };
  }

  static triangle(size = 2) {
    const nodes = [
      new THREE.Vector3(0,  size, 0),
      new THREE.Vector3(-size, -size, 0),
      new THREE.Vector3( size, -size, 0)
    ];
    
    const edges = [[0,1],[1,2],[2,0]];

    return { nodes, edges };
  }

  static line(length = 2) {
    const nodes = [
      new THREE.Vector3(-length/2, 0, 0),
      new THREE.Vector3( length/2, 0, 0)
    ];
    
    const edges = [[0,1]];

    return { nodes, edges };
  }

  static cone(radius = 2, height = 3, baseSegments = 8) {
    const nodes = [new THREE.Vector3(0, height * 0.5, 0)];
    const edges = [];

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

    return { nodes, edges };
  }
}