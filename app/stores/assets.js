import { defineStore } from 'pinia'

export const useAssetsStore = defineStore('assets', {
  state: () => ({
    textures: {},
    isReady: false
  }),
  actions: {
    setTexture(src, texture) {
      this.textures[src] = texture
    },
    markReady() {
      this.isReady = true
    }
  }
})