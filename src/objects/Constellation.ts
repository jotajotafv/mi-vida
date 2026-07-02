import {
  BufferGeometry,
  Float32BufferAttribute,
  Group,
  LineSegments,
  LineBasicMaterial,
  Mesh,
  MeshBasicMaterial,
  SphereGeometry,
  Vector3
} from "three";
import { DeviceProfile } from "../utils/device";

export class Constellation extends Group {
  private readonly nodes: Mesh[] = [];
  private readonly lines: LineSegments;

  constructor(profile: DeviceProfile) {
    super();
    const radius = profile.isMobile ? 1.35 : 2.05;
    const positions: number[] = [];
    const linePositions: number[] = [];

    for (let index = 0; index < 8; index += 1) {
      const angle = (index / 8) * Math.PI * 2;
      const point = new Vector3(
        Math.cos(angle) * radius,
        Math.sin(angle * 1.7) * 0.42,
        Math.sin(angle) * radius * 0.42
      );
      positions.push(point.x, point.y, point.z);

      const node = new Mesh(
        new SphereGeometry(index === 0 ? 0.045 : 0.032, 12, 12),
        new MeshBasicMaterial({
          color: index % 2 === 0 ? "#c9aa72" : "#9faeff",
          transparent: true,
          opacity: 0.74
        })
      );
      node.position.copy(point);
      this.nodes.push(node);
      this.add(node);

      const nextAngle = ((index + 1) / 8) * Math.PI * 2;
      linePositions.push(
        point.x,
        point.y,
        point.z,
        Math.cos(nextAngle) * radius,
        Math.sin(nextAngle * 1.7) * 0.42,
        Math.sin(nextAngle) * radius * 0.42
      );
    }

    linePositions.push(0, 0, 0, ...positions.slice(0, 3), 0, 0, 0, ...positions.slice(9, 12));
    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new Float32BufferAttribute(linePositions, 3));
    this.lines = new LineSegments(
      geometry,
      new LineBasicMaterial({
        color: "#c9aa72",
        transparent: true,
        opacity: 0.23
      })
    );
    this.add(this.lines);

    const center = new Mesh(
      new SphereGeometry(0.11, 16, 16),
      new MeshBasicMaterial({
        color: "#f4ede2",
        transparent: true,
        opacity: 0.68
      })
    );
    this.add(center);
  }

  update(elapsed: number, reducedMotion: boolean): void {
    if (reducedMotion) {
      return;
    }
    this.rotation.y = elapsed * 0.055;
    this.nodes.forEach((node, index) => {
      node.scale.setScalar(1 + Math.sin(elapsed * 0.9 + index) * 0.14);
    });
  }
}
