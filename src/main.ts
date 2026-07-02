import "./styles/main.css";
import { finalLetter, siteConfig } from "./data/config";
import { memories } from "./data/memories";
import { portraits } from "./data/portraits";
import { qualities } from "./data/qualities";
import { AudioManager } from "./core/AudioManager";
import { Experience } from "./core/Experience";
import { Resources } from "./core/Resources";
import { Loader } from "./ui/Loader";
import { MemoryViewer } from "./ui/MemoryViewer";
import { MusicControl } from "./ui/MusicControl";
import { assetUrl } from "./utils/assetUrl";

const debugMode = new URLSearchParams(window.location.search).get("debug") === "1";

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("No se encontró el contenedor principal.");
}

document.body.classList.add("is-preentry");

app.innerHTML = `
  <div class="loader" data-loader role="status" aria-live="polite">
    <div class="loader__inner">
      <p class="loader__eyebrow">${siteConfig.title}</p>
      <p class="loader__text" data-loader-status>Preparando un universo para ti...</p>
      <div class="loader__track" aria-hidden="true">
        <span class="loader__line" data-loader-line></span>
      </div>
      <p class="loader__percent" data-loader-percent>0%</p>
    </div>
  </div>
  <canvas class="webgl-canvas" data-webgl aria-hidden="true"></canvas>
  <div class="webgl-fallback" role="note">
    <p>${siteConfig.initials}</p>
    <span>${siteConfig.webglFallback}</span>
  </div>
  <main class="app-shell app-content" id="experience-root">
    <section class="opening" aria-label="${siteConfig.title}">
      <img
        class="opening__image"
        src="${assetUrl("assets/images/portada.jpg")}"
        alt="Ruth de perfil junto a unas vías del tren, de noche."
        decoding="async"
        fetchpriority="high"
      />
      <div class="opening__grain" aria-hidden="true"></div>
      <div class="opening__content" data-opening-content>
        <p class="opening__eyebrow">${siteConfig.openingEyebrow}</p>
        <h1>${siteConfig.openingTitle}</h1>
        <p class="opening__subtitle">${siteConfig.openingSubtitle}</p>
        <button class="button-primary" type="button" data-enter>
          <span>${siteConfig.enterButton}</span>
        </button>
      </div>
      <p class="opening__scroll" data-scroll-hint>${siteConfig.scrollHint}</p>
    </section>
    <section class="story-prologue" aria-label="Inicio de la historia">
      <p>${siteConfig.initials}</p>
    </section>
    <section class="webgl-stage" data-webgl-stage aria-label="Escultura de nuestro universo">
      <div class="section-copy">
        <p class="section-kicker">${siteConfig.relationshipDate}</p>
        <h2>${siteConfig.initials}</h2>
        <p>${siteConfig.universeText}</p>
      </div>
    </section>
    <section class="memories" aria-label="Línea del tiempo de recuerdos">
      <div class="section-copy memories__intro">
        <p class="section-kicker">${siteConfig.memoriesEyebrow}</p>
        <h2>${siteConfig.memoriesTitle}</h2>
      </div>
      ${memories
        .map(
          (memory, index) => `
            <article class="memory-step memory-section" data-memory-step="${index}" data-scene-index="${index}">
              <button class="memory-photo-button" type="button" data-memory-open="${index}" aria-label="Ampliar recuerdo ${index + 1}: ${memory.title}">
                <img src="${memory.image}" alt="${memory.alt}" loading="${index < 2 ? "eager" : "lazy"}" decoding="async" />
              </button>
              <div class="memory-copy">
                <span>${String(index + 1).padStart(2, "0")}</span>
                <h3>${memory.title}</h3>
                <p>${memory.description}</p>
              </div>
            </article>
          `
        )
        .join("")}
    </section>
    <section class="portraits" data-portraits aria-label="${siteConfig.portraitsTitle}">
      <div class="section-copy portraits__intro">
        <p class="section-kicker">${siteConfig.herName}</p>
        <h2>${siteConfig.portraitsTitle}</h2>
      </div>
      ${portraits
        .map(
          (portrait, index) => `
            <article class="portrait-note" data-portrait-step="${index}" data-scene-index="${memories.length + index}">
              <figure class="portrait-fallback">
                <img src="${portrait.image}" alt="${portrait.alt}" loading="lazy" decoding="async" />
                <figcaption>
                  <span>${String(index + 1).padStart(2, "0")}</span>
                  <p>${portrait.text}</p>
                </figcaption>
              </figure>
            </article>
          `
        )
        .join("")}
    </section>
    <section class="qualities" aria-label="${siteConfig.qualitiesTitle}">
      <div class="section-copy qualities__intro">
        <p class="section-kicker">Constelación</p>
        <h2>${siteConfig.qualitiesTitle}</h2>
      </div>
      <ul class="qualities-list">
        ${qualities.map((quality) => `<li>${quality}</li>`).join("")}
      </ul>
    </section>
    <section class="final-scene" data-final-scene aria-label="${siteConfig.finalTitle}">
      <div class="final-photo">
        <img class="final-photo__backdrop" src="${assetUrl("assets/images/final.jpg")}" alt="" aria-hidden="true" />
        <img class="final-photo__image" src="${assetUrl("assets/images/final.jpg")}" alt="Ruth y Juan juntos el 26 de abril de 2026." />
      </div>
      <article class="final-letter">
        <p class="section-kicker">${siteConfig.relationshipDate}</p>
        <h2>${siteConfig.finalTitle}</h2>
        ${finalLetter
          .split("\n\n")
          .map((paragraph) => `<p>${paragraph.replace(/\n/g, "<br />")}</p>`)
          .join("")}
        <blockquote>${siteConfig.finalPhrase}</blockquote>
        <button class="button-primary final-button" type="button" data-final-button>
          <span>${siteConfig.finalButton}</span>
        </button>
        <p class="final-initials" aria-hidden="true">${siteConfig.initials}</p>
      </article>
    </section>
  </main>
  <div class="memory-viewer" data-memory-viewer role="dialog" aria-modal="true" aria-hidden="true" hidden>
    <button class="viewer-close" type="button" data-viewer-close aria-label="Cerrar recuerdo">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"></path></svg>
    </button>
    <button class="viewer-nav viewer-nav--prev" type="button" data-viewer-prev aria-label="Recuerdo anterior">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"></path></svg>
    </button>
    <figure class="viewer-figure">
      <img data-viewer-image src="${assetUrl("assets/images/recuerdo-01.jpg")}" alt="" />
      <figcaption>
        <h2 data-viewer-title></h2>
        <p data-viewer-description></p>
      </figcaption>
    </figure>
    <button class="viewer-nav viewer-nav--next" type="button" data-viewer-next aria-label="Recuerdo siguiente">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6"></path></svg>
    </button>
  </div>
  <div class="music-control" data-music-control aria-label="Control de música">
    <button type="button" data-audio-toggle aria-label="Reproducir música" aria-pressed="false">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M9 18V6l10 6-10 6Z"></path>
      </svg>
    </button>
    <button type="button" data-audio-mute aria-label="Silenciar música" aria-pressed="false">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 10v4h4l5 4V6L9 10H5Z"></path>
        <path d="M17 9.5c.9 1.3.9 3.7 0 5"></path>
      </svg>
    </button>
    <span class="music-control__status" data-audio-status>listo</span>
  </div>
  <div class="debug-panel" data-debug-panel hidden></div>
`;

