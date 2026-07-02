import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Group,
  Points,
  PointsMaterial
} from "three";
import { DeviceProfile } from "../utils/device";

export class FinalScene extends Group {
  private readonly burst: Points;
  private intensity = 0;

  constructor(profile: DeviceProfile) {
    super();
    const count = profile.isMobile ? 160 : 360;
    const positions = new Float32Array(count * 3);

    for (let index = 0; index < count; index += 1) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 0.2 + Math.random() * 2.2;
      positions[index * 3] = Math.cos(angle) * radius;
      positions[index * 3 + 1] = (Math.random() - 0.5) * 1.2;
      positions[index * 3 + 2] = Math.sin(angle) * radius;
    }

    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new BufferAttribute(positions, 3));
    this.burst = new Points(
      geometry,
      new PointsMaterial({
        color: "#f4ede2",
        size: profile.isMobile ? 0.028 : 0.036,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        blending: AdditiveBlending
      })
    );
    this.add(this.burst);
  }

  ignite(): void {
    this.intensity = 1;
    this.burst.scale.setScalar(0.3);
  }

  update(elapsed: number, reducedMotion: boolean): void {
    if (this.intensity <= 0) {
      return;
    }
    this.intensity *= reducedMotion ? 0.96 : 0.985;
    this.burst.scale.setScalar(this.burst.scale.x + (reducedMotion ? 0.006 : 0.014));
    this.burst.rotation.y = elapsed * 0.08;
    (this.burst.material as PointsMaterial).opacity = this.intensity * 0.62;
  }
}
