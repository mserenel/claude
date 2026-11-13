import { useThree } from "@react-three/fiber";
import { ThreeCanvas } from "@remotion/three";
import { useEffect, useMemo } from "react";
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  Easing,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { iv, texto, titular } from "../Cafe/CafeTikTok";

// Versión realista de la demo del codo de 20: el codo y los caños están
// modelados en 3D (medidas en mm: caño de 20, bocas de ~31) con plástico
// verde mate, luz de estudio, reflejos y sombra suave sobre un fondo claro,
// como una foto de producto. Sigue siendo una demo: sin logo de la marca.

export const CODO3D_FRAMES = 300;

const verde = "#2E8A4B";
const tinta = "#14202B";

// Medidas (mm)
const R = 16; // radio de la curva
const TUBO = 14.5; // radio exterior del cuerpo
const BOCA_EXT = 15.6;
const BOCA_INT = 10.2;
const BOCA_L = 19;
const CANO_EXT = 10;
const CANO_INT = 6.6;
const CANO_L = 150;

// Anillo hueco (perfil girado): sirve para bocas y caños.
const hueco = (rInt: number, rExt: number, largo: number, bisel = 0.8) =>
  new THREE.LatheGeometry(
    [
      new THREE.Vector2(rInt, 0),
      new THREE.Vector2(rExt - bisel, 0),
      new THREE.Vector2(rExt, bisel),
      new THREE.Vector2(rExt, largo - bisel),
      new THREE.Vector2(rExt - bisel, largo),
      new THREE.Vector2(rInt, largo),
      new THREE.Vector2(rInt, 0),
    ],
    96,
  );

const Entorno: React.FC = () => {
  const { gl, scene } = useThree();
  useEffect(() => {
    const espera = delayRender("Entorno de luz");
    const pmrem = new THREE.PMREMGenerator(gl);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 1.05;
    continueRender(espera);
    return () => {
      env.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);
  return null;
};

const Modelo: React.FC<{ readonly union: number }> = ({ union }) => {
  const plastico = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: verde,
        roughness: 0.42,
        clearcoat: 0.25,
        clearcoatRoughness: 0.5,
        envMapIntensity: 0.9,
      }),
    [],
  );
  const interior = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#123D21", roughness: 0.8 }),
    [],
  );
  const curva = useMemo(
    () => new THREE.TorusGeometry(R, TUBO, 64, 96, Math.PI / 2),
    [],
  );
  const boca = useMemo(() => hueco(BOCA_INT, BOCA_EXT, BOCA_L), []);
  const cano = useMemo(() => hueco(CANO_INT, CANO_EXT, CANO_L, 0.4), []);
  const fondoBoca = useMemo(() => new THREE.CircleGeometry(BOCA_INT, 48), []);

  // Profundidad a la que entra el caño en la boca (termofusión).
  const entra = 14;
  const lejos = (1 - union) * 160;

  return (
    <group>
      <mesh geometry={curva} material={plastico} castShadow receiveShadow />
      {/* Boca A: sale hacia abajo desde (R, 0) */}
      <group position={[R, 0, 0]} rotation={[Math.PI, 0, 0]}>
        <mesh geometry={boca} material={plastico} castShadow receiveShadow />
        <mesh
          geometry={fondoBoca}
          material={interior}
          rotation={[Math.PI / 2, 0, 0]}
          position={[0, 0.5, 0]}
        />
        <group position={[0, BOCA_L - entra + lejos, 0]}>
          <mesh geometry={cano} material={plastico} castShadow receiveShadow />
        </group>
      </group>
      {/* Boca B: sale hacia la izquierda desde (0, R) */}
      <group position={[0, R, 0]} rotation={[0, 0, Math.PI / 2]}>
        <mesh geometry={boca} material={plastico} castShadow receiveShadow />
        <mesh
          geometry={fondoBoca}
          material={interior}
          rotation={[Math.PI / 2, 0, 0]}
          position={[0, 0.5, 0]}
        />
        <group position={[0, BOCA_L - entra + lejos, 0]}>
          <mesh geometry={cano} material={plastico} castShadow receiveShadow />
        </group>
      </group>
    </group>
  );
};

const Escena: React.FC = () => {
  const f = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const entra = Math.max(
    0,
    spring({ frame: f + 4, fps, config: { damping: 14 } }),
  );
  const union =
    f < 150 ? 0 : iv(f, [150, 190], [0, 1], Easing.out(Easing.cubic));
  // Giro de producto (tocadiscos) y al final se aleja para ver los caños.
  const giro =
    (1 - entra) * Math.PI * 1.5 + iv(f, [0, 300], [-0.55, 0.55], Easing.linear);
  const dist = iv(f, [140, 180], [250, 390]);
  const altoCam = iv(f, [140, 180], [60, 95]);
  return (
    <ThreeCanvas
      width={width}
      height={height}
      shadows
      gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
      camera={{ fov: 30, position: [0, altoCam, dist], near: 1, far: 3000 }}
      onCreated={({ camera }) => camera.lookAt(0, 0, 0)}
    >
      <CamaraMira y={altoCam} z={dist} />
      <Entorno />
      <ambientLight intensity={0.25} />
      <directionalLight
        position={[60, 160, 120]}
        intensity={2.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-250}
        shadow-camera-right={250}
        shadow-camera-top={250}
        shadow-camera-bottom={-250}
        shadow-radius={8}
        shadow-bias={-0.0005}
      />
      <directionalLight position={[-120, 40, -60]} intensity={0.6} />
      {/* Piso que sólo recibe sombra: el fondo es el degradé de atrás */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -46, 0]}
        receiveShadow
      >
        <planeGeometry args={[2000, 2000]} />
        <shadowMaterial opacity={0.22} />
      </mesh>
      <group rotation={[0, giro, 0]} scale={entra}>
        {/* Centrado: la L ocupa de -35 a 31 en X e Y */}
        <group position={[2, 2, 0]} rotation={[0, 0, 0]}>
          <Modelo union={union} />
        </group>
      </group>
    </ThreeCanvas>
  );
};

