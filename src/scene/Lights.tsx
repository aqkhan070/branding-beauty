// @ts-nocheck — ported from Glaura; lighting kept exact under this project's stricter TS.
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

/**
 * Soft daylight rig for the light dusty-rose desk theme:
 * - Bright ambient fill so the pink/cream surface reads true to the flat-lay reference
 * - Gentle overhead key with soft penumbra (no harsh lamp pool)
 * - Warm bounce + cool rim for object separation without dark-room contrast
 */
export function Lights() {
  const spotTarget = useRef<THREE.Object3D>(null)
  const spotLightRef = useRef<THREE.SpotLight>(null)
  const pointLightRef = useRef<THREE.PointLight>(null)

  // Softer base intensities for a light environment
  const BASE_SPOT = 12
  const BASE_POINT = 2.2

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const breath = Math.sin(t * 1.15) * 0.02 + Math.sin(t * 0.48) * 0.012

    if (spotLightRef.current) {
      spotLightRef.current.intensity = BASE_SPOT * (1 + breath)
    }
    if (pointLightRef.current) {
      pointLightRef.current.intensity = BASE_POINT * (1 + breath * 1.1)
    }
  })

  return (
    <>
      <object3D ref={spotTarget} position={[0.05, 0, 0]} />

      {/* Soft warm ambient matching dusty-rose bounce */}
      <ambientLight intensity={1.15} color="#f6e6e2" />

      {/* Soft overhead key — even, diffused pool */}
      <spotLight
        ref={spotLightRef}
        position={[0.1, 4.4, 0.5]}
        target={spotTarget.current ?? undefined}
        angle={0.85}
        penumbra={0.92}
        intensity={BASE_SPOT}
        color="#fff8f4"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0001}
        shadow-normalBias={0.02}
        distance={12}
      />

      {/* Gentle desk fill */}
      <pointLight
        ref={pointLightRef}
        position={[0.1, 2.2, 0.3]}
        intensity={BASE_POINT}
        color="#ffe8e0"
        distance={5.5}
        decay={2}
      />

      {/* Soft directional definition */}
      <directionalLight
        position={[2.4, 3.8, 1.8]}
        intensity={0.55}
        color="#fff0ea"
      />

      {/* Cool soft kicker for silhouette separation */}
      <directionalLight
        position={[-3.2, 3.2, -1.2]}
        intensity={0.35}
        color="#e8eef5"
      />

      {/* Hemisphere: soft pink sky / warmer ground bounce */}
      <hemisphereLight args={['#f8ece8', '#d9aea8', 0.75]} />
    </>
  )
}
