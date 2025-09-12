import * as THREE from 'three';

export class GeometryUtils {
  static createNodeGeometry(radius, segments) {
    return new THREE.SphereGeometry(radius, segments, segments);
  }

  static createEdgeGeometry(radius, height, segments) {
    return new THREE.CylinderGeometry(radius, radius, height, segments);
  }

  static createArrowGeometry(radius, height, segments) {
    return new THREE.ConeGeometry(radius, height, segments);
  }

  static calculateOrientation(start, end) {
    const orientation = new THREE.Matrix4().lookAt(start, end, new THREE.Vector3(0, 1, 0));
    const rotX = new THREE.Matrix4().makeRotationX(Math.PI / 2);
    orientation.multiply(rotX);
    return orientation;
  }

  static calculateMidpoint(start, end) {
    return new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
  }

  static calculateDistance(start, end) {
    return start.distanceTo(end);
  }
}