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
        <cylinderGeometry args={[0.32, 0.32, 0.12, 48]} />
        <meshPhysicalMaterial color="#11151b" metalness={0.8} roughness={0.18} clearcoat={0.55} />
      </mesh>
      <mesh position={[0, 0.075, 0]}>
        <cylinderGeometry args={[0.225, 0.225, 0.075, 48]} />
        <meshPhysicalMaterial color="#07111e" roughness={0.08} metalness={0.25} clearcoat={1} />
      </mesh>
      <mesh position={[0, 0.118, 0]}>
        <cylinderGeometry args={[0.11, 0.11, 0.016, 48]} />
        <meshPhysicalMaterial color="#18324f" roughness={0.05} clearcoat={1} />
      </mesh>
    </group>
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
        roughness: 0.33,
        metalness: 0.52,
        clearcoat: 0.32,
        clearcoatRoughness: 0.28,
      }),
    [finish]
  );

  useFrame((state, delta) => {
    if (!root.current) return;

    root.current.position.y = Math.sin(state.clock.elapsedTime * 0.65) * 0.035;

    const anatomy = mode === "anatomy" && anatomyPart !== "overview";
    const targetDisplay = anatomy ? (anatomyPart === "display" ? -1.05 : -0.58) : -0.215;
    const targetRear = anatomy ? 0.62 : 0.205;
    const targetCamera = anatomy ? (anatomyPart === "camera" ? 1.22 : 0.78) : 0.34;
    const targetBoard = anatomy ? (anatomyPart === "chip" ? 0.35 : 0.14) : 0;
    const targetBattery = anatomy ? (anatomyPart === "battery" ? -0.26 : -0.08) : -0.02;

    if (display.current) display.current.position.z = THREE.MathUtils.damp(display.current.position.z, targetDisplay, 6, delta);
    if (rear.current) rear.current.position.z = THREE.MathUtils.damp(rear.current.position.z, targetRear, 6, delta);
    if (cameras.current) cameras.current.position.z = THREE.MathUtils.damp(cameras.current.position.z, targetCamera, 6, delta);
    if (board.current) board.current.position.z = THREE.MathUtils.damp(board.current.position.z, targetBoard, 6, delta);
    if (battery.current) battery.current.position.z = THREE.MathUtils.damp(battery.current.position.z, targetBattery, 6, delta);
  });

  const anatomy = mode === "anatomy";

  return (
    <group
      ref={root}
      scale={mode === "hero" ? 0.9 : 0.78}
      rotation={mode === "hero" ? [0.05, 0.48, -0.025] : [0.04, 0.62, -0.015]}
    >
      <RoundedBox args={[2.62, 5.5, 0.42]} radius={0.31} smoothness={10}>
        <primitive object={finishMaterial} attach="material" />
      </RoundedBox>

      <group ref={rear} position={[0, 0, 0.205]}>
        <RoundedBox args={[2.47, 5.34, 0.055]} radius={0.27} smoothness={10}>
          <meshPhysicalMaterial color={finish} roughness={0.36} metalness={0.18} clearcoat={0.36} />
        </RoundedBox>

        <RoundedBox args={[2.23, 1.56, 0.12]} radius={0.25} smoothness={8} position={[0, 1.7, 0.085]}>
          <meshPhysicalMaterial color={finish} roughness={0.31} metalness={0.24} clearcoat={0.35} />
        </RoundedBox>
      </group>

      <group ref={cameras} position={[0, 0, 0.34]}>
        <Lens x={-0.7} y={1.95} z={0} />
        <Lens x={0.16} y={1.95} z={0} />
        <Lens x={-0.27} y={1.2} z={0} />

        <mesh position={[0.7, 1.33, 0.03]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.11, 0.11, 0.035, 32]} />
          <meshStandardMaterial color="#e8e7d9" />
        </mesh>
        <mesh position={[0.67, 1.72, 0.03]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.09, 0.09, 0.035, 32]} />
          <meshStandardMaterial color="#222830" />
        </mesh>
      </group>

      <group ref={display} position={[0, 0, -0.215]}>
        <RoundedBox args={[2.48, 5.35, 0.075]} radius={0.28} smoothness={10}>
          <meshPhysicalMaterial color="#05080d" roughness={0.08} metalness={0.05} clearcoat={0.9} />
        </RoundedBox>
        <mesh position={[0, 0, -0.048]}>
          <planeGeometry args={[2.26, 5.07]} />
          <meshBasicMaterial color="#07111f" />
        </mesh>
        <RoundedBox args={[0.78, 0.18, 0.045]} radius={0.09} smoothness={5} position={[0, 2.28, -0.075]}>
          <meshStandardMaterial color="#000000" />
        </RoundedBox>
      </group>

      {anatomy && (
        <>
          <group ref={board} position={[0.15, 0.58, 0]}>
            <RoundedBox args={[1.24, 1.46, 0.09]} radius={0.09} smoothness={4}>
              <meshStandardMaterial color={anatomyPart === "chip" ? "#6fa9ff" : "#203147"} metalness={0.32} roughness={0.42} />
            </RoundedBox>
            <mesh position={[0, 0.18, 0.065]}>
              <boxGeometry args={[0.7, 0.62, 0.04]} />
              <meshStandardMaterial color={anatomyPart === "chip" ? "#c7dcff" : "#7d98bc"} />
            </mesh>
            <mesh position={[-0.35, -0.47, 0.06]}>
              <boxGeometry args={[0.28, 0.22, 0.035]} />
              <meshStandardMaterial color="#586d86" />
            </mesh>
          </group>

          <group ref={battery} position={[0, -1.25, -0.02]}>
            <RoundedBox args={[1.62, 2.42, 0.12]} radius={0.16} smoothness={5}>
              <meshStandardMaterial color={anatomyPart === "battery" ? "#59d69b" : "#3a414b"} roughness={0.5} />
            </RoundedBox>
          </group>

          <mesh position={[0, -2.45, 0]}>
            <boxGeometry args={[1.42, 0.16, 0.055]} />
            <meshStandardMaterial color="#687a91" />
          </mesh>
        </>
      )}
    </group>
  );
}

export default function PhoneExperience({ mode = "hero", ...props }: Props) {
  const isHero = mode === "hero";

  return (
    <div className={isHero ? "phone-canvas hero-phone-canvas" : "phone-canvas anatomy-phone-canvas"} aria-label="Interactive 3D smartphone">
      <Canvas
        camera={{ position: isHero ? [0, 0.05, 9.3] : [0, 0.05, 10.2], fov: isHero ? 35 : 36 }}
        dpr={[1, 1.5]}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={1.75} />
          <directionalLight position={[5, 7, 7]} intensity={3.8} />
          <directionalLight position={[-5, 1, 5]} intensity={1.8} color="#9bbfff" />
          <directionalLight position={[0, -5, -4]} intensity={1.1} color="#ffd7bf" />

          <PhoneModel {...props} mode={mode} />

          <Environment preset="city" />
          <ContactShadows position={[0, -3.15, 0]} opacity={0.32} scale={8} blur={2.8} far={7} />

          <OrbitControls
            enablePan={false}
            enableZoom={false}
            minPolarAngle={Math.PI * 0.36}
            maxPolarAngle={Math.PI * 0.64}
            minAzimuthAngle={-Math.PI * 0.42}
            maxAzimuthAngle={Math.PI * 0.42}
            rotateSpeed={0.48}
            dampingFactor={0.08}
            enableDamping
          />
        </Suspense>
      </Canvas>
      <div className="canvas-hint">drag to rotate</div>
    </div>
  );
}
