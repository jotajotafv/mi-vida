import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Clock, Vector2, Vector3 } from "three";
import { PostProcessing } from "../effects/PostProcessing";
import { FinalScene } from "../scenes/FinalScene";
import { MemoriesScene } from "../scenes/MemoriesScene";
import { PortraitsScene } from "../scenes/PortraitsScene";
import { QualitiesScene } from "../scenes/QualitiesScene";
import { UniverseScene } from "../scenes/UniverseScene";
import { getDeviceProfile, hasWebGL } from "../utils/device";
import { disposeObject } from "../utils/dispose";
import { CameraRig } from "./Camera";
import { RendererCore } from "./Renderer";
import { Resources } from "./Resources";

gsap.registerPlugin(ScrollTrigger);

export class Experience {
  private readonly canvas: HTMLCanvasElement;
  private readonly profile = getDeviceProfile();
  private readonly pointer = new Vector2();
  private readonly clock = new Clock();
  private renderer?: RendererCore;
  private camera?: CameraRig;
  private post?: PostProcessing;
  private universe?: UniverseScene;
  private memoriesScene?: MemoriesScene;
  private portraitsScene?: PortraitsScene;
  private qualitiesScene?: QualitiesScene;
  private finalScene?: FinalScene;
  private pointerHandler?: (event: PointerEvent) => void;
  private visibilityHandler?: () => void;
  private contextLostHandler?: (event: Event) => void;
  private frameId = 0;
  private active = false;
  private entered = false;
  private running = false;
  private frames = 0;
  private fps = 0;
  private lastFpsTime = 0;

  constructor(canvas: HTMLCanvasElement, private readonly resources: Resources) {
    this.canvas = canvas;
  }

  init(): boolean {
    if (!hasWebGL()) {
      document.body.classList.add("no-webgl");
      return false;
    }

    this.renderer = new RendererCore(this.canvas, this.profile);
    this.camera = new CameraRig();
    this.universe = new UniverseScene(this.profile);
    this.memoriesScene = new MemoriesScene(this.resources, this.profile);
    this.portraitsScene = new PortraitsScene(this.resources, this.profile);
    this.qualitiesScene = new QualitiesScene(this.profile);
    this.finalScene = new FinalScene(this.profile);
    this.renderer.scene.add(this.universe);
    this.renderer.scene.add(this.memoriesScene);
    this.renderer.scene.add(this.portraitsScene);
    this.renderer.scene.add(this.qualitiesScene);
    this.renderer.scene.add(this.finalScene);
    this.post = new PostProcessing(this.renderer.renderer, this.renderer.scene, this.camera.camera, this.profile);

    this.renderer.resize((width, height) => {
      this.camera?.resize(width, height);
      this.post?.resize(width, height);
    });
    this.bindPointer();
    this.bindVisibility();
    this.createScrollRig();
    return true;
  }

  enter(): void {
    this.entered = true;
    this.active = true;
    if (this.camera) {
      gsap.to(this.camera.state.position, {
        z: 6.4,
        y: 0.25,
        duration: 1.6,
        ease: "power2.out"
      });
    }
    this.startLoop();
    document.body.classList.add("webgl-live");
    gsap.to(this.canvas, { autoAlpha: 1, duration: 1.4, ease: "power2.out" });
    ScrollTrigger.refresh();
  }

  finalGesture(): void {
    this.universe?.intensify();
    this.finalScene?.ignite();
  }

  destroy(): void {
    this.stopLoop();
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    if (this.pointerHandler) {
      window.removeEventListener("pointermove", this.pointerHandler);
    }
    if (this.visibilityHandler) {
      document.removeEventListener("visibilitychange", this.visibilityHandler);
    }
    if (this.contextLostHandler) {
      this.canvas.removeEventListener("webglcontextlost", this.contextLostHandler);
    }
    this.post?.dispose();
    if (this.renderer) {
      disposeObject(this.renderer.scene);
    }
    this.renderer?.dispose();
  }

  getDebugSnapshot(): { fps: number; objects: number; camera: string } {
    let objects = 0;
    this.renderer?.scene.traverse(() => {
      objects += 1;
    });

    const position = this.camera?.camera.position;
    const camera = position
      ? `${position.x.toFixed(2)}, ${position.y.toFixed(2)}, ${position.z.toFixed(2)}`
      : "sin camara";

    return {
      fps: this.fps,
      objects,
      camera
    };
  }

