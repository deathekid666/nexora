"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, OrbitControls, RoundedBox } from "@react-three/drei";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";

export type AnatomyPart = "overview" | "display" | "camera" | "chip" | "battery";

type Props = {
  finish: string;
  anatomyPart: AnatomyPart;
  mode?: "hero" | "anatomy";
};

function Lens({ x, y, z }: { x: number; y: number; z: number }) {
  return (
    <group position={[x, y, z]} rotation={[Math.PI / 2, 0, 0]}>
      <mesh>
        <cylinderGeometry args={[0.315, 0.315, 0.115, 64]} />
        <meshPhysicalMaterial color="#131820" metalness={0.82} roughness={0.16} clearcoat={0.6} />
      </mesh>
      <mesh position={[0, 0.072, 0]}>
        <cylinderGeometry args={[0.235, 0.235, 0.068, 64]} />
        <meshPhysicalMaterial color="#080d14" roughness={0.08} metalness={0.18} clearcoat={1} />
      </mesh>
      <mesh position={[0, 0.111, 0]}>
        <cylinderGeometry args={[0.13, 0.13, 0.012, 64]} />
        <meshPhysicalMaterial color="#193754" roughness={0.04} clearcoat={1} />
      </mesh>
      <mesh position={[0.03, 0.119, 0.045]}>
        <sphereGeometry args={[0.045, 20, 20]} />
        <meshBasicMaterial color="#78a9dc" transparent opacity={0.7} />
      </mesh>
    </group>
  );
}

function SideButton({ x, y, z, h }: { x: number; y: number; z: number; h: number }) {
  return (
    <RoundedBox args={[0.055, h, 0.12]} radius={0.025} smoothness={4} position={[x, y, z]}>
      <meshStandardMaterial color="#9da5af" metalness={0.8} roughness={0.25} />
    </RoundedBox>
  );
}

