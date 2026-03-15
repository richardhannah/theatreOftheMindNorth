import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext'
import Layout from './pages/Layout'
import DevHome from './pages/DevHome'
import Recap from './pages/Recap'
import HouseRules from './pages/HouseRules'
import Map from './pages/Map'
import Lore from './pages/Lore'
import WeaponMastery from './pages/WeaponMastery'
import TextCrawlPage from './pages/TextCrawlPage'
import Workbench from './pages/Workbench'
import DiceRoom from './pages/DiceRoom'
import Login from './pages/Login'
import Admin from './pages/Admin'
import Characters from './pages/Characters'
import CharacterSheetPage from './pages/CharacterSheetPage'

const isDev = import.meta.env.DEV

function App() {
  return (
    <AuthProvider>
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
            <Route path="diceroom" element={<DiceRoom />} />
            <Route path="login" element={<Login />} />
            <Route path="admin" element={<Admin />} />
            <Route path="characters" element={<Characters />} />
            <Route path="characters/:characterId" element={<CharacterSheetPage />} />
          </Route>
          {isDev && <Route path="/workbench" element={<Workbench />} />}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
