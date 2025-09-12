import * as THREE from 'three';

export class MaterialFactory {
  static createNodeMaterial(color = 0x00ffff) {
    return new THREE.MeshStandardMaterial({ color });
  }

  static createEdgeMaterial(color = 0xffffff) {
    return new THREE.MeshStandardMaterial({ color });
  }

  static createCustomNodeMaterial(color) {
    const material = new THREE.MeshStandardMaterial({ color: new THREE.Color(color) });
    return material;
  }

  static createCustomEdgeMaterial(color) {
    const material = new THREE.MeshStandardMaterial({ color: new THREE.Color(color) });
    return material;
  }
}