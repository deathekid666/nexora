"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, OrbitControls, RoundedBox } from "@react-three/drei";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";

export type AnatomyPart = "overview" | "display" | "camera" | "chip" | "battery";

type Props = {
  finish: string;
  anatomyPart: AnatomyPart;
};

function PhoneModel({ finish, anatomyPart }: Props) {
  const root = useRef<THREE.Group>(null);
  const finishMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: finish,
        roughness: 0.28,
        metalness: 0.68,
        clearcoat: 0.45,
        clearcoatRoughness: 0.24,
      }),
    [finish]
  );

  const explode = anatomyPart !== "overview" ? 1 : 0;
  const glassZ = anatomyPart === "display" ? 0.72 : explode ? 0.28 : 0.151;
  const cameraZ = anatomyPart === "camera" ? 0.86 : explode ? 0.42 : 0.2;
  const chipZ = anatomyPart === "chip" ? 0.7 : explode ? 0.28 : 0.02;
  const batteryZ = anatomyPart === "battery" ? -0.68 : explode ? -0.27 : -0.02;

  useFrame((state, delta) => {
    if (!root.current) return;
    root.current.rotation.y += delta * 0.07;
    root.current.position.y = Math.sin(state.clock.elapsedTime * 0.7) * 0.05;
  });

  return (
    <group ref={root} rotation={[0.08, -0.28, -0.03]}>
      <RoundedBox args={[2.65, 5.45, 0.42]} radius={0.34} smoothness={8}>
        <primitive object={finishMaterial} attach="material" />
      </RoundedBox>

      <RoundedBox args={[2.46, 5.22, 0.11]} radius={0.27} smoothness={8} position={[0, 0, glassZ]}>
        <meshPhysicalMaterial color="#05070b" roughness={0.12} metalness={0.1} clearcoat={0.7} />
      </RoundedBox>

      <RoundedBox args={[0.82, 0.18, 0.08]} radius={0.09} smoothness={4} position={[0, 2.28, glassZ + 0.08]}>
        <meshStandardMaterial color="#010101" />
      </RoundedBox>

      <group position={[-0.75, 1.84, cameraZ]}>
        {[
          [0, 0, 0],
          [0.55, 0.32, 0],
          [0.52, -0.42, 0],
        ].map((p, index) => (
          <group key={index} position={p as [number, number, number]}>
            <mesh>
              <cylinderGeometry args={[0.32, 0.32, 0.18, 40]} />
              <meshStandardMaterial color="#141820" metalness={0.85} roughness={0.22} />
            </mesh>
            <mesh position={[0, 0.1, 0]}>
              <cylinderGeometry args={[0.19, 0.19, 0.19, 40]} />
              <meshPhysicalMaterial color="#07101a" roughness={0.1} clearcoat={1} />
            </mesh>
          </group>
        ))}
      </group>

      <group position={[0.12, 0.42, chipZ]}>
        <RoundedBox args={[1.25, 1.05, 0.12]} radius={0.1} smoothness={4}>
          <meshStandardMaterial color={anatomyPart === "chip" ? "#75a9ff" : "#182438"} metalness={0.48} roughness={0.38} />
        </RoundedBox>
        <mesh position={[0, 0, 0.08]}>
          <boxGeometry args={[0.72, 0.56, 0.04]} />
          <meshStandardMaterial color="#95bdff" />
        </mesh>
      </group>

      <group position={[0, -1.15, batteryZ]}>
        <RoundedBox args={[1.6, 2.25, 0.15]} radius={0.16} smoothness={5}>
          <meshStandardMaterial color={anatomyPart === "battery" ? "#62d8a1" : "#3a414c"} roughness={0.45} />
        </RoundedBox>
      </group>

      {anatomyPart !== "overview" && (
        <>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[2.08, 4.55, 0.04]} />
            <meshBasicMaterial color="#8ca0bb" wireframe transparent opacity={0.22} />
          </mesh>
          <mesh position={[0, -2.45, 0.02]}>
            <boxGeometry args={[1.45, 0.18, 0.05]} />
            <meshStandardMaterial color="#7790ad" />
          </mesh>
        </>
      )}
    </group>
  );
}

export default function PhoneExperience(props: Props) {
  return (
    <div className="phone-canvas" aria-label="Interactive 3D smartphone">
      <Canvas camera={{ position: [0, 0.2, 8.2], fov: 38 }} dpr={[1, 1.65]}>
        <Suspense fallback={null}>
          <ambientLight intensity={1.35} />
          <directionalLight position={[4, 7, 6]} intensity={4.1} />
          <directionalLight position={[-5, -2, 4]} intensity={1.8} color="#82aaff" />
          <PhoneModel {...props} />
          <Environment preset="city" />
          <OrbitControls
            enablePan={false}
            enableZoom
            minDistance={6.2}
            maxDistance={10}
            autoRotate={false}
          />
        </Suspense>
      </Canvas>
      <div className="canvas-hint">drag to rotate · scroll to zoom</div>
    </div>
  );
}
