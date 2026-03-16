import { useEffect, useRef, useState } from 'react'
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr'
import { API_URL } from '../../config'

export function useVttConnection({ onCounterAdded, onCounterMoved, onCounterRemoved, onGridUpdated, onFullState, onMessage }) {
  const connectionRef = useRef(null)
  const [connected, setConnected] = useState(false)

  // Store callbacks in refs so SignalR handlers always call the latest version
  const cbRef = useRef({ onCounterAdded, onCounterMoved, onCounterRemoved, onGridUpdated, onFullState, onMessage })
  cbRef.current = { onCounterAdded, onCounterMoved, onCounterRemoved, onGridUpdated, onFullState, onMessage }

  useEffect(() => {
    const connection = new HubConnectionBuilder()
      .withUrl(`${API_URL}/vttHub`)
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build()

    connectionRef.current = connection

    connection.on('CounterAdded', (counter) => cbRef.current.onCounterAdded?.(counter))
    connection.on('CounterMoved', (id, x, y) => cbRef.current.onCounterMoved?.(id, x, y))
    connection.on('CounterRemoved', (id) => cbRef.current.onCounterRemoved?.(id))
    connection.on('GridUpdated', (grid) => cbRef.current.onGridUpdated?.(grid))
    connection.on('FullState', (state) => cbRef.current.onFullState?.(state))
    connection.on('ReceiveMessage', (msg) => cbRef.current.onMessage?.(msg))

    connection.onclose(() => setConnected(false))
    connection.onreconnected(() => {
      setConnected(true)
      connection.invoke('JoinSession').catch(console.error)
    })

    connection.start().then(() => {
      setConnected(true)
      connection.invoke('JoinSession').catch(console.error)
    }).catch((err) => console.error('VTT connection failed:', err))

    return () => {
      connection.stop()
    }
  }, [])

  const addCounter = (counter) => {
    connectionRef.current?.invoke('AddCounter', counter).catch(console.error)
  }

  const moveCounter = (id, x, y) => {
    connectionRef.current?.invoke('MoveCounter', id, x, y).catch(console.error)
  }

  const removeCounter = (id) => {
    connectionRef.current?.invoke('RemoveCounter', id).catch(console.error)
  }

  const updateGrid = (grid) => {
    connectionRef.current?.invoke('UpdateGrid', grid).catch(console.error)
  }

  const sendMessage = (msg) => {
    connectionRef.current?.invoke('SendMessage', msg).catch(console.error)
  }

  return { connected, addCounter, moveCounter, removeCounter, updateGrid, sendMessage }
}
