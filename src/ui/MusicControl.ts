import { AudioManager } from "../core/AudioManager";

export class MusicControl {
  private readonly root: HTMLElement;
  private readonly playButton: HTMLButtonElement;
  private readonly muteButton: HTMLButtonElement;
  private readonly status: HTMLElement;

  constructor(root: HTMLElement, audio: AudioManager) {
    this.root = root;
    this.playButton = this.root.querySelector<HTMLButtonElement>("[data-audio-toggle]")!;
    this.muteButton = this.root.querySelector<HTMLButtonElement>("[data-audio-mute]")!;
    this.status = this.root.querySelector<HTMLElement>("[data-audio-status]")!;

    this.playButton.addEventListener("click", () => audio.togglePlayback());
    this.muteButton.addEventListener("click", () => audio.toggleMute());
    audio.addEventListener("change", () => this.update(audio));
    audio.addEventListener("error", () => {
      this.root.classList.add("is-error");
      this.status.textContent = "No se pudo cargar la musica";
      this.playButton.setAttribute("aria-label", "No se pudo reproducir la musica");
    });

    this.update(audio);
  }

  show(): void {
    this.root.classList.add("is-visible");
  }

  private update(audio: AudioManager): void {
    this.playButton.setAttribute("aria-pressed", String(audio.isPlaying()));
    this.playButton.setAttribute("aria-label", audio.isPlaying() ? "Pausar musica" : "Reproducir musica");
    this.muteButton.setAttribute("aria-pressed", String(audio.isMuted()));
    this.muteButton.setAttribute("aria-label", audio.isMuted() ? "Activar sonido" : "Silenciar musica");
    this.root.dataset.playing = String(audio.isPlaying());
    this.root.dataset.muted = String(audio.isMuted());
    this.root.dataset.status = audio.getStatus();
    this.status.textContent = audio.getStatus();
  }
}
