// "Terre d'Opale Habitat" -> "terre-dopale-habitat"
// Sans accent, mots séparés par des tirets, lettres uniquement dans chaque mot.
export function slugify(title = '') {
  return title
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .split(/\s+/)
    .map(word => word.replace(/[^a-z]/g, ''))
    .filter(Boolean)
    .join('-')
}
