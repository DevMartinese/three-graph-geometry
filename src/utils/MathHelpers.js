export class MathHelpers {
  static rand(min, max) {
    return min + Math.random() * (max - min);
  }

  static randomColor() {
    return (Math.random() * 0xffffff) << 0;
  }

  static safeParse(str, fallback) {
    try {
      return JSON.parse(str);
    } catch {
      return fallback;
    }
  }

  static keyOf(vector, tolerance = 1e-6) {
    const kx = Math.round(vector.x / tolerance);
    const ky = Math.round(vector.y / tolerance);
    const kz = Math.round((vector.z ?? 0) / tolerance);
    return `${kx},${ky},${kz}`;
  }

  static normalizeEdge(edge, defaultRadius, defaultColor) {
    if (Array.isArray(edge)) {
      return { 
        a: edge[0], 
        b: edge[1], 
        radius: defaultRadius, 
        color: defaultColor 
      };
    }
    return {
      a: edge.a, 
      b: edge.b,
      radius: edge.radius ?? defaultRadius,
      color: edge.color ?? defaultColor
    };
  }
}