# GraphGeometry

`GraphGeometry` is a class that extends `THREE.Group` and generates graph-like structures (nodes and connections) as if it were a native Three.js geometry like `BoxGeometry` or `TorusKnotGeometry`.

## 🚀 Installation

Just drop `GraphGeometry.js` into your project and import it as an ES module:

```js
import { GraphGeometry } from './GraphGeometry.js';
```

---

## 🧱 Basic Usage

```js
const graph = new GraphGeometry('circular', 12, 4);
scene.add(graph);
```

---

## 🧩 Supported Types

### 🔘 `circular`
```js
new GraphGeometry('circular', nodeCount, radius);
```

### 🔲 `grid`
```js
new GraphGeometry('grid', rows, cols, spacing);
```

### 🌟 `star`
```js
new GraphGeometry('star', nodeCount, radius);
```

### 🔺 `pyramid`
```js
new GraphGeometry('pyramid', baseSize, height);
```

---

## 🎨 Customization

Each type accepts an **optional final parameter** with options:

```js
{
  nodeRadius: 0.1,
  edgeRadius: 0.02,
  nodeColor: 0x00ffff,
  edgeColor: 0xffffff
}
```

### Example:

```js
const graph = new GraphGeometry('grid', 5, 5, 2, {
  nodeRadius: 0.15,
  edgeRadius: 0.03,
  nodeColor: 0xff00ff,
  edgeColor: 0x3333ff,
});
```

---

## 📦 Features

- Creates node spheres using `THREE.Mesh`
- Creates edge cylinders between nodes
- Automatically positions and orients all elements
- Works as a standard `THREE.Group` in any Three.js scene

---

## 🛠️ Future Roadmap (optional ideas)

- `forceDirected` layout support
- JSON import/export for graphs
- Node interaction (hover/click/select)
- NPM package support

---

## 👨‍💻 Author

Built with ❤️ using Three.js