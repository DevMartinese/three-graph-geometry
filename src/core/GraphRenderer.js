import * as THREE from 'three';
import { MaterialFactory } from '../materials/MaterialFactory.js';
import { GeometryUtils } from '../utils/GeometryUtils.js';
import { MathHelpers } from '../utils/MathHelpers.js';

export class GraphRenderer extends THREE.Group {
  constructor(options = {}) {
    super();

    this.options = {
      nodeRadius: 0.12,
      edgeRadius: 0.02,
      nodeColor: 0x00ffff,
      edgeColor: 0xffffff,
      nodeSegments: 16,
      edgeSegments: 8,
      directed: false,
      arrowSize: 0.18,
      arrowSegments: 8,
      nodeRadii: null,
      nodeColors: null,
      ...options
    };

    this.nodeMaterial = MaterialFactory.createNodeMaterial(this.options.nodeColor);
    this.edgeMaterial = MaterialFactory.createEdgeMaterial(this.options.edgeColor);
    this.nodeGeometry = GeometryUtils.createNodeGeometry(
      this.options.nodeRadius, 
      this.options.nodeSegments
    );
  }

  render(nodes, edges) {
    this.clear();
    this.renderNodes(nodes);
    this.renderEdges(nodes, edges);
  }

  renderNodes(nodes) {
    nodes.forEach((pos, i) => {
      const sphere = new THREE.Mesh(this.nodeGeometry, this.nodeMaterial);

      if (this.options.nodeRadii && this.options.nodeRadii[i] != null) {
        const r = this.options.nodeRadii[i];
        sphere.scale.setScalar(r / this.options.nodeRadius);
      }

      if (this.options.nodeColors) {
        const col = (typeof this.options.nodeColors === 'function') 
          ? this.options.nodeColors(i) 
          : this.options.nodeColors[i];
        
        if (col != null) {
          sphere.material = MaterialFactory.createCustomNodeMaterial(col);
        }
      }

      sphere.position.copy(pos);
      sphere.userData.index = i;
      this.add(sphere);
    });
  }

  renderEdges(nodes, edges) {
    const normalizedEdges = edges.map(edge => 
      MathHelpers.normalizeEdge(edge, this.options.edgeRadius, this.options.edgeColor)
    );

    normalizedEdges.forEach(({ a, b, radius, color }) => {
      const start = nodes[a];
      const end = nodes[b];
      const distance = GeometryUtils.calculateDistance(start, end);
      const midpoint = GeometryUtils.calculateMidpoint(start, end);
      const orientation = GeometryUtils.calculateOrientation(start, end);

      const mat = (color !== this.options.edgeColor) 
        ? MaterialFactory.createCustomEdgeMaterial(color)
        : this.edgeMaterial;

      const cylGeo = GeometryUtils.createEdgeGeometry(radius, distance, this.options.edgeSegments);
      const cylinder = new THREE.Mesh(cylGeo, mat);
      cylinder.applyMatrix4(orientation);
      cylinder.position.copy(midpoint);
      cylinder.userData.indices = [a, b];
      this.add(cylinder);

      if (this.options.directed) {
        this.renderArrow(start, end, radius, mat, a, b, orientation);
      }
    });
  }

  renderArrow(start, end, edgeRadius, material, nodeAIndex, nodeBIndex, orientation) {
    const dir = new THREE.Vector3().subVectors(end, start).normalize();
    const destNodeR = this.options.nodeRadii && this.options.nodeRadii[nodeBIndex] != null 
      ? this.options.nodeRadii[nodeBIndex] 
      : this.options.nodeRadius;
    
    const tipOffset = destNodeR + this.options.arrowSize * 0.5;
    const tipPos = new THREE.Vector3().copy(end).addScaledVector(dir, -tipOffset);

    const aGeo = GeometryUtils.createArrowGeometry(
      edgeRadius * 2.2, 
      this.options.arrowSize, 
      this.options.arrowSegments
    );
    const aMesh = new THREE.Mesh(aGeo, material);
    aMesh.applyMatrix4(orientation);
    aMesh.position.copy(tipPos);
    this.add(aMesh);
  }

  clear() {
    while (this.children.length > 0) {
      this.remove(this.children[0]);
    }
  }

  dispose() {
    this.nodeGeometry.dispose();
    this.nodeMaterial.dispose();
    this.edgeMaterial.dispose();
    this.traverse(obj => {
      if (obj.isMesh && obj.geometry && obj.geometry !== this.nodeGeometry) {
        obj.geometry.dispose();
      }
    });
  }
}