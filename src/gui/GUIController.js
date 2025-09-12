import GUI from 'lil-gui';
import { PresetManager } from '../core/PresetManager.js';

export class GUIController {
  constructor(parameterManager, onUpdateCallback) {
    this.parameterManager = parameterManager;
    this.onUpdate = onUpdateCallback;
    this.gui = new GUI();
    this.folders = {};
    
    this.setupGUI();
  }

  setupGUI() {
    this.gui.children.slice().forEach(c => this.gui.remove(c));

    this.gui.add(this.parameterManager.params, 'preset', PresetManager.getAllPresets())
      .name('Preset')
      .onChange(() => {
        this.updateVisibility();
        this.onUpdate();
      });

    this.setupStyleFolder();
    this.setupDirectedFolder();
    this.setupPerNodeFolder();
    this.setupPresetFolders();
    this.updateVisibility();
  }

  setupStyleFolder() {
    const fStyle = this.gui.addFolder('Style');
    fStyle.addColor(this.parameterManager.params, 'nodeColor').onChange(this.onUpdate);
    fStyle.addColor(this.parameterManager.params, 'edgeColor').onChange(this.onUpdate);
    fStyle.add(this.parameterManager.params, 'nodeRadius', 0.02, 0.5, 0.01).onChange(this.onUpdate);
    fStyle.add(this.parameterManager.params, 'edgeRadius', 0.005, 0.2, 0.005).onChange(this.onUpdate);
    fStyle.add(this.parameterManager.params, 'nodeSegments', 6, 48, 1).onChange(this.onUpdate);
    fStyle.add(this.parameterManager.params, 'edgeSegments', 3, 32, 1).onChange(this.onUpdate);
  }

  setupDirectedFolder() {
    const fDirected = this.gui.addFolder('Directed');
    fDirected.add(this.parameterManager.params, 'directed').name('Arrows 3D').onChange(this.onUpdate);
    fDirected.add(this.parameterManager.params, 'arrowSize', 0.05, 0.6, 0.01).onChange(this.onUpdate);
  }

  setupPerNodeFolder() {
    const fPerNode = this.gui.addFolder('Per-node');
    fPerNode.add(this.parameterManager.params, 'useNodeRadii').name('Custom radii').onChange(this.onUpdate);
    fPerNode.add(this.parameterManager.params, 'minNodeRadius', 0.05, 0.5, 0.01).onChange(this.onUpdate);
    fPerNode.add(this.parameterManager.params, 'maxNodeRadius', 0.05, 0.5, 0.01).onChange(this.onUpdate);
    fPerNode.add(this.parameterManager.params, 'useNodeColors').name('Custom colors').onChange(this.onUpdate);
    fPerNode.add(this.parameterManager.params, 'colorMode', ['alternate', 'random']).onChange(this.onUpdate);
    fPerNode.add({ randomize: () => this.onUpdate() }, 'randomize').name('Randomize per-node');
  }

