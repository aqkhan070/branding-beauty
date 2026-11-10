import { useFrame, useThree } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useBookStore } from '@/store/bookStore'

/**
 * Camera framing:
 * - CLOSED: High three-quarter desk angle capturing lamplight, closed book, and salon tools
 * - OPEN: Perfectly centered directly over the open book spread (no cut pages, balanced margins)
 * - Gentle cursor-lean parallax effect
 */
const CLOSED = new THREE.Vector3(0.04, 2.5, 2.05)
const OPEN = new THREE.Vector3(0, 1.92, 1.6)
const LOOK_CLOSED = new THREE.Vector3(0.04, 0.02, 0.26)
const LOOK_OPEN = new THREE.Vector3(0, 0.024, 0.28)

export function CameraRig() {
  const { camera, size } = useThree()
  const target = useMemo(() => new THREE.Vector3(), [])
  const desired = useMemo(() => new THREE.Vector3(), [])
  const look = useMemo(() => new THREE.Vector3(), [])
  const lean = useRef({ x: 0, y: 0 })
  const openBlend = useRef(0)
  const zoomBlend = useRef(0)

  useFrame((_, dt) => {
    const { isOpen, isOpening, pointerNdc, setOpening, paused, zoom } = useBookStore.getState()
    if (paused) return

    openBlend.current = THREE.MathUtils.damp(openBlend.current, isOpen ? 1 : 0, 2.6, dt)
    const t = openBlend.current

    // Damp zoom smoothly towards target zoom level (0 = desk view, 1 = straight page view)
    zoomBlend.current = THREE.MathUtils.damp(
      zoomBlend.current,
      isOpen ? zoom : 0,
      4.2,
      dt
    )
    const zT = THREE.MathUtils.clamp(zoomBlend.current, 0, 1.35)

    // Calculate optimal camera height for straight-on page framing based on viewport aspect ratio
    const aspect = size.width / Math.max(1, size.height)
    // Book spread is 1.56 wide x 1.05 high (aspect ~1.48)
    const baseStraightHeight = aspect >= 1.48
      ? 2.14
      : Math.min(3.8, 1.56 / (0.84 * 0.5735 * Math.max(0.45, aspect)))

    // If deep zoomed (zT > 1), bring camera even closer to the paper
    const zoomScale = 1 - (zT > 1 ? (zT - 1) * 0.42 : 0)
    const straightHeight = baseStraightHeight * zoomScale

    // Straight view targets center spine at z=0.32 (providing comfortable clearance above dock)
    // Locked in place with zero drift or cursor panning so the page never moves with cursor
    const straightPos = new THREE.Vector3(0, straightHeight, 0.32)
    const straightLook = new THREE.Vector3(0, 0.024, 0.32)

    // Interpolate between angled desk view (OPEN) and perpendicular straight-on view (straightPos)
    const currentOpenPos = new THREE.Vector3().lerpVectors(OPEN, straightPos, zT)
    const currentOpenLook = new THREE.Vector3().lerpVectors(LOOK_OPEN, straightLook, zT)

    // Blend between CLOSED desk angle and OPEN/ZOOMED position
    desired.lerpVectors(CLOSED, currentOpenPos, t)
    look.lerpVectors(LOOK_CLOSED, currentOpenLook, t)

    // When book is open, leanAmt is 0 so the page remains 100% still without moving with cursor
    const leanAmt = isOpen ? 0 : 0.05
    lean.current.x += (pointerNdc.x * leanAmt - lean.current.x) * Math.min(1, dt * 3.5)
    lean.current.y += (pointerNdc.y * leanAmt * 0.45 - lean.current.y) * Math.min(1, dt * 3.5)

    // Desk parallax weight fades completely when book is open
    const deskParallaxWeight = (1 - t)
    desired.x += lean.current.x * 0.8 * deskParallaxWeight
    desired.y += lean.current.y * 0.06 * deskParallaxWeight
    desired.z += -lean.current.y * 0.08 * deskParallaxWeight

    // Smoothly rotate camera up-vector from desk up (0, 1, 0) to straight top-down (0, 0, -1)
    const upAngle = zT * (Math.PI / 2) * t
    camera.up.set(0, Math.cos(upAngle), -Math.sin(upAngle))

    camera.position.lerp(desired, 1 - Math.exp(-dt * 4.2))
    target.copy(look)
    if (!isOpen) {
      target.x += lean.current.x * 0.04
      target.z += -lean.current.y * 0.04
    }
    camera.lookAt(target)

    if (isOpening && t > 0.94) setOpening(false)
  })

  return null
}
