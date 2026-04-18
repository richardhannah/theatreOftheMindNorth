import { useEffect, useRef, useState } from 'react'
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr'
import { API_URL } from '../../config'

export function useVttConnection(callbacks) {
  const connectionRef = useRef(null)
  const [connected, setConnected] = useState(false)

  const cbRef = useRef(callbacks)
  cbRef.current = callbacks

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
    connection.on('CounterRenamed', (id, label) => cbRef.current.onCounterRenamed?.(id, label))
    connection.on('GridUpdated', (grid) => cbRef.current.onGridUpdated?.(grid))
    connection.on('FullState', (state) => cbRef.current.onFullState?.(state))
    connection.on('ReceiveMessage', (msg) => cbRef.current.onMessage?.(msg))
    connection.on('SceneCreated', (scene) => cbRef.current.onSceneCreated?.(scene))
    connection.on('SceneSwitched', (scene) => cbRef.current.onSceneSwitched?.(scene))
    connection.on('SceneDeleted', (sceneId) => cbRef.current.onSceneDeleted?.(sceneId))
    connection.on('InitiativeUpdated', (initiative) => cbRef.current.onInitiativeUpdated?.(initiative))
    connection.on('BackupRestored', () => cbRef.current.onBackupRestored?.())
    connection.on('FogUpdated', (fog) => cbRef.current.onFogUpdated?.(fog))
    connection.on('TileAdded', (tile) => cbRef.current.onTileAdded?.(tile))
    connection.on('TileMoved', (id, x, y) => cbRef.current.onTileMoved?.(id, x, y))
    connection.on('TileRemoved', (id) => cbRef.current.onTileRemoved?.(id))
    connection.on('TileVisibilityChanged', (id, hidden) => cbRef.current.onTileVisibilityChanged?.(id, hidden))
    connection.on('CounterVisibilityChanged', (id, hidden) => cbRef.current.onCounterVisibilityChanged?.(id, hidden))

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

  const addCounter = (counter) => connectionRef.current?.invoke('AddCounter', counter).catch(console.error)
  const moveCounter = (id, x, y) => connectionRef.current?.invoke('MoveCounter', id, x, y).catch(console.error)
  const removeCounter = (id) => connectionRef.current?.invoke('RemoveCounter', id).catch(console.error)
  const renameCounter = (id, label) => connectionRef.current?.invoke('RenameCounter', id, label).catch(console.error)
  const updateGrid = (grid) => connectionRef.current?.invoke('UpdateGrid', grid).catch(console.error)
  const sendMessage = (msg) => connectionRef.current?.invoke('SendMessage', msg).catch(console.error)
  const createScene = (id, name, mapId) => connectionRef.current?.invoke('CreateScene', id, name, mapId).catch(console.error)
  const switchScene = (sceneId) => connectionRef.current?.invoke('SwitchScene', sceneId).catch(console.error)
  const deleteScene = (sceneId) => connectionRef.current?.invoke('DeleteScene', sceneId).catch(console.error)
  const updateInitiative = (initiative) => connectionRef.current?.invoke('UpdateInitiative', initiative).catch(console.error)
  const updateFog = (fog) => connectionRef.current?.invoke('UpdateFog', fog).catch(console.error)
  const addTile = (tile) => connectionRef.current?.invoke('AddTile', tile).catch(console.error)
  const moveTile = (id, x, y) => connectionRef.current?.invoke('MoveTile', id, x, y).catch(console.error)
  const removeTile = (id) => connectionRef.current?.invoke('RemoveTile', id).catch(console.error)
  const setTileVisibility = (id, hidden) => connectionRef.current?.invoke('SetTileVisibility', id, hidden).catch(console.error)
  const setCounterVisibility = (id, hidden) => connectionRef.current?.invoke('SetCounterVisibility', id, hidden).catch(console.error)

  const rejoinSession = () => connectionRef.current?.invoke('JoinSession').catch(console.error)

  const disconnect = () => {
    connectionRef.current?.stop()
    setConnected(false)
  }

  return { connected, addCounter, moveCounter, removeCounter, renameCounter, updateGrid, sendMessage, createScene, switchScene, deleteScene, updateInitiative, updateFog, addTile, moveTile, removeTile, setTileVisibility, setCounterVisibility, rejoinSession, disconnect }
}
