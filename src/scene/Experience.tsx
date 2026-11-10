import { ContactShadows } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { useEffect } from 'react'
import { useBookStore } from '@/store/bookStore'
import { Book } from './Book'
import { CameraRig } from './CameraRig'
import { Lights } from './Lights'

function PointerBridge() {
  const setPointerNdc = useBookStore((s) => s.setPointerNdc)

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1
      const y = -((e.clientY / window.innerHeight) * 2 - 1)
      setPointerNdc(x, y)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [setPointerNdc])

  return null
}

function KeyControls() {
  const nextPage = useBookStore((s) => s.nextPage)
  const prevPage = useBookStore((s) => s.prevPage)
  const open = useBookStore((s) => s.open)
  const isOpen = useBookStore((s) => s.isOpen)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const state = useBookStore.getState()
      if (state.paused) return

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault()
        if (!isOpen) open()
        else nextPage()
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault()
        prevPage()
      }
      if ((e.key === 'Enter' || e.key === ' ') && !isOpen) {
        e.preventDefault()
        open()
      }
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault()
        if (state.zoom > 0.15) {
          state.setZoom(0)
        } else {
          state.close()
        }
      }
      if ((e.key === '+' || e.key === '=') && isOpen) {
        e.preventDefault()
        useBookStore.getState().setZoom((z) => Math.min(1.25, z + 0.25))
      }
      if ((e.key === '-' || e.key === '_') && isOpen) {
        e.preventDefault()
        useBookStore.getState().setZoom((z) => Math.max(0, z - 0.25))
      }
      if ((e.key === 'z' || e.key === 'Z') && isOpen) {
        e.preventDefault()
        useBookStore.getState().toggleZoom()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, nextPage, prevPage, open])

  return null
}

function ScrollZoomBridge() {
  const { gl } = useThree()

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      e.stopPropagation()
      const state = useBookStore.getState()
      if (state.paused) return

      // If book is closed and user scrolls down, open the book
      if (!state.isOpen) {
        if (e.deltaY > 0) {
          state.open()
        }
        return
      }

      // Smooth scroll delta: works for mouse wheel (deltaY ±100) and precision trackpads (deltaY ±1-15)
      const absY = Math.abs(e.deltaY)
      const rawDelta = Math.sign(e.deltaY) * Math.min(0.25, Math.max(0.08, absY * 0.0022))

      // deltaY > 0 (scroll down) => zoom in straight to book page
      // deltaY < 0 (scroll up)   => zoom out to desk
      state.setZoom((prev) => Math.max(0, Math.min(1.25, prev + rawDelta)))
    }

    // Scope wheel/zoom to the book canvas so the rest of the page can still scroll
    const el = gl.domElement
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [gl])

  return null
}

export function Experience() {
  return (
    <>
      <fog attach="fog" args={['#e4c2c0', 9, 18]} />
      <Lights />
      <CameraRig />
      <PointerBridge />
      <ScrollZoomBridge />
      <KeyControls />
      <Book />
      <ContactShadows
        position={[0, 0.001, 0]}
        opacity={0.28}
        scale={12}
        blur={2.4}
        far={4.5}
        color="#8a5a55"
      />
    </>
  )
}
