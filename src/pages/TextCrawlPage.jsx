import TextCrawl from '../components/TextCrawl/TextCrawl'
import fortuneGloryLogo from '../assets/recap/FortuneGlory.PNG'

const crawlParagraphs = [
  'It is a time of darkness. The Iron Ring, a ruthless band of slavers, tightens its grip across the Republic of Darokin, its agents hidden in every shadow.',
  "Sent by the mysterious Lord Blackthorn, a band of brave adventurers known as Coltello's Crew has fought their way through Castle Caldwell, battled cultists and wyverns, and liberated the town of Reedle from the Iron Ring's clutches.",
  "Now, deep in the Black Peak Mountains, the crew presses onward to the ancient monastery above Guido's Fort, seeking the long-lost tomb of the pirate John Blackbeard and the legendary Stormchaser's compass that lies within....",
]

function TextCrawlPage() {
  return (
    <TextCrawl
      title="Fortune & Glory"
      subtitle="Season Two"
      tagline="A long time ago in a land far, far away...."
      logo={fortuneGloryLogo}
      paragraphs={crawlParagraphs}
    />
  )
}

export default TextCrawlPage
