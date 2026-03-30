import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import { useVttModal } from '../VTT/VttModalContext'
import logo from '../../assets/WebsiteLogo1024.png'
import headerBg from '../../assets/headerbackcomposite.png'
import './Header.css'

function Header() {
  const { user } = useAuth()
  const { pathname } = useLocation()
  const compact = pathname === '/vtt'
  const vttModal = useVttModal()
  const navigate = useNavigate()
  const isUser = user && user.role !== 'Guest'

  return (
    <header className="header">
      {!compact && (
        <div className="header-banner" style={{ backgroundImage: `url(${headerBg})` }}>
          <Link to="/">
            <img src={logo} alt="Theatre of the Mind" className="header-logo" />
          </Link>
        </div>
      )}
      <nav className="header-menubar">
        {!compact && <Link to="/" className="menu-link">Home</Link>}
        {compact ? (
          <button className="menu-link" onClick={() => vttModal.openPage('recap')}>Recap</button>
        ) : (
          <Link to="/recap" className="menu-link">Recap</Link>
        )}
        {compact ? (
          <button className="menu-link" onClick={() => vttModal.openPage('house-rules')}>House Rules</button>
        ) : (
          <Link to="/house-rules" className="menu-link">House Rules</Link>
        )}
        {!compact && <Link to="/map" className="menu-link">Map</Link>}
        {compact ? (
          <button className="menu-link" onClick={() => vttModal.openPage('lore')}>Lore</button>
        ) : (
          <Link to="/lore" className="menu-link">Lore</Link>
        )}
        {compact ? (
          <button className="menu-link" onClick={() => vttModal.openPage('weapon-mastery')}>Weapon Mastery</button>
        ) : (
          <Link to="/weapon-mastery" className="menu-link">Weapon Mastery</Link>
        )}
        {isUser && (compact ? (
          <button className="menu-link" onClick={() => vttModal.openPage('expedition')}>Expedition</button>
        ) : (
          <Link to="/expedition" className="menu-link">Expedition</Link>
        ))}
        {isUser && <Link to="/vtt" className="menu-link">VTT</Link>}
        {isUser && (compact ? (
          <button className="menu-link" onClick={() => vttModal.openCharacters()}>Characters</button>
        ) : (
          <Link to="/characters" className="menu-link">Characters</Link>
        ))}
        <span className="menu-spacer" />
        {compact && (
          <button className="menu-link menu-link-disconnect" onClick={() => {
            vttModal.disconnect()
            navigate('/')
          }}>Disconnect</button>
        )}
        {user?.role === 'Admin' && (
          <Link to="/admin" className="menu-link menu-link-admin">Admin</Link>
        )}
        <Link to="/login" className="menu-link menu-link-user">
          {user ? user.username : 'Login'}
        </Link>
      </nav>
    </header>
  )
}

export default Header
