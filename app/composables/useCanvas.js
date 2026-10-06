import { useGL } from './useGL'
import Home from '~/webgl/Home'

// État partagé en dehors de la fonction = singleton, comme useGL.
// Seul l'accueil utilise le WebGL (galerie de polaroids).
const state = reactive({
  template: null,
  sizes: { width: 0, height: 0 },
  home: null
})

const x = { start: 0, distance: 0, end: 0 }
const y = { start: 0, distance: 0, end: 0 }
let isDown = false

export function useCanvas() {
  const { renderer, camera, scene, gl } = useGL()

  function mountCanvasToDOM() {
    if (gl.value && !gl.value.canvas.parentElement) {
      document.body.appendChild(gl.value.canvas)
    }
  }

  function createHome() {
    const assetsStore = useAssetsStore()

    if (!assetsStore.isReady) {
      console.warn('[Canvas] createHome() appelé avant que les textures soient prêtes')
      return
    }

    state.home = new Home({ gl: gl.value, scene, sizes: state.sizes })
  }

  function destroyHome() {
    if (!state.home) return
    state.home.destroy()
    state.home = null
  }

  // --- Events ---

  function onChangeStart() {
    state.home?.hide()
  }

  function onChangeEnd(template) {
    if (template === 'home') createHome()
    else destroyHome()

    state.template = template
  }

  function onResize() {
    if (!renderer) return

    renderer.setSize(window.innerWidth, window.innerHeight)

    camera.perspective({ aspect: window.innerWidth / window.innerHeight })

    const fov = camera.fov * (Math.PI / 180)
    const height = 2 * Math.tan(fov / 2) * camera.position.z
    const width = height * camera.aspect

    state.sizes = { height, width }

    state.home?.onResize({ sizes: state.sizes })
  }

  function onTouchDown(e) {
    isDown = true
    x.start = e.touches ? e.touches[0].clientX : e.clientX
    y.start = e.touches ? e.touches[0].clientY : e.clientY

    state.home?.onTouchDown({ x, y })
  }

  function onTouchMove(e) {
    if (!isDown) return

    x.end = e.touches ? e.touches[0].clientX : e.clientX
    y.end = e.touches ? e.touches[0].clientY : e.clientY

    state.home?.onTouchMove({ x, y })
  }

  function onTouchUp(e) {
    isDown = false
    x.end = e.changedTouches ? e.changedTouches[0].clientX : e.clientX
    y.end = e.changedTouches ? e.changedTouches[0].clientY : e.clientY

    state.home?.onTouchUp({ x, y })
  }

  function onWheel(e) {
    state.home?.onWheel(e)
  }

  function update() {
    state.home?.update()
    renderer.render({ camera, scene })
  }

  return {
    state,
    mountCanvasToDOM,
    onChangeStart,
    onChangeEnd,
    onResize,
    onTouchDown,
    onTouchMove,
    onTouchUp,
    onWheel,
    update
  }
}