const resources = new Resources();
const loader = new Loader(document.querySelector<HTMLElement>("[data-loader]")!);
const audio = new AudioManager();
const musicControl = new MusicControl(document.querySelector<HTMLElement>("[data-music-control]")!, audio);
const memoryViewer = new MemoryViewer(document.querySelector<HTMLElement>("[data-memory-viewer]")!);
const debugPanel = document.querySelector<HTMLElement>("[data-debug-panel]")!;
const enterButton = document.querySelector<HTMLButtonElement>("[data-enter]")!;
const openingContent = document.querySelector<HTMLElement>("[data-opening-content]")!;
const canvas = document.querySelector<HTMLCanvasElement>("[data-webgl]")!;
let experience: Experience | undefined;
let cleanedUp = false;
let entered = false;

resources
  .preload((progress) => loader.update(progress.percent, progress.ok))
  .then(() => {
    experience = new Experience(canvas, resources);
    experience.init();
    enterButton.disabled = false;
    return loader.hide();
  })
  .catch(() => loader.hide());

enterButton.disabled = true;
enterButton.addEventListener("click", () => {
  if (entered || enterButton.disabled) {
    return;
  }
  entered = true;
  audio.playFromUserGesture();
  document.body.classList.remove("is-preentry");
  document.body.classList.add("has-entered");
  experience?.enter();
  musicControl.show();
  openingContent.setAttribute("aria-hidden", "true");
});

document.querySelectorAll<HTMLButtonElement>("[data-memory-open]").forEach((button) => {
  button.addEventListener("click", () => {
    memoryViewer.open(Number(button.dataset.memoryOpen));
  });
});

document.querySelector<HTMLButtonElement>("[data-final-button]")?.addEventListener("click", () => {
  document.body.classList.add("final-ignited");
  experience?.finalGesture();
});

window.addEventListener("pagehide", () => {
  if (cleanedUp) {
    return;
  }
  cleanedUp = true;
  experience?.destroy();
  audio.destroy();
});

if (debugMode) {
  debugPanel.hidden = false;
  window.setInterval(() => {
    const snapshot = experience?.getDebugSnapshot();
    debugPanel.textContent = [
      `FPS: ${snapshot?.fps ?? 0}`,
      `Objetos: ${snapshot?.objects ?? 0}`,
      `Camara: ${snapshot?.camera ?? "sin iniciar"}`,
      `Texturas: ${resources.getTextureCount()}`,
      `Audio: ${audio.getStatus()}`
    ].join(" | ");
  }, 500);
}
