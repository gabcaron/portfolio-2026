import { defineStore } from 'pinia'

export const useAssetsStore = defineStore('assets', {
  state: () => ({
    textures: {},
    images: {},   // ← fallback si pas de contexte GL
    isReady: false
  }),
  actions: {
    setTexture(src, texture) {
      this.textures[src] = texture
    },
    setImage(src, image) {
      this.images[src] = image
    },
    markReady() {
      this.isReady = true
    }
  }
})