function PhoneModel({ finish, anatomyPart, mode = "hero" }: Props) {
  const root = useRef<THREE.Group>(null);
  const display = useRef<THREE.Group>(null);
  const rear = useRef<THREE.Group>(null);
  const cameras = useRef<THREE.Group>(null);
  const board = useRef<THREE.Group>(null);
  const battery = useRef<THREE.Group>(null);

  const finishMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: finish,
        roughness: 0.3,
        metalness: 0.58,
        clearcoat: 0.35,
        clearcoatRoughness: 0.22,
      }),
    [finish]
  );

  useFrame((state, delta) => {
    if (!root.current) return;
    root.current.position.y = Math.sin(state.clock.elapsedTime * 0.65) * 0.022;

    const anatomy = mode === "anatomy" && anatomyPart !== "overview";
    const displayGoal = anatomy ? (anatomyPart === "display" ? -1.25 : -0.88) : -0.225;
    const rearGoal = anatomy ? 0.72 : 0.215;
    const cameraGoal = anatomy ? (anatomyPart === "camera" ? 1.28 : 0.93) : 0.355;
    const boardGoal = anatomy ? (anatomyPart === "chip" ? 0.27 : 0.08) : 0;
    const batteryGoal = anatomy ? (anatomyPart === "battery" ? -0.35 : -0.1) : -0.025;

    if (display.current) display.current.position.z = THREE.MathUtils.damp(display.current.position.z, displayGoal, 7, delta);
    if (rear.current) rear.current.position.z = THREE.MathUtils.damp(rear.current.position.z, rearGoal, 7, delta);
    if (cameras.current) cameras.current.position.z = THREE.MathUtils.damp(cameras.current.position.z, cameraGoal, 7, delta);
    if (board.current) board.current.position.z = THREE.MathUtils.damp(board.current.position.z, boardGoal, 7, delta);
    if (battery.current) battery.current.position.z = THREE.MathUtils.damp(battery.current.position.z, batteryGoal, 7, delta);
  });

  const anatomy = mode === "anatomy";

  return (
    <group ref={root} scale={mode === "hero" ? 0.93 : 0.84} rotation={[0.02, 0.42, -0.018]}>
      <RoundedBox args={[2.64, 5.5, 0.46]} radius={0.3} smoothness={12}>
        <primitive object={finishMaterial} attach="material" />
      </RoundedBox>

      <group ref={rear} position={[0, 0, 0.215]}>
        <RoundedBox args={[2.49, 5.34, 0.055]} radius={0.27} smoothness={12}>
          <meshPhysicalMaterial color={finish} roughness={0.39} metalness={0.12} clearcoat={0.32} clearcoatRoughness={0.28} />
        </RoundedBox>
        <RoundedBox args={[2.28, 1.55, 0.105]} radius={0.22} smoothness={10} position={[0, 1.72, 0.08]}>
          <meshPhysicalMaterial color={finish} roughness={0.32} metalness={0.25} clearcoat={0.38} />
        </RoundedBox>
      </group>

      <group ref={cameras} position={[0, 0, 0.355]}>
        <Lens x={-0.68} y={1.98} z={0} />
        <Lens x={0.05} y={1.98} z={0} />
        <Lens x={-0.315} y={1.31} z={0} />
        <mesh position={[0.7, 1.38, 0.02]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.105, 0.105, 0.035, 40]} />
          <meshPhysicalMaterial color="#f4efe5" roughness={0.3} />
        </mesh>
        <mesh position={[0.67, 1.76, 0.02]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.085, 0.085, 0.035, 40]} />
          <meshPhysicalMaterial color="#1d2833" roughness={0.16} clearcoat={0.8} />
        </mesh>
      </group>

      <group ref={display} position={[0, 0, -0.225]}>
        <RoundedBox args={[2.49, 5.35, 0.068]} radius={0.275} smoothness={12}>
          <meshPhysicalMaterial color="#020408" roughness={0.07} metalness={0.04} clearcoat={0.92} />
        </RoundedBox>
        <mesh position={[0, 0, -0.043]}>
          <planeGeometry args={[2.29, 5.11]} />
          <meshBasicMaterial color="#07111f" side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0.2, 0.35, -0.052]}>
          <circleGeometry args={[0.86, 64]} />
          <meshBasicMaterial color="#173f72" transparent opacity={0.65} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[-0.36, -0.5, -0.056]}>
          <circleGeometry args={[0.72, 64]} />
          <meshBasicMaterial color="#6b2f45" transparent opacity={0.52} side={THREE.DoubleSide} />
        </mesh>
        <RoundedBox args={[0.76, 0.17, 0.035]} radius={0.085} smoothness={6} position={[0, 2.28, -0.078]}>
          <meshStandardMaterial color="#000" />
        </RoundedBox>
      </group>

      <SideButton x={-1.342} y={1.34} z={0.02} h={0.43} />
      <SideButton x={-1.342} y={0.68} z={0.02} h={0.58} />
      <SideButton x={-1.342} y={-0.06} z={0.02} h={0.58} />
      <SideButton x={1.342} y={1.02} z={0.02} h={0.78} />
      <SideButton x={1.342} y={-0.82} z={0.02} h={0.48} />

      <mesh position={[0, -2.756, -0.01]} rotation={[Math.PI / 2, 0, 0]}>
        <boxGeometry args={[0.52, 0.12, 0.055]} />
        <meshStandardMaterial color="#20262e" />
      </mesh>

      {[-0.92, -0.72, -0.52, 0.52, 0.72, 0.92].map((x) => (
        <mesh key={x} position={[x, -2.755, 0.01]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.025, 18]} />
          <meshStandardMaterial color="#242a31" />
        </mesh>
      ))}

      {anatomy && (
        <>
          <group ref={board} position={[0.18, 0.62, 0]}>
            <RoundedBox args={[1.2, 1.5, 0.09]} radius={0.09} smoothness={4}>
              <meshStandardMaterial color={anatomyPart === "chip" ? "#6ca9ff" : "#203047"} metalness={0.34} roughness={0.42} />
            </RoundedBox>
            <mesh position={[0, 0.2, 0.065]}>
              <boxGeometry args={[0.69, 0.6, 0.04]} />
              <meshStandardMaterial color={anatomyPart === "chip" ? "#c7ddff" : "#7893b7"} />
            </mesh>
            {[
              [-0.37, -0.48],
              [0.36, -0.52],
              [0.38, 0.56],
            ].map(([x, y], i) => (
              <mesh key={i} position={[x, y, 0.062]}>
                <boxGeometry args={[0.22, 0.18, 0.035]} />
                <meshStandardMaterial color="#556a84" />
              </mesh>
            ))}
          </group>

          <group ref={battery} position={[-0.05, -1.26, -0.025]}>
            <RoundedBox args={[1.58, 2.35, 0.12]} radius={0.15} smoothness={5}>
              <meshStandardMaterial color={anatomyPart === "battery" ? "#58d69a" : "#353d47"} roughness={0.48} />
            </RoundedBox>
            <mesh position={[0, 0.65, 0.07]}>
              <boxGeometry args={[0.55, 0.08, 0.03]} />
              <meshStandardMaterial color="#b0b7c0" />
            </mesh>
          </group>

          <mesh position={[0, -2.42, 0]}>
            <boxGeometry args={[1.42, 0.16, 0.055]} />
            <meshStandardMaterial color="#61748b" />
          </mesh>
        </>
      )}
    </group>
  );
}

export default function PhoneExperience({ mode = "hero", ...props }: Props) {
  const isHero = mode === "hero";

  return (
    <div
      className={isHero ? "phone-canvas hero-phone-canvas" : "phone-canvas anatomy-phone-canvas"}
      aria-label="Interactive 360 degree smartphone viewer"
    >
      <Canvas
        camera={{
          position: isHero ? [0, 0.04, 10.6] : [0, 0.04, 11.2],
          fov: isHero ? 31 : 32,
        }}
        dpr={[1, 1.5]}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={1.45} />
          <directionalLight position={[5, 7, 7]} intensity={3.6} />
          <directionalLight position={[-5, 2, 5]} intensity={1.8} color="#a3c3ff" />
          <directionalLight position={[0, -4, -6]} intensity={1.35} color="#ffd6c2" />
          <directionalLight position={[1, 3, -7]} intensity={1.1} color="#ffffff" />

          <PhoneModel {...props} mode={mode} />

          <Environment preset="studio" />
          <ContactShadows position={[0, -3.18, 0]} opacity={0.3} scale={8} blur={3.2} far={8} />

          <OrbitControls
            enablePan={false}
            enableZoom={false}
            enableRotate
            minPolarAngle={THREE.MathUtils.degToRad(24)}
            maxPolarAngle={THREE.MathUtils.degToRad(156)}
            rotateSpeed={0.72}
            dampingFactor={0.065}
            enableDamping
          />
        </Suspense>
      </Canvas>

      <div className="orbit-guide" aria-hidden="true"><span>360°</span></div>
      <div className="canvas-hint">drag left or right for full 360°</div>
    </div>
  );
}
