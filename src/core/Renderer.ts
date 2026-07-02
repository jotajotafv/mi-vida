import {
  ACESFilmicToneMapping,
  Color,
  FogExp2,
  Scene,
  SRGBColorSpace,
  WebGLRenderer
} from "three";
import { DeviceProfile } from "../utils/device";

export class RendererCore {
  readonly renderer: WebGLRenderer;
  readonly scene: Scene;
  private readonly profile: DeviceProfile;
  private resizeHandler?: () => void;

  constructor(canvas: HTMLCanvasElement, profile: DeviceProfile) {
    this.profile = profile;
    this.scene = new Scene();
    this.scene.background = new Color("#040816");
    this.scene.fog = new FogExp2("#050a1b", profile.isMobile ? 0.045 : 0.032);

    this.renderer = new WebGLRenderer({
      canvas,
      alpha: false,
      antialias: !profile.isLowPower,
      powerPreference: "high-performance"
    });
    this.renderer.outputColorSpace = SRGBColorSpace;
    this.renderer.toneMapping = ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 0.92;
    this.renderer.setClearColor("#040816", 1);
    this.renderer.setPixelRatio(profile.pixelRatio);
  }

  resize(onResize: (width: number, height: number) => void): void {
    const apply = (): void => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      this.renderer.setPixelRatio(this.profile.pixelRatio);
      this.renderer.setSize(width, height, false);
      onResize(width, height);
    };

    this.resizeHandler = apply;
    window.addEventListener("resize", apply, { passive: true });
    apply();
  }

  dispose(): void {
    if (this.resizeHandler) {
      window.removeEventListener("resize", this.resizeHandler);
    }
    this.renderer.dispose();
  }
}
