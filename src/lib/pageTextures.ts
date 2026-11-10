// @ts-nocheck — ported from Glaura; texture drawing kept exact under this project's stricter TS.
// @ts-nocheck — ported from Glaura; texture drawing kept exact under this project's stricter TS.
import * as THREE from 'three'
import type { CasePage } from '@/data/cases'
import { CONTENTS_ITEMS } from '@/data/cases'

const W = 1260
const H = 1700

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const radius = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.arcTo(x + w, y, x + w, y + h, radius)
  ctx.arcTo(x + w, y + h, x, y + h, radius)
  ctx.arcTo(x, y + h, x, y, radius)
  ctx.arcTo(x, y, x + w, y, radius)
  ctx.closePath()
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string[] {
  const words = text.split(/\s+/)
  const lines: string[] = []
  let currentLine = ''

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word
    const width = ctx.measureText(testLine).width
    if (width > maxWidth && currentLine) {
      lines.push(currentLine)
      currentLine = word
    } else {
      currentLine = testLine
    }
  }
  if (currentLine) {
    lines.push(currentLine)
  }
  return lines
}

const PAPER = '#FCF8F6'
const INK = '#2D2D2D'
const MUTED = '#6B6560'
const PEACH = '#FCEEEA'
const RULE = 'rgba(45, 45, 45, 0.12)'
const BRAND_PINK = '#D8285C'

function paintPaper(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = PAPER
  ctx.fillRect(0, 0, W, H)
  // Warm cotton grain
  for (let i = 0; i < 2800; i++) {
    ctx.fillStyle = `rgba(80, 40, 40, ${Math.random() * 0.028})`
    ctx.fillRect(Math.random() * W, Math.random() * H, 1.15, 1.15)
  }
}

function paintGutter(ctx: CanvasRenderingContext2D, isLeft: boolean) {
  if (isLeft) {
    const gutterShade = ctx.createLinearGradient(W - 150, 0, W, 0)
    gutterShade.addColorStop(0, 'rgba(80, 40, 40, 0)')
    gutterShade.addColorStop(1, 'rgba(80, 40, 40, 0.16)')
    ctx.fillStyle = gutterShade
    ctx.fillRect(W - 150, 0, 150, H)
  } else {
    const gutterShade = ctx.createLinearGradient(0, 0, 150, 0)
    gutterShade.addColorStop(0, 'rgba(80, 40, 40, 0.16)')
    gutterShade.addColorStop(1, 'rgba(80, 40, 40, 0)')
    ctx.fillStyle = gutterShade
    ctx.fillRect(0, 0, 150, H)
  }
}

function drawCtaButton(
  ctx: CanvasRenderingContext2D,
  label: string,
  x: number,
  y: number,
  accent: string,
  hovered?: boolean,
) {
  ctx.font = '600 20px "DM Sans", Inter, system-ui, sans-serif'
  const ctaText = `${label}  ↗`
  const tw = ctx.measureText(ctaText).width
  const bw = tw + 52
  const bh = 54
  roundRect(ctx, x, y - bh + 14, bw, bh, 27)
  ctx.fillStyle = hovered ? INK : accent
  ctx.fill()
  ctx.fillStyle = '#ffffff'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'
  ctx.fillText(ctaText, x + 26, y)
  return bw
}

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => {
      console.warn('Could not load image, using fallback:', src)
      resolve(null)
    }
    img.src = src
  })
}

const COVER_CREAM = '#F7F1EA'
const COVER_ROSE_GOLD = '#B88972'
const COVER_ROSE_GOLD_LIGHT = '#D4B29E'
const COVER_DUSTY_PINK = '#E4C4C4'
const COVER_DUSTY_PINK_DEEP = '#D4A8A8'
const COVER_INK = '#1A1614'
const COVER_MUTED = '#3F3834'
const COVER_SPINE = '#B85A66'

