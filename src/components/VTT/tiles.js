const tileModules = import.meta.glob('../../assets/vtt/tiles/*.{png,jpg,jpeg,webp}', { eager: true, import: 'default' })

const tiles = Object.entries(tileModules).map(([path, src]) => {
  const filename = path.split('/').pop().replace(/\.\w+$/, '')
  const label = filename
    .replace(/tile$/i, '')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[-_]/g, ' ')
    .trim()
    .replace(/^\w/, (c) => c.toUpperCase())
  return { id: filename, label, src }
}).sort((a, b) => a.label.localeCompare(b.label))

export default tiles
