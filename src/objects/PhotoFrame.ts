import {
  BoxGeometry,
  Color,
  Group,
  LinearFilter,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  PlaneGeometry,
  SRGBColorSpace,
  TextureLoader
} from "three";
import { ImageMeta } from "../core/Resources";

export class PhotoFrame extends Group {
  private readonly photo: Mesh<PlaneGeometry, MeshBasicMaterial>;
  private readonly frame: Mesh<BoxGeometry, MeshPhysicalMaterial>;
  private readonly baseScale = 1;

  constructor(image: string, meta: ImageMeta | undefined, width: number) {
    super();
    const aspect = meta?.aspect ?? 0.72;
    const height = width / Math.max(aspect, 0.35);
    const texture = new TextureLoader().load(image);
    texture.colorSpace = SRGBColorSpace;
    texture.minFilter = LinearFilter;
    texture.magFilter = LinearFilter;

    this.photo = new Mesh(
      new PlaneGeometry(width, height),
      new MeshBasicMaterial({
        map: texture,
        transparent: false,
        toneMapped: false
      })
    );
    this.photo.position.z = 0.046;

    this.frame = new Mesh(
      new BoxGeometry(width + 0.16, height + 0.16, 0.12),
      new MeshPhysicalMaterial({
        color: new Color("#11172b"),
        metalness: 0.48,
        roughness: 0.28,
        clearcoat: 0.45,
        clearcoatRoughness: 0.32
      })
    );

    this.add(this.frame, this.photo);
    this.scale.setScalar(this.baseScale);
    this.frustumCulled = true;
  }

  setPresence(value: number): void {
    const opacity = Math.max(0, Math.min(1, value));
    this.frame.material.opacity = opacity;
    this.frame.material.transparent = opacity < 1;
    this.photo.visible = opacity > 0.03;
    this.frame.visible = opacity > 0.03;
    this.scale.setScalar(0.76 + opacity * 0.34);
  }
}
