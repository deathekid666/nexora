"use client";

import {
  Bounds,
  Center,
  ContactShadows,
  Environment,
  Html,
  OrbitControls,
  RoundedBox,
  useGLTF,
} from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";

export type AnatomyPart = "overview" | "display" | "camera" | "chip" | "battery";

type Props = {
  finish: string;
  anatomyPart: AnatomyPart;
  mode?: "hero" | "anatomy";
};

const MODEL_URL = "/api/model/smartphone";

function ProductModel({ finish }: { finish: string }) {
  const { scene } = useGLTF(MODEL_URL);

  const product = useMemo(() => {
    const clone = scene.clone(true);
    const tint = new THREE.Color(finish);

    clone.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;

      object.castShadow = true;
      object.receiveShadow = true;

      const materials = Array.isArray(object.material) ? object.material : [object.material];
      const cloned = materials.map((material) => {
        const next = material.clone();
        const name = (next.name || "").toLowerCase();

        if (name === "base" || name === "material") {
          if ("color" in next && next.color instanceof THREE.Color) {
            next.color.copy(tint);
          }
          if (next instanceof THREE.MeshStandardMaterial) {
            next.metalness = Math.max(next.metalness, 0.42);
            next.roughness = Math.min(next.roughness, 0.32);
          }
        }

        return next;
      });

      object.material = Array.isArray(object.material) ? cloned : cloned[0];
    });

    return clone;
  }, [scene, finish]);

  return <primitive object={product} />;
}

type AnimatedPartProps = {
  children: React.ReactNode;
  targetZ: number;
  targetX?: number;
  targetY?: number;
  baseZ?: number;
  baseX?: number;
  baseY?: number;
};

function AnimatedPart({
  children,
  targetZ,
  targetX = 0,
  targetY = 0,
  baseZ = 0,
  baseX = 0,
  baseY = 0,
}: AnimatedPartProps) {
  const ref = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.position.x = THREE.MathUtils.damp(ref.current.position.x, baseX + targetX, 7.5, delta);
    ref.current.position.y = THREE.MathUtils.damp(ref.current.position.y, baseY + targetY, 7.5, delta);
    ref.current.position.z = THREE.MathUtils.damp(ref.current.position.z, baseZ + targetZ, 7.5, delta);
  });

  return (
    <group ref={ref} position={[baseX, baseY, baseZ]}>
      {children}
    </group>
  );
}

function CameraModule({ x, y, active }: { x: number; y: number; active: boolean }) {
  return (
    <group position={[x, y, 0]}>
      <RoundedBox args={[0.62, 0.62, 0.24]} radius={0.12} smoothness={5}>
        <meshPhysicalMaterial color="#474f5a" metalness={0.7} roughness={0.24} />
      </RoundedBox>
      <mesh position={[0, 0, 0.18]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.24, 0.24, 0.19, 48]} />
        <meshPhysicalMaterial color="#0b0f15" metalness={0.65} roughness={0.15} clearcoat={0.9} />
      </mesh>
      <mesh position={[0, 0, 0.29]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.14, 0.14, 0.025, 48]} />
        <meshPhysicalMaterial
          color={active ? "#2c6cae" : "#112841"}
          emissive={active ? "#2a78d0" : "#000000"}
          emissiveIntensity={active ? 0.55 : 0}
          roughness={0.05}
          clearcoat={1}
        />
      </mesh>
    </group>
  );
}

