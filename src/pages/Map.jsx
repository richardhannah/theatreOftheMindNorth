import { useState, useRef, useEffect } from 'react'
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

  const tileSize = Math.round(baseSize * zoomPct / 100)

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
          onChange={(e) => setZoomPct(Number(e.target.value))}
        />
        <span>Zoom: {zoomPct}%</span>
      </div>
      <div className="map-viewer" ref={viewerRef}>
        <table className="map-table">
          <tbody>
            {rows.map((row) => (
              <tr key={row}>
                {columns.map((col) => (
                  <td key={col}>
                    <img
                      src={`/maps/knownworld/row-${row}-column-${col}.png`}
                      className="map-tile"
                      style={{ width: `${tileSize}px`, height: `${tileSize}px` }}
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
  )
}

export default Map
