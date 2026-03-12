import { Outlet } from 'react-router-dom'
import Header from '../components/Header/Header'

function Layout() {
  return (
    <div className="layout">
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
