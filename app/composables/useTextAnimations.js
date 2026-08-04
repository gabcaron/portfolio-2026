import GSAP from 'gsap'

export function useTextAnimations() {
  const observers = []

  function animateIn(element) {
    GSAP.fromTo(element,
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 1, delay: 0.5 }
    )
  }

  function animateOut(element) {
    GSAP.set(element, { autoAlpha: 0 })
  }

  function observe(elements) {
    if (!elements || elements.length === 0) return

    const targets = elements instanceof NodeList
      ? [...elements]
      : Array.isArray(elements) ? elements : [elements]

    targets.forEach(el => {
      animateOut(el)

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateIn(entry.target)
          } else {
            animateOut(entry.target)
          }
        })
      }, {
        // ← Seuil très bas : déclenche dès qu'1px de l'élément est visible
        threshold: 0,
        // ← Marge positive : déclenche même légèrement AVANT que l'élément
        //   entre dans le viewport (évite le flash si l'élément est déjà visible)
        rootMargin: '0px 0px -10px 0px'
      })

      observer.observe(el)
      observers.push(observer)
    })
  }

  function disconnect() {
    observers.forEach(obs => obs.disconnect())
    observers.length = 0
  }

  return { observe, disconnect }
}