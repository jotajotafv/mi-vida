import { Group } from "three";
import { Constellation } from "../objects/Constellation";
import { DeviceProfile } from "../utils/device";

export class QualitiesScene extends Group {
  private readonly constellation: Constellation;

  constructor(profile: DeviceProfile) {
    super();
    this.position.set(0, 0.05, -3.1);
    this.constellation = new Constellation(profile);
    this.add(this.constellation);
  }

  update(elapsed: number, reducedMotion: boolean): void {
    this.constellation.update(elapsed, reducedMotion);
  }
}
