import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GraphGeometry } from './src/GraphGeometry';

class ComparisonDemo {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        
        // Object groups
        this.nativeGeometries = new THREE.Group();
        this.graphGeometries = new THREE.Group();
        this.groundPlane = null;
        this.grid = null;
        
        // Materials
        this.nativeMaterial = null;
        this.groundMaterial = null;
        
        // Performance tracking
        this.frameCount = 0;
        this.lastTime = performance.now();
        this.fps = 0;
        
        // Animation
        this.autoRotateSpeed = 0.005;
        
        this.init();
        this.createComparisons();
        this.createMixedScene();
        this.setupControls();
        this.animate();
    }
    
    init() {
        // Scene setup
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x1a1a1a);
        
        // Camera setup
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(12, 8, 12);
        
        // Renderer setup
        this.renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('canvas'), antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        // Controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.target.set(0, 0, 0);
        
        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(10, 10, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 50;
        directionalLight.shadow.camera.left = -20;
        directionalLight.shadow.camera.right = 20;
        directionalLight.shadow.camera.top = 20;
        directionalLight.shadow.camera.bottom = -20;
        this.scene.add(directionalLight);
        
        const pointLight = new THREE.PointLight(0xff6b6b, 0.5, 100);
        pointLight.position.set(-5, 5, 5);
        this.scene.add(pointLight);
        
        // Materials
        this.nativeMaterial = new THREE.MeshStandardMaterial({
            color: 0xff6b6b,
            transparent: true,
            opacity: 0.7
        });
        
        this.groundMaterial = new THREE.MeshStandardMaterial({
            color: 0x96ceb4,
            transparent: true,
            opacity: 0.3
        });
        
        // Add groups to scene
        this.scene.add(this.nativeGeometries);
        this.scene.add(this.graphGeometries);
        
        // Window resize handler
        window.addEventListener('resize', () => this.onWindowResize());
    }
    
    createComparisons() {
        const spacing = 6;
        const positions = [
            { x: -spacing, z: spacing },   // Box vs Cube
            { x: 0, z: spacing },          // Sphere vs Circular
            { x: spacing, z: spacing }     // Cone vs Cone
        ];
        
        // 1. Native BoxGeometry vs GraphGeometry('cube')
        this.createBoxComparison(positions[0]);
        
        // 2. Native SphereGeometry vs GraphGeometry('circular') 
        this.createSphereComparison(positions[1]);
        
        // 3. Native ConeGeometry vs GraphGeometry('cone')
        this.createConeComparison(positions[2]);
    }
    
    createBoxComparison(position) {
        // Native BoxGeometry
        const boxGeometry = new THREE.BoxGeometry(2, 2, 2);
        const boxMesh = new THREE.Mesh(boxGeometry, this.nativeMaterial);
        boxMesh.position.set(position.x - 1.5, 2, position.z);
        boxMesh.castShadow = true;
        boxMesh.receiveShadow = true;
        boxMesh.userData.type = 'native';
        this.nativeGeometries.add(boxMesh);
        
        // GraphGeometry cube
        const cubeGraph = new GraphGeometry('cube', 1, {
            nodeColor: 0x4ecdc4,
            edgeColor: 0x45b7d1,
            nodeRadius: 0.12,
            edgeRadius: 0.02,
            includeFaceCenters: true
        });
        cubeGraph.position.set(position.x + 1.5, 2, position.z);
        cubeGraph.userData.type = 'graph';
        this.graphGeometries.add(cubeGraph);
        
        // Labels
        this.createLabel("Native Box", position.x - 1.5, 0.5, position.z);
        this.createLabel("Graph Cube", position.x + 1.5, 0.5, position.z);
    }
    
    createSphereComparison(position) {
        // Native SphereGeometry
        const sphereGeometry = new THREE.SphereGeometry(1, 16, 12);
        const sphereMesh = new THREE.Mesh(sphereGeometry, this.nativeMaterial);
        sphereMesh.position.set(position.x - 1.5, 2, position.z);
        sphereMesh.castShadow = true;
        sphereMesh.receiveShadow = true;
        sphereMesh.userData.type = 'native';
        this.nativeGeometries.add(sphereMesh);
        
        // GraphGeometry circular
        const circularGraph = new GraphGeometry('circular', 12, 1.5, {
            nodeColor: 0x4ecdc4,
            edgeColor: 0x45b7d1,
            nodeRadius: 0.12,
            edgeRadius: 0.02
        });
        circularGraph.position.set(position.x + 1.5, 2, position.z);
        circularGraph.userData.type = 'graph';
        this.graphGeometries.add(circularGraph);
        
        // Labels
        this.createLabel("Native Sphere", position.x - 1.5, 0.5, position.z);
        this.createLabel("Graph Circle", position.x + 1.5, 0.5, position.z);
    }
    
    createConeComparison(position) {
        // Native ConeGeometry
        const coneGeometry = new THREE.ConeGeometry(1, 2, 8);
        const coneMesh = new THREE.Mesh(coneGeometry, this.nativeMaterial);
        coneMesh.position.set(position.x - 1.5, 2, position.z);
        coneMesh.castShadow = true;
        coneMesh.receiveShadow = true;
        coneMesh.userData.type = 'native';
        this.nativeGeometries.add(coneMesh);
        
        // GraphGeometry cone
        const coneGraph = new GraphGeometry('cone', 1, 2, 8, {
            nodeColor: 0x4ecdc4,
            edgeColor: 0x45b7d1,
            nodeRadius: 0.12,
            edgeRadius: 0.02,
            includeFaceCenters: true
        });
        coneGraph.position.set(position.x + 1.5, 2, position.z);
        coneGraph.userData.type = 'graph';
        this.graphGeometries.add(coneGraph);
        
        // Labels
        this.createLabel("Native Cone", position.x - 1.5, 0.5, position.z);
        this.createLabel("Graph Cone", position.x + 1.5, 0.5, position.z);
    }
    
    createMixedScene() {
        // Ground plane (native)
        const groundGeometry = new THREE.PlaneGeometry(20, 20);
        this.groundPlane = new THREE.Mesh(groundGeometry, this.groundMaterial);
        this.groundPlane.rotation.x = -Math.PI / 2;
        this.groundPlane.position.y = -0.5;
        this.groundPlane.receiveShadow = true;
        this.scene.add(this.groundPlane);
        
        // Grid helper
        this.grid = new THREE.GridHelper(20, 20, 0x444444, 0x222222);
        this.grid.position.y = -0.49;
        this.scene.add(this.grid);
        
        // Floating graph networks
        this.createNetworkGraph();
        this.createComplexGraph();
    }
    
    createNetworkGraph() {
        // Star network floating above
        this.starGraph = new GraphGeometry('star', 12, 4, {
            nodeColor: 0xffd93d,
            edgeColor: 0xffb74d,
            nodeRadius: 0.15,
            edgeRadius: 0.03,
            directed: false
        });
        this.starGraph.position.set(0, 6, -3);
        this.starGraph.userData.type = 'graph';
        this.starGraph.userData.network = 'star';
        this.graphGeometries.add(this.starGraph);
        
        // Grid network
        this.gridGraph = new GraphGeometry('grid', 4, 4, 1.5, {
            nodeColor: 0x6c5ce7,
            edgeColor: 0xa29bfe,
            nodeRadius: 0.1,
            edgeRadius: 0.025
        });
        this.gridGraph.position.set(-6, 4, -6);
        this.gridGraph.rotation.x = Math.PI / 6;
        this.gridGraph.userData.type = 'graph';
        this.gridGraph.userData.network = 'grid';
        this.graphGeometries.add(this.gridGraph);
    }
    
    createComplexGraph() {
        // 3D Lattice
        const lattice = new GraphGeometry('lattice', 2, 2, 2, 1.2, {
            nodeColor: 0xe17055,
            edgeColor: 0xd63031,
            nodeRadius: 0.08,
            edgeRadius: 0.02,
            directed: true,
            arrowSize: 0.15
        });
        lattice.position.set(6, 3, -6);
        lattice.userData.type = 'graph';
        lattice.userData.network = 'lattice';
        this.graphGeometries.add(lattice);
        
        // Custom path
        const pathPoints = [
            [{x: -3, y: 5, z: 3}, {x: -1, y: 6, z: 3}, {x: 1, y: 5, z: 3}, {x: 3, y: 6, z: 3}],
            [{x: -1, y: 6, z: 3}, {x: -1, y: 7, z: 1}],
            [{x: 1, y: 5, z: 3}, {x: 1, y: 4, z: 1}]
        ];
        
        const pathGraph = new GraphGeometry('paths', pathPoints, {
            merge: true,
            mergeTolerance: 0.1
        }, {
            nodeColor: 0x00b894,
            edgeColor: 0x00cec9,
            nodeRadius: 0.12,
            edgeRadius: 0.03
        });
        pathGraph.userData.type = 'graph';
        pathGraph.userData.network = 'paths';
        this.graphGeometries.add(pathGraph);
    }
    
    createLabel(text, x, y, z) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 64;
        
        context.fillStyle = 'rgba(0, 0, 0, 0.8)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        context.fillStyle = 'white';
        context.font = '20px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(text, canvas.width / 2, canvas.height / 2);
        
        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.SpriteMaterial({ map: texture });
        const sprite = new THREE.Sprite(material);
        sprite.position.set(x, y, z);
        sprite.scale.set(2, 0.5, 1);
        
        this.scene.add(sprite);
    }
    
    setupControls() {
        // Auto rotate
        const autoRotateCheckbox = document.getElementById('autoRotate');
        autoRotateCheckbox.addEventListener('change', (e) => {
            this.controls.autoRotate = e.target.checked;
        });
        this.controls.autoRotate = true;
        this.controls.autoRotateSpeed = 0.5;
        
        // Show grid
        const showGridCheckbox = document.getElementById('showGrid');
        showGridCheckbox.addEventListener('change', (e) => {
            this.grid.visible = e.target.checked;
            this.groundPlane.visible = e.target.checked;
        });
        
        // Native geometry controls
        const nativeWireframeCheckbox = document.getElementById('nativeWireframe');
        nativeWireframeCheckbox.addEventListener('change', (e) => {
            this.nativeMaterial.wireframe = e.target.checked;
        });
        
        const nativeOpacitySlider = document.getElementById('nativeOpacity');
        const nativeOpacityValue = document.getElementById('nativeOpacityValue');
        nativeOpacitySlider.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            this.nativeMaterial.opacity = value;
            nativeOpacityValue.textContent = value.toFixed(1);
        });
        
        const nativeSizeSlider = document.getElementById('nativeSize');
        const nativeSizeValue = document.getElementById('nativeSizeValue');
        nativeSizeSlider.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            this.nativeGeometries.children.forEach(child => {
                if (child.userData.type === 'native') {
                    child.scale.setScalar(value / 2);
                }
            });
            nativeSizeValue.textContent = value.toFixed(1);
        });
        
        // Graph geometry controls
        const showNodesCheckbox = document.getElementById('showNodes');
        showNodesCheckbox.addEventListener('change', (e) => {
            this.toggleNodesVisibility(e.target.checked);
        });
        
        const showEdgesCheckbox = document.getElementById('showEdges');
        showEdgesCheckbox.addEventListener('change', (e) => {
            this.toggleEdgesVisibility(e.target.checked);
        });
        
        const nodeSizeSlider = document.getElementById('nodeSize');
        const nodeSizeValue = document.getElementById('nodeSizeValue');
        nodeSizeSlider.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            this.updateNodeSizes(value);
            nodeSizeValue.textContent = value.toFixed(2);
        });
        
        const edgeSizeSlider = document.getElementById('edgeSize');
        const edgeSizeValue = document.getElementById('edgeSizeValue');
        edgeSizeSlider.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            this.updateEdgeSizes(value);
            edgeSizeValue.textContent = value.toFixed(3);
        });
        
        // Network controls
        const networkNodesSlider = document.getElementById('networkNodes');
        const networkNodesValue = document.getElementById('networkNodesValue');
        networkNodesSlider.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            this.updateStarNetwork(value);
            networkNodesValue.textContent = value;
        });
        
        const networkRadiusSlider = document.getElementById('networkRadius');
        const networkRadiusValue = document.getElementById('networkRadiusValue');
        networkRadiusSlider.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            this.updateStarRadius(value);
            networkRadiusValue.textContent = value.toFixed(1);
        });
        
        // Reset camera
        const resetCameraButton = document.getElementById('resetCamera');
        resetCameraButton.addEventListener('click', () => {
            this.camera.position.set(12, 8, 12);
            this.controls.target.set(0, 0, 0);
            this.controls.update();
        });
    }
    
    toggleNodesVisibility(visible) {
        this.graphGeometries.traverse((child) => {
            if (child.isMesh && child.geometry.type === 'SphereGeometry') {
                child.visible = visible;
            }
        });
    }
    
    toggleEdgesVisibility(visible) {
        this.graphGeometries.traverse((child) => {
            if (child.isMesh && (child.geometry.type === 'CylinderGeometry' || child.geometry.type === 'ConeGeometry')) {
                child.visible = visible;
            }
        });
    }
    
    updateNodeSizes(newSize) {
        const baseSize = 0.12;
        const scale = newSize / baseSize;
        
        this.graphGeometries.traverse((child) => {
            if (child.isMesh && child.geometry.type === 'SphereGeometry') {
                child.scale.setScalar(scale);
            }
        });
    }
    
    updateEdgeSizes(newSize) {
        const baseSize = 0.02;
        const scale = newSize / baseSize;
        
        this.graphGeometries.traverse((child) => {
            if (child.isMesh && (child.geometry.type === 'CylinderGeometry' || child.geometry.type === 'ConeGeometry')) {
                child.scale.x = scale;
                child.scale.z = scale;
            }
        });
    }
    
    updateStarNetwork(nodeCount) {
        if (this.starGraph) {
            this.graphGeometries.remove(this.starGraph);
            this.starGraph.dispose?.();
        }
        
        const radius = parseFloat(document.getElementById('networkRadius').value);
        
        this.starGraph = new GraphGeometry('star', nodeCount, radius, {
            nodeColor: 0xffd93d,
            edgeColor: 0xffb74d,
            nodeRadius: 0.15,
            edgeRadius: 0.03
        });
        this.starGraph.position.set(0, 6, -3);
        this.starGraph.userData.type = 'graph';
        this.starGraph.userData.network = 'star';
        this.graphGeometries.add(this.starGraph);
    }
    
    updateStarRadius(radius) {
        if (this.starGraph) {
            this.graphGeometries.remove(this.starGraph);
            this.starGraph.dispose?.();
        }
        
        const nodeCount = parseInt(document.getElementById('networkNodes').value);
        
        this.starGraph = new GraphGeometry('star', nodeCount, radius, {
            nodeColor: 0xffd93d,
            edgeColor: 0xffb74d,
            nodeRadius: 0.15,
            edgeRadius: 0.03
        });
        this.starGraph.position.set(0, 6, -3);
        this.starGraph.userData.type = 'graph';
        this.starGraph.userData.network = 'star';
        this.graphGeometries.add(this.starGraph);
    }
    
    updateStats() {
        // FPS calculation
        this.frameCount++;
        const currentTime = performance.now();
        if (currentTime >= this.lastTime + 1000) {
            this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
            this.frameCount = 0;
            this.lastTime = currentTime;
        }
        
        // Count objects and geometry data
        let objectCount = 0;
        let triangleCount = 0;
        let vertexCount = 0;
        
        this.scene.traverse((child) => {
            if (child.isMesh) {
                objectCount++;
                const geometry = child.geometry;
                if (geometry.index) {
                    triangleCount += geometry.index.count / 3;
                } else if (geometry.attributes.position) {
                    triangleCount += geometry.attributes.position.count / 3;
                }
                if (geometry.attributes.position) {
                    vertexCount += geometry.attributes.position.count;
                }
            }
        });
        
        // Update DOM
        document.getElementById('fps').textContent = this.fps;
        document.getElementById('objectCount').textContent = objectCount;
        document.getElementById('triangleCount').textContent = Math.round(triangleCount);
        document.getElementById('vertexCount').textContent = vertexCount;
    }
    
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Auto rotation for graph geometries
        if (document.getElementById('autoRotate').checked) {
            this.graphGeometries.children.forEach((child, index) => {
                if (child.userData.type === 'graph') {
                    child.rotation.y += this.autoRotateSpeed * (1 + index * 0.1);
                    if (child.userData.network === 'lattice') {
                        child.rotation.x += this.autoRotateSpeed * 0.5;
                    }
                }
            });
        }
        
        this.controls.update();
        this.updateStats();
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize the demo
new ComparisonDemo();