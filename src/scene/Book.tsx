// @ts-nocheck — ported from Glaura; animation code kept exact under this project's stricter TS.
// @ts-nocheck — ported from Glaura; animation code kept exact under this project's stricter TS.
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import type { ThreeEvent } from '@react-three/fiber'
import * as THREE from 'three'
import { CASES, CONTENTS_ITEMS, SPREADS, type CasePage } from '@/data/cases'
import {
  createBlankTexture,
  createCaseTexture,
  createContentsTexture,
  createCoverTexture,
  createPageImageTexture,
  drawVideoToPageTexture,
  restoreThumbnailToPageTexture,
} from '@/lib/pageTextures'
import { useBookStore } from '@/store/bookStore'

/** Temporary: show /images/pageN.png instead of generated page content. */
const USE_PAGE_IMAGES = true
const PAGE_IMAGE_COUNT = 14

const PAGE_W = 0.78
const PAGE_H = 1.05
const PAGE_Y = 0.024
const SEG_X = 64
const SEG_Y = 24

type TexPair = { idle: THREE.Texture; hover: THREE.Texture }

/**
 * Creates texture for the stacked paper edges (deckle edges) of the book block
 */
function makePageEdgeTexture(): THREE.CanvasTexture {
  const w = 512
  const h = 128
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')!

  ctx.fillStyle = '#efeae1'
  ctx.fillRect(0, 0, w, h)

  // Paper sheet striations (individual compressed pages)
  for (let y = 0; y < h; y += 2) {
    const alpha = 0.14 + Math.random() * 0.22
    ctx.fillStyle = `rgba(140, 130, 115, ${alpha})`
    ctx.fillRect(0, y, w, 1)
  }

  // Soft shading near top and bottom
  const g = ctx.createLinearGradient(0, 0, 0, h)
  g.addColorStop(0, 'rgba(0, 0, 0, 0.18)')
  g.addColorStop(0.2, 'rgba(0, 0, 0, 0.02)')
  g.addColorStop(0.8, 'rgba(0, 0, 0, 0.02)')
  g.addColorStop(1, 'rgba(0, 0, 0, 0.22)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)

  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  return tex
}

/**
 * Creates soft ambient shadow texture for the center spine gutter
 */
function makeGutterShadowTexture(): THREE.CanvasTexture {
  const w = 128
  const h = 512
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')!

  const g = ctx.createLinearGradient(0, 0, w, 0)
  g.addColorStop(0, 'rgba(0, 0, 0, 0)')
  g.addColorStop(0.35, 'rgba(0, 0, 0, 0.45)')
  g.addColorStop(0.5, 'rgba(0, 0, 0, 0.88)')
  g.addColorStop(0.65, 'rgba(0, 0, 0, 0.45)')
  g.addColorStop(1, 'rgba(0, 0, 0, 0)')

  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)

  return new THREE.CanvasTexture(canvas)
}

/**
 * Dynamic soft contact shadow underneath the arched turning page
 */
function makeTurningShadowTexture(): THREE.CanvasTexture {
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!

  const g = ctx.createRadialGradient(
    size / 2,
    size / 2,
    12,
    size / 2,
    size / 2,
    size * 0.48,
  )
  g.addColorStop(0, 'rgba(0, 0, 0, 0.65)')
  g.addColorStop(0.4, 'rgba(0, 0, 0, 0.28)')
  g.addColorStop(0.8, 'rgba(0, 0, 0, 0.08)')
  g.addColorStop(1, 'rgba(0, 0, 0, 0)')

  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)

  return new THREE.CanvasTexture(canvas)
}

/**
 * CurvedPage:
 * Authentically curved book page geometry that dips smoothly into the central spine gutter,
 * arches slightly across the page spread, and rests flat toward the outer edge.
 */