  setupPresetFolders() {
    const params = this.parameterManager.params;

    // Cube
    this.folders.cube = this.gui.addFolder('Cube');
    this.folders.cube.add(params, 'size', 0.5, 5, 0.1).onChange(this.onUpdate);

    // Pyramid
    this.folders.pyramid = this.gui.addFolder('Pyramid');
    this.folders.pyramid.add(params, 'baseSize', 0.5, 5, 0.1).onChange(this.onUpdate);
    this.folders.pyramid.add(params, 'height', 0.5, 6, 0.1).onChange(this.onUpdate);

    // Prism
    this.folders.prism = this.gui.addFolder('Prism');
    this.folders.prism.add(params, 'width', 0.5, 5, 0.1).onChange(this.onUpdate);
    this.folders.prism.add(params, 'pHeight', 0.2, 5, 0.1).name('height').onChange(this.onUpdate);
    this.folders.prism.add(params, 'depth', 0.2, 5, 0.1).onChange(this.onUpdate);

    // Octahedron
    this.folders.octahedron = this.gui.addFolder('Octahedron');
    this.folders.octahedron.add(params, 'oSize', 0.5, 5, 0.1).onChange(this.onUpdate);

    // Triangle
    this.folders.triangle = this.gui.addFolder('Triangle');
    this.folders.triangle.add(params, 'tSize', 0.5, 5, 0.1).onChange(this.onUpdate);

    // Line
    this.folders.line = this.gui.addFolder('Line');
    this.folders.line.add(params, 'length', 0.5, 20, 0.1).onChange(this.onUpdate);

    // Cone
    this.folders.cone = this.gui.addFolder('Cone');
    this.folders.cone.add(params, 'cRadius', 0.5, 6, 0.1).onChange(this.onUpdate);
    this.folders.cone.add(params, 'cHeight', 0.5, 8, 0.1).onChange(this.onUpdate);
    this.folders.cone.add(params, 'baseSegments', 3, 64, 1).onChange(this.onUpdate);

    // Star
    this.folders.star = this.gui.addFolder('Star');
    this.folders.star.add(params, 'count', 3, 64, 1).onChange(this.onUpdate);
    this.folders.star.add(params, 'radius', 0.5, 10, 0.1).onChange(this.onUpdate);

    // Circular
    this.folders.circular = this.gui.addFolder('Circular');
    this.folders.circular.add(params, 'count', 3, 64, 1).onChange(this.onUpdate);
    this.folders.circular.add(params, 'radius', 0.5, 10, 0.1).onChange(this.onUpdate);

    // Grid
    this.folders.grid = this.gui.addFolder('Grid (2D)');
    this.folders.grid.add(params, 'rows', 1, 20, 1).onChange(this.onUpdate);
    this.folders.grid.add(params, 'cols', 1, 20, 1).onChange(this.onUpdate);
    this.folders.grid.add(params, 'spacing', 0.5, 5, 0.1).onChange(this.onUpdate);

    // Lattice
    this.folders.lattice = this.gui.addFolder('Lattice (3D grid)');
    this.folders.lattice.add(params, 'nx', 1, 10, 1).name('nx (cells)').onChange(this.onUpdate);
    this.folders.lattice.add(params, 'ny', 1, 10, 1).name('ny (cells)').onChange(this.onUpdate);
    this.folders.lattice.add(params, 'nz', 1, 10, 1).name('nz (cells)').onChange(this.onUpdate);
    this.folders.lattice.add(params, 'lSpacing', 0.5, 5, 0.1).name('spacing').onChange(this.onUpdate);

    // Spokes
    this.folders.spokes = this.gui.addFolder('Spokes');
    this.folders.spokes.add(params, 'spokesCount', 1, 16, 1).onChange(this.onUpdate);
    this.folders.spokes.add(params, 'spokesLen', 0.2, 10, 0.1).onChange(this.onUpdate);
    this.folders.spokes.add(params, 'spokesOffset', 0, Math.PI * 2, 0.01).onChange(this.onUpdate);

    // Polyline
    this.folders.polyline = this.gui.addFolder('Polyline');
    this.folders.polyline.add(params, 'polylineJSON').onFinishChange(this.onUpdate);

    // Paths
    this.folders.paths = this.gui.addFolder('Paths');
    this.folders.paths.add(params, 'merge').onChange(this.onUpdate);
    this.folders.paths.add(params, 'mergeTol', 1e-6, 1e-1, 1e-6).onChange(this.onUpdate);
    this.folders.paths.add(params, 'pathsJSON').onFinishChange(this.onUpdate);
  }

  updateVisibility() {
    Object.values(this.folders).forEach(f => f.hide());
    
    switch (this.parameterManager.params.preset) {
      case 'cube': this.folders.cube.show(); break;
      case 'pyramid': this.folders.pyramid.show(); break;
      case 'prism': this.folders.prism.show(); break;
      case 'octahedron': this.folders.octahedron.show(); break;
      case 'triangle': this.folders.triangle.show(); break;
      case 'line': this.folders.line.show(); break;
      case 'cone': this.folders.cone.show(); break;
      case 'star': this.folders.star.show(); break;
      case 'circular': this.folders.circular.show(); break;
      case 'grid': this.folders.grid.show(); break;
      case 'lattice': this.folders.lattice.show(); break;
      case 'spokes': this.folders.spokes.show(); break;
      case 'polyline': this.folders.polyline.show(); break;
      case 'paths': this.folders.paths.show(); break;
    }
  }

  destroy() {
    this.gui.destroy();
  }
}