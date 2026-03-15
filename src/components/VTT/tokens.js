const tokenModules = import.meta.glob('../../assets/vtt/*.png', { eager: true, import: 'default' })

const tokens = Object.entries(tokenModules).map(([path, src]) => {
  const filename = path.split('/').pop().replace('.png', '')
  // Convert camelCase/filename to readable label
  const label = filename
    .replace(/token$/i, '')
    .replace(/counter$/i, '')
    .replace(/Counter\d*$/i, '')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[-_]/g, ' ')
    .replace(/\d+$/, '')
    .trim()
    .replace(/^\w/, (c) => c.toUpperCase())
  return { id: filename, label, src }
}).sort((a, b) => a.label.localeCompare(b.label))

export default tokens