  private animate = (): void => {
    if (!this.running) {
      return;
    }
    this.frameId = requestAnimationFrame(this.animate);
    if (
      !this.active ||
      !this.renderer ||
      !this.camera ||
      !this.post ||
      !this.universe ||
      !this.memoriesScene ||
      !this.portraitsScene ||
      !this.qualitiesScene ||
      !this.finalScene
    ) {
      return;
    }

    const elapsed = this.clock.getElapsedTime();
    this.frames += 1;
    if (elapsed - this.lastFpsTime > 1) {
      this.fps = Math.round(this.frames / Math.max(elapsed - this.lastFpsTime, 0.001));
      this.frames = 0;
      this.lastFpsTime = elapsed;
    }
    this.camera.update(this.profile.reducedMotion ? 0.08 : 0.045);
    this.universe.update(elapsed, this.pointer.x, this.pointer.y, this.profile.reducedMotion);
    this.memoriesScene.update(elapsed, this.profile.reducedMotion);
    this.portraitsScene.update(elapsed, this.profile.reducedMotion);
    this.qualitiesScene.update(elapsed, this.profile.reducedMotion);
    this.finalScene.update(elapsed, this.profile.reducedMotion);
    this.post.render();
  };

  private startLoop(): void {
    if (this.running) {
      return;
    }
    this.running = true;
    this.clock.start();
    this.animate();
  }

  private stopLoop(): void {
    this.running = false;
    cancelAnimationFrame(this.frameId);
  }

  private bindPointer(): void {
    this.pointerHandler = (event: PointerEvent): void => {
      const x = event.clientX / Math.max(window.innerWidth, 1);
      const y = event.clientY / Math.max(window.innerHeight, 1);
      this.pointer.set((x - 0.5) * 2, (y - 0.5) * -2);
    };
    window.addEventListener("pointermove", this.pointerHandler, { passive: true });
  }

  private bindVisibility(): void {
    this.visibilityHandler = (): void => {
      this.active = this.entered && !document.hidden;
      if (document.hidden) {
        this.stopLoop();
      } else if (this.entered) {
        this.startLoop();
      }
    };
    document.addEventListener("visibilitychange", this.visibilityHandler);

    this.contextLostHandler = (event: Event): void => {
      event.preventDefault();
      document.body.classList.add("no-webgl");
      this.active = false;
      this.stopLoop();
    };
    this.canvas.addEventListener("webglcontextlost", this.contextLostHandler);
  }

  private createScrollRig(): void {
    const camera = this.camera;
    if (!camera) {
      return;
    }

    ScrollTrigger.create({
      trigger: "[data-webgl-stage]",
      start: "top bottom",
      end: "bottom bottom",
      scrub: this.profile.reducedMotion ? 0.2 : 1.2,
      onUpdate: (self) => {
        const progress = self.progress;
        const z = 8.5 - progress * 2.2;
        const y = 1.2 - progress * 0.7;
        camera.setNarrativePoint(new Vector3(progress * 0.7, y, z), new Vector3(0, 0.05, 0));
      }
    });

    document.querySelectorAll<HTMLElement>("[data-memory-step]").forEach((element) => {
      const index = Number(element.dataset.memoryStep);
      ScrollTrigger.create({
        trigger: element,
        start: "top 72%",
        end: "bottom 28%",
        scrub: this.profile.reducedMotion ? 0.1 : 0.7,
        onEnter: () => this.focusMemory(index),
        onEnterBack: () => this.focusMemory(index),
        onUpdate: (self) => {
          this.memoriesScene?.setActive(index, self.progress);
          const side = index % 2 === 0 ? -0.38 : 0.38;
          camera.setNarrativePoint(
            new Vector3(side, 0.2 - self.progress * 0.12, 6.1 - index * 0.08),
            new Vector3(0, -0.08, -1.8)
          );
        }
      });
    });

    document.querySelectorAll<HTMLElement>("[data-portrait-step]").forEach((element) => {
      const index = Number(element.dataset.portraitStep);
      ScrollTrigger.create({
        trigger: element,
        start: "top 72%",
        end: "bottom 28%",
        scrub: this.profile.reducedMotion ? 0.1 : 0.8,
        onEnter: () => this.focusPortrait(index),
        onEnterBack: () => this.focusPortrait(index),
        onUpdate: (self) => {
          const progress = (index + self.progress) / 4;
          this.portraitsScene?.setProgress(progress);
          camera.setNarrativePoint(new Vector3(0, 0.15, 6.4), new Vector3(0, -0.12, -3.8));
        }
      });
    });

    ScrollTrigger.create({
      trigger: "[data-final-scene]",
      start: "top 70%",
      end: "bottom bottom",
      scrub: this.profile.reducedMotion ? 0.1 : 0.8,
      onUpdate: (self) => {
        camera.setNarrativePoint(new Vector3(0, 0.3, 6.8 - self.progress * 0.5), new Vector3(0, 0, 0));
      }
    });
  }

  private focusMemory(index: number): void {
    this.memoriesScene?.setActive(index, 0.5);
  }

  private focusPortrait(index: number): void {
    this.portraitsScene?.setProgress((index + 0.5) / 4);
  }
}
