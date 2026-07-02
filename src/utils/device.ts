export type DeviceProfile = {
  isMobile: boolean;
  isLowPower: boolean;
  reducedMotion: boolean;
  pixelRatio: number;
};

export function getDeviceProfile(): DeviceProfile {
  const width = window.innerWidth;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobile = width <= 760 || coarsePointer;
  const cores = navigator.hardwareConcurrency || 4;
  const isLowPower = isMobile || cores <= 4;
  const pixelRatio = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2);

  return {
    isMobile,
    isLowPower,
    reducedMotion,
    pixelRatio
  };
}

export function hasWebGL(): boolean {
  const canvas = document.createElement("canvas");
  return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
}
