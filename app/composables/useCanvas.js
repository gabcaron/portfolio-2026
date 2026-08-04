import { useGL } from './useGL'
import Home from '~/webgl/Home'
import About from '~/webgl/About'
import Collections from '~/webgl/Collections'

// État partagé en dehors de la fonction = singleton, comme useGL
const state = reactive({
  template: null,
  sizes: { width: 0, height: 0 },
  home: null,
  about: null,
  collections: null,
  detail: null,
  transition: null
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

  // --- Création/destruction de sous-scènes ---
  // NB: Home/About/Collections/Detail (les classes OGL pures) seront portées
  // aux étapes 4 à 7, en gardant leur logique interne quasi identique
  // (mêmes constructeurs, mêmes méthodes onResize/update/show/hide).

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

  function createAbout() {
    state.about = new About({ gl: gl.value, scene, sizes: state.sizes })
  }

  function destroyAbout() {
    if (!state.about) return
    state.about.destroy()
    state.about = null
  }

  function createCollections() {
    const medias = document.querySelectorAll('.projects__gallery__media')
   
    if (medias.length === 0) {
      console.warn('[Canvas] createCollections: DOM pas prêt, retry dans 100ms')
      setTimeout(() => createCollections(), 100)
      return
    }

    state.collections = new Collections({ gl: gl.value, scene, sizes: state.sizes })
  }

  function destroyCollections() {
    if (!state.collections) return
    state.collections.destroy()
    state.collections = null
  }

  function createDetail() {
    const { default: Detail } = require('~/webgl/Detail')
    state.detail = new Detail({
      gl: gl.value,
      scene,
      sizes: state.sizes,
      transition: state.transition
    })
  }

  function destroyDetail() {
    if (!state.detail) return
    state.detail.destroy()
    state.detail = null
  }

  // --- Events ---

  function onPreloaded() {
    onChangeEnd(state.template)
  }

  function onChangeStart(template, url) {
    state.home?.hide()
    state.collections?.hide()
    state.detail?.hide()
    state.about?.hide()

    const isFromCollectionsToDetail = state.template === 'collections' && url.indexOf('detail') > -1
    const isFromDetailToCollections = state.template === 'detail' && url.indexOf('collections') > -1

    if (isFromCollectionsToDetail || isFromDetailToCollections) {
      const { default: Transition } = require('~/webgl/Transition')
      state.transition = new Transition({ gl: gl.value, scene, sizes: state.sizes, url })
      state.transition.setElement(state.collections || state.detail)
    }
  }

  function onChangeEnd(template) {
    if (template === 'home') createHome()
    else destroyHome()

    if (template === 'about') createAbout()
    else if (state.about) destroyAbout()

    if (template === 'detail') createDetail()
    else if (state.detail) destroyDetail()

    if (template === 'collections' || template === 'projects') createCollections()
    else if (state.collections) destroyCollections()

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

    const values = { sizes: state.sizes }

    state.about?.onResize(values)
    state.collections?.onResize(values)
    state.detail?.onResize(values)
    state.home?.onResize(values)
  }

  function onTouchDown(e) {
    isDown = true
    x.start = e.touches ? e.touches[0].clientX : e.clientX
    y.start = e.touches ? e.touches[0].clientY : e.clientY

    const values = { x, y }
    state.about?.onTouchDown(values)
    state.collections?.onTouchDown(values)
    state.detail?.onTouchDown(values)
    state.home?.onTouchDown(values)
  }

  function onTouchMove(e) {
    if (!isDown) return

    x.end = e.touches ? e.touches[0].clientX : e.clientX
    y.end = e.touches ? e.touches[0].clientY : e.clientY

    const values = { x, y }
    state.about?.onTouchMove(values)
    state.collections?.onTouchMove(values)
    state.detail?.onTouchMove(values)
    state.home?.onTouchMove(values)
  }

  function onTouchUp(e) {
    isDown = false
    x.end = e.changedTouches ? e.changedTouches[0].clientX : e.clientX
    y.end = e.changedTouches ? e.changedTouches[0].clientY : e.clientY

    const values = { x, y }
    state.about?.onTouchUp(values)
    state.collections?.onTouchUp(values)
    state.detail?.onTouchUp(values)
    state.home?.onTouchUp(values)
  }

  function onWheel(e) {
    state.home?.onWheel(e)
    state.collections?.onWheel(e)
  }

  function update(scroll) {
    state.about?.update(scroll)
    state.collections?.update()
    state.detail?.update()
    state.home?.update()

    renderer.render({ camera, scene })
  }

  return {
    state,
    mountCanvasToDOM,
    onPreloaded,
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