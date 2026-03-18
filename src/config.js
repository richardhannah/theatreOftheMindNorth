export const API_URL = import.meta.env.VITE_SERVER_URL || (import.meta.env.DEV ? 'http://localhost:8080' : '')

// Feature toggles
export const FEATURES = {
  VIDEO_CONFERENCING: import.meta.env.VITE_FEATURE_VIDEO === 'true',
}

// Digital Samba configuration (only used when VIDEO_CONFERENCING is enabled)
export const VIDEO_CONFIG = {
  team: import.meta.env.VITE_SAMBA_TEAM || 'theatreofthemind',
  room: import.meta.env.VITE_SAMBA_ROOM || 'vtt',
}