function LogicBoard({ active }: { active: boolean }) {
  return (
    <group>
      <RoundedBox args={[1.2, 2.3, 0.12]} radius={0.16} smoothness={5}>
        <meshStandardMaterial color="#162b24" metalness={0.15} roughness={0.5} />
      </RoundedBox>

      {[
        [-0.32, 0.68, 0.13, 0.42, 0.34],
        [0.27, 0.66, 0.13, 0.34, 0.3],
        [-0.32, 0.17, 0.13, 0.3, 0.25],
        [0.28, -0.38, 0.13, 0.38, 0.42],
        [-0.28, -0.76, 0.13, 0.36, 0.28],
      ].map(([x, y, z, w, h], index) => (
        <mesh key={index} position={[x, y, z]}>
          <boxGeometry args={[w, h, 0.075]} />
          <meshStandardMaterial color="#27313a" metalness={0.45} roughness={0.32} />
        </mesh>
      ))}

      {[-0.42, -0.15, 0.12, 0.42].map((x, index) => (
        <mesh key={index} position={[x, 1.0, 0.13]}>
          <boxGeometry args={[0.16, 0.11, 0.06]} />
          <meshStandardMaterial color="#c59d50" metalness={0.72} roughness={0.25} />
        </mesh>
      ))}

      <RoundedBox args={[0.55, 0.55, 0.1]} radius={0.055} smoothness={3} position={[0.1, 0.15, 0.18]}>
        <meshStandardMaterial
          color={active ? "#7cb7ff" : "#46596b"}
          emissive={active ? "#2b7be1" : "#000000"}
          emissiveIntensity={active ? 1.25 : 0}
          metalness={0.5}
          roughness={0.25}
        />
      </RoundedBox>
    </group>
  );
}

function BatteryCell({ active }: { active: boolean }) {
  return (
    <group>
      <RoundedBox args={[1.45, 2.72, 0.16]} radius={0.18} smoothness={6}>
        <meshPhysicalMaterial
          color={active ? "#334e44" : "#282d34"}
          roughness={0.44}
          metalness={0.12}
          clearcoat={0.2}
        />
      </RoundedBox>
      <mesh position={[0, 0.78, 0.1]}>
        <planeGeometry args={[0.92, 0.22]} />
        <meshBasicMaterial color={active ? "#83e6b7" : "#a8b0ba"} />
      </mesh>
      <mesh position={[0.48, 1.22, 0.09]}>
        <boxGeometry args={[0.22, 0.32, 0.045]} />
        <meshStandardMaterial color="#b88b43" metalness={0.55} roughness={0.35} />
      </mesh>
    </group>
  );
}

function MidFrame() {
  return (
    <group>
      <RoundedBox args={[2.42, 4.82, 0.2]} radius={0.28} smoothness={8}>
        <meshPhysicalMaterial color="#7f8790" metalness={0.82} roughness={0.25} />
      </RoundedBox>

      <RoundedBox args={[2.1, 4.48, 0.23]} radius={0.21} smoothness={7} position={[0, 0, 0.02]}>
        <meshStandardMaterial color="#171c22" roughness={0.48} />
      </RoundedBox>

      <mesh position={[0, -2.29, 0.15]}>
        <boxGeometry args={[0.55, 0.14, 0.1]} />
        <meshStandardMaterial color="#202a34" />
      </mesh>
    </group>
  );
}

function SpeakerAssembly() {
  return (
    <group position={[0, -2.04, 0.1]}>
      <RoundedBox args={[0.92, 0.34, 0.16]} radius={0.07} smoothness={4}>
        <meshStandardMaterial color="#252d36" metalness={0.32} roughness={0.42} />
      </RoundedBox>
      {[-0.28, -0.14, 0, 0.14, 0.28].map((x) => (
        <mesh key={x} position={[x, 0, 0.095]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.035, 0.035, 0.025, 16]} />
          <meshStandardMaterial color="#07090c" />
        </mesh>
      ))}
    </group>
  );
}