/** Knock near-black pixels out of brand assets so they sit cleanly on cream. */
function drawImageKnockoutBlack(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  dx: number,
  dy: number,
  dw: number,
  dh: number,
  srcX = 0,
  srcY = 0,
  srcW = img.width,
  srcH = img.height,
) {
  const off = document.createElement('canvas')
  off.width = Math.max(1, Math.round(dw))
  off.height = Math.max(1, Math.round(dh))
  const octx = off.getContext('2d')!
  octx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, off.width, off.height)
  const data = octx.getImageData(0, 0, off.width, off.height)
  const px = data.data
  for (let i = 0; i < px.length; i += 4) {
    const r = px[i]
    const g = px[i + 1]
    const b = px[i + 2]
    if (r < 28 && g < 28 && b < 28) {
      px[i + 3] = 0
    } else if (r < 48 && g < 48 && b < 48) {
      px[i + 3] = Math.round(px[i + 3] * ((Math.max(r, g, b) - 28) / 20))
    }
  }
  octx.putImageData(data, 0, 0)
  ctx.drawImage(off, dx, dy)
}

function paintCoverWaves(ctx: CanvasRenderingContext2D) {
  const paintCorner = (originX: number, originY: number, flipX: number, flipY: number) => {
    ctx.save()
    ctx.translate(originX, originY)
    ctx.scale(flipX, flipY)
    ctx.shadowColor = 'rgba(110, 65, 75, 0.28)'
    ctx.shadowBlur = 40
    ctx.shadowOffsetX = 10 * flipX
    ctx.shadowOffsetY = 16 * flipY

    // Flowing silk folds — stacked S-curves sweeping in from the corner
    const bands: Array<{ y0: number; amp: number; thick: number; color: string; alpha: number }> = [
      { y0: 40, amp: 70, thick: 95, color: COVER_DUSTY_PINK_DEEP, alpha: 0.98 },
      { y0: 110, amp: 85, thick: 88, color: '#E8C9C9', alpha: 0.92 },
      { y0: 175, amp: 95, thick: 80, color: '#F2DCDC', alpha: 0.88 },
      { y0: 245, amp: 70, thick: 72, color: COVER_DUSTY_PINK, alpha: 0.84 },
      { y0: 310, amp: 55, thick: 64, color: '#F6E4E4', alpha: 0.78 },
    ]

    for (const band of bands) {
      ctx.globalAlpha = band.alpha
      const grad = ctx.createLinearGradient(0, band.y0, 520, band.y0 + 200)
      grad.addColorStop(0, band.color)
      grad.addColorStop(0.65, band.color)
      grad.addColorStop(1, 'rgba(247, 241, 234, 0)')
      ctx.fillStyle = grad

      ctx.beginPath()
      ctx.moveTo(0, band.y0)
      ctx.bezierCurveTo(90, band.y0 - band.amp, 200, band.y0 + band.amp * 0.6, 320, band.y0 + 20)
      ctx.bezierCurveTo(400, band.y0 - 10, 480, band.y0 + band.amp * 0.35, 560, band.y0 + 40)
      ctx.lineTo(560, band.y0 + band.thick)
      ctx.bezierCurveTo(
        480,
        band.y0 + band.thick + band.amp * 0.25,
        400,
        band.y0 + band.thick - 20,
        320,
        band.y0 + band.thick + 10,
      )
      ctx.bezierCurveTo(
        200,
        band.y0 + band.thick + band.amp * 0.5,
        90,
        band.y0 + band.thick - band.amp * 0.4,
        0,
        band.y0 + band.thick + 30,
      )
      ctx.closePath()
      ctx.fill()
    }

    // Soft highlight edge on the nearest fold
    ctx.globalAlpha = 0.35
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(0, 130)
    ctx.bezierCurveTo(100, 60, 220, 180, 340, 120)
    ctx.stroke()

    ctx.restore()
  }

  paintCorner(0, 0, 1, 1)
  paintCorner(W, H, -1, -1)
}

function fillSpacedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  tracking: number,
) {
  const chars = text.split('')
  const widths = chars.map((ch) => ctx.measureText(ch).width)
  const total = widths.reduce((sum, w, i) => sum + w + (i > 0 ? tracking : 0), 0)
  let cursor = x - total / 2
  const prevAlign = ctx.textAlign
  ctx.textAlign = 'left'
  for (let i = 0; i < chars.length; i++) {
    ctx.fillText(chars[i], cursor, y)
    cursor += widths[i] + tracking
  }
  ctx.textAlign = prevAlign
}

function paintCoverTypography(ctx: CanvasRenderingContext2D) {
  const cx = W / 2

  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  // Main title — near-black serif for clear cream contrast
  ctx.fillStyle = COVER_INK
  ctx.font = '600 72px "Playfair Display", Georgia, "Times New Roman", serif'
  ctx.fillText('Beauty meets', cx, H * 0.445)
  ctx.fillText('intelligence.', cx, H * 0.445 + 84)

  // Secondary branding — wide tracked caps
  ctx.fillStyle = COVER_MUTED
  ctx.font = '700 20px "DM Sans", Inter, system-ui, sans-serif'
  fillSpacedText(ctx, 'THE GLAURA EXPERIENCE', cx, H * 0.6, 8)

  // Tagline
  ctx.fillStyle = COVER_MUTED
  ctx.font = 'italic 500 26px "Playfair Display", Georgia, "Times New Roman", serif'
  ctx.fillText('Discover. Book. Connect.', cx, H * 0.665)
}

function paintCoverWordmark(ctx: CanvasRenderingContext2D, cx: number, y: number) {
  // Match the horizontal brand wordmark: lowercase DM Sans with pink→coral gradient
  ctx.save()
  ctx.font = '600 56px "DM Sans", Inter, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  const label = 'glaura'
  const tw = ctx.measureText(label).width
  const grad = ctx.createLinearGradient(cx - tw / 2, y, cx + tw / 2, y)
  grad.addColorStop(0, '#E23B6D')
  grad.addColorStop(0.55, '#E85A55')
  grad.addColorStop(1, '#F0784A')
  ctx.fillStyle = grad
  ctx.fillText(label, cx, y)
  ctx.restore()
}

function paintCoverBrandFallback(ctx: CanvasRenderingContext2D) {
  const cx = W / 2
  paintCoverWordmark(ctx, cx, H * 0.22)
}

function paintCoverBrandLogos(
  ctx: CanvasRenderingContext2D,
  icon: HTMLImageElement | null,
  horizontal: HTMLImageElement | null,
) {
  const cx = W / 2
  // Cover reference lockup: brand mark above wordmark (same assets/style as navbar)
  const brandTop = H * 0.155

  if (icon) {
    const iconH = 120
    const iconW = (icon.width / icon.height) * iconH
    drawImageKnockoutBlack(ctx, icon, cx - iconW / 2, brandTop, iconW, iconH)
    paintCoverWordmark(ctx, cx, brandTop + iconH + 44)
    return
  }

  if (horizontal) {
    const logoW = 440
    const logoH = (horizontal.height / horizontal.width) * logoW
    drawImageKnockoutBlack(ctx, horizontal, cx - logoW / 2, brandTop + 16, logoW, logoH)
    return
  }

  paintCoverBrandFallback(ctx)
}

