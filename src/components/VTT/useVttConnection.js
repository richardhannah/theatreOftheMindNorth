import { useEffect, useRef, useState } from 'react'
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr'

const SERVER_URL = import.meta.env.VITE_SERVER_URL || (import.meta.env.DEV ? 'http://localhost:8080' : '')

export function useVttConnection({ onCounterAdded, onCounterMoved, onCounterRemoved, onGridUpdated, onFullState, onMessage }) {
  const connectionRef = useRef(null)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    const connection = new HubConnectionBuilder()
      .withUrl(`${SERVER_URL}/vttHub`)
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build()

    connectionRef.current = connection

    connection.on('CounterAdded', (counter) => onCounterAdded?.(counter))
    connection.on('CounterMoved', (id, x, y) => onCounterMoved?.(id, x, y))
    connection.on('CounterRemoved', (id) => onCounterRemoved?.(id))
    connection.on('GridUpdated', (grid) => onGridUpdated?.(grid))
    connection.on('FullState', (state) => onFullState?.(state))
    connection.on('ReceiveMessage', (msg) => onMessage?.(msg))

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
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

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
