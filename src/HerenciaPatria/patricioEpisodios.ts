import type { Episodio } from "./DonPatricio";
import { vozEnvolvente } from "./patricioVoz";

// Cada Secreto de Don Patricio: el audio de ElevenLabs va en
// public/patricio-voz/ y su volumen por cuadro sale de
// `python3 tools/envolvente_voz.py AUDIO OUT.ts`. Los cuadros (30 fps) se
// miden en las pausas de la voz.

export const bombilla: Episodio = {
  titulo: "Secreto Nº 1: la bombilla tapada",
  audio: "elevenlabs-bombilla.mp3",
  voz: vozEnvolvente,
  vozFin: 659,
  guion: [
    { from: 0, to: 86, text: "¡Buenas, m'hijo! ¿Se le tapa la bombilla?" },
    {
      from: 97,
      to: 203,
      text: "¡No es culpa de la bombilla, eh! Es cómo arma el mate.",
    },
    {
      from: 219,
      to: 409,
      text: "Mire: ponga la yerba, tape la boca con la mano, ¡y sacúdalo boca abajo! Así se va el polvillo.",
    },
    {
      from: 418,
      to: 542,
      text: "Después lo inclina, moja del costadito y mete la bombilla ahí. ¡Y no la mueva más, eh!",
    },
    { from: 596, to: 659, text: "Y ahí está el secreto." },
  ],
  caras: [
    { from: 0, expr: "saludo" }, // ¡Buenas, m'hijo!
    { from: 46, expr: "preocupado" }, // ¿Se le tapa la bombilla?
    { from: 92, expr: "indignado" }, // ¡No es culpa de la bombilla, eh!
    { from: 162, expr: "senala" }, // Es cómo arma el mate.
    { from: 211, expr: "explica" }, // Mire: ponga la yerba...
    { from: 316, expr: "sorpresa" }, // ¡y sacúdalo boca abajo!
    { from: 367, expr: "contento" }, // Así se va el polvillo.
    { from: 418, expr: "serena" }, // Después lo inclina...
    { from: 547, expr: "senala" }, // ¡Y no la mueva más, eh!
    { from: 594, expr: "guino" }, // Y ahí está el secreto.
    { from: 668, expr: "mate" }, // se toma un mate, satisfecho
  ],
};

// Borrador: los cuadros son estimados hasta tener el audio de ElevenLabs
// (patricio-voz/elevenlabs-agua.mp3); ahí se miden las pausas, se genera su
// envolvente y se registra la composición en Root.tsx.
export const agua: Episodio = {
  titulo: "Secreto Nº 2: el agua nunca hervida",
  audio: "elevenlabs-agua.mp3",
  voz: [],
  vozFin: 570,
  guion: [
    {
      from: 0,
      to: 75,
      text: "¡Si silba la pava, ya le quemó la yerba, m'hijo!",
    },
    {
      from: 85,
      to: 165,
      text: "Y así el mate sale amargo y se lava enseguida.",
    },
    {
      from: 175,
      to: 275,
      text: "El agua va calentita, no hervida: entre setenta y ochenta grados.",
    },
    {
      from: 285,
      to: 385,
      text: "¿Cómo sabe? Cuando la pava empieza a hacer ruidito... ¡ahí la saca!",
    },
    {
      from: 395,
      to: 500,
      text: "¿Se le pasó? Échele un buen chorro de agua fría, o déjela descansar un ratito.",
    },
    { from: 510, to: 570, text: "Ahhh... ¡eso sí es un mate!" },
  ],
  caras: [
    { from: 0, expr: "indignado" }, // ¡Si silba la pava...!
    { from: 80, expr: "preocupado" }, // Y así el mate sale amargo...
    { from: 170, expr: "senala" }, // El agua va calentita...
    { from: 280, expr: "pensativo" }, // ¿Cómo sabe? ... ruidito
    { from: 345, expr: "explica" }, // ¡ahí la saca!
    { from: 390, expr: "sorpresa" }, // ¿Se le pasó?
    { from: 420, expr: "guino" }, // Échele un buen chorro...
    { from: 505, expr: "mate" }, // Ahhh...
    { from: 545, expr: "satisfecho" }, // ¡eso sí es un mate!
  ],
};
