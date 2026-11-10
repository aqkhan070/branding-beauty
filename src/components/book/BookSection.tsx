import { Canvas } from '@react-three/fiber'
import { useEffect, useState } from 'react'
import { Experience } from '@/scene/Experience'
import { useBookStore } from '@/store/bookStore'
import { Overlay } from './Overlay'
import '@/styles/booklet.css'

/**
 * Full-viewport 3D booklet section (ported from Glaura).
 * Mounts the WebGL canvas only on the client to avoid SSR issues.
 */
export function BookSection() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    useBookStore.getState().close()
    // Start paused until the section enters the viewport
    useBookStore.setState({ paused: true })
  }, [])

  useEffect(() => {
    if (!mounted) return
    const section = document.getElementById('beauty-book')
    if (!section) return

    const io = new IntersectionObserver(
      ([entry]) => {
        const visible = Boolean(entry?.isIntersecting)
        // Pause book animation/input when the section is off-screen
        useBookStore.setState({ paused: !visible })
      },
      { threshold: 0.35 },
    )
    io.observe(section)
    return () => io.disconnect()
  }, [mounted])

  return (
    <section
      id="beauty-book"
      className="book-section"
      aria-label="Interactive 3D beauty book portfolio"
    >
      <div className="app">
        {mounted ? (
          <Canvas
            className="stage"
            shadows
            dpr={[1, 2]}
            camera={{ position: [0.04, 2.5, 2.05], fov: 32, near: 0.1, far: 40 }}
            gl={{
              antialias: true,
              toneMappingExposure: 1.05,
              preserveDrawingBuffer: true,
              alpha: false,
            }}
            style={{ background: '#e4c2c0' }}
            onCreated={({ camera, gl }) => {
              camera.lookAt(0.04, 0.02, 0.26)
              gl.setClearColor('#e4c2c0', 1)
            }}
          >
            <Experience />
          </Canvas>
        ) : (
          <div className="stage" style={{ background: '#e4c2c0' }} />
        )}
        <Overlay />
      </div>
    </section>
  )
}
