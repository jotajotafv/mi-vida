import { Scene, Vector2, WebGLRenderer } from "three";
import { PerspectiveCamera } from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { DeviceProfile } from "../utils/device";

export class PostProcessing {
  private readonly composer: EffectComposer;
  private readonly bloom: UnrealBloomPass;

  constructor(renderer: WebGLRenderer, scene: Scene, camera: PerspectiveCamera, profile: DeviceProfile) {
    this.composer = new EffectComposer(renderer);
    this.composer.addPass(new RenderPass(scene, camera));

    this.bloom = new UnrealBloomPass(
      new Vector2(window.innerWidth, window.innerHeight),
      profile.isLowPower ? 0.08 : 0.24,
      0.38,
      0.84
    );
    this.bloom.enabled = !profile.reducedMotion && !profile.isMobile;
    this.composer.addPass(this.bloom);
    this.composer.addPass(new OutputPass());
  }

  resize(width: number, height: number): void {
    this.composer.setSize(width, height);
    this.bloom.setSize(width, height);
  }

  render(): void {
    this.composer.render();
  }

  dispose(): void {
    this.composer.dispose();
  }
}
