import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Dev from './pages/Dev'
import DevHome from './pages/DevHome'
import Recap from './pages/Recap'
import Workbench from './pages/Workbench'

const isDev = import.meta.env.DEV

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dev" element={<Dev />}>
          <Route index element={<DevHome />} />
          <Route path="recap" element={<Recap />} />
        </Route>
        {isDev && <Route path="/workbench" element={<Workbench />} />}
      </Routes>
    </BrowserRouter>
  )
}

export default App
