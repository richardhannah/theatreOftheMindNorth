import { useState, useRef, useEffect, useCallback } from 'react'
import './Map.css'

const rows = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const columns = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

function Map() {
  const [zoomPct, setZoomPct] = useState(100)
  const [baseSize, setBaseSize] = useState(100)
  const viewerRef = useRef(null)
  const dragging = useRef(false)
  const dragStart = useRef({ x: 0, y: 0 })
  const scrollStart = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const viewer = viewerRef.current
    if (!viewer) return
    setBaseSize(viewer.clientWidth / 10)
  }, [])

  const tileSize = baseSize * zoomPct / 100
  const mapSize = tileSize * 10

  const handleZoom = useCallback((newZoomPct) => {
    const viewer = viewerRef.current
    if (!viewer) return

    const ratio = newZoomPct / zoomPct

    const centerX = viewer.scrollLeft + viewer.clientWidth / 2
    const centerY = viewer.scrollTop + viewer.clientHeight / 2

    const newScrollLeft = centerX * ratio - viewer.clientWidth / 2
    const newScrollTop = centerY * ratio - viewer.clientHeight / 2

    setZoomPct(newZoomPct)

    requestAnimationFrame(() => {
      viewer.scrollLeft = newScrollLeft
      viewer.scrollTop = newScrollTop
    })
  }, [zoomPct])

  // Drag to pan
  useEffect(() => {
    const viewer = viewerRef.current
    if (!viewer) return

    const onMouseDown = (e) => {
      dragging.current = true
      dragStart.current = { x: e.clientX, y: e.clientY }
      scrollStart.current = { x: viewer.scrollLeft, y: viewer.scrollTop }
      viewer.style.cursor = 'grabbing'
    }

    const onMouseMove = (e) => {
      if (!dragging.current) return
      viewer.scrollLeft = scrollStart.current.x - (e.clientX - dragStart.current.x)
      viewer.scrollTop = scrollStart.current.y - (e.clientY - dragStart.current.y)
    }

    const onMouseUp = () => {
      dragging.current = false
      viewer.style.cursor = 'grab'
    }

    viewer.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)

    return () => {
      viewer.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [])

  return (
    <div className="map-page">
      <div className="map-controls">
        <input
          type="range"
          min="100"
          max="800"
          step="10"
          value={zoomPct}
          onChange={(e) => handleZoom(Number(e.target.value))}
        />
        <span>Zoom: {zoomPct}%</span>
      </div>
      <div className="map-viewer" ref={viewerRef}>
        <div className="map-sizer" style={{ width: `${mapSize}px`, height: `${mapSize}px` }}>
          <table
            className="map-table"
            style={{
              transform: `scale(${zoomPct / 100})`,
              transformOrigin: '0 0',
            }}
          >
            <tbody>
              {rows.map((row) => (
                <tr key={row}>
                  {columns.map((col) => (
                    <td key={col}>
                      <img
                        src={`/maps/knownworld/row-${row}-column-${col}.png`}
                        className="map-tile"
                        style={{ width: `${baseSize}px`, height: `${baseSize}px` }}
                        draggable={false}
                        alt=""
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Map
