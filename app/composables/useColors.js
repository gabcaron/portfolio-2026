import GSAP from 'gsap'

export function useColors() {
  function change({ backgroundColor, color }) {
    GSAP.to(document.documentElement, {
      backgroundColor,
      color,
      duration: 1.5
    })
  }

  return { change }
}