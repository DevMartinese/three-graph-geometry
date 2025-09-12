---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "three-graph-geometry"
  text: "experimental extension"
  tagline: Visualización y manipulación de grafos en Three.js
  actions:
    - theme: brand
      text: Ejemplos de Markdown
      link: /markdown-examples
    - theme: alt
      text: Ejemplos de API
      link: /api-examples

features:
  - title: Clases principales
    details: Incluye GraphGeometry y GraphObject para crear y visualizar grafos 3D.
  - title: Presets y layouts
    details: Soporta múltiples tipos de grafos predefinidos y layouts personalizables.
  - title: Personalización
    details: Permite modificar colores, radios, segmentos y más, tanto global como por nodo.
---

# ¿Qué es Graph Geometry Three?

**Graph Geometry Three** es una extensión experimental para facilitar la creación, visualización y manipulación de grafos usando Three.js. Permite generar grafos 3D con presets, layouts y opciones de personalización visual.

## Clases principales

### `GraphGeometry`
Clase que extiende `THREE.Group` y permite crear grafos 3D a partir de presets (cube, grid, circular, star, etc.) o datos personalizados. Soporta opciones de apariencia como color, radio, segmentos, nodos dirigidos, flechas, y personalización por nodo.

**Ejemplo de uso:**
```js
import { GraphGeometry } from './src/GraphGeometry.js';
const graph = new GraphGeometry('cube', 2, { nodeColor: 0xff66cc, edgeColor: 0x3333ff });
scene.add(graph);
```

### `GraphObject`
Otra clase que extiende `THREE.Group`, permite crear grafos a partir de listas de nodos y aristas, o usando presets registrados. Útil para manipulación directa de nodos y aristas.

**Ejemplo de uso:**
```js
import { GraphObject } from './src/GraphObject.js';
const nodes = [new THREE.Vector3(0,0,0), new THREE.Vector3(1,0,0)];
const edges = [[0,1]];
const graph = new GraphObject(nodes, edges, { nodeColor: 0x00ffff });
scene.add(graph);
```

## Presets disponibles
- cube
- pyramid
- prism
- octahedron
- triangle
- line
- cone
- star
- circular
- grid
- lattice
- spokes
- polyline
- paths

Consulta los ejemplos y la API para más detalles sobre cada preset y sus parámetros.

