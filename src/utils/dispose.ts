import {
  BufferGeometry,
  Material,
  Object3D,
  Texture
} from "three";

type DisposableMaterial = Material & {
  map?: Texture | null;
  alphaMap?: Texture | null;
  emissiveMap?: Texture | null;
  roughnessMap?: Texture | null;
  metalnessMap?: Texture | null;
  normalMap?: Texture | null;
};

export function disposeObject(root: Object3D): void {
  root.traverse((object) => {
    const renderable = object as Object3D & {
      geometry?: BufferGeometry;
      material?: Material | Material[];
    };

    renderable.geometry?.dispose();

    const materials = Array.isArray(renderable.material)
      ? renderable.material
      : renderable.material
        ? [renderable.material]
        : [];

    materials.forEach((material) => {
      const disposable = material as DisposableMaterial;
      disposable.map?.dispose();
      disposable.alphaMap?.dispose();
      disposable.emissiveMap?.dispose();
      disposable.roughnessMap?.dispose();
      disposable.metalnessMap?.dispose();
      disposable.normalMap?.dispose();
      material.dispose();
    });
  });
}
