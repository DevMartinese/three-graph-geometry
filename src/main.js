import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
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

//const graph = new GraphGeometry('pyramid', 2, 3);
//const graph = new GraphGeometry('cube', 2);
//const graph = new GraphGeometry('prism', 2, 1, 0.5)
//const graph = new GraphGeometry('octahedron', 2)
const graph = new GraphGeometry('triangle', 2)

scene.add(graph);

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();
