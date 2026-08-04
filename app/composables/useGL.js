// app/composables/useGL.js
import { Renderer, Camera, Transform } from 'ogl'

let renderer = null
let camera = null
let scene = null

export function useGL() {
  function init() {
    if (renderer || typeof window === 'undefined') return

    renderer = new Renderer({ alpha: true, antialias: true })

    camera = new Camera(renderer.gl)
    camera.position.z = 5

    scene = new Transform()
  }

  init()

  return {
    renderer,
    camera,
    scene,
    gl: computed(() => renderer?.gl ?? null)
  }
}