import {
  cancelRender,
  continueRender,
  delayRender,
  staticFile,
} from "remotion";

// Tipografías de la marca, enviadas por Herencia Patria: Addington CF
// (serif), Helvetica Neue LT Std (sans), Acumin (sans variable) y Sketcha
// Kits (a mano, para Don Patricio). Tienen licencia: van en public/fonts/, que no se sube al
// repositorio. Si faltan, el render falla en vez de usar otra letra.

const lista: [family: string, file: string, weight: string, style: string][] = [
  ["Addington CF", "AddingtonCF-Light.otf", "300", "normal"],
  ["Addington CF", "AddingtonCF-LightItalic.otf", "300", "italic"],
  ["Addington CF", "AddingtonCF-Regular.otf", "400", "normal"],
  ["Addington CF", "AddingtonCF-RegularItalic.otf", "400", "italic"],
  ["Addington CF", "AddingtonCF-Medium.otf", "500", "normal"],
  ["Addington CF", "AddingtonCF-DemiBold.otf", "600", "normal"],
  ["Addington CF", "AddingtonCF-DemiBoldItalic.otf", "600", "italic"],
  ["Addington CF", "AddingtonCF-Bold.otf", "700", "normal"],
  ["Addington CF", "AddingtonCF-ExtraBold.otf", "800", "normal"],
  ["Helvetica Neue", "HelveticaNeueLTStd-Lt.otf", "300", "normal"],
  ["Helvetica Neue", "HelveticaNeueLTStd-Md.otf", "500", "normal"],
  ["Helvetica Neue", "HelveticaNeueLTStd-Bd.otf", "700", "normal"],
  ["Sketcha Kits", "SketchaKits.otf", "400", "normal"],
  // Variable: todos los pesos en un archivo.
  ["Acumin", "AcuminVariableConcept.otf", "100 900", "normal"],
];

const espera = delayRender("Tipografías de la marca");
Promise.all(
  lista.map(([family, file, weight, style]) => {
    const font = new FontFace(family, `url(${staticFile(`fonts/${file}`)})`, {
      weight,
      style,
    });
    return font.load().then(() => document.fonts.add(font));
  }),
)
  .then(() => continueRender(espera))
  .catch((err) => cancelRender(err));
