import { useRef, useEffect, useMemo, memo } from 'react'
import type { EntityType } from '../../core/types'

// ---------------------------------------------------------------------------
// Deterministic Seeded PRNG (SplitMix32 variant)
// ---------------------------------------------------------------------------

function seededRandom(seed: number): () => number {
  let s = seed | 0
  return () => {
    s = Math.imul(s ^ (s >>> 15), 1 | s)
    s = (s + Math.imul(s ^ (s >>> 7), 61 | s)) ^ s
    return ((s ^ (s >>> 14)) >>> 0) / 4294967296
  }
}

// ---------------------------------------------------------------------------
// Particle Data Model
// ---------------------------------------------------------------------------

interface ParticleData {
  readonly id: number
  readonly baseX: number
  readonly baseY: number
  readonly size: number
  readonly baseOpacity: number
  readonly driftDuration: number
  readonly driftDelay: number
  readonly driftAmplitudeX: number
  readonly driftAmplitudeY: number
}

function generateParticles(count: number): readonly ParticleData[] {
  const particles: ParticleData[] = []
  for (let i = 0; i < count; i++) {
    const rng = seededRandom(i * 7919 + 31)
    particles.push({
      id: i,
      baseX: rng() * 94 + 3,
      baseY: rng() * 90 + 5,
      size: 2 + rng() * 2.5,
      baseOpacity: 0.18 + rng() * 0.22,
      driftDuration: 25 + rng() * 35,
      driftDelay: -(rng() * 40),
      driftAmplitudeX: 4 + rng() * 8,
      driftAmplitudeY: 4 + rng() * 8,
    })
  }
  return particles
}

// ---------------------------------------------------------------------------
// Responsive Particle Count
// ---------------------------------------------------------------------------

function getParticleCount(): number {
  if (typeof window === 'undefined') return 28
  const w = window.innerWidth
  if (w <= 640) return 10
  if (w <= 1024) return 18
  return 28
}

// ---------------------------------------------------------------------------
// Focus-Type Position Adjustments
// Subtle atmospheric bias — the difference is felt, not seen.
// ---------------------------------------------------------------------------

function adjustPosition(
  baseX: number,
  baseY: number,
  focusType: EntityType,
  index: number,
): { x: number; y: number } {
  const rng = seededRandom(index * 1327 + 97)
  const jitter = rng() * 0.5

  switch (focusType) {
    case 'profile':
      return { x: baseX, y: baseY }
    case 'project':
      return {
        x: baseX + (50 - baseX) * 0.08,
        y: baseY + (30 - baseY) * 0.06,
      }
    case 'technology':
      return {
        x: Math.round(baseX / 12) * 12 + jitter,
        y: Math.round(baseY / 12) * 12 + jitter,
      }
    case 'skill':
      return {
        x: baseX + (40 - baseX) * 0.05,
        y: baseY + (50 - baseY) * 0.04,
      }
    case 'timeline':
      return {
        x: baseX,
        y: baseY + (50 - baseY) * 0.15,
      }
    default:
      return { x: baseX, y: baseY }
  }
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface ParticleFieldProps {
  readonly focusedEntityType: EntityType
  readonly isInspecting: boolean
  readonly isIdle: boolean
  readonly reducedMotion: boolean
  readonly pointerRef: React.RefObject<{ x: number; y: number } | null>
  readonly hoveredEntityId: string | null
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const ParticleField = memo(function ParticleField({
  focusedEntityType,
  isInspecting,
  isIdle,
  reducedMotion,
  pointerRef,
  hoveredEntityId,
}: ParticleFieldProps) {
  const count = useMemo(getParticleCount, [])
  const particles = useMemo(() => generateParticles(count), [count])
  const particleEls = useRef<(HTMLDivElement | null)[]>([])
  const rafRef = useRef(0)
  const nearState = useRef<boolean[]>(new Array(count).fill(false))

  // Adjusted positions for the current focus type
  const adjustedPositions = useMemo(
    () => particles.map((p, i) => adjustPosition(p.baseX, p.baseY, focusedEntityType, i)),
    [particles, focusedEntityType],
  )
  const positionsRef = useRef(adjustedPositions)
  positionsRef.current = adjustedPositions

  const isHoverActive = Boolean(hoveredEntityId)

  // Cursor proximity: boost opacity for nearby particles (desktop, non-reduced-motion)
  useEffect(() => {
    if (reducedMotion || (typeof window !== 'undefined' && window.innerWidth <= 640)) return

    let lastTime = 0
    const THROTTLE_MS = 50

    const update = (time: number) => {
      if (time - lastTime >= THROTTLE_MS) {
        lastTime = time
        const cursor = pointerRef.current
        const positions = positionsRef.current
        const vw = window.innerWidth
        const vh = window.innerHeight
        const near = nearState.current
        const els = particleEls.current

        for (let i = 0; i < positions.length; i++) {
          const el = els[i]
          if (!el) continue

          if (!cursor) {
            if (near[i]) {
              el.style.setProperty('--cursor-boost', '0')
              near[i] = false
            }
            continue
          }

          const pos = positions[i]
          if (!pos) continue
          const { x, y } = pos
          const px = (x / 100) * vw
          const py = (y / 100) * vh
          const dx = cursor.x - px
          const dy = cursor.y - py
          const dist = Math.sqrt(dx * dx + dy * dy)
          const isNear = dist < 120

          if (!near[i] && !isNear) continue

          if (isNear) {
            const boost = ((120 - dist) / 120) * 0.35
            el.style.setProperty('--cursor-boost', String(Math.round(boost * 1000) / 1000))
            near[i] = true
          } else {
            el.style.setProperty('--cursor-boost', '0')
            near[i] = false
          }
        }
      }
      rafRef.current = requestAnimationFrame(update)
    }

    rafRef.current = requestAnimationFrame(update)
    return () => cancelAnimationFrame(rafRef.current)
  }, [reducedMotion, pointerRef, count])

  return (
    <div className={`absolute inset-0 transition-opacity duration-500 ${isHoverActive ? 'opacity-85' : 'opacity-65'}`} aria-hidden="true">
      {particles.map((p, i) => {
        const pos = adjustedPositions[i] ?? { x: p.baseX, y: p.baseY }
        const { x, y } = pos
        const animClass = reducedMotion
          ? ''
          : isIdle
            ? 'env-particle-idle'
            : 'env-particle-drift'

        return (
          <div
            key={p.id}
            ref={(el) => { particleEls.current[i] = el }}
            className={`env-particle ${animClass}`}
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              '--base-opacity': p.baseOpacity,
              '--inspect-mult': isInspecting ? 0.5 : 1,
              '--drift-duration': `${p.driftDuration}s`,
              '--drift-delay': `${p.driftDelay}s`,
              '--drift-ax': `${p.driftAmplitudeX}px`,
              '--drift-ay': `${p.driftAmplitudeY}px`,
            } as React.CSSProperties}
          />
        )
      })}
    </div>
  )
})
