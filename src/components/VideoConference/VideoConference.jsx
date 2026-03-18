import { useEffect, useRef, useState } from 'react'
import DigitalSambaEmbedded from '@digitalsamba/embedded-sdk'
import { VIDEO_CONFIG } from '../../config'
import './VideoConference.css'

function VideoConference({ userName, isDM }) {
  const containerRef = useRef(null)
  const sambaRef = useRef(null)
  const iframeRef = useRef(null)
  const [permissionGranted, setPermissionGranted] = useState(false)
  const [permissionDenied, setPermissionDenied] = useState(false)
  const [audioOn, setAudioOn] = useState(true)
  const [videoOn, setVideoOn] = useState(true)
  const [joined, setJoined] = useState(false)
  const [nativeToolbar, setNativeToolbar] = useState(false)

  const [error] = useState(() => {
    if (!VIDEO_CONFIG.team || !VIDEO_CONFIG.room) return 'Video not configured'
    return ''
  })

  // Request camera/mic permissions
  useEffect(() => {
    if (error) return
    navigator.mediaDevices.getUserMedia({ audio: true, video: true })
      .then((stream) => {
        stream.getTracks().forEach((t) => t.stop())
        setPermissionGranted(true)
      })
      .catch(() => setPermissionDenied(true))
  }, [error])

  // Load iframe + SDK
  useEffect(() => {
    if (!permissionGranted || error || !containerRef.current) return

    if (iframeRef.current) {
      iframeRef.current.remove()
      iframeRef.current = null
      sambaRef.current = null
    }

    const iframe = document.createElement('iframe')
    iframe.setAttribute('allow', 'camera; microphone; display-capture; autoplay; fullscreen')
    iframe.setAttribute('allowfullscreen', 'true')
    iframe.style.cssText = 'width: 100%; height: 100%; border: none;'
    containerRef.current.appendChild(iframe)
    iframeRef.current = iframe

    const samba = DigitalSambaEmbedded.createControl({
      frame: iframe,
      team: VIDEO_CONFIG.team,
      room: VIDEO_CONFIG.room,
    })

    samba.load()

    // Once room is joined, hide the native toolbar/topbar
    samba.on('roomJoined', () => {
      samba.hideToolbar()
      samba.hideTopbar()
      setJoined(true)
    })

    samba.on('audioEnabled', () => setAudioOn(true))
    samba.on('audioDisabled', () => setAudioOn(false))
    samba.on('videoEnabled', () => setVideoOn(true))
    samba.on('videoDisabled', () => setVideoOn(false))

    sambaRef.current = samba

    return () => {
      if (iframeRef.current) {
        iframeRef.current.remove()
        iframeRef.current = null
      }
      sambaRef.current = null
    }
  }, [permissionGranted, error, userName])

  const toggleNativeToolbar = () => {
    if (nativeToolbar) {
      sambaRef.current?.hideToolbar()
      sambaRef.current?.hideTopbar()
    } else {
      sambaRef.current?.showToolbar()
      sambaRef.current?.showTopbar()
    }
    setNativeToolbar(!nativeToolbar)
  }

  const toggleAudio = () => sambaRef.current?.toggleAudio()
  const toggleVideo = () => sambaRef.current?.toggleVideo()
  const endSession = () => {
    if (confirm('End the video session for everyone?')) {
      sambaRef.current?.endSession()
    }
  }
  const leaveSession = () => {
    sambaRef.current?.leaveSession()
    setJoined(false)
  }

  return (
    <div className="vc-fill">
      <div className="vc-video" ref={containerRef}>
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
      {joined && (
        <div className="vc-controls">
          <button
            className={`vc-btn${audioOn ? '' : ' vc-btn-off'}`}
            onClick={toggleAudio}
            title={audioOn ? 'Mute mic' : 'Unmute mic'}
          >
            {audioOn ? '\u{1F3A4}' : '\u{1F507}'}
          </button>
          <button
            className={`vc-btn${videoOn ? '' : ' vc-btn-off'}`}
            onClick={toggleVideo}
            title={videoOn ? 'Turn off camera' : 'Turn on camera'}
          >
            {videoOn ? '\u{1F4F7}' : '\u{1F6AB}'}
          </button>
          <button
            className={`vc-btn${nativeToolbar ? ' vc-btn-active' : ''}`}
            onClick={toggleNativeToolbar}
            title={nativeToolbar ? 'Hide settings' : 'Show settings'}
          >
            &#x2699;
          </button>
          <button
            className="vc-btn vc-btn-leave"
            onClick={leaveSession}
            title="Leave session"
          >
            Leave
          </button>
          {isDM && (
            <button
              className="vc-btn vc-btn-end"
              onClick={endSession}
              title="End session for everyone"
            >
              End
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default VideoConference
