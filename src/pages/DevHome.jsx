import dragonImg from '../assets/dragon.png'
import './DevHome.css'

function DevHome() {
  return (
    <div className="dev-home">
      <h2 className="subtitle">Fortune & Glory - Season Two</h2>
      <img src={dragonImg} alt="Dragon" className="dragon" />
      <p className="coming-soon">Coming soon...</p>
    </div>
  )
}

export default DevHome
