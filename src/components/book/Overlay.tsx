import { useEffect } from 'react'
import { useBookStore } from '@/store/bookStore'
import { CASES, SPREADS } from '@/data/cases'

export function Overlay() {
  const isOpen = useBookStore((s) => s.isOpen)
  const spreadIndex = useBookStore((s) => s.spreadIndex)
  const maxSpread = useBookStore((s) => s.maxSpread)
  const open = useBookStore((s) => s.open)
  const close = useBookStore((s) => s.close)
  const nextPage = useBookStore((s) => s.nextPage)
  const prevPage = useBookStore((s) => s.prevPage)
  const zoom = useBookStore((s) => s.zoom)
  const toggleZoom = useBookStore((s) => s.toggleZoom)
  const openedImage = useBookStore((s) => s.openedImage)
  const closeImage = useBookStore((s) => s.closeImage)
  const nextImage = useBookStore((s) => s.nextImage)
  const prevImage = useBookStore((s) => s.prevImage)
  const isVideoPlaying = useBookStore((s) => s.isVideoPlaying)
  const toggleVideoPlaying = useBookStore((s) => s.toggleVideoPlaying)

  const currentRightPage = SPREADS[spreadIndex]?.right
  const hasCurrentVideo = Boolean(currentRightPage && typeof currentRightPage !== 'string' && currentRightPage.video)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (openedImage) {
          e.preventDefault()
          closeImage()
          return
        }
        if (isOpen) {
          if (zoom > 0.15) {
            useBookStore.getState().setZoom(0)
          } else {
            close()
          }
        }
      }
      if (openedImage) {
        if (e.key === 'ArrowRight') {
          e.preventDefault()
          nextImage()
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault()
          prevImage()
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [close, closeImage, isOpen, nextImage, openedImage, prevImage, zoom])

  return (
    <div className={`overlay ${isOpen ? 'is-open' : ''}`}>
      <header className="topbar">
        <div />
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {isOpen && (
            <button
              id="close-book-btn"
              type="button"
              className="ghost-open"
              style={{ margin: 0, padding: '9px 18px' }}
              onClick={() => close()}
            >
              Close Book ✕
            </button>
          )}
        </div>
      </header>

      <div className={`hero-copy ${isOpen ? 'aside' : ''}`}>
        <h1>
          Interactive Portfolio
          <br />
          that you can explore
        </h1>
        <p className="lede">
          Click on pages to view works, hover to see how they act in motion
        </p>
        {!isOpen && (
          <button id="open-book-btn" type="button" className="ghost-open" onClick={() => open()}>
            Open Book
          </button>
        )}
      </div>

      {isOpen && (
        <div className="book-nav-dock">
          <button
            id="dock-close-btn"
            type="button"
            className="book-nav-btn"
            onClick={() => close()}
            title="Close Book"
          >
            ✕ Close
          </button>
          <button
            type="button"
            className="book-nav-btn"
            disabled={spreadIndex === 0}
            onClick={() => prevPage()}
            title="Previous Page"
          >
            <span className="arrow">←</span> Prev
          </button>

          <div className="book-nav-status">
            <span className="spread-label">
              {spreadIndex === 0
                ? 'Contents'
                : SPREADS[spreadIndex]?.right?.subtitle ||
                  (spreadIndex * 2 < 10 ? `Case 0${spreadIndex * 2}` : `Case ${spreadIndex * 2}`)}
            </span>
            <div className="spread-dots">
              {SPREADS.map((_, i) => (
                <span
                  key={i}
                  className={`dot ${i === spreadIndex ? 'active' : ''}`}
                />
              ))}
            </div>
          </div>

          <button
            type="button"
            className="book-nav-btn primary"
            disabled={spreadIndex >= maxSpread}
            onClick={() => nextPage()}
            title="Next Page"
          >
            Next <span className="arrow">→</span>
          </button>

          <button
            id="dock-zoom-btn"
            type="button"
            className={`book-nav-btn zoom-toggle ${zoom > 0.35 ? 'is-active' : ''}`}
            onClick={() => toggleZoom()}
            title={zoom > 0.35 ? 'Reset to Desk View (Scroll up / Esc)' : 'Zoom Straight to Page (Scroll down / Wheel)'}
          >
            {zoom > 0.35 ? '⊟ Desk View' : '⊞ Straight View'}
          </button>
        </div>
      )}

      {isOpen && (
        <div className="scroll-hint-pill" key={zoom > 0.35 ? 'zoomed' : 'unzoomed'}>
          <span className="hint-icon">✦</span>
          <span>{zoom > 0.35 ? 'Scroll up to zoom out · Click image to view' : 'Scroll to zoom straight · Click video to play'}</span>
        </div>
      )}

      {/* Floating Video Quick Action Pill when browsing a spread with interactive video */}
      {isOpen && hasCurrentVideo && (
        <div className="video-dock-control">
          <button
            type="button"
            className={`video-dock-btn ${isVideoPlaying ? 'is-playing' : ''}`}
            onClick={() => toggleVideoPlaying()}
            title={isVideoPlaying ? 'Pause Video on Phone' : 'Play Video on Phone'}
          >
            <span className="btn-icon">{isVideoPlaying ? '⏸' : '▶'}</span>
            <span>{isVideoPlaying ? 'Pause Video' : 'Play on Phone'}</span>
          </button>
          <button
            type="button"
            className="video-dock-btn expand"
            onClick={() => {
              if (!currentRightPage) return
              const caseIndex = CASES.findIndex((c) => c.id === currentRightPage.id)
              useBookStore.getState().openImage({
                src: currentRightPage.image,
                video: currentRightPage.video,
                title: currentRightPage.title,
                subtitle: currentRightPage.subtitle,
                category: currentRightPage.category,
                accent: currentRightPage.accent,
                domain: currentRightPage.domain,
                description: currentRightPage.description,
                isMobile: currentRightPage.isMobile,
                caseIndex: Math.max(0, caseIndex),
              })
            }}
            title="Watch High-Res Fullscreen with Audio"
          >
            ⛶ Fullscreen
          </button>
        </div>
      )}

      {/* Fullscreen High-Resolution Image/Video Lightbox Modal */}
      {openedImage && (
        <div
          className="image-lightbox-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeImage()
          }}
        >
          <div className="image-lightbox-content">
            {/* Header */}
            <div className="image-lightbox-header">
              <div className="lightbox-meta">
                <span
                  className="lightbox-tag"
                  style={{ color: openedImage.accent, borderColor: openedImage.accent + '55' }}
                >
                  ❖ {openedImage.category}
                </span>
                <h2 className="lightbox-title">{openedImage.subtitle}</h2>
                {openedImage.domain && (
                  <a
                    href={`https://${openedImage.domain}`}
                    target="_blank"
                    rel="noreferrer"
                    className="lightbox-domain"
                  >
                    🔒 {openedImage.domain} ↗
                  </a>
                )}
              </div>

              <div className="lightbox-actions">
                <span className="lightbox-counter">
                  {openedImage.caseIndex + 1} / {CASES.length}
                </span>
                <button
                  type="button"
                  className="lightbox-close-btn"
                  onClick={() => closeImage()}
                  title="Close (Esc)"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Media Container with Next/Prev Arrows */}
            <div className="image-lightbox-body">
              <button
                type="button"
                className="lightbox-nav-arrow prev"
                onClick={(e) => {
                  e.stopPropagation()
                  prevImage()
                }}
                title="Previous Image (←)"
              >
                ‹
              </button>

              <div className={`lightbox-image-wrapper ${openedImage.isMobile ? 'is-mobile' : ''}`}>
                {openedImage.video ? (
                  <video
                    src={openedImage.video}
                    controls
                    autoPlay
                    playsInline
                    loop
                    className="lightbox-video"
                  />
                ) : (
                  <img
                    src={openedImage.src}
                    alt={openedImage.subtitle}
                    className="lightbox-image"
                  />
                )}
              </div>

              <button
                type="button"
                className="lightbox-nav-arrow next"
                onClick={(e) => {
                  e.stopPropagation()
                  nextImage()
                }}
                title="Next Image (→)"
              >
                ›
              </button>
            </div>

            {/* Footer with case description */}
            <div className="image-lightbox-footer">
              <p className="lightbox-desc">{openedImage.description || openedImage.title}</p>
              <span className="lightbox-esc-hint">Press ESC or click backdrop to close · Use ← → keys to browse</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
