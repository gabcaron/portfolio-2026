import { Mesh, Program } from 'ogl'
import GSAP from 'gsap'

import vertex from '~/assets/shaders/home-vertex.glsl?raw'
import fragment from '~/assets/shaders/home-fragment.glsl?raw'

import { useAssetsStore } from '~/stores/assets'

export default class Media {
  constructor({ element, geometry, gl, index, scene, sizes }) {
    this.element = element
    this.gl = gl
    this.geometry = geometry
    this.scene = scene
    this.index = index
    this.sizes = sizes

    this.extra = { x: 0, y: 0 }

    this.createTexture()
    this.createProgram()
    this.createMesh()
  }

  createTexture() {
    const assetsStore = useAssetsStore()
    const src = this.element.getAttribute('data-src')
    this.texture = assetsStore.textures[src]

    if (!this.texture) {
      console.warn(`[Media] Texture manquante pour : ${src}`)
    }
  }

  createProgram() {
    // Ne crée pas le Program si la texture est manquante
    if (!this.texture) return

    this.program = new Program(this.gl, {
      fragment,
      vertex,
      uniforms: {
        uAlpha: { value: 0 },
        uSpeed: { value: 0 },
        uViewportSizes: { value: [this.sizes.width, this.sizes.height] },
        tMap: { value: this.texture }
      }
    })
  }

  createMesh() {
    // Ne crée pas le Mesh si le Program n'existe pas
    if (!this.program) return

    this.mesh = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program
    })
    this.mesh.setParent(this.scene)
    this.mesh.rotation.z = GSAP.utils.random(-Math.PI * 0.03, Math.PI * 0.03)
  }

  createBounds({ sizes }) {
    this.sizes = sizes
    this.bounds = this.element.getBoundingClientRect()

    this.updateScale()
    this.updateX()
    this.updateY()
  }

  show() {
    if (!this.program) return
    GSAP.fromTo(
      this.program.uniforms.uAlpha,
      { value: 0 },
      { value: 0.4 }
    )
  }

  hide() {
    if (!this.program) return
    GSAP.to(this.program.uniforms.uAlpha, { value: 0 })
  }

  onResize(sizes, scroll) {
    this.extra = { x: 0, y: 0 }

    this.createBounds(sizes)
    this.updateX(scroll && scroll.x)
    this.updateY(scroll && scroll.y)
  }

  updateScale() {
    this.height = this.bounds.height / window.innerHeight
    this.width = this.bounds.width / window.innerWidth

    this.mesh.scale.x = this.sizes.width * this.width
    this.mesh.scale.y = this.sizes.height * this.height
  }

  updateX(x = 0) {
    this.x = (this.bounds.left + x) / window.innerWidth
    this.mesh.position.x = (-this.sizes.width / 2) + (this.mesh.scale.x / 2) + (this.x * this.sizes.width) + this.extra.x
  }

  updateY(y = 0) {
    this.y = (this.bounds.top + y) / window.innerHeight
    this.mesh.position.y = (this.sizes.height / 2) - (this.mesh.scale.y / 2) - (this.y * this.sizes.height) + this.extra.y
  }

  update(scroll, speed) {
    if (!this.mesh || !this.program) return
    this.updateX(scroll.x)
    this.updateY(scroll.y)
    this.program.uniforms.uSpeed.value = speed
  }
}