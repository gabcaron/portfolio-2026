// Champs "case study" des projets, venant de Prismic.
// Si un champ est vide dans Prismic, on affiche la valeur par défaut ci-dessous.

const DEFAULT = {
  type: 'Project',
  client: '—',
  summary: '',
  focus: '—',
  tagline: '',
  challenge: '',
  approach: '',
  outcome: ''
}

export function getProjectExtra(project = {}) {
  const extra = { ...DEFAULT }
  Object.keys(DEFAULT).forEach(key => {
    const value = typeof project[key] === 'string' ? project[key].trim() : project[key]
    if (value) extra[key] = value
  })
  return extra
}

export function splitTitle(title = '') {
  const words = title.trim().split(' ')
  const last = words.length > 1 ? words.pop() : ''
  return { start: words.join(' '), last }
}
