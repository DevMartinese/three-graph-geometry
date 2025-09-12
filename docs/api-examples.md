---
outline: deep
---

# Referencia rápida de la API

## GraphGeometry

```js
new GraphGeometry(type, ...params, options)
```

- **type**: string. Tipo de grafo/preset ("cube", "grid", "circular", etc).
- **params**: parámetros específicos según el tipo (por ejemplo, tamaño, cantidad de nodos, etc).
- **options**: objeto con opciones de apariencia y comportamiento:
  - `nodeRadius`: radio de los nodos (default: 0.12)
  - `edgeRadius`: radio de las aristas (default: 0.02)
  - `nodeColor`: color de los nodos (default: 0x00ffff)
  - `edgeColor`: color de las aristas (default: 0xffffff)
  - `nodeSegments`: detalle de las esferas
  - `edgeSegments`: detalle de los cilindros
  - `directed`: si las aristas son dirigidas (flechas)
  - `arrowSize`: tamaño de la flecha
  - `arrowSegments`: detalle de la flecha
  - `nodeRadii`: array de radios por nodo
  - `nodeColors`: array o función de colores por nodo

## GraphObject

```js
new GraphObject(nodes, edges, options)
// o
new GraphObject({ preset: 'cube' })
// o
new GraphObject({ layout: 'circular', nodeCount: 8 })
```

- **nodes**: array de `THREE.Vector3`.
- **edges**: array de pares de índices `[a, b]`.
- **options**: igual que en GraphGeometry, más:
  - `preset`: nombre de un preset registrado
  - `layout`: nombre de layout ("grid", "circular", etc)
  - `nodeCount`: cantidad de nodos para el layout
  - `layoutOptions`: opciones específicas del layout

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

Consulta el código fuente para detalles avanzados y ejemplos de cada preset.
