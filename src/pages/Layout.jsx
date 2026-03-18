import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Header from '../components/Header/Header'

function Layout() {
  const { pathname } = useLocation()
  const fullWidth = pathname === '/vtt'

  useEffect(() => {
    document.getElementById('root').classList.toggle('root-full', fullWidth)
    return () => document.getElementById('root').classList.remove('root-full')
  }, [fullWidth])

  return (
    <div className="layout">
      <Header />
      <main style={fullWidth ? { flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 } : undefined}>
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
