import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './pages/Layout'
import DevHome from './pages/DevHome'
import Recap from './pages/Recap'
import HouseRules from './pages/HouseRules'
import Map from './pages/Map'
import Lore from './pages/Lore'
import WeaponMastery from './pages/WeaponMastery'
import TextCrawlPage from './pages/TextCrawlPage'
import Workbench from './pages/Workbench'

const isDev = import.meta.env.DEV

function App() {
  return (
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
        </Route>
        {isDev && <Route path="/workbench" element={<Workbench />} />}
      </Routes>
    </BrowserRouter>
  )
}

export default App
