import { useState, useEffect } from 'react'
import './TextCrawl.css'

function TextCrawl({ title, subtitle, paragraphs, logo, tagline }) {
  const [phase, setPhase] = useState('tagline') // tagline -> blank -> crawl

  useEffect(() => {
    const blankTimer = setTimeout(() => setPhase('blank'), 6000)
    const crawlTimer = setTimeout(() => setPhase('crawl'), 7500)
    return () => {
      clearTimeout(blankTimer)
      clearTimeout(crawlTimer)
    }
  }, [])

  return (
    <div className="crawl-wrapper">
    <div className="crawl-container">
      {/* Phase 1: Tagline */}
      {phase === 'tagline' && (
        <div className="crawl-tagline">
          <p>{tagline}</p>
        </div>
      )}

      {/* Phase 2+3: Logo appears and immediately recedes, crawl follows */}
      {phase === 'crawl' && (
        <>
          <div className="crawl-logo logo-recede">
            <img src={logo} alt={title} />
          </div>
          <div className="crawl-fade-top" />
          <div className="crawl-fade-bottom" />
          <div className="crawl-perspective">
            <div className="crawl-content">
              <p className="crawl-subtitle">{subtitle}</p>
              <div className="crawl-text">
                {paragraphs.map((text, i) => (
                  <p key={i}>{text}</p>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
    </div>
  )
}

export default TextCrawl
