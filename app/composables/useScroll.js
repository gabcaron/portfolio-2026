import GSAP from 'gsap'

const LERP = 0.1          // force du lissage, pour un écran 60 Hz
const FRAME_MS = 1000 / 60

export function useScroll() {
  const scroll = reactive({
    current: 0,
    target: 0,
    last: 0,
    limit: 0
  })

  let lastTime = 0

  function onWheel({ pixelY }) {
    scroll.target += pixelY
  }

  // Tactile (mobile) : drag vertical + petite inertie au relâchement
  let touchY = 0
  let touchDelta = 0

  function onTouchStart(e) {
    touchY = e.touches[0].clientY
    touchDelta = 0
  }

  function onTouchMove(e) {
    const y = e.touches[0].clientY
    touchDelta = touchY - y
    scroll.target += touchDelta
    touchY = y
  }

  function onTouchEnd() {
    scroll.target += touchDelta * 10
    touchDelta = 0
  }

  function onResize(wrapper) {
    if (wrapper) {
      scroll.limit = Math.max(0, wrapper.clientHeight - window.innerHeight)
    }
  }

  function update(wrapper) {
    // Temps écoulé depuis la dernière image, en "images à 60 Hz"
    // (plafonné pour éviter un saut après un onglet en arrière-plan)
    const now = performance.now()
    const frames = lastTime ? Math.min((now - lastTime) / FRAME_MS, 4) : 1
    lastTime = now

    scroll.target = GSAP.utils.clamp(0, scroll.limit, scroll.target)

    // Lissage indépendant de la fréquence d'écran (60, 120, 144 Hz…)
    const ease = 1 - Math.pow(1 - LERP, frames)
    scroll.current = GSAP.utils.interpolate(scroll.current, scroll.target, ease)

    if (Math.abs(scroll.target - scroll.current) < 0.01) scroll.current = scroll.target

    if (wrapper) {
      // translate3d : déplacement géré par la carte graphique, sans redessiner la page
      wrapper.style.transform = `translate3d(0, ${-scroll.current}px, 0)`
    }

    scroll.last = scroll.current
  }

  function reset() {
    scroll.current = 0
    scroll.target = 0
    scroll.last = 0
    scroll.limit = 0
    lastTime = 0
  }

  return { scroll, onWheel, onTouchStart, onTouchMove, onTouchEnd, onResize, update, reset }
}