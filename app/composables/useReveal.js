// Lance une animation une seule fois, quand l'élément arrive à l'écran.
// Les observers sont nettoyés automatiquement quand le composant est démonté.
export function useReveal() {
  const observers = []

  function observeOnce(el, animation, threshold = 0.15) {
    if (!el) return
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        animation()
        observer.disconnect()
      }
    }, { threshold })
    observer.observe(el)
    observers.push(observer)
  }

  onUnmounted(() => observers.forEach(observer => observer.disconnect()))

  return { observeOnce }
}