function CurvedPage({
  map,
  position,
  peel = 0,
  side,
  onClick,
  onPointerOver,
  onPointerOut,
  onPointerMove,
  onPointerDown,
  onPointerUp,
}: {
  map: THREE.Texture
  position: [number, number, number]
  peel?: number
  side: 'left' | 'right'
  onClick?: (e: ThreeEvent<MouseEvent>) => void
  onPointerOver?: (e: ThreeEvent<PointerEvent>) => void
  onPointerOut?: (e: ThreeEvent<PointerEvent>) => void
  onPointerMove?: (e: ThreeEvent<PointerEvent>) => void
  onPointerDown?: (e: ThreeEvent<PointerEvent>) => void
  onPointerUp?: (e: ThreeEvent<PointerEvent>) => void
}) {
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(PAGE_W, PAGE_H, SEG_X, SEG_Y)
    const pos = g.attributes.position as THREE.BufferAttribute

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i) // [-PAGE_W/2, PAGE_W/2]

      // Distance from the spine gutter (at x = PAGE_W/2 for left, x = -PAGE_W/2 for right)
      const distFromSpine = side === 'left' ? PAGE_W / 2 - x : x + PAGE_W / 2
      const normDist = Math.max(0, Math.min(1, distFromSpine / PAGE_W))

      // Spine dip: curves downward into the central gutter seam at normDist = 0
      const spineDip = -0.005 * Math.exp(-Math.pow(normDist / 0.15, 2))

      // Gentle paper arch
      const arch = 0.0025 * Math.sin(normDist * Math.PI)

      pos.setZ(i, spineDip + arch)
    }

    g.computeVertexNormals()
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 2.5)
    return g
  }, [side])

  const base = useMemo(() => Float32Array.from(geo.attributes.position.array as Float32Array), [geo])
  const lastPeel = useRef(-1)

  useFrame(() => {
    if (Math.abs(peel - lastPeel.current) < 0.001) return
    lastPeel.current = peel

    const pos = geo.attributes.position as THREE.BufferAttribute
    if (peel <= 0.001) {
      pos.array.set(base)
      pos.needsUpdate = true
      return
    }
    for (let i = 0; i < pos.count; i++) {
      const ix = i * 3
      const x0 = base[ix]
      const y0 = base[ix + 1]
      const z0 = base[ix + 2]
      const edge = side === 'right' ? (x0 + PAGE_W / 2) / PAGE_W : (PAGE_W / 2 - x0) / PAGE_W
      const cornerBias = side === 'right' ? (y0 + PAGE_H / 2) / PAGE_H : (PAGE_H / 2 - y0) / PAGE_H
      const lift = Math.pow(Math.max(0, edge), 1.35) * peel * (0.08 + cornerBias * 0.08)
      const pull = lift * 0.3 * (side === 'right' ? -1 : 1)
      pos.setXYZ(i, x0 + pull, y0, z0 + lift)
    }
    pos.needsUpdate = true
    geo.computeVertexNormals()
  })

  return (
    <mesh
      geometry={geo}
      position={position}
      rotation={[-Math.PI / 2, 0, 0]}
      castShadow
      receiveShadow
      onClick={onClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
      onPointerMove={onPointerMove}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
    >
      <meshStandardMaterial map={map} roughness={0.72} metalness={0} side={THREE.DoubleSide} />
    </mesh>
  )
}

/**
 * TurningPage:
 * Realistic, continuous-length page folding simulation.
 * - Arc length is mathematically 100% conserved (zero stretching or shrinking).
 * - Symmetrically supports both 'next' (right to left) and 'prev' (left to right).
 * - Discrete front & back buffer meshes ensure crisp, un-mirrored texture mapping on both sides.
 * - Dynamic corner curl bias and 3D belly arch reproduce tactile physics of luxury book stock.
 */
