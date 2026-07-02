import { memories } from "../data/memories";

export class MemoryViewer {
  private readonly root: HTMLElement;
  private readonly image: HTMLImageElement;
  private readonly title: HTMLElement;
  private readonly description: HTMLElement;
  private readonly closeButton: HTMLButtonElement;
  private readonly previousButton: HTMLButtonElement;
  private readonly nextButton: HTMLButtonElement;
  private index = 0;
  private lastFocus: HTMLElement | null = null;

  constructor(root: HTMLElement) {
    this.root = root;
    this.image = root.querySelector<HTMLImageElement>("[data-viewer-image]")!;
    this.title = root.querySelector<HTMLElement>("[data-viewer-title]")!;
    this.description = root.querySelector<HTMLElement>("[data-viewer-description]")!;
    this.closeButton = root.querySelector<HTMLButtonElement>("[data-viewer-close]")!;
    this.previousButton = root.querySelector<HTMLButtonElement>("[data-viewer-prev]")!;
    this.nextButton = root.querySelector<HTMLButtonElement>("[data-viewer-next]")!;

    this.closeButton.addEventListener("click", () => this.close());
    this.previousButton.addEventListener("click", () => this.go(-1));
    this.nextButton.addEventListener("click", () => this.go(1));
    this.root.addEventListener("click", (event) => {
      if (event.target === this.root) {
        this.close();
      }
    });
    document.addEventListener("keydown", this.handleKeydown);
  }

  open(index: number): void {
    this.index = index;
    this.lastFocus = document.activeElement as HTMLElement | null;
    this.render();
    document.body.classList.add("viewer-open");
    this.root.removeAttribute("hidden");
    this.root.setAttribute("aria-hidden", "false");
    this.closeButton.focus({ preventScroll: true });
  }

  close(): void {
    this.root.setAttribute("aria-hidden", "true");
    this.root.setAttribute("hidden", "");
    document.body.classList.remove("viewer-open");
    this.lastFocus?.focus({ preventScroll: true });
  }

  private go(offset: number): void {
    this.index = (this.index + offset + memories.length) % memories.length;
    this.render();
  }

  private render(): void {
    const memory = memories[this.index];
    this.image.src = memory.image;
    this.image.alt = memory.alt;
    this.title.textContent = memory.title;
    this.description.textContent = memory.description;
  }

  private readonly handleKeydown = (event: KeyboardEvent): void => {
    if (this.root.hasAttribute("hidden")) {
      return;
    }

    if (event.key === "Escape") {
      this.close();
    }
    if (event.key === "ArrowLeft") {
      this.go(-1);
    }
    if (event.key === "ArrowRight") {
      this.go(1);
    }
  };
}