function paintCoverFrame(ctx: CanvasRenderingContext2D) {
  // Outer plate edge — soft shadow that reads as a physical cover panel
  const plate = 28
  ctx.save()
  ctx.shadowColor = 'rgba(70, 40, 35, 0.18)'
  ctx.shadowBlur = 18
  ctx.shadowOffsetX = 0
  ctx.shadowOffsetY = 2
  ctx.strokeStyle = 'rgba(180, 140, 120, 0.35)'
  ctx.lineWidth = 1.5
  ctx.strokeRect(plate, plate, W - plate * 2, H - plate * 2)
  ctx.restore()

  // Primary rose-gold metallic border (inset frame)
  const inset = 58
  const frameW = W - inset * 2
  const frameH = H - inset * 2

  // Warm metallic fill line
  const metal = ctx.createLinearGradient(inset, inset, inset + frameW, inset + frameH)
  metal.addColorStop(0, COVER_ROSE_GOLD_LIGHT)
  metal.addColorStop(0.35, COVER_ROSE_GOLD)
  metal.addColorStop(0.7, '#A8735E')
  metal.addColorStop(1, COVER_ROSE_GOLD_LIGHT)

  ctx.strokeStyle = metal
  ctx.lineWidth = 3.25
  ctx.strokeRect(inset, inset, frameW, frameH)

  // Inner hairline for a printed-cover double rule
  ctx.strokeStyle = 'rgba(168, 115, 94, 0.55)'
  ctx.lineWidth = 1.15
  ctx.strokeRect(inset + 9, inset + 9, frameW - 18, frameH - 18)

  // Soft highlight on the outer rule (top/left catch light)
  ctx.strokeStyle = 'rgba(255, 240, 230, 0.45)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(inset, inset + frameH)
  ctx.lineTo(inset, inset)
  ctx.lineTo(inset + frameW, inset)
  ctx.stroke()
}

/**
 * Front hardcover face — uses the authored public/book-cover.png asset.
 * Starts with a sync cream/pink canvas so the first frame never flashes black
 * while the PNG loads.
 */
export function createCoverTexture(): THREE.Texture {
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')!

  // Immediate pink/cream cover matching the authored asset (no black flash)
  ctx.fillStyle = COVER_CREAM
  ctx.fillRect(0, 0, W, H)
  ctx.fillStyle = COVER_SPINE
  ctx.fillRect(0, 0, 36, H)
  paintCoverWaves(ctx)
  paintCoverFrame(ctx)
  paintCoverBrandFallback(ctx)
  paintCoverTypography(ctx)

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8

  new THREE.TextureLoader().load('/book-cover.png', (loaded) => {
    ctx.clearRect(0, 0, W, H)
    ctx.drawImage(loaded.image as CanvasImageSource, 0, 0, W, H)
    tex.needsUpdate = true
    loaded.dispose()
  })

  return tex
}

/**
 * Editorial contents page — logo, "Contents", two-column case index.
 * Contents is on the LEFT page (Verso), so the spine is on the right edge.
 */
