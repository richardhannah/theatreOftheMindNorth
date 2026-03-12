import { Outlet } from 'react-router-dom'
import Header from '../components/Header/Header'

function Dev() {
  return (
    <div className="dev">
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default Dev
