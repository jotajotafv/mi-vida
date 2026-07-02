import { Group } from "three";
import { Resources } from "../core/Resources";
import { portraits } from "../data/portraits";
import { PhotoFrame } from "../objects/PhotoFrame";
import { DeviceProfile } from "../utils/device";

export class PortraitsScene extends Group {
  private readonly frames: PhotoFrame[] = [];

  constructor(resources: Resources, profile: DeviceProfile) {
    super();
    this.position.set(0, -0.25, -3.8);

    portraits.forEach((portrait, index) => {
      const frame = new PhotoFrame(portrait.image, resources.getImageMeta(portrait.image), profile.isMobile ? 2.05 : 1.7);
      const angle = -0.48 + index * 0.32;
      const x = profile.isMobile ? 0 : (index - 1.5) * 1.18;
      frame.position.set(x, profile.isMobile ? 0 : Math.sin(angle) * 0.38, profile.isMobile ? -index * 1.1 : -Math.cos(angle) * 1.2);
      frame.rotation.y = profile.isMobile ? (index % 2 === 0 ? -0.16 : 0.16) : -angle;
      frame.setPresence(index === 0 ? 1 : 0.2);
      this.frames.push(frame);
      this.add(frame);
    });
  }

  setProgress(progress: number): void {
    const active = Math.min(this.frames.length - 1, Math.floor(progress * this.frames.length));
    this.frames.forEach((frame, index) => {
      const distance = Math.abs(index - active);
      frame.setPresence(distance === 0 ? 1 : distance === 1 ? 0.32 : 0.12);
      frame.position.z = distance === 0 ? 0.6 : -distance * 1.35;
      frame.rotation.y = distance === 0 ? 0 : index < active ? -0.36 : 0.36;
    });
  }

  update(elapsed: number, reducedMotion: boolean): void {
    if (reducedMotion) {
      return;
    }
    this.rotation.y = Math.sin(elapsed * 0.22) * 0.04;
  }
}