export function createContentsTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')!
  paintPaper(ctx)
  paintGutter(ctx, true)

  // Header Brand & Folio
  ctx.fillStyle = BRAND_PINK
  ctx.beginPath()
  ctx.arc(96, 80, 11, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = PAPER
  ctx.beginPath()
  ctx.arc(96, 80, 5, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = BRAND_PINK
  ctx.beginPath()
  ctx.arc(98, 79, 2, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = BRAND_PINK
  ctx.font = '700 28px "DM Sans", Inter, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'
  ctx.fillText('glaura', 122, 80)

  // Top Right Running Head (safely away from spine)
  ctx.fillStyle = MUTED
  ctx.font = '600 15px "DM Sans", Inter, system-ui, sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText('CONTENTS  ·  2026 EDITION', W - 170, 80)

  // Large Editorial Headline
  ctx.fillStyle = INK
  ctx.font = '700 78px "DM Sans", Inter, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'
  ctx.fillText('Contents', 90, 215)

  ctx.fillStyle = MUTED
  ctx.font = '500 22px "DM Sans", Inter, system-ui, sans-serif'
  ctx.fillText(`${CONTENTS_ITEMS.length} selected works  ·  beauty tech & salon ecosystem`, 90, 258)

  // Separator line
  ctx.strokeStyle = RULE
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(90, 288)
  ctx.lineTo(W - 160, 288)
  ctx.stroke()

  // Two-column contents table
  const colX = [90, 620]
  const startY = 345
  const rowH = 118
  const perCol = Math.ceil(CONTENTS_ITEMS.length / 2) // 7

  CONTENTS_ITEMS.forEach((item, i) => {
    const col = i < perCol ? 0 : 1
    const row = i < perCol ? i : i - perCol
    const x = colX[col]
    const y = startY + row * rowH

    // Page number in warm accent
    ctx.fillStyle = BRAND_PINK
    ctx.font = '700 20px "DM Sans", Inter, system-ui, sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText(item.page, x, y)

    // Case Title
    ctx.fillStyle = INK
    ctx.font = '700 25px "DM Sans", Inter, system-ui, sans-serif'
    ctx.fillText(item.name, x + 54, y)

    // Category tag
    ctx.fillStyle = MUTED
    ctx.font = '600 13px "DM Sans", Inter, system-ui, sans-serif'
    ctx.fillText(item.category, x + 54, y + 22)

    // Description line
    if (item.desc) {
      ctx.fillStyle = '#7A746E'
      ctx.font = '400 15px "DM Sans", Inter, system-ui, sans-serif'
      ctx.fillText(item.desc, x + 54, y + 46)
    }

    // Subtle divider line under row
    ctx.strokeStyle = 'rgba(45, 45, 45, 0.06)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(x, y + 62)
    ctx.lineTo(x + 440, y + 62)
    ctx.stroke()
  })

  // Right column bottom: Studio Colophon Card (placed neatly under column 1)
  const colophonX = 620
  const colophonY = startY + (perCol - 1) * rowH
  roundRect(ctx, colophonX, colophonY - 14, 460, 160, 16)
  ctx.fillStyle = PEACH
  ctx.fill()

  ctx.fillStyle = INK
  ctx.font = '700 15px "DM Sans", Inter, system-ui, sans-serif'
  ctx.fillText('GLAURA DESIGN SYSTEMS', colophonX + 24, colophonY + 20)

  ctx.fillStyle = MUTED
  ctx.font = '400 15px "DM Sans", Inter, system-ui, sans-serif'
  ctx.fillText('Interactive portfolio showcasing beauty booking,', colophonX + 24, colophonY + 48)
  ctx.fillText('autonomous salon AI, and customized flagships.', colophonX + 24, colophonY + 72)

  ctx.fillStyle = '#9A938C'
  ctx.font = '500 13px "DM Sans", Inter, system-ui, sans-serif'
  ctx.fillText('PARIS  ·  NEW YORK  ·  2026', colophonX + 24, colophonY + 110)

  // Editorial Footer
  ctx.fillStyle = '#9A938C'
  ctx.font = '600 15px "DM Sans", Inter, system-ui, sans-serif'
  ctx.fillText('GLAURA DESIGN STUDIO', 90, H - 75)
  ctx.textAlign = 'right'
  ctx.fillText('CLICK A CASE TO TURN TO SPREAD ↗', W - 170, H - 75)
  ctx.textAlign = 'left'

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

/**
 * Cream editorial case-study page — warm paper, dark type, large product visual, pink CTA.
 * Respects page side so spine gutter shadows and margins stay correct.
 * Preserves phoneBounds for video playback overlay.
 */
export async function createCaseTexture(
  page: CasePage,
  options?: { hovered?: boolean; side?: 'left' | 'right' },
): Promise<THREE.CanvasTexture> {
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')!

  const side = options?.side ?? 'right'
  const isLeft = side === 'left'
  const accent = page.accent || BRAND_PINK

  paintPaper(ctx)
  paintGutter(ctx, isLeft)

  // Usable content boundaries (strictly avoiding the book spine gutter fold)
  const xLeft = isLeft ? 88 : 158
  const xRight = isLeft ? W - 158 : W - 88
  const contentWidth = xRight - xLeft

  // 1. Eyebrow: "04 / AI ASSISTANT"
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = accent
  ctx.font = '600 17px "DM Sans", Inter, system-ui, sans-serif'
  ctx.fillText(`${page.pageNumber}  /  ${page.category}`, xLeft, 78)

  // Thin rule under header
  ctx.strokeStyle = RULE
  ctx.lineWidth = 1.25
  ctx.beginPath()
  ctx.moveTo(xLeft, 108)
  ctx.lineTo(xRight, 108)
  ctx.stroke()

  // 2. Headline
  ctx.textBaseline = 'alphabetic'
  ctx.fillStyle = INK
  ctx.font =
    page.headlineStyle === 'serif'
      ? '600 46px Georgia, "Times New Roman", serif'
      : '700 44px "DM Sans", Inter, system-ui, sans-serif'

  const titleLines = page.title.split('\n')
  let curY = 168
  titleLines.forEach((tl) => {
    ctx.fillText(tl, xLeft, curY)
    curY += 54
  })

  // 3. Description
  curY += 10
  ctx.fillStyle = MUTED
  ctx.font = '400 22px "DM Sans", Inter, system-ui, sans-serif'
  const descLines = wrapText(ctx, page.description, contentWidth - 20)
  descLines.slice(0, 3).forEach((dl) => {
    ctx.fillText(dl, xLeft, curY)
    curY += 32
  })

  const img = await loadImage(page.image)
  let phoneBounds: { x: number; y: number; w: number; h: number } | undefined

  // CTA + folio reserved at bottom
  const ctaY = H - 110
  const visualTop = Math.max(curY + 36, 390)
  const visualBottom = ctaY - 48
  const visualBudget = Math.max(420, visualBottom - visualTop)

  // Soft peach wash behind the product stage (after copy so title stays on cream)
  roundRect(ctx, xLeft - 18, visualTop - 28, contentWidth + 36, visualBudget + 56, 28)
  ctx.fillStyle = PEACH
  ctx.fill()

  if (page.isMobile) {
    // ==========================================
    // MOBILE LAYOUT — large phone, soft shadow
    // ==========================================
    const phoneW = Math.min(620, contentWidth - 40)
    const imgRatio = img ? img.width / img.height : 0.55
    let phoneH = Math.round(phoneW / imgRatio)
    let phoneWFinal = phoneW
    if (phoneH > visualBudget) {
      phoneH = visualBudget
      phoneWFinal = Math.round(phoneH * imgRatio)
    }
    const phoneX = xLeft + Math.round((contentWidth - phoneWFinal) / 2)
    const phoneY = visualTop + Math.round((visualBudget - phoneH) / 2)
    phoneBounds = { x: phoneX, y: phoneY, w: phoneWFinal, h: phoneH }

    ctx.save()
    ctx.shadowColor = 'rgba(80, 30, 40, 0.22)'
    ctx.shadowBlur = 48
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 22

    roundRect(ctx, phoneX - 5, phoneY - 5, phoneWFinal + 10, phoneH + 10, 38)
    ctx.fillStyle = '#1a1a1c'
    ctx.fill()
    ctx.restore()

    roundRect(ctx, phoneX - 5, phoneY - 5, phoneWFinal + 10, phoneH + 10, 38)
    ctx.strokeStyle = 'rgba(45, 45, 45, 0.12)'
    ctx.lineWidth = 1.5
    ctx.stroke()

    ctx.save()
    roundRect(ctx, phoneX, phoneY, phoneWFinal, phoneH, 34)
    ctx.clip()

    if (img) {
      ctx.drawImage(img, 0, 0, img.width, img.height, phoneX, phoneY, phoneWFinal, phoneH)
    } else {
      ctx.fillStyle = '#f3ebe7'
      ctx.fillRect(phoneX, phoneY, phoneWFinal, phoneH)
    }

    roundRect(ctx, phoneX + phoneWFinal / 2 - 48, phoneY + 10, 96, 20, 10)
    ctx.fillStyle = '#0c0c0e'
    ctx.fill()
    ctx.restore()
  } else {
    // ==========================================
    // DESKTOP / WEB LAYOUT — large browser frame
    // ==========================================
    const barH = 42
    const cropTop = page.cropTop ?? 0
    const cropBottom = page.cropBottom ?? (page.image.includes('/cases/sp/') ? 48 : 0)
    const srcY = cropTop
    const srcH = Math.max(100, (img ? img.height : 920) - cropTop - cropBottom)
    const srcW = img ? img.width : 1920
    const imgRatio = srcW / srcH

    let frameW = contentWidth
    let imgH = Math.round(frameW / imgRatio)
    let totalFrameH = barH + imgH
    if (totalFrameH > visualBudget) {
      totalFrameH = visualBudget
      imgH = totalFrameH - barH
      frameW = Math.round(imgH * imgRatio)
      frameW = Math.min(frameW, contentWidth)
      imgH = Math.round(frameW / imgRatio)
      totalFrameH = barH + imgH
    }

    const frameX = xLeft + Math.round((contentWidth - frameW) / 2)
    const frameY = visualTop + Math.round((visualBudget - totalFrameH) / 2)

    ctx.save()
    ctx.shadowColor = 'rgba(80, 30, 40, 0.2)'
    ctx.shadowBlur = 44
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 20

    roundRect(ctx, frameX, frameY, frameW, totalFrameH, 18)
    ctx.fillStyle = '#ffffff'
    ctx.fill()
    ctx.restore()

    roundRect(ctx, frameX, frameY, frameW, totalFrameH, 18)
    ctx.strokeStyle = 'rgba(45, 45, 45, 0.1)'
    ctx.lineWidth = 1.25
    ctx.stroke()

    ctx.save()
    roundRect(ctx, frameX, frameY, frameW, totalFrameH, 18)
    ctx.clip()

    // Light browser chrome
    ctx.fillStyle = '#F5F0EC'
    ctx.fillRect(frameX, frameY, frameW, barH)

    const dotY = frameY + barH / 2
    ctx.fillStyle = '#FF5F56'
    ctx.beginPath()
    ctx.arc(frameX + 24, dotY, 5.5, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#FFBD2E'
    ctx.beginPath()
    ctx.arc(frameX + 42, dotY, 5.5, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#27C93F'
    ctx.beginPath()
    ctx.arc(frameX + 60, dotY, 5.5, 0, Math.PI * 2)
    ctx.fill()

    const urlW = Math.min(380, frameW - 160)
    const urlX = frameX + (frameW - urlW) / 2
    roundRect(ctx, urlX, frameY + 8, urlW, 26, 13)
    ctx.fillStyle = '#ffffff'
    ctx.fill()
    ctx.strokeStyle = 'rgba(45, 45, 45, 0.08)'
    ctx.lineWidth = 1
    ctx.stroke()

    ctx.fillStyle = MUTED
    ctx.font = '500 13px "DM Sans", Inter, system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(page.domain, urlX + urlW / 2, frameY + 21)

    if (img) {
      ctx.drawImage(img, 0, srcY, srcW, srcH, frameX, frameY + barH, frameW, imgH)
    } else {
      ctx.fillStyle = '#f7f1ed'
      ctx.fillRect(frameX, frameY + barH, frameW, imgH)
    }

    ctx.restore()
  }

  // Branded pink CTA
  drawCtaButton(ctx, page.cta, xLeft, ctaY, accent, options?.hovered)

  // Running bottom folio
  ctx.fillStyle = '#9A938C'
  ctx.font = '500 14px "DM Sans", Inter, system-ui, sans-serif'
  ctx.textBaseline = 'middle'
  if (isLeft) {
    ctx.textAlign = 'left'
    ctx.fillText(`PAGE ${page.pageNumber}  ·  GLAURA`, xLeft, H - 48)
  } else {
    ctx.textAlign = 'right'
    ctx.fillText(`GLAURA  ·  PAGE ${page.pageNumber}`, xRight, H - 48)
  }

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  tex.userData = {
    canvas,
    ctx,
    phoneBounds,
    img,
    page,
  }
  return tex
}

export function drawVideoToPageTexture(
  texture: THREE.CanvasTexture,
  video: HTMLVideoElement,
) {
  const meta = texture.userData as {
    canvas: HTMLCanvasElement
    ctx: CanvasRenderingContext2D
    phoneBounds?: { x: number; y: number; w: number; h: number }
  }
  if (!meta || !meta.phoneBounds || !meta.ctx) return

  const { x, y, w, h } = meta.phoneBounds
  const ctx = meta.ctx

  ctx.save()
  roundRect(ctx, x, y, w, h, 34)
  ctx.clip()

  // Draw current video frame scaled into the mobile phone viewport
  if (video.videoWidth > 0 && video.videoHeight > 0) {
    ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight, x, y, w, h)
  }

  // Dynamic Island pill cutout over video
  roundRect(ctx, x + w / 2 - 48, y + 10, 96, 20, 10)
  ctx.fillStyle = '#0c0c0e'
  ctx.fill()

  ctx.restore()
  texture.needsUpdate = true
}

export function restoreThumbnailToPageTexture(texture: THREE.CanvasTexture) {
  const meta = texture.userData as {
    canvas: HTMLCanvasElement
    ctx: CanvasRenderingContext2D
    phoneBounds?: { x: number; y: number; w: number; h: number }
    img?: HTMLImageElement | null
    page?: CasePage
  }
  if (!meta || !meta.phoneBounds || !meta.ctx) return

  const { x, y, w, h } = meta.phoneBounds
  const ctx = meta.ctx

  ctx.save()
  roundRect(ctx, x, y, w, h, 34)
  ctx.clip()

  if (meta.img) {
    ctx.drawImage(meta.img, 0, 0, meta.img.width, meta.img.height, x, y, w, h)
  } else {
    ctx.fillStyle = '#f3ebe7'
    ctx.fillRect(x, y, w, h)
  }

  // Dynamic Island cutout
  roundRect(ctx, x + w / 2 - 48, y + 10, 96, 20, 10)
  ctx.fillStyle = '#0c0c0e'
  ctx.fill()

  ctx.restore()
  texture.needsUpdate = true
}

export function createBlankTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')!
  paintPaper(ctx)
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

/**
 * Temporary full-page image texture for book pages.
 * Fits `/images/pageN.png` inside a page-aspect canvas with aspect preserved
 * (no stretch); paper fills any letterbox margins. Canvas is sized from the
 * source so the PNG is never upscaled before GPU upload.
 */
export async function createPageImageTexture(
  pageNumber: number,
): Promise<THREE.CanvasTexture> {
  const pageAspect = W / H
  const img = await loadImage(`/images/page${pageNumber}.png`)

  // Prefer native width when the image is wider than the page plane; otherwise
  // prefer native height — always keep page aspect and never upscale.
  let canvasW = W
  let canvasH = H
  if (img && img.width > 0 && img.height > 0) {
    const byWidthH = Math.round(img.width / pageAspect)
    if (byWidthH >= img.height) {
      canvasW = img.width
      canvasH = byWidthH
    } else {
      canvasH = img.height
      canvasW = Math.round(img.height * pageAspect)
    }
  }

  const canvas = document.createElement('canvas')
  canvas.width = canvasW
  canvas.height = canvasH
  const ctx = canvas.getContext('2d')!

  // Local paper fill (same color as paintPaper) for letterbox margins
  ctx.fillStyle = PAPER
  ctx.fillRect(0, 0, canvasW, canvasH)

  if (img) {
    const scale = Math.min(canvasW / img.width, canvasH / img.height)
    const dw = Math.round(img.width * scale)
    const dh = Math.round(img.height * scale)
    const dx = Math.round((canvasW - dw) / 2)
    const dy = Math.round((canvasH - dh) / 2)
    // 1:1 or downscale only — crisp pixels when scale === 1
    ctx.imageSmoothingEnabled = scale < 1
    if (scale < 1) ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(img, dx, dy, dw, dh)
  }

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  tex.generateMipmaps = false
  tex.minFilter = THREE.LinearFilter
  tex.magFilter = THREE.LinearFilter
  return tex
}
