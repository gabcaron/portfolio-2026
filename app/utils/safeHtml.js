// Nettoie un texte venant du CMS avant de l'injecter avec v-html :
// tout est échappé, sauf une courte liste de balises sans attributs (<br>, <em> par défaut).
export function safeHtml(text = '', allowed = ['br', 'em']) {
  const escaped = String(text ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

  const allowedTags = new RegExp(`&lt;(\\/?)(${allowed.join('|')})\\s*\\/?&gt;`, 'gi')
  return escaped.replace(allowedTags, '<$1$2>')
}
