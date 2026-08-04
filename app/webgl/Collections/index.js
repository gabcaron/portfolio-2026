import { Plane, Transform } from 'ogl'
import Media from './Media'

export default class Collections {
  constructor({ gl, scene, sizes }) {
    this.gl = gl
    this.scene = scene
    this.sizes = sizes

    this.group = new Transform()
    this.mediaElement = document.querySelector('.projects__media')

    this.createGeometry()
    this.createMedia()
    this.onResize({ sizes: this.sizes })
    this.group.setParent(this.scene)
    this.media.show()
  }

  createGeometry() {
    this.geometry = new Plane(this.gl)
  }

  createMedia() {
    this.media = new Media({
      element: this.mediaElement,
      geometry: this.geometry,
      gl: this.gl,
      scene: this.group,
      sizes: this.sizes
    })
  }

  show() { this.media?.show() }
  hide() { this.media?.hide() }
  onResize({ sizes }) {
    this.sizes = sizes
    this.media?.onResize({ sizes })
  }
  onTouchDown() {}
  onTouchMove() {}
  onTouchUp() {}
  onWheel() {}
  update() { this.media?.update() }
  destroy() { this.scene.removeChild(this.group) }
}