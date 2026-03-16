const mapModules = import.meta.glob('../../assets/vtt/maps/*.{jpg,jpeg,png,webp}', { eager: true, import: 'default' })

const maps = Object.entries(mapModules).map(([path, src]) => {
  const filename = path.split('/').pop().replace(/\.\w+$/, '')
  const label = filename
    .replace(/[-_]/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/^\w/, (c) => c.toUpperCase())
  return { id: filename, label, src }
}).sort((a, b) => a.label.localeCompare(b.label))

export default maps
