import { Link } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import logo from '../../assets/WebsiteLogo1024.png'
import headerBg from '../../assets/headerbackcomposite.png'
import './Header.css'

function Header() {
  const { user } = useAuth()

  return (
    <header className="header">
      <div className="header-banner" style={{ backgroundImage: `url(${headerBg})` }}>
        <Link to="/">
          <img src={logo} alt="Theatre of the Mind" className="header-logo" />
        </Link>
      </div>
      <nav className="header-menubar">
        <Link to="/" className="menu-link">Home</Link>
        <Link to="/recap" className="menu-link">Recap</Link>
        <Link to="/house-rules" className="menu-link">House Rules</Link>
        <Link to="/map" className="menu-link">Map</Link>
        <Link to="/lore" className="menu-link">Lore</Link>
        <Link to="/weapon-mastery" className="menu-link">Weapon Mastery</Link>
        <Link to="/vtt" className="menu-link">VTT</Link>
        {user && <Link to="/characters" className="menu-link">Characters</Link>}
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
