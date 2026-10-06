import { useScroll } from './useScroll'

// Scroll fluide commun aux pages qui défilent (About, Projects, Case study, Legal) :
// limite recalculée à chaque changement de hauteur, tactile mobile, et branchement à app.vue.
export function usePageScroll(wrapperEl, emit, onReady) {
  const { scroll, onWheel, onTouchStart, onTouchMove, onTouchEnd, onResize, update, reset } = useScroll()
  const resize = () => onResize(wrapperEl.value)
  let resizeObserver = null

  onMounted(() => {
    nextTick(() => {
      resize()

      // Recalcule la limite de scroll quand la hauteur change (images, polices, langue, responsive)
      resizeObserver = new ResizeObserver(resize)
      resizeObserver.observe(wrapperEl.value)

      window.addEventListener('touchstart', onTouchStart, { passive: true })
      window.addEventListener('touchmove', onTouchMove, { passive: true })
      window.addEventListener('touchend', onTouchEnd, { passive: true })

      onReady?.()

      emit('page-ready', {
        scroll,
        update: () => update(wrapperEl.value),
        onWheel,
        onResize: resize
      })
    })
  })

  onUnmounted(() => {
    resizeObserver?.disconnect()
    window.removeEventListener('touchstart', onTouchStart)
    window.removeEventListener('touchmove', onTouchMove)
    window.removeEventListener('touchend', onTouchEnd)
    reset()
  })

  return { scroll }
}
