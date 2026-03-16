import { useState, useRef, useEffect, useCallback } from 'react'
import tokens from './tokens'
import { useVttConnection } from './useVttConnection'
import { useAuth } from '../../auth/AuthContext'
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

// Build a token src lookup from the tokens list
const tokenSrcMap = Object.fromEntries(tokens.map((t) => [t.id, t.src]))

function VTT({ mapSrc }) {
  const { user } = useAuth()
  const [, forceRender] = useState(0)
  const savedGrid = useRef(loadGridSettings())
  const [gridW, setGridW] = useState(savedGrid.current?.gridW ?? 20)
  const [gridH, setGridH] = useState(savedGrid.current?.gridH ?? 20)
  const [gridLinked, setGridLinked] = useState(savedGrid.current?.gridLinked ?? true)
  const [gridDecoupled, setGridDecoupled] = useState(false)
  const [gridOffset, setGridOffset] = useState(savedGrid.current?.gridOffset ?? { x: 0, y: 0 })
  const [gridColor, setGridColor] = useState(savedGrid.current?.gridColor ?? '#ffffff')
  const [gridOpacity, setGridOpacity] = useState(savedGrid.current?.gridOpacity ?? 0.15)
  const [gridThickness, setGridThickness] = useState(savedGrid.current?.gridThickness ?? 1)
  const [showGridPanel, setShowGridPanel] = useState(false)
  const [showCounterTray, setShowCounterTray] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [counters, setCounters] = useState([])
  const [trayFilter, setTrayFilter] = useState('')
  const counterIdRef = useRef(0)

  // Chat state
  const [messages, setMessages] = useState([])
  const [chatInput, setChatInput] = useState('')
  const [charName, setCharName] = useState('')
  const [charNameSet, setCharNameSet] = useState(false)
  const chatMessagesRef = useRef(null)

  // Command history
  const CMD_HISTORY_KEY = 'vtt_command_history'
  const cmdHistoryInitRef = useRef(() => {
    try { return JSON.parse(localStorage.getItem(CMD_HISTORY_KEY)) || [] } catch { return [] }
  })
  const [commandHistory] = useState(() => cmdHistoryInitRef.current())
  const historyIndexRef = useRef(-1)
  const savedInputRef = useRef('')

  // SignalR connection
  const vtt = useVttConnection({
    onCounterAdded: (counter) => {
      // Resolve local src from tokenId
      setCounters((prev) => {
        if (prev.find((c) => c.id === counter.id)) return prev
        return [...prev, {
          id: counter.id,
          tokenId: counter.tokenId,
          src: tokenSrcMap[counter.tokenId] || '',
          label: counter.label,
          x: counter.x,
          y: counter.y,
        }]
      })
      counterIdRef.current = Math.max(counterIdRef.current, counter.id)
    },
    onCounterMoved: (id, x, y) => {
      setCounters((prev) => prev.map((c) =>
        c.id === id ? { ...c, x, y } : c
      ))
    },
    onCounterRemoved: (id) => {
      setCounters((prev) => prev.filter((c) => c.id !== id))
    },
    onGridUpdated: (grid) => {
      setGridW(grid.gridW)
      setGridH(grid.gridH)
      setGridOffset({ x: grid.offsetX, y: grid.offsetY })
      setGridColor(grid.gridColor)
      setGridOpacity(grid.gridOpacity)
      setGridThickness(grid.gridThickness)
    },
    onFullState: (state) => {
      const resolved = state.counters.map((c) => ({
        id: c.id,
        tokenId: c.tokenId,
        src: tokenSrcMap[c.tokenId] || '',
        label: c.label,
        x: c.x,
        y: c.y,
      }))
      setCounters(resolved)
      counterIdRef.current = state.nextCounterId || 0
      if (state.grid?.gridW) {
        setGridW(state.grid.gridW)
        setGridH(state.grid.gridH)
        setGridOffset({ x: state.grid.offsetX, y: state.grid.offsetY })
        setGridColor(state.grid.gridColor)
        setGridOpacity(state.grid.gridOpacity)
        setGridThickness(state.grid.gridThickness)
      }
    },
    onMessage: (msg) => {
      setMessages((prev) => [...prev.slice(-499), msg])
    },
  })

  // Auto-scroll chat
  useEffect(() => {
    const el = chatMessagesRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages])

  // Persist grid settings locally
  useEffect(() => {
    localStorage.setItem(VTT_GRID_KEY, JSON.stringify({
      gridW, gridH, gridLinked, gridOffset, gridColor, gridOpacity, gridThickness,
    }))
  }, [gridW, gridH, gridLinked, gridOffset, gridColor, gridOpacity, gridThickness])

  // Broadcast grid changes
  const broadcastGrid = () => {
    vtt.updateGrid({
      gridW, gridH,
      offsetX: gridOffset.x, offsetY: gridOffset.y,
      gridColor, gridOpacity, gridThickness,
    })
  }

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

  // Pan controls
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

  // Zoom controls
  const zoomTimerRef = useRef(null)
  const zoomFrameCount = useRef(0)

  const startZoom = (direction) => {
    zoomFrameCount.current = 0
    const step = () => {
      zoomFrameCount.current++
      if (zoomFrameCount.current % 6 === 0) {
        const newZoom = direction > 0
          ? Math.min(MAX_ZOOM, zoomRef.current + ZOOM_STEP)
          : Math.max(MIN_ZOOM, zoomRef.current - ZOOM_STEP)
        zoomTo(newZoom)
      }
      zoomTimerRef.current = requestAnimationFrame(step)
    }
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

  // Snap a position to the grid
  const snapToGrid = (x, y) => {
    const ox = gridOffset.x
    const oy = gridOffset.y
    return {
      x: Math.round((x - ox) / gridW) * gridW + ox,
      y: Math.round((y - oy) / gridH) * gridH + oy,
    }
  }

  // Spawn a counter from the tray
  const spawnFromTray = (e, token) => {
    e.preventDefault()
    e.stopPropagation()
    const vp = viewportRef.current
    if (!vp) return

    const rect = vp.getBoundingClientRect()
    const zoom = zoomRef.current
    const pan = panRef.current

    const mapX = (e.clientX - rect.left - pan.x) / zoom
    const mapY = (e.clientY - rect.top - pan.y) / zoom

    counterIdRef.current++
    const newId = counterIdRef.current

    const newCounter = {
      id: newId,
      tokenId: token.id,
      src: token.src,
      label: token.label,
      x: mapX,
      y: mapY,
    }

    setCounters((prev) => [...prev, newCounter])
    setDraggingCounterId(newId)
    counterDragRef.current = {
      counterId: newId,
      startMouse: { x: e.clientX, y: e.clientY },
      startPos: { x: mapX, y: mapY },
    }

    const onMouseMove = (ev) => {
      if (!counterDragRef.current) return
      const dx = (ev.clientX - counterDragRef.current.startMouse.x) / zoomRef.current
      const dy = (ev.clientY - counterDragRef.current.startMouse.y) / zoomRef.current
      const newX = counterDragRef.current.startPos.x + dx
      const newY = counterDragRef.current.startPos.y + dy
      setCounters((prev) => prev.map((c) =>
        c.id === newId ? { ...c, x: newX, y: newY } : c
      ))
    }

    const onMouseUp = (ev) => {
      if (counterDragRef.current) {
        const dx = (ev.clientX - counterDragRef.current.startMouse.x) / zoomRef.current
        const dy = (ev.clientY - counterDragRef.current.startMouse.y) / zoomRef.current
        const newX = counterDragRef.current.startPos.x + dx
        const newY = counterDragRef.current.startPos.y + dy
        const snapped = snapToGrid(newX, newY)
        setCounters((prev) => prev.map((c) =>
          c.id === newId ? { ...c, x: snapped.x, y: snapped.y } : c
        ))
        // Broadcast the new counter at its final position
        vtt.addCounter({ id: newId, tokenId: token.id, label: token.label, x: snapped.x, y: snapped.y })
      }
      counterDragRef.current = null
      setDraggingCounterId(null)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }

  // Drag existing counter
  const counterDragRef = useRef(null)
  const [draggingCounterId, setDraggingCounterId] = useState(null)

  const startCounterDrag = (e, counterId) => {
    e.stopPropagation()
    const counter = counters.find((c) => c.id === counterId)
    if (!counter) return

    setDraggingCounterId(counterId)
    counterDragRef.current = {
      counterId,
      startMouse: { x: e.clientX, y: e.clientY },
      startPos: { x: counter.x, y: counter.y },
    }

    const onMouseMove = (ev) => {
      if (!counterDragRef.current) return
      const dx = (ev.clientX - counterDragRef.current.startMouse.x) / zoomRef.current
      const dy = (ev.clientY - counterDragRef.current.startMouse.y) / zoomRef.current
      const newX = counterDragRef.current.startPos.x + dx
      const newY = counterDragRef.current.startPos.y + dy
      setCounters((prev) => prev.map((c) =>
        c.id === counterId ? { ...c, x: newX, y: newY } : c
      ))
    }

    const onMouseUp = (ev) => {
      if (counterDragRef.current) {
        const dx = (ev.clientX - counterDragRef.current.startMouse.x) / zoomRef.current
        const dy = (ev.clientY - counterDragRef.current.startMouse.y) / zoomRef.current
        const newX = counterDragRef.current.startPos.x + dx
        const newY = counterDragRef.current.startPos.y + dy
        const snapped = snapToGrid(newX, newY)
        setCounters((prev) => prev.map((c) =>
          c.id === counterId ? { ...c, x: snapped.x, y: snapped.y } : c
        ))
        // Broadcast the move
        vtt.moveCounter(counterId, snapped.x, snapped.y)
      }
      counterDragRef.current = null
      setDraggingCounterId(null)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }

  const removeCounter = (counterId) => {
    setCounters((prev) => prev.filter((c) => c.id !== counterId))
    vtt.removeCounter(counterId)
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

  // Drag to pan
  useEffect(() => {
    const vp = viewportRef.current
    if (!vp) return

    const onMouseDown = (e) => {
      if (e.target.closest('.vtt-counter')) return
      if (e.target.closest('.vtt-counter-tray')) return
      if (e.target.closest('.vtt-nav-overlay')) return
      if (e.target.closest('.vtt-chat')) return

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

  // Scroll to zoom
  useEffect(() => {
    const vp = viewportRef.current
    if (!vp) return

    const onWheel = (e) => {
      e.preventDefault()
      if (gridDecoupledRef.current) return

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

  // Chat send
  const sendChat = (e) => {
    e.preventDefault()
    if (!chatInput.trim()) return
    const text = chatInput.trim()
    // Add to command history
    commandHistory.unshift(text)
    if (commandHistory.length > 100) commandHistory.pop()
    localStorage.setItem(CMD_HISTORY_KEY, JSON.stringify(commandHistory))
    historyIndexRef.current = -1
    savedInputRef.current = ''

    const msg = { name: charName, playerName: user?.username || '', text, ts: Date.now(), isDiceRoll: false }
    setMessages((prev) => [...prev.slice(-499), msg])
    vtt.sendMessage(msg)
    setChatInput('')
  }

  const handleChatKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (historyIndexRef.current === -1) savedInputRef.current = chatInput
      if (historyIndexRef.current < commandHistory.length - 1) {
        historyIndexRef.current++
        setChatInput(commandHistory[historyIndexRef.current])
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndexRef.current > 0) {
        historyIndexRef.current--
        setChatInput(commandHistory[historyIndexRef.current])
      } else if (historyIndexRef.current === 0) {
        historyIndexRef.current = -1
        setChatInput(savedInputRef.current)
      }
    }
  }

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
        <button
          className={`vtt-grid-lock-btn${showCounterTray ? ' vtt-link-active' : ''}`}
          onClick={() => setShowCounterTray(!showCounterTray)}
        >
          {showCounterTray ? 'Hide Counter Tray' : 'Show Counter Tray'}
        </button>
        <button
          className={`vtt-grid-lock-btn${showChat ? ' vtt-link-active' : ''}`}
          onClick={() => setShowChat(!showChat)}
        >
          {showChat ? 'Hide Chat' : 'Show Chat'}
        </button>
        <span className="vtt-toolbar-sep" />
        <span className="vtt-toolbar-label">
          {vtt.connected ? 'Connected' : 'Disconnected'}
        </span>
      </div>
      {showGridPanel && (
        <div className="vtt-grid-panel">
          <div className="vtt-grid-panel-row">
            <label className="vtt-toolbar-label">Width</label>
            <button className="vtt-fine-btn" onClick={() => handleGridW(Math.max(5, gridW - 1))}>-</button>
            <input type="range" min="5" max="100" step="1" value={gridW} onChange={(e) => handleGridW(e.target.value)} />
            <button className="vtt-fine-btn" onClick={() => handleGridW(Math.min(100, gridW + 1))}>+</button>
            <span className="vtt-grid-panel-val">{gridW}px</span>
          </div>
          <div className="vtt-grid-panel-row">
            <label className="vtt-toolbar-label">Height</label>
            <button className="vtt-fine-btn" onClick={() => handleGridH(Math.max(5, gridH - 1))}>-</button>
            <input type="range" min="5" max="100" step="1" value={gridH} onChange={(e) => handleGridH(e.target.value)} />
            <button className="vtt-fine-btn" onClick={() => handleGridH(Math.min(100, gridH + 1))}>+</button>
            <span className="vtt-grid-panel-val">{gridH}px</span>
          </div>
          <div className="vtt-grid-panel-row">
            <button className={`vtt-link-btn${gridLinked ? ' vtt-link-active' : ''}`} onClick={() => setGridLinked(!gridLinked)} title={gridLinked ? 'Unlink W/H' : 'Link W/H'}>
              {gridLinked ? '\u{1F517}' : '\u2E2F'}
            </button>
            <span className="vtt-toolbar-label">{gridLinked ? 'Linked' : 'Independent'}</span>
          </div>
          <div className="vtt-grid-panel-divider" />
          <div className="vtt-grid-panel-row">
            <label className="vtt-toolbar-label">Colour</label>
            <input type="color" className="vtt-color-picker" value={gridColor} onChange={(e) => setGridColor(e.target.value)} />
            <label className="vtt-toolbar-label">Opacity</label>
            <input type="range" min="5" max="100" step="5" value={Math.round(gridOpacity * 100)} onChange={(e) => setGridOpacity(Number(e.target.value) / 100)} />
          </div>
          <div className="vtt-grid-panel-row">
            <label className="vtt-toolbar-label">Thickness</label>
            <input type="range" min="1" max="5" step="1" value={gridThickness} onChange={(e) => setGridThickness(Number(e.target.value))} />
            <span className="vtt-grid-panel-val">{gridThickness}px</span>
          </div>
          <div className="vtt-grid-panel-divider" />
          <div className="vtt-grid-panel-row">
            <button
              className={`vtt-grid-lock-btn${gridDecoupled ? ' vtt-grid-decoupled' : ''}`}
              onClick={() => setGridDecoupled(!gridDecoupled)}
            >
              {gridDecoupled ? 'Lock Grid' : 'Adjust Grid'}
            </button>
            <button className="vtt-grid-lock-btn" onClick={broadcastGrid}>
              Sync Grid
            </button>
          </div>
        </div>
      )}
      <div
        className={`vtt-viewport${gridDecoupled ? ' vtt-viewport-grid-mode' : ''}`}
        ref={viewportRef}
      >
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
          {counters.map((c) => (
            <div
              key={c.id}
              className={`vtt-counter${draggingCounterId === c.id ? ' vtt-counter-dragging' : ''}`}
              style={{
                left: `${c.x}px`,
                top: `${c.y}px`,
                width: `${gridW}px`,
                height: `${gridH}px`,
              }}
              onMouseDown={(e) => startCounterDrag(e, c.id)}
              onContextMenu={(e) => { e.preventDefault(); removeCounter(c.id) }}
              title={`${c.label} (right-click to remove)`}
            >
              <img src={c.src} alt={c.label} draggable={false} />
            </div>
          ))}
        </div>
        {/* Counter Tray */}
        {showCounterTray && (
          <div className="vtt-counter-tray">
            <input
              className="vtt-tray-search"
              type="text"
              placeholder="Search tokens..."
              value={trayFilter}
              onChange={(e) => setTrayFilter(e.target.value)}
            />
            <div className="vtt-tray-list">
              {tokens
                .filter((t) => t.label.toLowerCase().includes(trayFilter.toLowerCase()))
                .map((t) => (
                  <div key={t.id} className="vtt-tray-item" onMouseDown={(e) => spawnFromTray(e, t)}>
                    <img src={t.src} alt={t.label} draggable={false} />
                    <span className="vtt-tray-item-label">{t.label}</span>
                  </div>
                ))}
            </div>
          </div>
        )}
        {/* Chat Panel */}
        {showChat && (
          <div className="vtt-chat">
            {!charNameSet ? (
              <form className="vtt-chat-name-form" onSubmit={(e) => { e.preventDefault(); if (charName.trim()) setCharNameSet(true) }}>
                <input
                  autoFocus
                  value={charName}
                  onChange={(e) => setCharName(e.target.value)}
                  placeholder="Character name..."
                  className="vtt-chat-input"
                />
                <button type="submit" className="vtt-chat-send">Join</button>
              </form>
            ) : (
              <>
                <div className="vtt-chat-messages" ref={chatMessagesRef}>
                  {messages.map((m, i) => (
                    <div key={i} className={`vtt-chat-msg${m.isDiceRoll ? ' vtt-chat-dice' : ''}`}>
                      <strong>{m.name}{m.playerName ? ` [${m.playerName}]` : ''}: </strong>
                      {m.text}
                    </div>
                  ))}
                </div>
                <form className="vtt-chat-form" onSubmit={sendChat}>
                  <input
                    autoFocus
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={handleChatKeyDown}
                    placeholder="Message or roll (#2d6+3)..."
                    className="vtt-chat-input"
                  />
                  <button type="submit" className="vtt-chat-send">Send</button>
                </form>
              </>
            )}
          </div>
        )}
        {/* Nav overlay */}
        <div className="vtt-nav-overlay">
          <div className="vtt-dpad">
            <button className="vtt-dpad-btn vtt-dpad-up" onMouseDown={() => startPan(0, 4)} onMouseUp={stopPan} onMouseLeave={stopPan}>&#x25B2;</button>
            <button className="vtt-dpad-btn vtt-dpad-left" onMouseDown={() => startPan(4, 0)} onMouseUp={stopPan} onMouseLeave={stopPan}>&#x25C0;</button>
            <button className="vtt-dpad-btn vtt-dpad-right" onMouseDown={() => startPan(-4, 0)} onMouseUp={stopPan} onMouseLeave={stopPan}>&#x25B6;</button>
            <button className="vtt-dpad-btn vtt-dpad-down" onMouseDown={() => startPan(0, -4)} onMouseUp={stopPan} onMouseLeave={stopPan}>&#x25BC;</button>
          </div>
          <div className="vtt-zoom-controls">
            <button className="vtt-dpad-btn" onMouseDown={() => startZoom(1)} onMouseUp={stopZoom} onMouseLeave={stopZoom}>+</button>
            <span className="vtt-zoom-label">{zoomPct}%</span>
            <button className="vtt-dpad-btn" onMouseDown={() => startZoom(-1)} onMouseUp={stopZoom} onMouseLeave={stopZoom}>-</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VTT
