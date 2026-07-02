import {
  AdditiveBlending,
  BufferGeometry,
  CatmullRomCurve3,
  Color,
  DoubleSide,
  Float32BufferAttribute,
  Group,
  IcosahedronGeometry,
  Line,
  LineBasicMaterial,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  PlaneGeometry,
  TorusGeometry,
  TubeGeometry,
  Vector3
} from "three";
import { DeviceProfile } from "../utils/device";

export class OrbitalSculpture extends Group {
  private readonly leftRing: Mesh;
  private readonly rightRing: Mesh;
  private readonly core: Mesh;

  constructor(profile: DeviceProfile) {
    super();

    const goldMaterial = new MeshPhysicalMaterial({
      color: "#c9aa72",
      metalness: 0.82,
      roughness: 0.25,
      emissive: "#3a250c",
      emissiveIntensity: 0.18
    });
    const glassMaterial = new MeshPhysicalMaterial({
      color: "#10204a",
      metalness: 0.08,
      roughness: 0.12,
      transmission: 0.38,
      thickness: 0.35,
      transparent: true,
      opacity: 0.32,
      side: DoubleSide
    });
    const glowMaterial = new MeshBasicMaterial({
      color: "#f5dfb4",
      transparent: true,
      opacity: 0.9,
      blending: AdditiveBlending
    });

    const ringGeometry = new TorusGeometry(1.18, 0.045, 24, 140);
    this.leftRing = new Mesh(ringGeometry, goldMaterial);
    this.leftRing.rotation.set(Math.PI * 0.5, 0.42, -0.5);
    this.leftRing.position.x = -0.4;
    this.rightRing = new Mesh(ringGeometry.clone(), goldMaterial.clone());
    this.rightRing.rotation.set(Math.PI * 0.5, -0.42, 0.5);
    this.rightRing.position.x = 0.4;
    this.add(this.leftRing, this.rightRing);

    this.core = new Mesh(new IcosahedronGeometry(0.34, 3), glowMaterial);
    this.core.scale.set(1, 1, 1);
    this.add(this.core);

    this.addOrbit(1.8, 0.28, "#8fa4ff");
    this.addOrbit(2.28, -0.42, "#c9aa72");
    this.addOrbit(1.48, 0.82, "#d46d8b");
    this.addInitials(profile);

    for (let index = 0; index < 5; index += 1) {
      const plane = new Mesh(new PlaneGeometry(0.75, 1.15), glassMaterial.clone());
      plane.position.set(Math.cos(index) * 1.8, -0.2 + index * 0.12, Math.sin(index * 1.2) * 0.9);
      plane.rotation.set(0.6 + index * 0.1, index * 0.72, -0.28);
      this.add(plane);
    }
  }

  update(elapsed: number, pointerX: number, pointerY: number, reducedMotion: boolean): void {
    const motion = reducedMotion ? 0 : 1;
    this.rotation.y = elapsed * 0.1 * motion + pointerX * 0.08;
    this.rotation.x = Math.sin(elapsed * 0.22) * 0.04 * motion + pointerY * 0.04;
    this.position.y = Math.sin(elapsed * 0.55) * 0.06 * motion;
    this.core.scale.setScalar(1 + Math.sin(elapsed * 1.4) * 0.035 * motion);
  }

  uniteRings(): void {
    this.leftRing.position.x *= 0.62;
    this.rightRing.position.x *= 0.62;
    this.core.scale.setScalar(1.35);
  }

  private addOrbit(radius: number, tilt: number, color: string): void {
    const points: Vector3[] = [];
    for (let index = 0; index <= 96; index += 1) {
      const angle = (index / 96) * Math.PI * 2;
      points.push(new Vector3(Math.cos(angle) * radius, Math.sin(angle * 2) * 0.12, Math.sin(angle) * radius * 0.48));
    }

    const curve = new CatmullRomCurve3(points, true);
    const mesh = new Mesh(
      new TubeGeometry(curve, 96, 0.008, 8, true),
      new MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.52
      })
    );
    mesh.rotation.z = tilt;
    this.add(mesh);
  }

  private addInitials(profile: DeviceProfile): void {
    const material = new LineBasicMaterial({
      color: new Color("#f4ede2"),
      transparent: true,
      opacity: profile.isMobile ? 0.28 : 0.36
    });

    this.add(this.createInitialLine(["R"], -1.35, material));
    this.add(this.createInitialLine(["J"], 1.15, material.clone()));
  }

  private createInitialLine(letter: string[], offsetX: number, material: LineBasicMaterial): Line {
    const points =
      letter[0] === "R"
        ? [
            -0.2, -0.6, 0, -0.2, 0.7, 0, 0.22, 0.58, 0, 0.36, 0.25, 0, -0.2, 0.05, 0, 0.36, -0.6, 0
          ]
        : [0.35, 0.7, 0, 0.35, -0.42, 0, 0.12, -0.64, 0, -0.2, -0.48, 0];
    const geometry = new BufferGeometry();
    const shifted = points.map((value, index) => (index % 3 === 0 ? value + offsetX : value));
    geometry.setAttribute("position", new Float32BufferAttribute(shifted, 3));
    return new Line(geometry, material);
  }
}
