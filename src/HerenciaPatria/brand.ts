import React from "react";
import { cargarFuentesMarca } from "./fuentes";

export const colors = {
  azul: "#14233B",
  verde: "#1F3A2E",
  crema: "#F3EBDD",
  madera: "#6B3F24",
  mostaza: "#C9A24A",
};

// Sólo las tipografías de la marca (fuentes.ts).
export const fonts = {
  serif: '"Addington CF", serif',
  sans: '"Helvetica Neue", sans-serif',
  mano: '"Sketcha Kits", cursive',
};

// Zona segura para Reels/Stories (1080x1920): la interfaz de Instagram tapa
// aprox. 250px arriba, 420px abajo y 160px a la derecha.
export const safe = {
  top: 250,
  bottom: 420,
  left: 80,
  right: 160,
};

// Envuelve una composición de la marca para que cargue sus tipografías.
const envueltas = new Map<
  React.ComponentType<never>,
  React.ComponentType<never>
>();
export const conMarca = <P extends object>(
  C: React.ComponentType<P>,
): React.ComponentType<P> => {
  const previa = envueltas.get(C as React.ComponentType<never>);
  if (previa) return previa as React.ComponentType<P>;
  const Envuelta: React.FC<P> = (props) => {
    cargarFuentesMarca();
    return React.createElement(C, props);
  };
  envueltas.set(
    C as React.ComponentType<never>,
    Envuelta as React.ComponentType<never>,
  );
  return Envuelta;
};
