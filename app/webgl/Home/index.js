import { Plane, Transform } from 'ogl'
import GSAP from 'gsap'
 
import Media from './Media'
 
export default class Home {
  constructor({ gl, scene, sizes }) {
    this.gl = gl
    this.scene = scene
    this.sizes = sizes
 
    this.group = new Transform()
 
    this.galleryElement = document.querySelector('.home__gallery')
    this.mediasElements = document.querySelectorAll('.home__gallery__media__image')
 
    this.x = { current: 0, target: 0, lerp: 0.1 }
    this.y = { current: 0, target: 0, lerp: 0.1 }
    this.scrollCurrent = { x: 0, y: 0 }
    this.scroll = { x: 0, y: 0 }
    this.speed = { current: 0, target: 0, lerp: 0.1 }
 
    // Défilement automatique (px/frame) : le signe donne le sens,
    // il est inversé au relâchement d'un drag pour suivre le geste
    this.autoScroll = { x: 0.3, y: 0.65 }
 
    this.createGeometry()
    this.createGallery()
 
    this.onResize({ sizes: this.sizes })
 
    this.group.setParent(this.scene)
 
    this.show()
  }
 
  createGeometry() {
    this.geometry = new Plane(this.gl, { heightSegments: 20, widthSegments: 20 })
  }
 
  createGallery() {
    this.medias = [...this.mediasElements].map((element, index) => {
      return new Media({
        element,
        geometry: this.geometry,
        index,
        gl: this.gl,
        scene: this.group,
        sizes: this.sizes
      })
    }).filter((media) => media.mesh) // ignore les images dont la texture n'a pas chargé
  }
 
  show() {
    this.medias.forEach((media) => media.show())
  }
 
  hide() {
    this.medias.forEach((media) => media.hide())
  }
 
  onResize(e) {
    this.galleryBounds = this.galleryElement.getBoundingClientRect()
    this.sizes = e.sizes
 
    this.gallerySizes = {
      width: (this.galleryBounds.width / window.innerWidth) * this.sizes.width,
      height: (this.galleryBounds.height / window.innerHeight) * this.sizes.height
    }
 
    this.scroll.x = this.x.target = 0
    this.scroll.y = this.y.target = 0
 
    this.medias.forEach((media) => media.onResize(e, this.scroll))
  }
 
  onTouchDown({ x, y }) {
    this.speed.target = 0.35
    this.scrollCurrent.x = this.scroll.x
    this.scrollCurrent.y = this.scroll.y
  }
 
  onTouchMove({ x, y }) {
    const xDistance = x.start - x.end
    const yDistance = y.start - y.end
 
    this.x.target = this.scrollCurrent.x - xDistance
    this.y.target = this.scrollCurrent.y - yDistance
  }
 
  onTouchUp({ x, y }) {
    this.speed.target = 0
 
    // Reprend le défilement dans le sens du drag (axe par axe).
    // Un drag positif (vers la droite / le bas) augmente la cible, comme dans onTouchMove.
    const DRAG_THRESHOLD = 5 // px, pour ignorer un simple clic
    const dx = x.end - x.start
    const dy = y.end - y.start
 
    if (Math.abs(dx) > DRAG_THRESHOLD) {
      this.autoScroll.x = Math.sign(dx) * Math.abs(this.autoScroll.x)
    }
    if (Math.abs(dy) > DRAG_THRESHOLD) {
      this.autoScroll.y = Math.sign(dy) * Math.abs(this.autoScroll.y)
    }
  }
 
  onWheel({ pixelX, pixelY }) {
    this.x.target += pixelX
    this.y.target += pixelY
  }
 
  update() {
    this.speed.current = GSAP.utils.interpolate(this.speed.current, this.speed.target, this.speed.lerp)
 
    this.x.target += this.autoScroll.x
    this.y.target += this.autoScroll.y
 
    this.x.current = GSAP.utils.interpolate(this.x.current, this.x.target, this.x.lerp)
    this.y.current = GSAP.utils.interpolate(this.y.current, this.y.target, this.y.lerp)
 
    if (this.scroll.x < this.x.current) {
      this.x.direction = 'right'
    } else if (this.scroll.x > this.x.current) {
      this.x.direction = 'left'
    }
 
    if (this.scroll.y < this.y.current) {
      this.y.direction = 'top'
    } else if (this.scroll.y > this.y.current) {
      this.y.direction = 'bottom'
    }
 
    this.scroll.x = this.x.current
    this.scroll.y = this.y.current
 
    this.medias.forEach((media) => {
      const offsetX = this.sizes.width * 0.6
      const scaleX = media.mesh.scale.x / 2
 
      if (this.x.direction === 'left') {
        const mx = media.mesh.position.x + scaleX
        if (mx < -offsetX) {
          media.extra.x += this.gallerySizes.width
          media.mesh.rotation.z = GSAP.utils.random(-Math.PI * 0.03, Math.PI * 0.03)
        }
      } else if (this.x.direction === 'right') {
        const mx = media.mesh.position.x - scaleX
        if (mx > offsetX) {
          media.extra.x -= this.gallerySizes.width
          media.mesh.rotation.z = GSAP.utils.random(-Math.PI * 0.03, Math.PI * 0.03)
        }
      }
 
      const offsetY = this.sizes.height * 0.6
      const scaleY = media.mesh.scale.y / 2
 
      if (this.y.direction === 'top') {
        const my = media.mesh.position.y + scaleY
        if (my < -offsetY) {
          media.extra.y += this.gallerySizes.height
          media.mesh.rotation.z = GSAP.utils.random(-Math.PI * 0.03, Math.PI * 0.03)
        }
      } else if (this.y.direction === 'bottom') {
        const my = media.mesh.position.y - scaleY
        if (my > offsetY) {
          media.extra.y -= this.gallerySizes.height
          media.mesh.rotation.z = GSAP.utils.random(-Math.PI * 0.03, Math.PI * 0.03)
        }
      }
 
      media.update(this.scroll, this.speed.current)
    })
  }
 
  destroy() {
    this.scene.removeChild(this.group)
  }
}