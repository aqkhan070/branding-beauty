// @ts-nocheck — ported from Glaura; store kept exact under this project's stricter TS.
import { create } from 'zustand'
import { CASES, SPREADS } from '@/data/cases'

export type OpenedImage = {
  src: string
  video?: string | undefined
  title: string
  subtitle: string
  category: string
  accent: string
  domain?: string | undefined
  description?: string | undefined
  isMobile?: boolean | undefined
  caseIndex: number
}

type BookState = {
  isOpen: boolean
  isOpening: boolean
  paused: boolean
  spreadIndex: number
  turnProgress: number
  turning: 'idle' | 'next' | 'prev'
  hoverSide: 'none' | 'left' | 'right' | 'cover'
  hoverPage: 'none' | 'left' | 'right'
  pointerNdc: { x: number; y: number }
  zoom: number
  openedImage: OpenedImage | null
  isVideoPlaying: boolean
  setIsVideoPlaying: (v: boolean) => void
  toggleVideoPlaying: () => void
  open: () => void
  close: () => void
  setOpening: (v: boolean) => void
  togglePause: () => void
  goToSpread: (index: number) => void
  nextPage: () => void
  prevPage: () => void
  setTurnProgress: (v: number) => void
  setTurning: (v: 'idle' | 'next' | 'prev') => void
  setHoverSide: (v: BookState['hoverSide']) => void
  setHoverPage: (v: BookState['hoverPage']) => void
  setPointerNdc: (x: number, y: number) => void
  setZoom: (v: number | ((prev: number) => number)) => void
  toggleZoom: () => void
  openImage: (img: OpenedImage) => void
  closeImage: () => void
  nextImage: () => void
  prevImage: () => void
  maxSpread: number
}

export const useBookStore = create<BookState>((set, get) => ({
  isOpen: false,
  isOpening: false,
  paused: false,
  spreadIndex: 0,
  turnProgress: 0,
  turning: 'idle',
  hoverSide: 'none',
  hoverPage: 'none',
  pointerNdc: { x: 0, y: 0 },
  zoom: 0,
  openedImage: null,
  isVideoPlaying: false,
  maxSpread: SPREADS.length - 1,

  setIsVideoPlaying: (v) => set({ isVideoPlaying: v }),
  toggleVideoPlaying: () => set((s) => ({ isVideoPlaying: !s.isVideoPlaying })),

  open: () => set({ isOpen: true, isOpening: true }),
  close: () =>
    set({
      isOpen: false,
      isOpening: false,
      spreadIndex: 0,
      turnProgress: 0,
      turning: 'idle',
      zoom: 0,
      openedImage: null,
      isVideoPlaying: false,
    }),
  setOpening: (v) => set({ isOpening: v }),
  togglePause: () => set((s) => ({ paused: !s.paused })),

  goToSpread: (index) => {
    const clamped = Math.max(0, Math.min(get().maxSpread, index))
    set({ spreadIndex: clamped, turnProgress: 0, turning: 'idle', isVideoPlaying: false })
  },

  nextPage: () => {
    const { spreadIndex, maxSpread, turning, isOpen, paused } = get()
    if (paused || !isOpen || turning !== 'idle' || spreadIndex >= maxSpread) return
    set({ turning: 'next', turnProgress: 0, isVideoPlaying: false })
  },

  prevPage: () => {
    const { spreadIndex, turning, isOpen, paused } = get()
    if (paused || !isOpen || turning !== 'idle') return
    if (spreadIndex <= 0) {
      get().close()
      return
    }
    set({ turning: 'prev', turnProgress: 0, isVideoPlaying: false })
  },

  setTurnProgress: (v) => set({ turnProgress: v }),
  setTurning: (v) => set({ turning: v }),
  setHoverSide: (v) => set({ hoverSide: v }),
  setHoverPage: (v) => set({ hoverPage: v }),
  setPointerNdc: (x, y) => set({ pointerNdc: { x, y } }),
  setZoom: (v) =>
    set((s) => {
      const next = typeof v === 'function' ? v(s.zoom) : v
      return { zoom: Math.max(0, Math.min(1.25, next)) }
    }),
  toggleZoom: () =>
    set((s) => ({ zoom: s.zoom > 0.4 ? 0 : 1 })),

  openImage: (img) => set({ openedImage: img, isVideoPlaying: false }),
  closeImage: () => set({ openedImage: null }),
  nextImage: () => {
    const curr = get().openedImage
    if (!curr) return
    const nextIdx = (curr.caseIndex + 1) % CASES.length
    const c = CASES[nextIdx]
    set({
      openedImage: {
        src: c.image,
        video: c.video,
        title: c.title,
        subtitle: c.subtitle,
        category: c.category,
        accent: c.accent,
        domain: c.domain,
        description: c.description,
        isMobile: c.isMobile,
        caseIndex: nextIdx,
      },
    })
  },
  prevImage: () => {
    const curr = get().openedImage
    if (!curr) return
    const prevIdx = (curr.caseIndex - 1 + CASES.length) % CASES.length
    const c = CASES[prevIdx]
    set({
      openedImage: {
        src: c.image,
        video: c.video,
        title: c.title,
        subtitle: c.subtitle,
        category: c.category,
        accent: c.accent,
        domain: c.domain,
        description: c.description,
        isMobile: c.isMobile,
        caseIndex: prevIdx,
      },
    })
  },
}))
