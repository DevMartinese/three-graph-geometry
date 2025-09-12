# Ejemplos de uso

A continuación se muestran ejemplos básicos de cómo utilizar las clases principales del proyecto para crear y personalizar grafos 3D.

## Crear un grafo tipo "cube" con GraphGeometry

```js
import { GraphGeometry } from './src/GraphGeometry.js';
const graph = new GraphGeometry('cube', 2, {
  nodeColor: 0xff66cc,
  edgeColor: 0x3333ff,
  nodeRadius: 0.15,
  edgeRadius: 0.03
});
scene.add(graph);
```

## Crear un grafo personalizado con GraphObject

```js
import { GraphObject } from './src/GraphObject.js';
const nodes = [
  new THREE.Vector3(0, 0, 0),
  new THREE.Vector3(1, 0, 0),
  new THREE.Vector3(0, 1, 0)
];
const edges = [ [0, 1], [1, 2], [2, 0] ];
const graph = new GraphObject(nodes, edges, {
  nodeColor: 0x00ffff,
  edgeColor: 0xffffff
});
scene.add(graph);
```

## Usar presets y layouts

```js
// Usar un preset registrado
const graph = new GraphObject({ preset: 'cube' });
scene.add(graph);

// Usar un layout circular
const graph2 = new GraphObject({ layout: 'circular', nodeCount: 8 });
scene.add(graph2);
```

## Personalización avanzada

Puedes personalizar el radio y color de cada nodo usando los parámetros `nodeRadii` y `nodeColors` en GraphGeometry:

```js
const nodeRadii = [0.1, 0.2, 0.15, 0.12, 0.18, 0.14, 0.16, 0.13];
const nodeColors = i => (i % 2 ? 0x00e0ff : 0xff60cc);
const graph = new GraphGeometry('cube', 2, {
  nodeRadii,
  nodeColors
});
scene.add(graph);
```
