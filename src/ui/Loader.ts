import { gsap } from "gsap";

export class Loader {
  private readonly root: HTMLElement;
  private readonly percentage: HTMLElement;
  private readonly line: HTMLElement;
  private readonly status: HTMLElement;

  constructor(root: HTMLElement) {
    this.root = root;
    this.percentage = this.root.querySelector<HTMLElement>("[data-loader-percent]")!;
    this.line = this.root.querySelector<HTMLElement>("[data-loader-line]")!;
    this.status = this.root.querySelector<HTMLElement>("[data-loader-status]")!;
  }

  update(percent: number, ok: boolean): void {
    this.percentage.textContent = `${percent}%`;
    this.line.style.transform = `scaleX(${percent / 100})`;
    if (!ok) {
      this.status.textContent = "Un recuerdo tardó en responder, seguimos preparando el universo.";
    }
  }

  async hide(): Promise<void> {
    await gsap.to(this.root, {
      autoAlpha: 0,
      duration: 0.9,
      ease: "power2.out"
    });
    this.root.setAttribute("aria-hidden", "true");
  }
}
