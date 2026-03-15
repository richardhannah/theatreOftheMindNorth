import { useState, useEffect, useRef } from 'react'
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr'
import { useAuth } from '../auth/AuthContext'
import './DiceRoom.css'

const SERVER_URL = import.meta.env.VITE_SERVER_URL || (import.meta.env.DEV ? 'http://localhost:8080' : '')

function DiceRoom() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [name, setName] = useState('')
  const [nameSet, setNameSet] = useState(false)
  const { user } = useAuth()
  const connectionRef = useRef(null)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    const connection = new HubConnectionBuilder()
      .withUrl(`${SERVER_URL}/chatHub`)
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build()

    connectionRef.current = connection

    connection.on('ReceiveMessage', (msg) => {
      setMessages((prev) => [...prev, msg])
    })

    connection.onclose(() => console.log('Disconnected'))

    connection.start().catch((err) => console.error('Connection failed:', err))

    return () => {
      connection.stop()
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages])

  const send = (e) => {
    e.preventDefault()
    if (!input.trim() || !connectionRef.current) return

    const msg = { name, playerName: user?.username || '', text: input.trim(), ts: Date.now(), isDiceRoll: false }
    setMessages((prev) => [...prev, msg])
    connectionRef.current.invoke('SendMessage', msg).catch(console.error)
    setInput('')
  }

  if (!nameSet) {
    return (
      <div className="diceroom">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (name.trim()) setNameSet(true)
          }}
          className="diceroom-name-form"
        >
          <h2>Enter your character name</h2>
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Character name..."
          />
          <button type="submit">Join</button>
        </form>
      </div>
    )
  }

  return (
    <div className="diceroom-fixed">
      <div className="diceroom-chat">
        <div className="diceroom-messages">
          {messages.map((m, i) => (
            <div key={i} className={`diceroom-msg${m.isDiceRoll ? ' dice-roll' : ''}`}>
              <strong>{m.name}{m.playerName ? ` [${m.playerName}]` : ''}: </strong>
              {m.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={send} className="diceroom-form">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message or roll dice (#2d6+3)..."
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  )
}

export default DiceRoom