function TurningPage({
  direction,
  front,
  back,
  shadowTex,
  dragStateRef,
  onComplete,
  onCancel,
  onProgressUpdate,
}: {
  direction: 'next' | 'prev'
  front: THREE.Texture
  back: THREE.Texture
  shadowTex: THREE.Texture
  dragStateRef: React.MutableRefObject<{
    isDragging: boolean
    hasMoved: boolean
    side: 'left' | 'right' | null
    startX: number
    startY: number
    dragProgress: number
    cornerV: number
    released: boolean
    targetEnd: number
  }>
  onComplete: () => void
  onCancel: () => void
  onProgressUpdate?: (p: number) => void
}) {
  const nx = SEG_X
  const ny = SEG_Y
  const progressRef = useRef(0)
  const completedRef = useRef(false)
  const shadowMeshRef = useRef<THREE.Mesh>(null)
  const shadowMatRef = useRef<THREE.MeshBasicMaterial>(null)

  const { frontGeo, backGeo } = useMemo(() => {
    const numVerts = (nx + 1) * (ny + 1)

    const fGeo = new THREE.BufferGeometry()
    const fPos = new Float32Array(numVerts * 3)
    const fNorm = new Float32Array(numVerts * 3)
    const fUv = new Float32Array(numVerts * 2)
    const fIndices: number[] = []

    const bGeo = new THREE.BufferGeometry()
    const bPos = new Float32Array(numVerts * 3)
    const bNorm = new Float32Array(numVerts * 3)
    const bUv = new Float32Array(numVerts * 2)
    const bIndices: number[] = []

    for (let j = 0; j <= ny; j++) {
      const v = j / ny
      for (let i = 0; i <= nx; i++) {
        const u = i / nx
        const idx = j * (nx + 1) + i

        // Exact UV coordinates mapping matching the resting pages:
        // When turning 'next':
        //   Front starts on right page: spine at u=0, outer edge at u=1 => fUv = u
        //   Back lands on left page: spine at u=0, outer edge at u=1 => bUv = 1 - u
        // When turning 'prev':
        //   Front starts on left page: spine at u=0, outer edge at u=1 => fUv = 1 - u
        //   Back lands on right page: spine at u=0, outer edge at u=1 => bUv = u
        const fu = direction === 'next' ? u : 1 - u
        const bu = direction === 'next' ? 1 - u : u

        fUv[idx * 2] = fu
        fUv[idx * 2 + 1] = v

        bUv[idx * 2] = bu
        bUv[idx * 2 + 1] = v
      }
    }

    for (let j = 0; j < ny; j++) {
      for (let i = 0; i < nx; i++) {
        const a = j * (nx + 1) + i
        const b = j * (nx + 1) + i + 1
        const c = (j + 1) * (nx + 1) + i
        const d = (j + 1) * (nx + 1) + i + 1

        // Front face: CCW facing out on starting side
        // Back face: CCW facing out on landing side
        if (direction === 'next') {
          fIndices.push(a, b, d, a, d, c)
          bIndices.push(a, d, b, a, c, d)
        } else {
          fIndices.push(a, d, b, a, c, d)
          bIndices.push(a, b, d, a, d, c)
        }
      }
    }

    fGeo.setAttribute('position', new THREE.BufferAttribute(fPos, 3))
    fGeo.setAttribute('normal', new THREE.BufferAttribute(fNorm, 3))
    fGeo.setAttribute('uv', new THREE.BufferAttribute(fUv, 2))
    fGeo.setIndex(fIndices)
    fGeo.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 2.5)

    bGeo.setAttribute('position', new THREE.BufferAttribute(bPos, 3))
    bGeo.setAttribute('normal', new THREE.BufferAttribute(bNorm, 3))
    bGeo.setAttribute('uv', new THREE.BufferAttribute(bUv, 2))
    bGeo.setIndex(bIndices)
    bGeo.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 2.5)

    return { frontGeo: fGeo, backGeo: bGeo }
  }, [direction, nx, ny])

  useFrame((_, dt) => {
    if (completedRef.current) return

    const drag = dragStateRef.current

    if (drag.isDragging) {
      // Direct cursor tracking with silky smooth physical damping
      progressRef.current = THREE.MathUtils.damp(
        progressRef.current,
        drag.dragProgress,
        16,
        dt
      )
    } else if (drag.released) {
      // Natural spring-momentum gliding upon release
      const target = drag.targetEnd
      const speed = 1.65
      if (target === 1) {
        progressRef.current = Math.min(1, progressRef.current + dt * speed)
        if (progressRef.current >= 1) {
          completedRef.current = true
          onComplete()
          return
        }
      } else {
        progressRef.current = Math.max(0, progressRef.current - dt * speed)
        if (progressRef.current <= 0) {
          completedRef.current = true
          onCancel()
          return
        }
      }
    } else {
      // Autonomous mode (e.g. click):
      // Smooth 1.35s tactile animation
      const turnDuration = 1.35
      progressRef.current = Math.min(1, progressRef.current + dt / turnDuration)
      if (progressRef.current >= 1) {
        completedRef.current = true
        onComplete()
        return
      }
    }

    const p = progressRef.current
    onProgressUpdate?.(p)

    // Smooth physical easing for non-drag or release
    const naturalEase =
      p < 0.5
        ? 0.5 * Math.pow(2 * p, 1.55)
        : 1 - 0.5 * Math.pow(2 * (1 - p), 1.75)

    const ease = drag.isDragging
      ? THREE.MathUtils.lerp(p, naturalEase, 0.45)
      : naturalEase

    const fPos = frontGeo.attributes.position as THREE.BufferAttribute
    const bPos = backGeo.attributes.position as THREE.BufferAttribute

    // Natural lift bell envelope: 0 at rest, crests in mid-flight
    const liftBell = Math.sin(p * Math.PI)

    // Dynamic contact shadow underneath the turning page
    if (shadowMeshRef.current && shadowMatRef.current) {
      const shadowXPos =
        direction === 'next'
          ? THREE.MathUtils.lerp(PAGE_W * 0.42, -PAGE_W * 0.42, ease)
          : THREE.MathUtils.lerp(-PAGE_W * 0.42, PAGE_W * 0.42, ease)
      shadowMeshRef.current.position.x = shadowXPos
      shadowMatRef.current.opacity = liftBell * 0.32
      shadowMeshRef.current.scale.set(
        1 + liftBell * 0.25,
        1 + liftBell * 0.12,
        1
      )
    }

    const ds = PAGE_W / nx

    // Helper for resting page curvature (spine dip + gentle paper arch)
    const getRestZ = (normDist: number) => {
      const spineDip = -0.005 * Math.exp(-Math.pow(normDist / 0.15, 2))
      const arch = 0.0025 * Math.sin(normDist * Math.PI)
      return spineDip + arch
    }

    const cornerCenter = drag.isDragging ? drag.cornerV : 0.2

    for (let j = 0; j <= ny; j++) {
      const v = j / ny
      const y0 = (v - 0.5) * PAGE_H

      // Dynamic corner bias: responds to hand grip height
      const cornerLead = (cornerCenter - v) * 0.14 * liftBell
      const pe = THREE.MathUtils.clamp(ease + cornerLead, 0, 1)

      let currX = 0
      let currZ = getRestZ(0)

      for (let i = 0; i <= nx; i++) {
        const u = i / nx
        const idx = j * (nx + 1) + i

        if (i === 0) {
          fPos.setXYZ(idx, 0, y0, currZ)
          bPos.setXYZ(idx, 0, y0, currZ)
          continue
        }

        let theta: number
        if (direction === 'next') {
          // Base rotation: spine turns smoothly from 0 to PI
          const base = pe * Math.PI
          // Natural 3D paper arching & outer edge curl:
          const curl = liftBell * (0.40 * Math.sin(u * Math.PI) + 0.36 * Math.pow(u, 1.3))
          theta = THREE.MathUtils.clamp(base + curl, 0, Math.PI)

          // Soft air-cushion landing: as p approaches 1, the page flattens smoothly
          if (p > 0.72) {
            const settle = (p - 0.72) / 0.28
            const smoothSettle = settle * settle * (3 - 2 * settle)
            theta = theta * (1 - smoothSettle) + Math.PI * smoothSettle
          }
        } else {
          // Prev: turns symmetrically from left (PI) to right (0)
          const base = (1 - pe) * Math.PI
          const curl = liftBell * (0.40 * Math.sin(u * Math.PI) + 0.36 * Math.pow(u, 1.3))
          theta = THREE.MathUtils.clamp(base - curl, 0, Math.PI)

          if (p > 0.72) {
            const settle = (p - 0.72) / 0.28
            const smoothSettle = settle * settle * (3 - 2 * settle)
            theta = theta * (1 - smoothSettle)
          }
        }

        currX += ds * Math.cos(theta)
        currZ += ds * Math.sin(theta)

        // Seamless blending to resting page profile at start and touchdown
        const restZ = getRestZ(u)
        // Tiny 0.6mm clearance lift in mid-air to guarantee clean rendering without z-fighting
        const midAirClearance = 0.0006 * liftBell
        const blendedZ = currZ + midAirClearance
        const finalZ =
          p < 0.06
            ? THREE.MathUtils.lerp(restZ, blendedZ, p / 0.06)
            : p > 0.94
            ? THREE.MathUtils.lerp(blendedZ, restZ, (p - 0.94) / 0.06)
            : Math.max(restZ, blendedZ)

        // Subtle longitudinal flex (soft gravitational paper drape)
        const yFlex = Math.sin(u * Math.PI) * liftBell * 0.008 * (1 - v)
        const totalY = y0 + yFlex

        fPos.setXYZ(idx, currX, totalY, finalZ)
        bPos.setXYZ(idx, currX, totalY, finalZ)
      }
    }

    fPos.needsUpdate = true
    bPos.needsUpdate = true
    frontGeo.computeVertexNormals()
    backGeo.computeVertexNormals()
  })

  return (
    <group position={[0, PAGE_Y, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      {/* Dynamic contact shadow underneath the turning page */}
      <mesh ref={shadowMeshRef} position={[0, 0, -0.003]}>
        <planeGeometry args={[PAGE_W * 0.85, PAGE_H * 0.95]} />
        <meshBasicMaterial
          ref={shadowMatRef}
          map={shadowTex}
          transparent
          opacity={0}
          depthWrite={false}
        />
      </mesh>

      {/* Front Face: CCW normal facing out on starting side */}
      <mesh geometry={frontGeo} castShadow receiveShadow>
        <meshStandardMaterial
          map={front}
          roughness={0.72}
          metalness={0}
          side={THREE.FrontSide}
        />
      </mesh>

      {/* Back Face: CCW normal facing out on destination side */}
      <mesh geometry={backGeo} castShadow receiveShadow>
        <meshStandardMaterial
          map={back}
          roughness={0.72}
          metalness={0}
          side={THREE.FrontSide}
        />
      </mesh>
    </group>
  )
}

export function Book() {
  const bookGroup = useRef<THREE.Group>(null)
  const coverPivot = useRef<THREE.Group>(null)
  const baseMesh = useRef<THREE.Mesh>(null)
  const closedStackMesh = useRef<THREE.Mesh>(null)
  const pagesGroup = useRef<THREE.Group>(null)
  const leftPageGroup = useRef<THREE.Group>(null)
  const spineExtras = useRef<THREE.Group>(null)
  const openProgress = useRef(0)

  // Synchronous initial textures guarantee instant crisp rendering
  const coverMap = useMemo(() => createCoverTexture(), [])
  const contentsMap = useMemo(() => createContentsTexture(), [])
  const blank = useMemo(() => createBlankTexture(), [])
  const pageEdgeTex = useMemo(() => makePageEdgeTexture(), [])
  const gutterShadowTex = useMemo(() => makeGutterShadowTexture(), [])
  const turningShadowTex = useMemo(() => makeTurningShadowTexture(), [])

  const [caseMaps, setCaseMaps] = useState<Record<string, TexPair>>({})
  const [pageImageMaps, setPageImageMaps] = useState<(THREE.Texture | null)[]>(
    () => Array.from({ length: PAGE_IMAGE_COUNT }, () => null),
  )
  const [turnHalf, setTurnHalf] = useState<'start' | 'landing'>('start')

  const dragStateRef = useRef<{
    isDragging: boolean
    hasMoved: boolean
    side: 'left' | 'right' | null
    startX: number
    startY: number
    dragProgress: number
    cornerV: number
    released: boolean
    targetEnd: number
  }>({
    isDragging: false,
    hasMoved: false,
    side: null,
    startX: 0,
    startY: 0,
    dragProgress: 0,
    cornerV: 0.2,
    released: false,
    targetEnd: 1,
  })

  const pointerDownMeta = useRef<{
    side: 'left' | 'right'
    startX: number
    startY: number
    time: number
    uv?: THREE.Vector2
  } | null>(null)

  const isOpen = useBookStore((s) => s.isOpen)
  const spreadIndex = useBookStore((s) => s.spreadIndex)
  const turning = useBookStore((s) => s.turning)
  const hoverPage = useBookStore((s) => s.hoverPage)
  const isVideoPlaying = useBookStore((s) => s.isVideoPlaying)
  const open = useBookStore((s) => s.open)
  const close = useBookStore((s) => s.close)
  const nextPage = useBookStore((s) => s.nextPage)
  const prevPage = useBookStore((s) => s.prevPage)
  const goToSpread = useBookStore((s) => s.goToSpread)
  const setTurning = useBookStore((s) => s.setTurning)
  const setHoverPage = useBookStore((s) => s.setHoverPage)
  const setHoverSide = useBookStore((s) => s.setHoverSide)

  const videoRef = useRef<HTMLVideoElement | null>(null)
  const activeVideoUrl = useRef<string | null>(null)

  // Initialize hidden video element for real-time 3D page texture rendering
  useEffect(() => {
    const video = document.createElement('video')
    video.crossOrigin = 'anonymous'
    video.loop = true
    video.playsInline = true
    video.muted = true
    video.preload = 'auto'
    videoRef.current = video

    return () => {
      video.pause()
      video.src = ''
    }
  }, [])

  const handleTurnComplete = useCallback(() => {
    const state = useBookStore.getState()
    if (state.turning === 'next') {
      goToSpread(state.spreadIndex + 1)
    } else if (state.turning === 'prev') {
      goToSpread(state.spreadIndex - 1)
    }
    setTurnHalf('start')
  }, [goToSpread])

  const handleTurnCancel = useCallback(() => {
    setTurning('idle')
    setTurnHalf('start')
  }, [setTurning])

  const handleProgressUpdate = useCallback((p: number) => {
    const half = p >= 0.5 ? 'landing' : 'start'
    setTurnHalf((prev) => (prev !== half ? half : prev))
  }, [])

  useEffect(() => {
    let alive = true
    ;(async () => {
      // Existing generated page content (kept intact; hidden while USE_PAGE_IMAGES)
      const caseEntries = await Promise.all(
        CASES.map(async (c) => {
          const isLeft = SPREADS.some((s) => s.left === c)
          const side: 'left' | 'right' = isLeft ? 'left' : 'right'
          const idle = await createCaseTexture(c, { side })
          const hover = await createCaseTexture(c, { hovered: true, side })
          return [c.id, { idle, hover }] as const
        }),
      )
      if (!alive) return
      setCaseMaps(Object.fromEntries(caseEntries))
    })()
    return () => {
      alive = false
    }
  }, [])

  useEffect(() => {
    if (!USE_PAGE_IMAGES) return
    let alive = true
    ;(async () => {
      const maps = await Promise.all(
        Array.from({ length: PAGE_IMAGE_COUNT }, (_, i) =>
          createPageImageTexture(i + 1),
        ),
      )
      if (!alive) return
      setPageImageMaps(maps)
    })()
    return () => {
      alive = false
    }
  }, [])

  /** Book page index 1..14: contents=1, then CASES[0]..CASES[12] => 2..14 */
  const pageNumberFor = useCallback(
    (page: 'contents' | CasePage | 'blank'): number | null => {
      if (page === 'blank') return null
      if (page === 'contents') return 1
      const idx = CASES.findIndex((c) => c.id === page.id)
      return idx >= 0 ? idx + 2 : null
    },
    [],
  )

  const resolveMap = useCallback(
    (page: 'contents' | CasePage | 'blank', hovered: boolean) => {
      if (USE_PAGE_IMAGES) {
        const n = pageNumberFor(page)
        if (n != null) {
          const imgTex = pageImageMaps[n - 1]
          if (imgTex) return imgTex
        }
      }
      // Existing content textures (fallback while images load / when flag is off)
      if (page === 'blank') return blank
      if (page === 'contents') return contentsMap
      const pair = caseMaps[page.id]
      if (!pair) return blank
      return hovered ? pair.hover : pair.idle
    },
    [blank, caseMaps, contentsMap, pageImageMaps, pageNumberFor],
  )

  const spread = SPREADS[spreadIndex]
  const nextSpread = SPREADS[Math.min(spreadIndex + 1, SPREADS.length - 1)]
  const prevSpread = SPREADS[Math.max(spreadIndex - 1, 0)]

  useFrame((_, dt) => {
    const state = useBookStore.getState()
    if (state.paused) return

    // Smooth open & close animation with Hermite easing
    const openSpeed = state.isOpen ? 1.05 : 1.25
    if (state.isOpen) {
      openProgress.current = Math.min(1, openProgress.current + dt * openSpeed)
    } else {
      openProgress.current = Math.max(0, openProgress.current - dt * openSpeed)
    }
    const p = openProgress.current
    // C2 Hermite smooth easing: zero initial jerk, fluid crest, cushioned landing
    const smoothT = p <= 0 ? 0 : p >= 1 ? 1 : p * p * (3 - 2 * p)

    // Book center shift: closed book centered at world 0, open book centered at world 0
    if (bookGroup.current) {
      bookGroup.current.position.x = THREE.MathUtils.lerp(-PAGE_W / 2, 0, smoothT)
    }

    // Spine hinge is always at x = 0; vertical lift arch prevents page clipping
    const midLift = Math.sin(smoothT * Math.PI) * 0.042
    const spineY = THREE.MathUtils.lerp(0.023, 0.001, smoothT) + midLift
    const angle = smoothT * Math.PI

    if (coverPivot.current) {
      coverPivot.current.position.x = 0
      coverPivot.current.position.y = spineY
      coverPivot.current.rotation.z = angle
      // Cover is always visible: swings smoothly over and rests flush on the left
      coverPivot.current.visible = true
    }

    // Dynamic base scaling: expands from single cover width on the right to double cover width
    if (baseMesh.current) {
      baseMesh.current.position.x = THREE.MathUtils.lerp(PAGE_W / 2, 0, smoothT)
      baseMesh.current.scale.x = THREE.MathUtils.lerp(
        1,
        (PAGE_W * 2 + 0.016) / (PAGE_W + 0.016),
        smoothT,
      )
    }

    // Closed book stack: visible ONLY when closed or nearly closed under cover
    // Threshold matches pagesGroup so the two never overlap (avoids a hairline seam mid-swing)
    if (closedStackMesh.current) {
      closedStackMesh.current.visible = p < 0.03
    }

    // Inner pages: visible ONLY when book is open or opening (p > 0.03)
    // Directly driven in useFrame so it NEVER gets stuck on screen when closed!
    if (pagesGroup.current) {
      pagesGroup.current.visible = p > 0.03
    }

    // Spine gutter/wire: hide while cover is mid-swing so their edge doesn't
    // rasterize as a thin line against the rotating cover; show when open.
    if (spineExtras.current) {
      spineExtras.current.visible = p > 0.82
    }

    // Left interactive page: visible only when book is fully or nearly open (p >= 0.95)
    // While opening/closing, the inside face of coverPivot displays the left page in flight!
    if (leftPageGroup.current) {
      leftPageGroup.current.visible = p >= 0.95
    }
  })

  const onCoverClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    if (openProgress.current < 0.2) open()
  }

function isOverImage(casePage: CasePage, uv?: THREE.Vector2): boolean {
  if (!uv) return false
  // Cream editorial layout: copy on top, large product visual mid-page (UV.y=1 at top)
  if (casePage.isMobile) {
    return uv.y >= 0.12 && uv.y <= 0.74 && uv.x >= 0.16 && uv.x <= 0.84
  }
  return uv.y >= 0.12 && uv.y <= 0.74 && uv.x >= 0.06 && uv.x <= 0.94
}

  const onLeftClick = useCallback((uv?: THREE.Vector2) => {
    const state = useBookStore.getState()
    if (!state.isOpen || state.turning !== 'idle') return

    // If on first spread (Contents on left)
    if (state.spreadIndex === 0) {
      if (spread.left === 'contents' && uv) {
        const y = 1 - uv.y
        if (y > 0.18 && y < 0.72) {
          const perCol = Math.ceil(CONTENTS_ITEMS.length / 2)
          const col = uv.x > 0.48 ? 1 : 0
          const row = Math.min(perCol - 1, Math.max(0, Math.floor((y - 0.20) / (0.50 / perCol))))
          const idx = col * perCol + row
          const item = CONTENTS_ITEMS[idx]
          if (item && item.spread > 0) {
            goToSpread(item.spread)
            return
          }
        }
      }
      close()
      return
    }

    // Check if clicked directly on the image/mockup of the left page
    if (spread.left !== 'contents') {
      const casePage = spread.left as CasePage
      if (isOverImage(casePage, uv)) {
        const caseIndex = CASES.findIndex((c) => c.id === casePage.id)
        state.openImage({
          src: casePage.image,
          title: casePage.title,
          subtitle: casePage.subtitle,
          category: casePage.category,
          accent: casePage.accent,
          domain: casePage.domain,
          description: casePage.description,
          isMobile: casePage.isMobile,
          caseIndex: caseIndex >= 0 ? caseIndex : 0,
        })
        return
      }
    }

    prevPage()
  }, [close, goToSpread, prevPage, spread.left])

  const onRightClick = useCallback((uv?: THREE.Vector2) => {
    const state = useBookStore.getState()
    if (!state.isOpen || state.turning !== 'idle') return

    // Check if clicked directly on the image/mockup of the right page
    const casePage = spread.right
    if (casePage && isOverImage(casePage, uv)) {
      if (casePage.video) {
        // Toggle interactive video playback directly on the 3D book page
        state.toggleVideoPlaying()
        return
      }
      const caseIndex = CASES.findIndex((c) => c.id === casePage.id)
      state.openImage({
        src: casePage.image,
        video: casePage.video,
        title: casePage.title,
        subtitle: casePage.subtitle,
        category: casePage.category,
        accent: casePage.accent,
        domain: casePage.domain,
        description: casePage.description,
        isMobile: casePage.isMobile,
        caseIndex: caseIndex >= 0 ? caseIndex : 0,
      })
      return
    }

    nextPage()
  }, [nextPage, spread.right])

  const handlePointerDown = (side: 'left' | 'right') => (e: ThreeEvent<PointerEvent>) => {
    if (!isOpen) return
    e.stopPropagation()

    // If currently animating or dragging, ignore new down
    if (turning !== 'idle') return

    const pointerY = e.clientY
    // Calculate cornerV (normalized vertical ratio 0..1, 0 bottom, 1 top)
    const cornerV = THREE.MathUtils.clamp(1 - (pointerY / window.innerHeight), 0, 1)

    dragStateRef.current = {
      isDragging: false,
      hasMoved: false,
      side,
      startX: e.clientX,
      startY: e.clientY,
      dragProgress: 0,
      cornerV,
      released: false,
      targetEnd: 1,
    }

    pointerDownMeta.current = {
      side,
      startX: e.clientX,
      startY: e.clientY,
      time: Date.now(),
      uv: e.uv ? e.uv.clone() : undefined,
    }
  }

  useEffect(() => {
    const onWindowPointerMove = () => {
      // Intentionally do NOT track cursor movement to prevent page from moving with cursor
    }

    const onWindowPointerUp = (e: PointerEvent) => {
      const meta = pointerDownMeta.current
      if (!meta) return
      pointerDownMeta.current = null
      document.body.style.cursor = 'default'

      // Clean click detection
      const dx = Math.abs(e.clientX - meta.startX)
      const dy = Math.abs(e.clientY - meta.startY)
      const dt = Date.now() - meta.time

      if (dx < 30 && dy < 30 && dt < 650) {
        if (meta.side === 'right') {
          onRightClick(meta.uv)
        } else {
          onLeftClick(meta.uv)
        }
      }
    }

    window.addEventListener('pointermove', onWindowPointerMove, { passive: true })
    window.addEventListener('pointerup', onWindowPointerUp, { passive: true })

    return () => {
      window.removeEventListener('pointermove', onWindowPointerMove)
      window.removeEventListener('pointerup', onWindowPointerUp)
    }
  }, [onLeftClick, onRightClick])

  const handleEdge = (side: 'left' | 'right') => (e: ThreeEvent<PointerEvent>) => {
    if (!isOpen || !e.uv || turning !== 'idle') return

    // If hovering directly over the image, indicate click-to-open with zoom-in cursor
    const casePage =
      side === 'left'
        ? spread.left !== 'contents'
          ? (spread.left as CasePage)
          : null
        : spread.right

    if (casePage && isOverImage(casePage, e.uv)) {
      document.body.style.cursor = casePage.video ? 'pointer' : 'zoom-in'
      return
    }

    document.body.style.cursor = 'pointer'
  }

  const leftMap = resolveMap(spread.left, hoverPage === 'left' && spread.left !== 'contents')
  const rightMap = resolveMap(spread.right, hoverPage === 'right')

  // Underneath static pages while turning:
  // When turning next and in landing half (p >= 0.5), pre-render the landing spread's left page
  // so when TurningPage unmounts at p=1, there is ZERO visual texture change or flicker!
  const activeLeftMap =
    turning === 'next' && turnHalf === 'landing'
      ? resolveMap(nextSpread.left, false)
      : turning === 'prev'
      ? resolveMap(prevSpread.left, false)
      : leftMap

  const activeRightMap =
    turning === 'prev' && turnHalf === 'landing'
      ? resolveMap(prevSpread.right, false)
      : turning === 'next'
      ? resolveMap(nextSpread.right, false)
      : rightMap

  // Synchronize HTML video playback with book state
  useEffect(() => {
    const v = videoRef.current
    if (!v) return

    const rightVideo = spread.right?.video
    if (!rightVideo || !isOpen || turning !== 'idle') {
      if (isVideoPlaying) {
        useBookStore.getState().setIsVideoPlaying(false)
      }
      v.pause()
      return
    }

    if (isVideoPlaying) {
      if (activeVideoUrl.current !== rightVideo) {
        v.src = rightVideo
        activeVideoUrl.current = rightVideo
      }
      v.play().catch((err) => console.warn('Video play interrupted:', err))
    } else {
      v.pause()
      if (activeRightMap instanceof THREE.CanvasTexture) {
        restoreThumbnailToPageTexture(activeRightMap)
      }
    }
  }, [isVideoPlaying, isOpen, turning, spread.right?.video, activeRightMap])

  // Stream current video frame onto active page texture
  useFrame(() => {
    const v = videoRef.current
    if (
      isVideoPlaying &&
      v &&
      !v.paused &&
      !v.ended &&
      v.readyState >= 2 &&
      activeRightMap instanceof THREE.CanvasTexture
    ) {
      drawVideoToPageTexture(activeRightMap, v)
    }
  })

  // Front & Back textures of the turning page
  const turnFront =
    turning === 'next'
      ? resolveMap(spread.right, false)
      : resolveMap(spread.left, false)

  const turnBack =
    turning === 'next'
      ? resolveMap(nextSpread.left, false)
      : resolveMap(prevSpread.right, false)

  return (
    <group ref={bookGroup} position={[-PAGE_W / 2, 0.012, 0.28]}>
      {/* 1. Bottom Hardcover Casing: cream/pink board matching cover linen (visible lip & open/close) */}
      <mesh ref={baseMesh} position={[PAGE_W / 2, 0.0035, 0]} castShadow receiveShadow>
        <boxGeometry args={[PAGE_W + 0.016, 0.007, PAGE_H + 0.016]} />
        <meshStandardMaterial color="#f2ebe4" roughness={0.78} metalness={0.02} />
      </mesh>

      {/* 2. Closed Page Stack: Visible ONLY when book is closed, perfectly centered under the front cover */}
      <mesh ref={closedStackMesh} position={[PAGE_W / 2, 0.015, 0]} castShadow receiveShadow>
        <boxGeometry args={[PAGE_W, 0.016, PAGE_H]} />
        <meshStandardMaterial
          map={pageEdgeTex}
          color="#f4efe6"
          roughness={0.88}
        />
      </mesh>

      {/* 3. Front Hardcover Board (Hinged at Center Spine x = 0) */}
      <group
        ref={coverPivot}
        position={[0, 0.023, 0]}
      >
        {/* Hardcover Casing Board — cream board edges matching linen cover face */}
        <mesh
          position={[PAGE_W / 2, 0.0035, 0]}
          castShadow
          receiveShadow
          onClick={onCoverClick}
          onPointerOver={() => {
            if (openProgress.current < 0.15) {
              setHoverSide('cover')
              document.body.style.cursor = 'pointer'
            }
          }}
          onPointerOut={() => {
            setHoverSide('none')
            if (openProgress.current < 0.15) {
              document.body.style.cursor = 'default'
            }
          }}
        >
          <boxGeometry args={[PAGE_W + 0.016, 0.007, PAGE_H + 0.016]} />
          <meshStandardMaterial color="#f2ebe4" roughness={0.78} metalness={0.02} />
        </mesh>

        {/* Front Cover Outside Face Texture (Glaura cream cover)
            Separated + polygonOffset to prevent z-fight hairline vs board during swing */}
        <mesh
          position={[PAGE_W / 2, 0.0086, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          onClick={onCoverClick}
          onPointerOver={() => {
            if (openProgress.current < 0.15) {
              setHoverSide('cover')
              document.body.style.cursor = 'pointer'
            }
          }}
          onPointerOut={() => {
            setHoverSide('none')
            if (openProgress.current < 0.15) {
              document.body.style.cursor = 'default'
            }
          }}
        >
          <planeGeometry args={[PAGE_W + 0.016, PAGE_H + 0.016]} />
          <meshStandardMaterial
            map={coverMap}
            roughness={0.72}
            metalness={0.03}
            polygonOffset
            polygonOffsetFactor={-1}
            polygonOffsetUnits={-1}
          />
        </mesh>

        {/* Inside Cover Face Texture (Contents / Endpaper - swinging with cover in flight) */}
        <mesh
          position={[PAGE_W / 2, -0.0016, 0]}
          rotation={[Math.PI / 2, 0, Math.PI]}
        >
          <planeGeometry args={[PAGE_W, PAGE_H]} />
          <meshStandardMaterial
            map={resolveMap('contents', false)}
            roughness={0.72}
            metalness={0}
            polygonOffset
            polygonOffsetFactor={-1}
            polygonOffsetUnits={-1}
          />
        </mesh>
      </group>

      {/* 5. Inner Book Pages with authentic binding curvature & center gutter */}
      <group ref={pagesGroup} position={[0, 0, 0]} visible={false}>
        <group ref={spineExtras} visible={false}>
          {/* Central Spine Gutter Shadow Crease */}
          <mesh position={[0, PAGE_Y + 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.042, PAGE_H + 0.002]} />
            <meshBasicMaterial
              map={gutterShadowTex}
              transparent
              opacity={0.88}
              depthWrite={false}
            />
          </mesh>

          {/* Central Spine Binding Seam Stitch Wire */}
          <mesh position={[0, PAGE_Y - 0.002, 0]}>
            <cylinderGeometry args={[0.0012, 0.0012, PAGE_H, 12]} />
            <meshStandardMaterial color="#1e1e22" roughness={0.7} />
          </mesh>
        </group>

        {/* Left Page Group (Visible only when book is fully or nearly open) */}
        <group ref={leftPageGroup} visible={false}>
          <CurvedPage
            side="left"
            map={activeLeftMap}
            position={[-PAGE_W / 2, PAGE_Y, 0]}
            peel={0}
            onClick={(e) => {
              e.stopPropagation()
              onLeftClick(e.uv)
            }}
            onPointerOver={(e) => {
              e.stopPropagation()
              setHoverPage('left')
              if (turning === 'idle') document.body.style.cursor = 'pointer'
            }}
            onPointerOut={() => {
              setHoverPage('none')
              document.body.style.cursor = 'default'
            }}
            onPointerMove={handleEdge('left')}
            onPointerDown={handlePointerDown('left')}
          />
        </group>

        {/* Right Page (Curved paper arching from gutter) */}
        <CurvedPage
          side="right"
          map={activeRightMap}
          position={[PAGE_W / 2, PAGE_Y, 0]}
          peel={0}
          onClick={(e) => {
            e.stopPropagation()
            onRightClick(e.uv)
          }}
          onPointerOver={(e) => {
            e.stopPropagation()
            setHoverPage('right')
            if (turning === 'idle') document.body.style.cursor = 'pointer'
          }}
          onPointerOut={() => {
            setHoverPage('none')
            document.body.style.cursor = 'default'
          }}
          onPointerMove={handleEdge('right')}
          onPointerDown={handlePointerDown('right')}
        />

        {/* Turning Page Folding Physics */}
        {turning !== 'idle' && (
          <TurningPage
            key={turning + spreadIndex}
            direction={turning}
            front={turnFront}
            back={turnBack}
            shadowTex={turningShadowTex}
            dragStateRef={dragStateRef}
            onComplete={handleTurnComplete}
            onCancel={handleTurnCancel}
            onProgressUpdate={handleProgressUpdate}
          />
        )}
      </group>
    </group>
  )
}
