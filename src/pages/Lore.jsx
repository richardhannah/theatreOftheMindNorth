import { useState } from 'react'
import { loreItems, CAMPAIGN, WORLD, IMMORTALS } from './loreData'
import WorldDate from '../components/WorldDate/WorldDate'
import './Lore.css'

const categories = [
  { key: CAMPAIGN, label: 'Campaign', description: 'Lore found on the campaign trail' },
  { key: WORLD, label: 'World', description: 'Discover Mystara' },
  { key: IMMORTALS, label: 'Immortals', description: 'Knowledge of the Divine' },
]

const images = import.meta.glob('../assets/lore/*.png', { eager: true })

function getImage(filename) {
  if (!filename) return null
  const match = Object.entries(images).find(([path]) => path.endsWith(filename))
  return match ? match[1].default : null
}

function Lore() {
  const [selected, setSelected] = useState(loreItems[0])
  const [openCategory, setOpenCategory] = useState(CAMPAIGN)

  const toggleCategory = (cat) => {
    setOpenCategory(openCategory === cat ? null : cat)
  }

  return (
    <div className="lore-page">
      <nav className="lore-sidebar">
        {categories.map((cat) => (
          <div key={cat.key} className="lore-category">
            <button
              className={`lore-category-header ${openCategory === cat.key ? 'open' : ''}`}
              onClick={() => toggleCategory(cat.key)}
            >
              <span className="lore-category-title">{cat.label}</span>
              <span className="lore-category-desc">{cat.description}</span>
            </button>
            {openCategory === cat.key && (
              <div className="lore-nav-items">
                {loreItems
                  .filter((item) => item.category === cat.key)
                  .map((item) => (
                    <button
                      key={item.key}
                      className={`lore-nav-btn ${selected.key === item.key ? 'active' : ''}`}
                      onClick={() => setSelected(item)}
                    >
                      {item.title}
                    </button>
                  ))}
              </div>
            )}
          </div>
        ))}
      </nav>
      <article className="lore-content">
        <h1>{selected.title}</h1>
        {selected.dateFound && (
          <h2>Discovered: <WorldDate shortDate={selected.dateFound} /></h2>
        )}
        <div className="lore-text">
          {selected.content.split('\n\n').map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
        {selected.image && (
          <div className="lore-media">
            <img src={getImage(selected.image)} alt={selected.title} />
          </div>
        )}
      </article>
    </div>
  )
}

export default Lore
