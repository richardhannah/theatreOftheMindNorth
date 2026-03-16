// Deterministic colour from a string
function nameToColor(name) {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  const h = ((hash % 360) + 360) % 360
  return `hsl(${h}, 55%, 40%)`
}

function getInitials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0].toUpperCase())
    .slice(0, 2)
    .join('')
}

function InitialsToken({ name, size = 48 }) {
  const initials = getInitials(name || '?')
  const bg = nameToColor(name || '?')
  const fontSize = size * (initials.length > 1 ? 0.38 : 0.45)

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={size / 2} fill={bg} />
      <text
        x="50%"
        y="50%"
        dy=".1em"
        textAnchor="middle"
        dominantBaseline="central"
        fill="#fff"
        fontFamily="system-ui, sans-serif"
        fontWeight="600"
        fontSize={fontSize}
      >
        {initials}
      </text>
    </svg>
  )
}

export default InitialsToken
export { nameToColor, getInitials }
