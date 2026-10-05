import GSAP from 'gsap'

export function useScroll() {
  const scroll = reactive({
    current: 0,
    target: 0,
    last: 0,
    limit: 0
  })

  let transformPrefix = null

  if (typeof window !== 'undefined') {
    // Detect vendor prefix for transform (équivalent de Prefix('transform'))
    const el = document.createElement('div')
    const props = ['transform', 'webkitTransform', 'MozTransform']
    transformPrefix = props.find(p => el.style[p] !== undefined) || 'transform'
  }

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
      scroll.limit = wrapper.clientHeight - window.innerHeight
    }
  }

  function update(wrapper) {
    scroll.target = GSAP.utils.clamp(0, scroll.limit, scroll.target)

    scroll.current = GSAP.utils.interpolate(scroll.current, scroll.target, 0.1)

    if (scroll.current < 0.01) scroll.current = 0

    if (wrapper && transformPrefix) {
      wrapper.style[transformPrefix] = `translateY(-${scroll.current}px)`
    }

    scroll.last = scroll.current
  }

  function reset() {
    scroll.current = 0
    scroll.target = 0
    scroll.last = 0
    scroll.limit = 0
  }

  return { scroll, onWheel, onTouchStart, onTouchMove, onTouchEnd, onResize, update, reset }
}