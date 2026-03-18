import { useEffect, useRef, useState } from 'react'
import { VIDEO_CONFIG } from '../../config'
import './VideoConference.css'

function VideoConference({ userName }) {
  const containerRef = useRef(null)
  const iframeRef = useRef(null)
  const [permissionGranted, setPermissionGranted] = useState(false)
  const [permissionDenied, setPermissionDenied] = useState(false)

  const [error] = useState(() => {
    if (!VIDEO_CONFIG.team || !VIDEO_CONFIG.room) return 'Video not configured'
    return ''
  })

  // Request camera/mic permissions on our origin before loading the iframe
  useEffect(() => {
    if (error) return

    navigator.mediaDevices.getUserMedia({ audio: true, video: true })
      .then((stream) => {
        stream.getTracks().forEach((t) => t.stop())
        setPermissionGranted(true)
      })
      .catch(() => {
        setPermissionDenied(true)
      })
  }, [error])

  // Load the iframe only after permissions are granted
  useEffect(() => {
    if (!permissionGranted || error || !containerRef.current) return

    if (iframeRef.current) {
      iframeRef.current.remove()
      iframeRef.current = null
    }

    const params = new URLSearchParams()
    if (userName) params.set('name', userName)
    const roomUrl = `https://${VIDEO_CONFIG.team}.digitalsamba.com/${VIDEO_CONFIG.room}${params.toString() ? '?' + params.toString() : ''}`

    const iframe = document.createElement('iframe')
    iframe.setAttribute('allow', 'camera; microphone; display-capture; autoplay; fullscreen')
    iframe.setAttribute('allowfullscreen', 'true')
    iframe.style.cssText = 'width: 100%; height: 100%; border: none;'
    iframe.src = roomUrl

    containerRef.current.appendChild(iframe)
    iframeRef.current = iframe

    return () => {
      if (iframeRef.current) {
        iframeRef.current.remove()
        iframeRef.current = null
      }
    }
  }, [permissionGranted, error, userName])

  return (
    <div className="vc-fill" ref={containerRef}>
      {error && <div className="vc-message vc-error">{error}</div>}
      {permissionDenied && (
        <div className="vc-message vc-error">
          Camera/mic access denied.<br />
          Allow access in browser settings and refresh.
        </div>
      )}
      {!permissionGranted && !permissionDenied && !error && (
        <div className="vc-message">Requesting camera/mic access...</div>
      )}
    </div>
  )
}

export default VideoConference