// La cámara apunta siempre al codo aunque se aleje.
const CamaraMira: React.FC<{ readonly y: number; readonly z: number }> = ({
  y,
  z,
}) => {
  const { camera } = useThree();
  camera.position.set(0, y, z);
  camera.lookAt(0, -12, 0);
  return null;
};

const Pastilla: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly t: string;
  readonly desde: number;
}> = ({ x, y, t, desde }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = Math.max(
    0,
    spring({ frame: f - desde, fps, config: { damping: 12 } }),
  );
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${s})`,
        padding: "14px 30px",
        borderRadius: 60,
        background: tinta,
        color: "#FFFFFF",
        fontFamily: texto,
        fontWeight: 900,
        fontSize: 52,
        whiteSpace: "nowrap",
        boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
      }}
    >
      {t}
    </div>
  );
};

const Textos: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = Math.max(0, spring({ frame: f + 6, fps, config: { damping: 10 } }));
  const fin = Math.max(
    0,
    spring({ frame: f - 232, fps, config: { damping: 12 } }),
  );
  return (
    <>
      {f < 232 ? (
        <div
          style={{
            position: "absolute",
            top: 250,
            left: 40,
            right: 40,
            textAlign: "center",
            transform: `scale(${0.7 + 0.3 * s})`,
            opacity: Math.min(1, s) * iv(f, [224, 232], [1, 0]),
          }}
        >
          <div
            style={{
              fontFamily: texto,
              fontWeight: 800,
              fontSize: 60,
              color: tinta,
            }}
          >
            {f < 60 ? "¿Necesitás un" : "Aquasystem"}
          </div>
          <div
            style={{
              fontFamily: titular,
              fontSize: 150,
              lineHeight: 1,
              color: verde,
              whiteSpace: "nowrap",
            }}
          >
            {f < 60 ? "CODO DE 20?" : "CODO 90° DE 20"}
          </div>
        </div>
      ) : null}
      {f >= 60 && f < 150 ? (
        <>
          <Pastilla x={290} y={1420} t={'20 mm (½")'} desde={66} />
          <Pastilla x={790} y={1420} t="Ángulo 90°" desde={80} />
          <Pastilla x={540} y={1550} t="Para termofusión" desde={94} />
        </>
      ) : null}
      {f >= 150 && f < 232 ? (
        <div
          style={{
            position: "absolute",
            top: 1400,
            left: 60,
            right: 150,
            textAlign: "center",
            fontFamily: texto,
            fontWeight: 900,
            fontSize: 72,
            lineHeight: 1.12,
            color: tinta,
            padding: "20px 30px",
            borderRadius: 30,
            background: "rgba(255,255,255,0.88)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
            opacity: iv(f, [186, 196], [0, 1]) * iv(f, [224, 232], [1, 0]),
          }}
        >
          Unión <span style={{ color: verde }}>firme</span> por{" "}
          <span style={{ color: verde }}>termofusión</span>
        </div>
      ) : null}
      {f >= 232 ? (
        <div
          style={{
            position: "absolute",
            top: 230,
            left: 40,
            right: 40,
            textAlign: "center",
            opacity: Math.min(1, fin),
            transform: `translateY(${(1 - fin) * 40}px)`,
          }}
        >
          <div
            style={{
              fontFamily: titular,
              fontSize: 150,
              lineHeight: 1,
              color: verde,
            }}
          >
            HAY STOCK
          </div>
          <div
            style={{
              fontFamily: texto,
              fontWeight: 800,
              fontSize: 58,
              color: tinta,
              marginTop: 10,
            }}
          >
            Pedilo hoy en
          </div>
          <div
            style={{
              display: "inline-block",
              marginTop: 18,
              padding: "16px 40px",
              border: `4px dashed ${tinta}`,
              borderRadius: 18,
              fontFamily: texto,
              fontWeight: 900,
              fontSize: 64,
              color: tinta,
            }}
          >
            TU NEGOCIO
          </div>
          <div
            style={{
              fontFamily: texto,
              fontWeight: 700,
              fontSize: 44,
              color: tinta,
              marginTop: 18,
              opacity: 0.8,
            }}
          >
            Consultá por WhatsApp
          </div>
        </div>
      ) : null}
    </>
  );
};

export const Codo3D: React.FC = () => (
  <AbsoluteFill
    style={{
      // Fondo de estudio: blanco arriba que pasa a gris claro abajo.
      background:
        "radial-gradient(ellipse at 50% 55%, #FFFFFF 0%, #ECEFF1 45%, #C9CFD4 100%)",
    }}
  >
    <Escena />
    <Textos />
  </AbsoluteFill>
);
