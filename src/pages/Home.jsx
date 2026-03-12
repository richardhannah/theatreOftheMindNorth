import dragonImg from '../assets/dragon.png'
import './Home.css'

function Home() {
  return (
    <div className="home">
      <h1 className="title">Theatre of the Mind</h1>
      <h2 className="subtitle">Fortune & Glory - Season Two</h2>
      <img src={dragonImg} alt="Dragon" className="dragon" />
      <p className="coming-soon">Coming soon...</p>
    </div>
  )
}

export default Home
