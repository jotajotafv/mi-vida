import { PerspectiveCamera, Vector3 } from "three";
import { dampVector } from "../utils/math";

export type CameraRigState = {
  position: Vector3;
  target: Vector3;
};

export class CameraRig {
  readonly camera: PerspectiveCamera;
  readonly state: CameraRigState;
  private readonly currentTarget = new Vector3(0, 0, 0);

  constructor() {
    this.camera = new PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 80);
    this.state = {
      position: new Vector3(0, 0.35, 9),
      target: new Vector3(0, 0, 0)
    };
    this.camera.position.copy(this.state.position);
    this.currentTarget.copy(this.state.target);
  }

  resize(width: number, height: number): void {
    this.camera.aspect = width / Math.max(height, 1);
    this.camera.updateProjectionMatrix();
  }

  setNarrativePoint(position: Vector3, target: Vector3): void {
    this.state.position.copy(position);
    this.state.target.copy(target);
  }

  update(alpha: number): void {
    dampVector(this.camera.position, this.state.position, alpha);
    dampVector(this.currentTarget, this.state.target, alpha);
    this.camera.lookAt(this.currentTarget);
  }
}
