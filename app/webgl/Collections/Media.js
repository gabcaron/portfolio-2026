import GSAP from 'gsap'
import { Mesh, Program, Texture } from 'ogl'
import vertex from '~/assets/shaders/collections-vertex.glsl'
import fragment from '~/assets/shaders/collections-fragment.glsl'

export default class Media {
  constructor({ element, geometry, gl, scene, sizes }) {
    this.element = element
    this.geometry = geometry
    this.gl = gl
    this.scene = scene
    this.sizes = sizes

    this.alpha = { current: 0, target: 0, lerp: 0.07 }
    this.scale = { current: 1.04, target: 1, lerp: 0.05 }
    this.shouldShow = false

    this.createBounds()
  }

  // Appelé depuis projects.vue avec l'image déjà chargée
  setImage(image) {
    const texture = new Texture(this.gl, { image })

    if (!this.program) {
      this.texture = texture
      this.createProgram()
      this.createMesh()
      if (this.shouldShow) this.show()
    } else {
      // Fade out → swap texture → fade in
      this.alpha.target = 0
      setTimeout(() => {
        this.program.uniforms.tMap.value = texture
        this.scale.current = 1.04
        this.scale.target = 1
        this.alpha.target = 1
      }, 280)
    }
  }

  createProgram() {
    if (!this.texture) return
    this.program = new Program(this.gl, {
      fragment,
      vertex,
      uniforms: {
        uAlpha: { value: 0 },
        tMap: { value: this.texture }
      }
    })
  }

  createMesh() {
    if (!this.program) return
    this.mesh = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program
    })
    this.mesh.setParent(this.scene)
    this.updateMesh()
  }

  createBounds() {
    if (this.element) {
      this.bounds = this.element.getBoundingClientRect()
    }
  }

  show() {
    if (!this.program) { this.shouldShow = true; return }
    this.shouldShow = false
    this.scale.current = 1.04
    this.scale.target = 1
    this.alpha.target = 1
  }

  hide() {
    if (!this.program) return
    this.alpha.target = 0
  }

  onResize({ sizes }) {
    this.sizes = sizes
    this.createBounds()
    if (this.mesh) this.updateMesh()
  }

  updateMesh() {
    if (!this.mesh || !this.bounds) return
    const cx = (this.bounds.left + this.bounds.width / 2) / window.innerWidth
    const cy = (this.bounds.top + this.bounds.height / 2) / window.innerHeight
    this.mesh.position.x = -this.sizes.width / 2 + cx * this.sizes.width
    this.mesh.position.y = this.sizes.height / 2 - cy * this.sizes.height
    this.mesh.scale.x = (this.bounds.width / window.innerWidth) * this.sizes.width
    this.mesh.scale.y = (this.bounds.height / window.innerHeight) * this.sizes.height
  }

  update() {
    if (!this.mesh || !this.program) return

    this.alpha.current = GSAP.utils.interpolate(
      this.alpha.current, this.alpha.target, this.alpha.lerp
    )
    this.program.uniforms.uAlpha.value = this.alpha.current

    this.scale.current = GSAP.utils.interpolate(
      this.scale.current, this.scale.target, this.scale.lerp
    )

    this.createBounds()
    const cx = (this.bounds.left + this.bounds.width / 2) / window.innerWidth
    const cy = (this.bounds.top + this.bounds.height / 2) / window.innerHeight
    this.mesh.position.x = -this.sizes.width / 2 + cx * this.sizes.width
    this.mesh.position.y = this.sizes.height / 2 - cy * this.sizes.height
    this.mesh.scale.x = (this.bounds.width / window.innerWidth) * this.sizes.width * this.scale.current
    this.mesh.scale.y = (this.bounds.height / window.innerHeight) * this.sizes.height * this.scale.current
  }

  destroy() {}
}