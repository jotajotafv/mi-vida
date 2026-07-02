import { assetUrl } from "../utils/assetUrl";

export type Memory = {
  image: string;
  title: string;
  description: string;
  alt: string;
};

export const memories: Memory[] = [
  {
    image: assetUrl("assets/images/recuerdo-01.jpg"),
    title: "Algo comenzaba",
    description: "Sin saberlo, cada pequeño momento empezaba a acercarme a ti.",
    alt: "Recuerdo de Ruth y Juan: algo comenzaba."
  },
  {
    image: assetUrl("assets/images/recuerdo-02.jpg"),
    title: "Tu compañía",
    description: "Contigo, hasta los días más sencillos comenzaron a sentirse especiales.",
    alt: "Recuerdo de Ruth y Juan compartiendo compañía."
  },
  {
    image: assetUrl("assets/images/recuerdo-03.jpg"),
    title: "Una sonrisa más",
    description: "Fui descubriendo que tu alegría también podía convertirse en la mía.",
    alt: "Recuerdo de Ruth y Juan con una sonrisa especial."
  },
  {
    image: assetUrl("assets/images/recuerdo-04.jpg"),
    title: "Más cerca de ti",
    description: "Cada conversación me daba una razón nueva para querer conocerte más.",
    alt: "Recuerdo de Ruth y Juan acercándose más."
  },
  {
    image: assetUrl("assets/images/recuerdo-05.jpg"),
    title: "Nuestros instantes",
    description: "Hay momentos que duran poco, pero encuentran la manera de quedarse para siempre.",
    alt: "Recuerdo de Ruth y Juan guardando un instante."
  },
  {
    image: assetUrl("assets/images/recuerdo-06.jpg"),
    title: "La calma de encontrarte",
    description: "A tu lado comprendí que también se puede sentir hogar en una persona.",
    alt: "Recuerdo de Ruth y Juan con calma y cercanía."
  },
  {
    image: assetUrl("assets/images/recuerdo-07.jpg"),
    title: "Todo lo que compartimos",
    description: "Risas, palabras, silencios y recuerdos que ahora llevan un poco de nosotros.",
    alt: "Recuerdo de Ruth y Juan compartiendo momentos."
  },
  {
    image: assetUrl("assets/images/recuerdo-08.jpg"),
    title: "Elegirte",
    description: "Entre tantas casualidades, mi parte favorita fue coincidir contigo.",
    alt: "Recuerdo de Ruth y Juan coincidiendo."
  },
  {
    image: assetUrl("assets/images/recuerdo-09.jpg"),
    title: "Lo que seguimos construyendo",
    description: "Nuestra historia apenas comienza, y ya se ha convertido en una de mis favoritas.",
    alt: "Recuerdo de Ruth y Juan construyendo su historia."
  },
  {
    image: assetUrl("assets/images/recuerdo-10.jpg"),
    title: "Nuestro presente",
    description: "Hoy solo quiero seguir guardando momentos contigo, uno después de otro.",
    alt: "Recuerdo de Ruth y Juan en su presente."
  }
];
