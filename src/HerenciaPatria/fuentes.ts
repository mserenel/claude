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

// Cada estilo puede venir en .otf (primer envío) o en .ttf (carpeta de Drive):
// se usa el que esté. Si de una familia obligatoria no carga ninguno, el
// render falla en vez de usar otra letra.
const lista: [
  family: string,
  files: string[],
  weight: string,
  style: string,
][] = [
  [
    "Addington CF",
    ["AddingtonCF-Light.otf", "AddingtonCF-Light.ttf"],
    "300",
    "normal",
  ],
  [
    "Addington CF",
    ["AddingtonCF-LightItalic.otf", "AddingtonCF-LightItalic.ttf"],
    "300",
    "italic",
  ],
  [
    "Addington CF",
    ["AddingtonCF-Regular.otf", "AddingtonCF-Regular.ttf"],
    "400",
    "normal",
  ],
  [
    "Addington CF",
    ["AddingtonCF-RegularItalic.otf", "AddingtonCF-Italic.ttf"],
    "400",
    "italic",
  ],
  [
    "Addington CF",
    ["AddingtonCF-Medium.otf", "AddingtonCF-Medium.ttf"],
    "500",
    "normal",
  ],
  [
    "Addington CF",
    ["AddingtonCF-MediumItalic.otf", "AddingtonCF-MediumItalic.ttf"],
    "500",
    "italic",
  ],
  [
    "Addington CF",
    ["AddingtonCF-DemiBold.otf", "AddingtonCF-DemiBold.ttf"],
    "600",
    "normal",
  ],
  [
    "Addington CF",
    ["AddingtonCF-DemiBoldItalic.otf", "AddingtonCF-DemiBoldItalic.ttf"],
    "600",
    "italic",
  ],
  [
    "Addington CF",
    ["AddingtonCF-Bold.otf", "AddingtonCF-Bold.ttf"],
    "700",
    "normal",
  ],
  [
    "Addington CF",
    ["AddingtonCF-ExtraBold.otf", "AddingtonCF-ExtraBold.ttf"],
    "800",
    "normal",
  ],
  ["Helvetica Neue", ["HelveticaNeueLTStd-Lt.otf"], "300", "normal"],
  ["Helvetica Neue", ["HelveticaNeueLTStd-Md.otf"], "500", "normal"],
  ["Helvetica Neue", ["HelveticaNeueLTStd-Bd.otf"], "700", "normal"],
  ["Sketcha Kits", ["SketchaKits.otf", "Sketcha Kits.otf"], "400", "normal"],
  // Variable: todos los pesos en un archivo.
  ["Acumin", ["AcuminVariableConcept.otf"], "100 900", "normal"],
];
const obligatorias = ["Addington CF", "Helvetica Neue"];

const cargarUna = async (
  family: string,
  files: string[],
  weight: string,
  style: string,
) => {
  for (const file of files) {
    try {
      const font = new FontFace(
        family,
        `url(${staticFile(`fonts/${encodeURIComponent(file)}`)})`,
        {
          weight,
          style,
        },
      );
      await font.load();
      document.fonts.add(font);
      return family;
    } catch {
      // probar el siguiente formato
    }
  }
  return null;
};

// Se cargan una sola vez, recién cuando se muestra una composición de la
// marca (así los videos de otros proyectos no dependen de estas fuentes).
let carga: Promise<void> | null = null;

export const cargarFuentesMarca = () => {
  if (!carga) {
    const espera = delayRender("Tipografías de la marca");
    carga = Promise.all(
      lista.map(([f, files, w, st]) => cargarUna(f, files, w, st)),
    )
      .then((cargadas) => {
        const faltan = obligatorias.filter((fam) => !cargadas.includes(fam));
        if (faltan.length) {
          throw new Error(
            `Faltan las tipografías de la marca: ${faltan.join(", ")}`,
          );
        }
        continueRender(espera);
      })
      .catch((err) => cancelRender(err));
  }
};
