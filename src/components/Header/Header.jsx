import { Link, useLocation } from 'react-router-dom'
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
        {compact ? (
          <button className="menu-link" onClick={() => {
            if (confirm('Leaving the VTT will disconnect you from the video chat. Continue?')) {
              window.location.href = '/'
            }
          }}>Home</button>
        ) : (
          <Link to="/" className="menu-link">Home</Link>
        )}
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
        {user && <Link to="/vtt" className="menu-link">VTT</Link>}
        {user && (compact ? (
          <button className="menu-link" onClick={() => vttModal.openCharacters()}>Characters</button>
        ) : (
          <Link to="/characters" className="menu-link">Characters</Link>
        ))}
        <span className="menu-spacer" />
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