function AnatomyModel({ finish, anatomyPart }: { finish: string; anatomyPart: AnatomyPart }) {
  const root = useRef<THREE.Group>(null);
  const exploded = anatomyPart !== "overview";

  useFrame((state) => {
    if (!root.current) return;
    root.current.position.y = Math.sin(state.clock.elapsedTime * 0.55) * 0.025;
  });

  const z = {
    frontGlass: anatomyPart === "display" ? -2.3 : exploded ? -1.55 : -0.29,
    display: anatomyPart === "display" ? -1.65 : exploded ? -1.06 : -0.21,
    displayFrame: anatomyPart === "display" ? -1.05 : exploded ? -0.64 : -0.14,
    frame: 0,
    board: anatomyPart === "chip" ? 0.95 : exploded ? 0.34 : 0.04,
    chip: anatomyPart === "chip" ? 1.4 : exploded ? 0.44 : 0.06,
    battery: anatomyPart === "battery" ? 0.95 : exploded ? 0.3 : 0.035,
    coil: anatomyPart === "battery" ? 1.55 : exploded ? 0.54 : 0.055,
    cameras: anatomyPart === "camera" ? 1.9 : exploded ? 0.78 : 0.18,
    plateau: anatomyPart === "camera" ? 2.42 : exploded ? 1.0 : 0.23,
    rear: anatomyPart === "camera" || anatomyPart === "battery" ? 2.9 : exploded ? 1.32 : 0.31,
  };

  return (
    <group ref={root} rotation={[0.02, 0.58, -0.015]} scale={0.92}>
      <AnimatedPart targetZ={z.frontGlass}>
        <RoundedBox args={[2.3, 4.66, 0.055]} radius={0.29} smoothness={10}>
          <meshPhysicalMaterial
            color="#0c1119"
            transparent
            opacity={0.72}
            transmission={0.12}
            roughness={0.08}
            clearcoat={1}
          />
        </RoundedBox>
        {anatomyPart === "display" && (
          <Html position={[1.45, 1.65, 0]} className="hotspot-label" center>
            <b>Front glass</b><span>Protective cover</span>
          </Html>
        )}
      </AnimatedPart>

      <AnimatedPart targetZ={z.display}>
        <RoundedBox args={[2.18, 4.5, 0.075]} radius={0.245} smoothness={8}>
          <meshStandardMaterial
            color="#09182a"
            emissive={anatomyPart === "display" ? "#0d4f93" : "#06111e"}
            emissiveIntensity={anatomyPart === "display" ? 0.55 : 0.18}
            roughness={0.25}
          />
        </RoundedBox>
        {anatomyPart === "display" && (
          <Html position={[-1.45, 0.55, 0]} className="hotspot-label" center>
            <b>OLED panel</b><span>Display layer</span>
          </Html>
        )}
      </AnimatedPart>

      <AnimatedPart targetZ={z.displayFrame}>
        <RoundedBox args={[2.22, 4.56, 0.11]} radius={0.25} smoothness={8}>
          <meshStandardMaterial color="#3e4650" metalness={0.62} roughness={0.28} />
        </RoundedBox>
      </AnimatedPart>

      <AnimatedPart targetZ={z.frame}>
        <MidFrame />
        <SpeakerAssembly />
      </AnimatedPart>

      <AnimatedPart targetZ={z.board} targetX={anatomyPart === "chip" ? 0.15 : 0} baseX={0.45} baseY={0.72}>
        <LogicBoard active={anatomyPart === "chip"} />
        {anatomyPart === "chip" && (
          <Html position={[1.15, 0.2, 0.3]} className="hotspot-label hotspot-blue" center>
            <b>Logic board</b><span>Power + compute</span>
          </Html>
        )}
      </AnimatedPart>

      <AnimatedPart targetZ={z.chip} baseX={0.56} baseY={0.85}>
        {anatomyPart === "chip" && (
          <group>
            <RoundedBox args={[0.58, 0.58, 0.12]} radius={0.06} smoothness={4}>
              <meshStandardMaterial color="#9ac8ff" emissive="#2d7ee4" emissiveIntensity={1.3} metalness={0.42} roughness={0.2} />
            </RoundedBox>
            <Html position={[0.88, 0.15, 0.15]} className="hotspot-label hotspot-blue" center>
              <b>A-series SoC</b><span>CPU · GPU · neural compute</span>
            </Html>
          </group>
        )}
      </AnimatedPart>

      <AnimatedPart targetZ={z.battery} baseX={-0.38} baseY={-0.7}>
        <BatteryCell active={anatomyPart === "battery"} />
        {anatomyPart === "battery" && (
          <Html position={[-1.45, -0.1, 0.1]} className="hotspot-label hotspot-green" center>
            <b>Battery cell</b><span>Main energy pack</span>
          </Html>
        )}
      </AnimatedPart>

      <AnimatedPart targetZ={z.coil} baseX={0.05} baseY={0.05}>
        <group>
          <mesh rotation={[0, 0, 0]}>
            <torusGeometry args={[0.72, 0.052, 20, 72]} />
            <meshStandardMaterial color="#bb7e35" metalness={0.72} roughness={0.25} />
          </mesh>
          <mesh>
            <torusGeometry args={[0.56, 0.027, 16, 72]} />
            <meshStandardMaterial color="#d19a53" metalness={0.7} roughness={0.24} />
          </mesh>
          <mesh>
            <cylinderGeometry args={[0.19, 0.19, 0.08, 40]} />
            <meshStandardMaterial color="#242a31" metalness={0.45} roughness={0.38} />
          </mesh>
        </group>
        {anatomyPart === "battery" && (
          <Html position={[1.25, 0.4, 0.1]} className="hotspot-label hotspot-green" center>
            <b>Charging coil</b><span>Wireless power</span>
          </Html>
        )}
      </AnimatedPart>

      <AnimatedPart targetZ={z.cameras} baseX={-0.55} baseY={1.45}>
        <group>
          <CameraModule x={-0.36} y={0.36} active={anatomyPart === "camera"} />
          <CameraModule x={0.36} y={0.36} active={anatomyPart === "camera"} />
          <CameraModule x={-0.02} y={-0.36} active={anatomyPart === "camera"} />
        </group>
        {anatomyPart === "camera" && (
          <Html position={[1.35, 0.2, 0.4]} className="hotspot-label hotspot-blue" center>
            <b>Camera modules</b><span>Individual optical assemblies</span>
          </Html>
        )}
      </AnimatedPart>

      <AnimatedPart targetZ={z.plateau} baseX={-0.55} baseY={1.45}>
        <RoundedBox args={[1.62, 1.58, 0.09]} radius={0.24} smoothness={7}>
          <meshPhysicalMaterial color={finish} metalness={0.46} roughness={0.32} clearcoat={0.35} />
        </RoundedBox>
      </AnimatedPart>

      <AnimatedPart targetZ={z.rear}>
        <RoundedBox args={[2.3, 4.66, 0.07]} radius={0.29} smoothness={10}>
          <meshPhysicalMaterial color={finish} metalness={0.24} roughness={0.3} clearcoat={0.5} />
        </RoundedBox>
        {(anatomyPart === "camera" || anatomyPart === "battery") && (
          <Html position={[1.45, -1.55, 0]} className="hotspot-label" center>
            <b>Rear plate</b><span>Back enclosure</span>
          </Html>
        )}
      </AnimatedPart>
    </group>
  );
}

