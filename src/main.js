import * as THREE from 'three';
import { GraphGeometry } from './GraphGeometry';

const scene = new THREE.Scene();
scene.add(new THREE.AmbientLight(0xffffff, 0.6));
const light = new THREE.PointLight(0xffffff, 1);
light.position.set(5, 5, 5);
scene.add(light);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 6;

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('webgl') });
renderer.setSize(window.innerWidth, window.innerHeight);

const graph = new GraphGeometry('pyramid', 2, 3);
// baseSize 2, altura 3

scene.add(graph);

function animate() {
  requestAnimationFrame(animate);
  graph.rotation.y += 0.0050;
  renderer.render(scene, camera);
}
animate();
