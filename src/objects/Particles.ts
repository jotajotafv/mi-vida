import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  Points,
  PointsMaterial
} from "three";
import { DeviceProfile } from "../utils/device";

export class Particles extends Points {
  constructor(profile: DeviceProfile) {
    const count = profile.isMobile ? 360 : 960;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const gold = new Color("#c9aa72");
    const blue = new Color("#7790ff");

    for (let index = 0; index < count; index += 1) {
      const radius = 3.5 + Math.random() * 14;
      const angle = Math.random() * Math.PI * 2;
      const height = (Math.random() - 0.5) * 9;
      positions[index * 3] = Math.cos(angle) * radius;
      positions[index * 3 + 1] = height;
      positions[index * 3 + 2] = Math.sin(angle) * radius;

      const color = gold.clone().lerp(blue, Math.random() * 0.65);
      colors[index * 3] = color.r;
      colors[index * 3 + 1] = color.g;
      colors[index * 3 + 2] = color.b;
    }

    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new BufferAttribute(positions, 3));
    geometry.setAttribute("color", new BufferAttribute(colors, 3));

    const material = new PointsMaterial({
      size: profile.isMobile ? 0.025 : 0.032,
      vertexColors: true,
      transparent: true,
      opacity: profile.reducedMotion ? 0.16 : profile.isMobile ? 0.38 : 0.48,
      depthWrite: false,
      blending: AdditiveBlending
    });

    super(geometry, material);
    this.frustumCulled = true;
  }

  update(elapsed: number, reducedMotion: boolean): void {
    if (reducedMotion) {
      return;
    }
    this.rotation.y = elapsed * 0.018;
    this.rotation.x = Math.sin(elapsed * 0.12) * 0.018;
  }
}
