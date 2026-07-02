import { Group } from "three";
import { Resources } from "../core/Resources";
import { memories } from "../data/memories";
import { PhotoFrame } from "../objects/PhotoFrame";
import { DeviceProfile } from "../utils/device";

export class MemoriesScene extends Group {
  private readonly frames: PhotoFrame[] = [];
  private readonly baseY: number[] = [];
  private activeIndex = 0;

  constructor(resources: Resources, profile: DeviceProfile) {
    super();
    this.position.set(0, -0.25, -1.8);

    memories.forEach((memory, index) => {
      const frame = new PhotoFrame(memory.image, resources.getImageMeta(memory.image), profile.isMobile ? 2.55 : 2.6);
      const side = index % 2 === 0 ? -1 : 1;
      const y = profile.isMobile ? 0 : (index - 4.5) * -0.08;
      frame.position.set(profile.isMobile ? 0 : side * 1.25, y, -index * 1.35);
      frame.rotation.y = profile.isMobile ? 0 : side * -0.35;
      frame.rotation.z = side * 0.025;
      frame.setPresence(index === 0 ? 1 : 0.14);
      this.baseY.push(y);
      this.frames.push(frame);
      this.add(frame);
    });
  }

  setActive(index: number, progress: number): void {
    this.activeIndex = index;
    this.frames.forEach((frame, frameIndex) => {
      const distance = Math.abs(frameIndex - index);
      const base = distance === 0 ? 1 : distance === 1 ? 0.26 : 0.08;
      frame.setPresence(base);
      frame.position.y = this.baseY[frameIndex] + (progress - 0.5) * 0.28;
      frame.position.z = -distance * 1.4 + (distance === 0 ? 0.65 : -1.8);
      frame.rotation.y = distance === 0 ? 0 : (frameIndex < index ? -0.42 : 0.42);
      frame.rotation.x = distance === 0 ? 0 : -0.08;
    });
  }

  update(elapsed: number, reducedMotion: boolean): void {
    const current = this.frames[this.activeIndex];
    if (!current || reducedMotion) {
      return;
    }
    current.position.z = Math.sin(elapsed * 0.6) * 0.035;
    current.rotation.x = Math.sin(elapsed * 0.34) * 0.018;
  }
}
