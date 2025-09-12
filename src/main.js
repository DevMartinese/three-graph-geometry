import { SceneManager } from './core/Scene.js';
import { GraphGeometry } from './GraphGeometry.js';
import { ParameterManager } from './gui/ParameterManager.js';
import { GUIController } from './gui/GUIController.js';

class GraphGeometryApp {
  constructor() {
    this.sceneManager = new SceneManager('webgl');
    this.parameterManager = new ParameterManager();
    this.guiController = new GUIController(this.parameterManager, () => this.updateGraph());
    
    this.currentGraph = null;
    
    this.init();
  }

  init() {
    this.updateGraph();
    this.sceneManager.start();
  }

  updateGraph() {
    if (this.currentGraph) {
      this.sceneManager.remove(this.currentGraph);
      if (this.currentGraph.dispose) {
        this.currentGraph.dispose();
      }
      this.currentGraph = null;
    }

    this.parameterManager.allocatePerNodeArrays();
    const styleOptions = this.parameterManager.getStyleOptions();
    const presetParams = this.parameterManager.getPresetParameters();

    this.currentGraph = new GraphGeometry(
      this.parameterManager.params.preset,
      ...presetParams,
      styleOptions
    );

    this.sceneManager.add(this.currentGraph);
  }

  destroy() {
    this.guiController.destroy();
    if (this.currentGraph && this.currentGraph.dispose) {
      this.currentGraph.dispose();
    }
  }
}

new GraphGeometryApp();