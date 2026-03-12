import { Link } from 'react-router-dom'
import logo from '../../assets/WebsiteLogo1024.png'
import './Header.css'

function Header() {
  return (
    <header className="header">
      <div className="header-banner">
        <Link to="/">
          <img src={logo} alt="Theatre of the Mind" className="header-logo" />
        </Link>
      </div>
      <nav className="header-menubar">
        <Link to="/dev" className="menu-link">Home</Link>
        <Link to="/dev/recap" className="menu-link">Recap</Link>
        <Link to="/dev/house-rules" className="menu-link">House Rules</Link>
        <Link to="/dev/map" className="menu-link">Map</Link>
        <Link to="/dev/lore" className="menu-link">Lore</Link>
        <Link to="/dev/weapon-mastery" className="menu-link">Weapon Mastery</Link>
      </nav>
    </header>
  )
}

export default Header
