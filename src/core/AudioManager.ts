import { siteConfig } from "../data/config";

export class AudioManager extends EventTarget {
  private readonly audio: HTMLAudioElement;
  private wasPlayingBeforeHidden = false;
  private started = false;
  private status: "listo" | "reproduciendo" | "pausado" | "error" = "listo";

  constructor() {
    super();
    this.audio = new Audio(siteConfig.musicPath);
    this.audio.preload = "auto";
    this.audio.loop = true;
    this.audio.muted = false;
    this.audio.defaultMuted = false;
    this.audio.volume = 1;

    this.audio.addEventListener("loadedmetadata", () => this.logState("metadata"));
    this.audio.addEventListener("canplaythrough", () => this.logState("canplaythrough"));
    this.audio.addEventListener("play", () => {
      this.status = "reproduciendo";
      this.logState("play");
      this.dispatchChange();
    });
    this.audio.addEventListener("pause", () => {
      this.status = this.started ? "pausado" : "listo";
      this.logState("pause");
      this.dispatchChange();
    });
    this.audio.addEventListener("error", () => {
      this.status = "error";
      this.logState("error");
      this.dispatchError();
    });

    document.addEventListener("visibilitychange", this.handleVisibilityChange);
  }

  playFromUserGesture(): void {
    this.started = true;
    this.audio.muted = false;
    this.audio.defaultMuted = false;
    this.audio.volume = 1;

    this.logState("antes de play()");
    this.audio
      .play()
      .then(() => {
        this.status = "reproduciendo";
        this.logState("Reproduciendo");
        this.dispatchChange();
      })
      .catch((error: unknown) => {
        this.status = "error";
        console.error("[AUDIO] Fallo play()", error);
        this.logState("fallo play()");
        this.dispatchError();
      });
  }

  togglePlayback(): void {
    if (this.audio.paused) {
      this.playFromUserGesture();
      return;
    }

    this.audio.pause();
    this.status = "pausado";
    this.dispatchChange();
  }

  toggleMute(): void {
    this.audio.muted = !this.audio.muted;
    this.audio.defaultMuted = false;
    if (!this.audio.muted) {
      this.audio.volume = 1;
    }
    this.logState("mute toggle");
    this.dispatchChange();
  }

  isPlaying(): boolean {
    return !this.audio.paused;
  }

  isMuted(): boolean {
    return this.audio.muted;
  }

  getStatus(): string {
    if (this.status === "error") {
      return "error";
    }
    if (!this.audio.paused) {
      return "reproduciendo";
    }
    if (this.started) {
      return "pausado";
    }
    return "listo";
  }

  destroy(): void {
    document.removeEventListener("visibilitychange", this.handleVisibilityChange);
    this.audio.pause();
    this.audio.removeAttribute("src");
    this.audio.load();
  }

  private readonly handleVisibilityChange = (): void => {
    if (document.hidden) {
      this.wasPlayingBeforeHidden = !this.audio.paused;
      if (this.wasPlayingBeforeHidden) {
        this.audio.pause();
      }
      return;
    }

    if (this.started && this.wasPlayingBeforeHidden) {
      this.playFromUserGesture();
    }
  };

  private dispatchChange(): void {
    this.dispatchEvent(new CustomEvent("change"));
  }

  private dispatchError(): void {
    this.dispatchEvent(new CustomEvent("error"));
  }

  private logState(label: string): void {
    console.info(`[AUDIO] ${label}`, {
      currentSrc: this.audio.currentSrc,
      paused: this.audio.paused,
      muted: this.audio.muted,
      volume: this.audio.volume,
      currentTime: this.audio.currentTime,
      duration: this.audio.duration,
      readyState: this.audio.readyState,
      error: this.audio.error
    });
  }
}
