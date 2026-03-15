import { useState, useRef, useEffect, useCallback } from 'react'
import './VTT.css'

const MIN_ZOOM = 0.25
const MAX_ZOOM = 4
const ZOOM_STEP = 0.1

const VTT_GRID_KEY = 'vtt_grid'

function loadGridSettings() {
  try {
    const saved = localStorage.getItem(VTT_GRID_KEY)
    if (saved) return JSON.parse(saved)
  } catch { /* ignore */ }
  return null
}

function VTT({ mapSrc }) {
  const [, forceRender] = useState(0)
  const saved = useRef(loadGridSettings())
  const [gridW, setGridW] = useState(saved.current?.gridW ?? 20)
  const [gridH, setGridH] = useState(saved.current?.gridH ?? 20)
  const [gridLinked, setGridLinked] = useState(saved.current?.gridLinked ?? true)
  const [gridDecoupled, setGridDecoupled] = useState(false)
  const [gridOffset, setGridOffset] = useState(saved.current?.gridOffset ?? { x: 0, y: 0 })
  const [gridColor, setGridColor] = useState(saved.current?.gridColor ?? '#ffffff')
  const [gridOpacity, setGridOpacity] = useState(saved.current?.gridOpacity ?? 0.15)
  const [gridThickness, setGridThickness] = useState(saved.current?.gridThickness ?? 1)
  const [showGridPanel, setShowGridPanel] = useState(false)

  // Persist grid settings
  useEffect(() => {
    localStorage.setItem(VTT_GRID_KEY, JSON.stringify({
      gridW, gridH, gridLinked, gridOffset, gridColor, gridOpacity, gridThickness,
    }))
  }, [gridW, gridH, gridLinked, gridOffset, gridColor, gridOpacity, gridThickness])

  const handleGridW = (val) => {
    const v = Number(val)
    if (gridLinked) { setGridW(v); setGridH(v) }
    else setGridW(v)
  }

  const handleGridH = (val) => {
    const v = Number(val)
    if (gridLinked) { setGridW(v); setGridH(v) }
    else setGridH(v)
  }

  const decoupledAlpha = () => {
    const alpha = gridDecoupled ? Math.max(gridOpacity, 0.5) : gridOpacity
    return Math.round(alpha * 255).toString(16).padStart(2, '0')
  }

  const panTimerRef = useRef(null)

  const startPan = (dx, dy) => {
    const step = () => {
      panRef.current = {
        x: panRef.current.x + dx,
        y: panRef.current.y + dy,
      }
      applyTransformRef.current()
      panTimerRef.current = requestAnimationFrame(step)
    }
    step()
  }

  const stopPan = () => {
    if (panTimerRef.current) {
      cancelAnimationFrame(panTimerRef.current)
      panTimerRef.current = null
    }
    forceRender((n) => n + 1)
  }

  const zoomTimerRef = useRef(null)
  const zoomFrameCount = useRef(0)

  const startZoom = (direction) => {
    zoomFrameCount.current = 0
    const step = () => {
      zoomFrameCount.current++
      // Only zoom every few frames to keep it smooth but not too fast
      if (zoomFrameCount.current % 6 === 0) {
        const newZoom = direction > 0
          ? Math.min(MAX_ZOOM, zoomRef.current + ZOOM_STEP)
          : Math.max(MIN_ZOOM, zoomRef.current - ZOOM_STEP)
        zoomTo(newZoom)
      }
      zoomTimerRef.current = requestAnimationFrame(step)
    }
    // Fire once immediately
    const newZoom = direction > 0
      ? Math.min(MAX_ZOOM, zoomRef.current + ZOOM_STEP)
      : Math.max(MIN_ZOOM, zoomRef.current - ZOOM_STEP)
    zoomTo(newZoom)
    zoomTimerRef.current = requestAnimationFrame(step)
  }

  const stopZoom = () => {
    if (zoomTimerRef.current) {
      cancelAnimationFrame(zoomTimerRef.current)
      zoomTimerRef.current = null
    }
  }

  const zoomRef = useRef(1)
  const panRef = useRef({ x: 0, y: 0 })
  const viewportRef = useRef(null)
  const canvasRef = useRef(null)
  const gridRef = useRef(null)
  const dragging = useRef(false)
  const dragStart = useRef({ x: 0, y: 0 })
  const panStart = useRef({ x: 0, y: 0 })
  const gridDragging = useRef(false)
  const gridDragStart = useRef({ x: 0, y: 0 })
  const gridOffsetStart = useRef({ x: 0, y: 0 })
  const gridDecoupledRef = useRef(false)

  // Keep ref in sync
  useEffect(() => {
    gridDecoupledRef.current = gridDecoupled
  }, [gridDecoupled])

  const applyTransformRef = useRef(null)
  const applyTransform = useCallback(() => {
    const el = canvasRef.current
    if (!el) return
    const { x, y } = panRef.current
    const z = zoomRef.current
    el.style.transform = `translate(${x}px, ${y}px) scale(${z})`
  }, [])
  applyTransformRef.current = applyTransform

  const render = useCallback(() => {
    applyTransform()
    forceRender((n) => n + 1)
  }, [applyTransform])

  const zoomTo = (newZoom) => {
    const vp = viewportRef.current
    if (!vp) return
    const prevZoom = zoomRef.current
    if (newZoom === prevZoom) return
    const cx = vp.clientWidth / 2
    const cy = vp.clientHeight / 2
    const ratio = newZoom / prevZoom
    panRef.current = {
      x: cx - (cx - panRef.current.x) * ratio,
      y: cy - (cy - panRef.current.y) * ratio,
    }
    zoomRef.current = newZoom
    applyTransform()
    forceRender((n) => n + 1)
  }

  // Center the map when it loads
  const onMapLoad = useCallback((e) => {
    const img = e.target
    const vp = viewportRef.current
    if (!vp) return
    panRef.current = {
      x: (vp.clientWidth - img.naturalWidth) / 2,
      y: (vp.clientHeight - img.naturalHeight) / 2,
    }
    render()
  }, [render])

  // Drag to pan (map or grid depending on mode)
  useEffect(() => {
    const vp = viewportRef.current
    if (!vp) return

    const onMouseDown = (e) => {
      if (gridDecoupledRef.current) {
        gridDragging.current = true
        gridDragStart.current = { x: e.clientX, y: e.clientY }
        gridOffsetStart.current = { ...gridOffset }
      } else {
        dragging.current = true
        dragStart.current = { x: e.clientX, y: e.clientY }
        panStart.current = { ...panRef.current }
      }
    }

    const onMouseMove = (e) => {
      if (dragging.current) {
        panRef.current = {
          x: panStart.current.x + (e.clientX - dragStart.current.x),
          y: panStart.current.y + (e.clientY - dragStart.current.y),
        }
        applyTransform()
      }
      if (gridDragging.current) {
        const zoom = zoomRef.current
        setGridOffset({
          x: gridOffsetStart.current.x + (e.clientX - gridDragStart.current.x) / zoom,
          y: gridOffsetStart.current.y + (e.clientY - gridDragStart.current.y) / zoom,
        })
      }
    }

    const onMouseUp = () => {
      dragging.current = false
      gridDragging.current = false
    }

    vp.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)

    return () => {
      vp.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [applyTransform, gridOffset])

  // Scroll to zoom (centered on cursor)
  useEffect(() => {
    const vp = viewportRef.current
    if (!vp) return

    const onWheel = (e) => {
      e.preventDefault()
      if (gridDecoupledRef.current) return // disable zoom while adjusting grid

      const rect = vp.getBoundingClientRect()
      const cursorX = e.clientX - rect.left
      const cursorY = e.clientY - rect.top

      const prevZoom = zoomRef.current
      const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP
      const newZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, prevZoom + delta))
      const ratio = newZoom / prevZoom

      panRef.current = {
        x: cursorX - (cursorX - panRef.current.x) * ratio,
        y: cursorY - (cursorY - panRef.current.y) * ratio,
      }
      zoomRef.current = newZoom
      render()
    }

    vp.addEventListener('wheel', onWheel, { passive: false })
    return () => vp.removeEventListener('wheel', onWheel)
  }, [render])

  const zoomPct = Math.round(zoomRef.current * 100)

  return (
    <div className="vtt">
      <div className="vtt-toolbar">
        <button
          className={`vtt-grid-lock-btn${showGridPanel ? ' vtt-link-active' : ''}`}
          onClick={() => setShowGridPanel(!showGridPanel)}
        >
          {showGridPanel ? 'Hide Grid Controls' : 'Show Grid Controls'}
        </button>
      </div>
      {showGridPanel && (
        <div className="vtt-grid-panel">
          <div className="vtt-grid-panel-row">
            <label className="vtt-toolbar-label">Width</label>
            <button className="vtt-fine-btn" onClick={() => handleGridW(Math.max(5, gridW - 1))}>-</button>
            <input
              type="range"
              min="5"
              max="100"
              step="1"
              value={gridW}
              onChange={(e) => handleGridW(e.target.value)}
            />
            <button className="vtt-fine-btn" onClick={() => handleGridW(Math.min(100, gridW + 1))}>+</button>
            <span className="vtt-grid-panel-val">{gridW}px</span>
          </div>
          <div className="vtt-grid-panel-row">
            <label className="vtt-toolbar-label">Height</label>
            <button className="vtt-fine-btn" onClick={() => handleGridH(Math.max(5, gridH - 1))}>-</button>
            <input
              type="range"
              min="5"
              max="100"
              step="1"
              value={gridH}
              onChange={(e) => handleGridH(e.target.value)}
            />
            <button className="vtt-fine-btn" onClick={() => handleGridH(Math.min(100, gridH + 1))}>+</button>
            <span className="vtt-grid-panel-val">{gridH}px</span>
          </div>
          <div className="vtt-grid-panel-row">
            <button
              className={`vtt-link-btn${gridLinked ? ' vtt-link-active' : ''}`}
              onClick={() => setGridLinked(!gridLinked)}
              title={gridLinked ? 'Unlink W/H' : 'Link W/H'}
            >
              {gridLinked ? '\u{1F517}' : '\u2E2F'}
            </button>
            <span className="vtt-toolbar-label">{gridLinked ? 'Linked' : 'Independent'}</span>
          </div>
          <div className="vtt-grid-panel-divider" />
          <div className="vtt-grid-panel-row">
            <label className="vtt-toolbar-label">Colour</label>
            <input
              type="color"
              className="vtt-color-picker"
              value={gridColor}
              onChange={(e) => setGridColor(e.target.value)}
            />
            <label className="vtt-toolbar-label">Opacity</label>
            <input
              type="range"
              min="5"
              max="100"
              step="5"
              value={Math.round(gridOpacity * 100)}
              onChange={(e) => setGridOpacity(Number(e.target.value) / 100)}
            />
          </div>
          <div className="vtt-grid-panel-row">
            <label className="vtt-toolbar-label">Thickness</label>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={gridThickness}
              onChange={(e) => setGridThickness(Number(e.target.value))}
            />
            <span className="vtt-grid-panel-val">{gridThickness}px</span>
          </div>
          <div className="vtt-grid-panel-divider" />
          <div className="vtt-grid-panel-row">
            <button
              className={`vtt-grid-lock-btn${gridDecoupled ? ' vtt-grid-decoupled' : ''}`}
              onClick={() => setGridDecoupled(!gridDecoupled)}
              title={gridDecoupled ? 'Lock grid to map' : 'Decouple grid from map'}
            >
              {gridDecoupled ? 'Lock Grid' : 'Adjust Grid'}
            </button>
          </div>
        </div>
      )}
      <div className={`vtt-viewport${gridDecoupled ? ' vtt-viewport-grid-mode' : ''}`} ref={viewportRef}>
        <div className="vtt-canvas" ref={canvasRef}>
          <img src={mapSrc} alt="Map" onLoad={onMapLoad} draggable={false} />
          <div
            className="vtt-grid"
            ref={gridRef}
            style={{
              backgroundSize: `${gridW}px ${gridH}px`,
              backgroundPosition: `${gridOffset.x}px ${gridOffset.y}px`,
              backgroundImage: `linear-gradient(to right, ${gridColor}${decoupledAlpha()} ${gridThickness}px, transparent ${gridThickness}px), linear-gradient(to bottom, ${gridColor}${decoupledAlpha()} ${gridThickness}px, transparent ${gridThickness}px)`,
            }}
          />
        </div>
        <div className="vtt-nav-overlay">
          <div className="vtt-dpad">
            <button
              className="vtt-dpad-btn vtt-dpad-up"
              onMouseDown={() => startPan(0, 4)}
              onMouseUp={stopPan}
              onMouseLeave={stopPan}
            >&#x25B2;</button>
            <button
              className="vtt-dpad-btn vtt-dpad-left"
              onMouseDown={() => startPan(4, 0)}
              onMouseUp={stopPan}
              onMouseLeave={stopPan}
            >&#x25C0;</button>
            <button
              className="vtt-dpad-btn vtt-dpad-right"
              onMouseDown={() => startPan(-4, 0)}
              onMouseUp={stopPan}
              onMouseLeave={stopPan}
            >&#x25B6;</button>
            <button
              className="vtt-dpad-btn vtt-dpad-down"
              onMouseDown={() => startPan(0, -4)}
              onMouseUp={stopPan}
              onMouseLeave={stopPan}
            >&#x25BC;</button>
          </div>
          <div className="vtt-zoom-controls">
            <button
              className="vtt-dpad-btn"
              onMouseDown={() => startZoom(1)}
              onMouseUp={stopZoom}
              onMouseLeave={stopZoom}
            >+</button>
            <span className="vtt-zoom-label">{zoomPct}%</span>
            <button
              className="vtt-dpad-btn"
              onMouseDown={() => startZoom(-1)}
              onMouseUp={stopZoom}
              onMouseLeave={stopZoom}
            >-</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VTT
