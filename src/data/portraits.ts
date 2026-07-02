import { assetUrl } from "../utils/assetUrl";

export type Portrait = {
  image: string;
  text: string;
  alt: string;
};

export const portraits: Portrait[] = [
  {
    image: assetUrl("assets/images/retrato-01.jpg"),
    text: "Tu sonrisa ilumina incluso mis días más difíciles.",
    alt: "Retrato de Ruth sonriendo."
  },
  {
    image: assetUrl("assets/images/retrato-02.jpg"),
    text: "Me encanta la tranquilidad que encuentro contigo.",
    alt: "Retrato de Ruth transmitiendo tranquilidad."
  },
  {
    image: assetUrl("assets/images/retrato-03.jpg"),
    text: "Podría admirarte durante toda una vida.",
    alt: "Retrato de Ruth para admirar."
  },
  {
    image: assetUrl("assets/images/retrato-04.jpg"),
    text: "Eres mi persona favorita.",
    alt: "Retrato de Ruth, persona favorita de Juan."
  }
];