function LoadingModel() {
  return (
    <Html center className="model-loading">
      Loading 3D model…
    </Html>
  );
}

export default function PhoneExperience({ mode = "hero", ...props }: Props) {
  const isHero = mode === "hero";

  return (
    <div
      className={isHero ? "phone-canvas hero-phone-canvas" : "phone-canvas anatomy-phone-canvas"}
      aria-label={isHero ? "Interactive 360 degree smartphone viewer" : "Interactive exploded smartphone anatomy"}
    >
      <Canvas
        camera={{ position: [0, 0.1, isHero ? 8 : 9.2], fov: isHero ? 34 : 35 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={1.25} />
        <directionalLight position={[4, 7, 6]} intensity={3.6} />
        <directionalLight position={[-5, 1, 4]} intensity={1.5} color="#9fc5ff" />
        <directionalLight position={[1, -4, -5]} intensity={1.15} color="#ffd8c2" />

        <Suspense fallback={<LoadingModel />}>
          {isHero ? (
            <Bounds fit clip margin={1.18}>
              <Center>
                <ProductModel finish={props.finish} />
              </Center>
            </Bounds>
          ) : (
            <AnatomyModel finish={props.finish} anatomyPart={props.anatomyPart} />
          )}

          <Environment preset={isHero ? "studio" : "city"} />
          <ContactShadows position={[0, -3.15, 0]} opacity={0.32} scale={8} blur={3} far={8} />
        </Suspense>

        <OrbitControls
          makeDefault
          enablePan={false}
          enableZoom={false}
          enableRotate
          minPolarAngle={THREE.MathUtils.degToRad(22)}
          maxPolarAngle={THREE.MathUtils.degToRad(158)}
          rotateSpeed={0.72}
          dampingFactor={0.065}
          enableDamping
        />
      </Canvas>

      <div className="orbit-guide" aria-hidden="true"><span>360°</span></div>
      <div className="canvas-hint">
        {isHero ? "drag for full 360°" : "drag to inspect · choose a component"}
      </div>
    </div>
  );
}

useGLTF.preload(MODEL_URL);
