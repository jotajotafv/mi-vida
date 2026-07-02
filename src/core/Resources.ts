import { memories } from "../data/memories";
import { portraits } from "../data/portraits";
import { siteConfig } from "../data/config";
import { assetUrl } from "../utils/assetUrl";

export type ResourceProgress = {
  loaded: number;
  total: number;
  percent: number;
  url: string;
  ok: boolean;
};

export type ImageMeta = {
  url: string;
  width: number;
  height: number;
  aspect: number;
};

export class Resources {
  private readonly imageMeta = new Map<string, ImageMeta>();
  private readonly errors: string[] = [];

  getImageMeta(url: string): ImageMeta | undefined {
    return this.imageMeta.get(url);
  }

  getErrors(): string[] {
    return [...this.errors];
  }

  getTextureCount(): number {
    return this.imageMeta.size;
  }

  getInitialUrls(): string[] {
    return [
      assetUrl("assets/images/portada.jpg"),
      ...memories.map((memory) => memory.image),
      ...portraits.map((portrait) => portrait.image),
      assetUrl("assets/images/final.jpg"),
      siteConfig.musicPath
    ];
  }

  async preload(onProgress: (progress: ResourceProgress) => void): Promise<void> {
    const urls = this.getInitialUrls();
    let loaded = 0;

    await Promise.all(
      urls.map(async (url) => {
        const ok = await this.loadUrl(url);
        console.info(`${ok ? "[OK]" : "[ERROR]"} ${url}`);
        loaded += 1;
        onProgress({
          loaded,
          total: urls.length,
          percent: Math.round((loaded / urls.length) * 100),
          url,
          ok
        });
      })
    );
  }

  private async loadUrl(url: string): Promise<boolean> {
    try {
      if (/\.(jpg|jpeg|png|webp)$/i.test(url)) {
        await this.loadImage(url);
        return true;
      }

      await this.checkAsset(url);
      return true;
    } catch {
      this.errors.push(url);
      return false;
    }
  }

  private loadImage(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.decoding = "async";
      image.onload = () => {
        this.imageMeta.set(url, {
          url,
          width: image.naturalWidth,
          height: image.naturalHeight,
          aspect: image.naturalWidth / Math.max(image.naturalHeight, 1)
        });
        resolve();
      };
      image.onerror = () => reject(new Error(url));
      image.src = url;
    });
  }

  private async checkAsset(url: string): Promise<void> {
    const response = await fetch(url, { method: "HEAD" });
    if (!response.ok) {
      throw new Error(url);
    }
  }
}
