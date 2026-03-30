import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider, useAuth } from './auth/AuthContext'
import { VttModalProvider } from './components/VTT/VttModalContext'
import Layout from './pages/Layout'
import DevHome from './pages/DevHome'
import Recap from './pages/Recap'
import HouseRules from './pages/HouseRules'
import Map from './pages/Map'
import Lore from './pages/Lore'
import WeaponMastery from './pages/WeaponMastery'
import TextCrawlPage from './pages/TextCrawlPage'
import Workbench from './pages/Workbench'
import Login from './pages/Login'
import Admin from './pages/Admin'
import Characters from './pages/Characters'
import CharacterSheetPage from './pages/CharacterSheetPage'
import Expedition from './pages/Expedition'

const isDev = import.meta.env.DEV

function RequireUser({ children }) {
  const { user } = useAuth()
  if (!user) return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--pale-gold)' }}><h2>Login Required</h2><p>You must be logged in to access this page.</p></div>
  if (user.role === 'Guest') return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--pale-gold)' }}><h2>Access Restricted</h2><p>Your account has not yet been granted access to this feature. Ask the DM to upgrade your role.</p></div>
  return children
}

function App() {
  return (
    <AuthProvider>
      <VttModalProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<DevHome />} />
            <Route path="recap" element={<Recap />} />
            <Route path="house-rules" element={<HouseRules />} />
            <Route path="map" element={<Map />} />
            <Route path="lore" element={<Lore />} />
            <Route path="weapon-mastery" element={<WeaponMastery />} />
            <Route path="textcrawl" element={<TextCrawlPage />} />
            <Route path="vtt" element={<RequireUser><Workbench /></RequireUser>} />
            <Route path="login" element={<Login />} />
            <Route path="admin" element={<Admin />} />
            <Route path="characters" element={<RequireUser><Characters /></RequireUser>} />
            <Route path="characters/:characterId" element={<RequireUser><CharacterSheetPage /></RequireUser>} />
            <Route path="expedition" element={<RequireUser><Expedition /></RequireUser>} />
          </Route>
          {isDev && <Route path="/workbench" element={<Workbench />} />}
        </Routes>
      </BrowserRouter>
      </VttModalProvider>
    </AuthProvider>
  )
}

export default App
