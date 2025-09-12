const customPresets = new Map();

export class PresetManager {
  static registerPreset(name, fn) {
    if (typeof fn !== 'function') {
      console.warn(`PresetManager.registerPreset: fn must be a function`);
      return;
    }
    customPresets.set(name, fn);
  }

  static unregisterPreset(name) {
    customPresets.delete(name);
  }

  static listPresets() {
    return [...customPresets.keys()];
  }

  static getPreset(name) {
    return customPresets.get(name);
  }

  static hasPreset(name) {
    return customPresets.has(name);
  }

  static getBuiltInPresets() {
    return [
      'cube', 'pyramid', 'prism', 'octahedron', 'triangle', 'line',
      'cone', 'star', 'circular', 'grid', 'lattice',
      'spokes', 'polyline', 'paths'
    ];
  }

  static getAllPresets() {
    return [...PresetManager.getBuiltInPresets(), ...PresetManager.listPresets()];
  }
}

export function registerPreset(name, fn) {
  return PresetManager.registerPreset(name, fn);
}

export function unregisterPreset(name) {
  return PresetManager.unregisterPreset(name);
}

export function listPresets() {
  return PresetManager.listPresets();
}