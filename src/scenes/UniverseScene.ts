import {
  AmbientLight,
  DirectionalLight,
  Group,
  PointLight
} from "three";
import { OrbitalSculpture } from "../objects/OrbitalSculpture";
import { Particles } from "../objects/Particles";
import { DeviceProfile } from "../utils/device";

export class UniverseScene extends Group {
  readonly sculpture: OrbitalSculpture;
  private readonly particles: Particles;
  private readonly keyLight: PointLight;

  constructor(profile: DeviceProfile) {
    super();
    this.add(new AmbientLight("#9aa8d6", 0.58));

    const rim = new DirectionalLight("#7b8fff", 1.1);
    rim.position.set(-3, 4, 5);
    this.add(rim);

    const blue = new PointLight("#6e8cff", 1.15, 18);
    blue.position.set(2.4, -1.1, 3.8);
    this.add(blue);

    this.keyLight = new PointLight("#f3d69a", 1.7, 18);
    this.keyLight.position.set(0, 0.3, 2.2);
    this.add(this.keyLight);

    this.sculpture = new OrbitalSculpture(profile);
    this.sculpture.scale.setScalar(profile.isMobile ? 1.08 : 1.18);
    this.add(this.sculpture);

    this.particles = new Particles(profile);
    this.add(this.particles);
  }

  update(elapsed: number, pointerX: number, pointerY: number, reducedMotion: boolean): void {
    this.sculpture.update(elapsed, pointerX, pointerY, reducedMotion);
    this.particles.update(elapsed, reducedMotion);
    if (!reducedMotion) {
      this.keyLight.intensity = 1.55 + Math.sin(elapsed * 0.75) * 0.15;
    }
  }

  intensify(): void {
    this.keyLight.intensity = 2.6;
    this.sculpture.uniteRings();
  }
}
