import { useState, useRef, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import tokens from './tokens'
import maps from './maps'
import { useVttConnection } from './useVttConnection'
import { useAuth } from '../../auth/AuthContext'
import { API_URL, FEATURES } from '../../config'
import InitialsToken from '../TokenPicker/InitialsToken'
import { lazy, Suspense } from 'react'
import './VTT.css'

// Video conferencing — lazy loaded, only when feature is enabled
const VideoConference = FEATURES.VIDEO_CONFERENCING
  ? lazy(() => import('../VideoConference/VideoConference'))
  : null

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

// Lookups
const tokenSrcMap = Object.fromEntries(tokens.map((t) => [t.id, t.src]))
const mapSrcMap = Object.fromEntries(maps.map((m) => [m.id, m.src]))

function VTT() {
  const { user } = useAuth()
  const isDM = user?.role === 'Admin'
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
  const [showChat, setShowChat] = useState(true)
  const [showScenePanel, setShowScenePanel] = useState(false)
  const [videoSidebarOpen, setVideoSidebarOpen] = useState(true)
  const [counters, setCounters] = useState([])
  const [trayFilter, setTrayFilter] = useState('')
  const counterIdRef = useRef(0)

  // Scene state
  const [scenes, setScenes] = useState([])
  const [activeSceneId, setActiveSceneId] = useState('')
  const [activeMapId, setActiveMapId] = useState('')
  const [newSceneName, setNewSceneName] = useState('')
  const [newSceneMap, setNewSceneMap] = useState(maps[0]?.id || '')
  const sceneDirtyRef = useRef(false)

  // Mark scenes dirty on any scene/counter/grid change
  const markScenesDirty = () => { sceneDirtyRef.current = true }

  // Persist scenes to backend every 10s if dirty (DM only)
  useEffect(() => {
    if (!isDM || !user) return
    const interval = setInterval(() => {
      if (!sceneDirtyRef.current) return
      sceneDirtyRef.current = false

      // Build scene entities from the VttHub's in-memory state via the scenes list
      // We need to read current counters/grid for the active scene from local state
      const sceneEntities = scenes.map((s) => {
        const isActive = s.id === activeSceneId
        return {
          sceneId: s.id,
          name: s.name,
          mapId: s.mapId,
          gridW: isActive ? gridW : 20,
          gridH: isActive ? gridH : 20,
          gridOffsetX: isActive ? gridOffset.x : 0,
          gridOffsetY: isActive ? gridOffset.y : 0,
          gridColor: isActive ? gridColor : '#ffffff',
          gridOpacity: isActive ? gridOpacity : 0.15,
          gridThickness: isActive ? gridThickness : 1,
          counters: isActive ? JSON.stringify(counters.map((c) => ({ id: c.id, tokenId: c.tokenId, label: c.label, x: c.x, y: c.y }))) : '[]',
          nextCounterId: isActive ? counterIdRef.current : 0,
          isActive,
        }
      })

      fetch(`${API_URL}/api/scenes`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` },
        body: JSON.stringify(sceneEntities),
      }).catch(() => { sceneDirtyRef.current = true })
    }, 10000)
    return () => clearInterval(interval)
  }, [isDM, user, scenes, activeSceneId, gridW, gridH, gridOffset, gridColor, gridOpacity, gridThickness, counters])

  // Chat state
  const [messages, setMessages] = useState([])
  const [chatInput, setChatInput] = useState('')
  const [charName, setCharName] = useState(() => localStorage.getItem('vtt_char_name') || '')
  const [charTokenId, setCharTokenId] = useState(() => localStorage.getItem('vtt_char_token') || '')
  const [charId, setCharId] = useState(() => localStorage.getItem('vtt_char_id') || '')
  const [charNameSet, setCharNameSet] = useState(() => !!localStorage.getItem('vtt_char_name'))
  const [chatCharacters, setChatCharacters] = useState([])
  const chatMessagesRef = useRef(null)

  // Load characters for chat name picker + refresh current character's token
  useEffect(() => {
    if (!user) return
    fetch(`${API_URL}/api/characters`, {
      headers: { 'Authorization': `Bearer ${user.token}` },
    })
      .then((res) => res.ok ? res.json() : [])
      .then((data) => {
        setChatCharacters(data || [])
        const currentId = localStorage.getItem('vtt_char_id')
        if (currentId) {
          const match = (data || []).find((c) => c.characterId === currentId)
          if (match) {
            // Refresh name and token if they changed
            setCharName(match.name)
            setCharTokenId(match.tokenId || '')
            localStorage.setItem('vtt_char_name', match.name)
            localStorage.setItem('vtt_char_token', match.tokenId || '')
          } else {
            // Character was deleted — reset selection
            setCharName(''); setCharTokenId(''); setCharId(''); setCharNameSet(false)
            localStorage.removeItem('vtt_char_name')
            localStorage.removeItem('vtt_char_token')
            localStorage.removeItem('vtt_char_id')
          }
        }
      })
      .catch(() => {})
  }, [user])

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
      setScenes(state.scenes || [])
      setActiveSceneId(state.activeSceneId || '')
      if (state.scene) {
        loadScene(state.scene)
      }
    },
    onSceneCreated: (scene) => {
      setScenes((prev) => [...prev, { id: scene.id, name: scene.name, mapId: scene.mapId }])
      markScenesDirty()
    },
    onSceneSwitched: (scene) => {
      setActiveSceneId(scene.id)
      loadScene(scene)
      markScenesDirty()
    },
    onSceneDeleted: (sceneId) => {
      setScenes((prev) => prev.filter((s) => s.id !== sceneId))
      setActiveSceneId((prev) => prev === sceneId ? '' : prev)
      markScenesDirty()
    },
    onMessage: (msg) => {
      setMessages((prev) => [...prev.slice(-499), msg])
    },
  })

  const loadScene = (scene) => {
    loadingSceneRef.current = true
    setActiveMapId(scene.mapId || '')
    const resolved = (scene.counters || []).map((c) => ({
      id: c.id,
      tokenId: c.tokenId,
      src: tokenSrcMap[c.tokenId] || '',
      label: c.label,
      x: c.x,
      y: c.y,
    }))
    setCounters(resolved)
    counterIdRef.current = scene.nextCounterId || 0
    if (scene.grid) {
      setGridW(scene.grid.gridW || 20)
      setGridH(scene.grid.gridH || 20)
      setGridOffset({ x: scene.grid.offsetX || 0, y: scene.grid.offsetY || 0 })
      setGridColor(scene.grid.gridColor || '#ffffff')
      setGridOpacity(scene.grid.gridOpacity ?? 0.15)
      setGridThickness(scene.grid.gridThickness || 1)
    }
    // Allow sync again after React has processed the state updates
    requestAnimationFrame(() => { loadingSceneRef.current = false })
  }

  // Auto-scroll chat
  useEffect(() => {
    const el = chatMessagesRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages])

  // Persist grid settings locally
  const loadingSceneRef = useRef(false)

  useEffect(() => {
    localStorage.setItem(VTT_GRID_KEY, JSON.stringify({
      gridW, gridH, gridLinked, gridOffset, gridColor, gridOpacity, gridThickness,
    }))
  }, [gridW, gridH, gridLinked, gridOffset, gridColor, gridOpacity, gridThickness])

  // Sync grid to server when grid panel closes
  const prevShowGridPanel = useRef(showGridPanel)
  useEffect(() => {
    if (prevShowGridPanel.current && !showGridPanel && !loadingSceneRef.current) {
      vtt.updateGrid({
        gridW, gridH,
        offsetX: gridOffset.x, offsetY: gridOffset.y,
        gridColor, gridOpacity, gridThickness,
      })
      markScenesDirty()
    }
    prevShowGridPanel.current = showGridPanel
  }, [showGridPanel])

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
        markScenesDirty()
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
        markScenesDirty()
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
    markScenesDirty()
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
  }, [applyTransform, gridOffset, charNameSet])

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
  }, [render, charNameSet])

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

    const msg = { name: charName, playerName: user?.username || '', tokenId: charTokenId, text, ts: Date.now(), isDiceRoll: false }
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

  // Character selection gate
  const [showCreateChar, setShowCreateChar] = useState(false)
  const [newCharName, setNewCharName] = useState('')
  const [newCharClass, setNewCharClass] = useState('')
  const CLASSES = ['Fighter', 'Cleric', 'Magic-User', 'Thief', 'Elf', 'Dwarf', 'Halfling', 'Mystic']

  const createAndJoin = async (e) => {
    e.preventDefault()
    if (!newCharName.trim() || !user) return
    try {
      const res = await fetch(`${API_URL}/api/characters`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` },
        body: JSON.stringify({ name: newCharName.trim(), class: newCharClass, level: 1, alignment: '' }),
      })
      if (!res.ok) return
      const data = await res.json()
      const c = data.character
      setChatCharacters((prev) => [...prev, { characterId: c.characterId, name: c.name, class: c.class, level: c.level, tokenId: c.tokenId }])
      setCharName(c.name); setCharTokenId(c.tokenId || ''); setCharId(c.characterId || ''); setCharNameSet(true)
      localStorage.setItem('vtt_char_name', c.name)
      localStorage.setItem('vtt_char_token', c.tokenId || '')
      localStorage.setItem('vtt_char_id', c.characterId || '')
    } catch { /* ignore */ }
  }

  if (!charNameSet) {
    return (
      <div className="vtt-char-gate">
        <h2>Join the Virtual Tabletop</h2>
        {user && chatCharacters.length > 0 && (
          <div className="vtt-char-gate-list">
            {chatCharacters.map((c) => (
              <button
                key={c.characterId}
                className="vtt-char-gate-btn"
                onClick={() => {
                  setCharName(c.name); setCharTokenId(c.tokenId || ''); setCharId(c.characterId || ''); setCharNameSet(true)
                  localStorage.setItem('vtt_char_name', c.name)
                  localStorage.setItem('vtt_char_token', c.tokenId || '')
                  localStorage.setItem('vtt_char_id', c.characterId || '')
                }}
              >
                {c.tokenId && tokenSrcMap[c.tokenId] ? (
                  <img src={tokenSrcMap[c.tokenId]} alt="" className="vtt-char-gate-token" />
                ) : (
                  <InitialsToken name={c.name || '?'} size={40} />
                )}
                <div className="vtt-char-gate-info">
                  <span className="vtt-char-gate-name">{c.name}</span>
                  <span className="vtt-char-gate-detail">{c.class ? `Level ${c.level} ${c.class}` : ''}</span>
                </div>
              </button>
            ))}
          </div>
        )}
        {user && !showCreateChar && (
          <button className="vtt-char-gate-create-toggle" onClick={() => setShowCreateChar(true)}>
            + New Character
          </button>
        )}
        {user && showCreateChar && (
          <form className="vtt-char-gate-create" onSubmit={createAndJoin}>
            <input
              autoFocus
              value={newCharName}
              onChange={(e) => setNewCharName(e.target.value)}
              placeholder="Character name"
              className="vtt-char-gate-input"
            />
            <select
              className="vtt-char-gate-select"
              value={newCharClass}
              onChange={(e) => setNewCharClass(e.target.value)}
            >
              <option value="">Class...</option>
              {CLASSES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <button type="submit" className="vtt-char-gate-submit">Create & Join</button>
            <button type="button" className="vtt-char-gate-cancel" onClick={() => setShowCreateChar(false)}>Cancel</button>
          </form>
        )}
        <form
          className="vtt-char-gate-form"
          onSubmit={(e) => {
            e.preventDefault()
            if (charName.trim()) {
              setCharNameSet(true); setCharId('')
              localStorage.setItem('vtt_char_name', charName.trim())
              localStorage.setItem('vtt_char_token', '')
              localStorage.setItem('vtt_char_id', '')
            }
          }}
        >
          <input
            value={charName}
            onChange={(e) => setCharName(e.target.value)}
            placeholder={user ? 'Or enter a custom name...' : 'Enter your name...'}
            className="vtt-char-gate-input"
          />
          <button type="submit" className="vtt-char-gate-submit">Join</button>
        </form>
      </div>
    )
  }

  return (
    <div className="vtt-outer">
      {VideoConference && (
        <div className={`vtt-video-sidebar${videoSidebarOpen ? '' : ' vtt-video-sidebar-collapsed'}`}>
          {videoSidebarOpen && (
            <Suspense fallback={null}>
              <VideoConference userName={charName} />
            </Suspense>
          )}
          <button
            className="vtt-video-sidebar-toggle"
            onClick={() => setVideoSidebarOpen(!videoSidebarOpen)}
          >
            {videoSidebarOpen ? '\u25C0' : '\u25B6'}
          </button>
        </div>
      )}
      <div className="vtt">
      <div className="vtt-toolbar">
        {isDM && (
          <button
            className={`vtt-grid-lock-btn${showGridPanel ? ' vtt-link-active' : ''}`}
            onClick={() => setShowGridPanel(!showGridPanel)}
          >
            {showGridPanel ? 'Hide Grid Controls' : 'Show Grid Controls'}
          </button>
        )}
        <button
          className={`vtt-grid-lock-btn${showCounterTray ? ' vtt-link-active' : ''}`}
          onClick={() => setShowCounterTray(!showCounterTray)}
        >
          {showCounterTray ? 'Hide Counter Tray' : 'Show Counter Tray'}
        </button>
        {isDM && (
          <button
            className={`vtt-grid-lock-btn${showScenePanel ? ' vtt-link-active' : ''}`}
            onClick={() => setShowScenePanel(!showScenePanel)}
          >
            Scenes
          </button>
        )}
        {charId && (
          <Link to={`/characters/${charId}`} className="vtt-grid-lock-btn vtt-char-sheet-link">
            Character Sheet
          </Link>
        )}
        <span className="vtt-toolbar-spacer" />
        <span className="vtt-toolbar-label">
          {activeSceneId ? scenes.find((s) => s.id === activeSceneId)?.name || '' : 'No scene'}
        </span>
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
          </div>
        </div>
      )}
      {showScenePanel && isDM && (
        <div className="vtt-scene-panel">
          <div className="vtt-scene-list">
            {scenes.map((s) => (
              <div key={s.id} className={`vtt-scene-item${s.id === activeSceneId ? ' vtt-scene-active' : ''}`}>
                <button className="vtt-scene-select" onClick={() => vtt.switchScene(s.id)}>
                  {s.name}
                </button>
                {s.id !== 'default' && (
                  <button className="vtt-scene-delete" onClick={() => {
                    if (confirm(`Delete scene "${s.name}"?`)) vtt.deleteScene(s.id)
                  }}>x</button>
                )}
              </div>
            ))}
          </div>
          <div className="vtt-scene-create">
            <input
              className="vtt-scene-input"
              value={newSceneName}
              onChange={(e) => setNewSceneName(e.target.value)}
              placeholder="Scene name..."
            />
            <select
              className="vtt-scene-map-select"
              value={newSceneMap}
              onChange={(e) => setNewSceneMap(e.target.value)}
            >
              {maps.map((m) => (
                <option key={m.id} value={m.id}>{m.label}</option>
              ))}
            </select>
            <button
              className="vtt-scene-create-btn"
              onClick={() => {
                if (!newSceneName.trim()) return
                const id = crypto.randomUUID()
                vtt.createScene(id, newSceneName.trim(), newSceneMap)
                setNewSceneName('')
              }}
            >+ Create</button>
          </div>
        </div>
      )}
      <div
        className={`vtt-viewport${gridDecoupled ? ' vtt-viewport-grid-mode' : ''}`}
        ref={viewportRef}
      >
        <div className="vtt-canvas" ref={canvasRef}>
          {(mapSrcMap[activeMapId] || activeMapId) && (
            <img src={mapSrcMap[activeMapId] || activeMapId} alt="Map" onLoad={onMapLoad} draggable={false} />
          )}
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
              {c.src ? (
                <img src={c.src} alt={c.label} draggable={false} />
              ) : (
                <InitialsToken name={c.label || '?'} size={Math.min(gridW, gridH)} />
              )}
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
              {charName && !trayFilter && (
                <div
                  className="vtt-tray-item vtt-tray-item-mine"
                  onMouseDown={(e) => spawnFromTray(e, {
                    id: charTokenId || `initials_${charName}`,
                    src: tokenSrcMap[charTokenId] || '',
                    label: charName,
                  })}
                >
                  {charTokenId && tokenSrcMap[charTokenId] ? (
                    <img src={tokenSrcMap[charTokenId]} alt={charName} draggable={false} />
                  ) : (
                    <InitialsToken name={charName} size={32} />
                  )}
                  <span className="vtt-tray-item-label">{charName}</span>
                </div>
              )}
              {tokens
                .filter((t) => t.label.toLowerCase().includes(trayFilter.toLowerCase()))
                .filter((t) => t.id !== charTokenId)
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
        {!showChat && (
          <button className="vtt-chat-show-btn" onClick={() => setShowChat(true)}>Chat</button>
        )}
        {showChat && (
          <div className="vtt-chat">
            <>
                <div className="vtt-chat-header">
                  <span className="vtt-chat-header-name">{charName}</span>
                  <button className="vtt-chat-reset" onClick={() => {
                    setCharName(''); setCharTokenId(''); setCharId(''); setCharNameSet(false)
                    localStorage.removeItem('vtt_char_name')
                    localStorage.removeItem('vtt_char_token')
                    localStorage.removeItem('vtt_char_id')
                  }}>Switch</button>
                  <button className="vtt-chat-hide" onClick={() => setShowChat(false)}>&#x2715;</button>
                </div>
                <div className="vtt-chat-messages" ref={chatMessagesRef}>
                  {messages.map((m, i) => (
                    <div key={i} className={`vtt-chat-msg${m.isDiceRoll ? ' vtt-chat-dice' : ''}`}>
                      {m.tokenId && tokenSrcMap[m.tokenId] ? (
                        <img src={tokenSrcMap[m.tokenId]} alt="" className="vtt-chat-msg-token" />
                      ) : (
                        <InitialsToken name={m.name || '?'} size={20} />
                      )}
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
    </div>
  )
}

export default VTT
