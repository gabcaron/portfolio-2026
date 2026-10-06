<template>
  <div id="app">
    <Preloader
      v-if="showPreloader"
      :title="layout?.preloader?.data?.title"
      @completed="onPreloaded"
      @hidden="showPreloader = false"
    />

    <Navigation v-if="layout" :navigation="layout.navigation" :meta="layout.meta" />

    <div id="content" class="content" :data-template="currentTemplate">
      <NuxtPage
        @page-ready="onPageReady"
        :transition="{
          name: 'page',
          mode: 'out-in',
          onEnter: onPageEnter,
          onLeave: onPageLeave
        }"
      />
    </div>
  </div>
</template>

<script setup>
import GSAP from 'gsap'
import NormalizeWheel from 'normalize-wheel'
import { useCanvas } from '~/composables/useCanvas'
import { useAssetsStore } from '~/stores/assets'

// Clé "layout" : réutilisée par useSEO pour l'image de partage par défaut
const { data: layout } = await useFetch('/api/layout', { key: 'layout' })
const assetsStore = useAssetsStore()

const isLoading = ref(true)
// Reste monté jusqu'à la fin de son animation de sortie
const showPreloader = ref(true)
const isMobile = ref(false)
const route = useRoute()

const currentTemplate = computed(() => {
  return route.name === 'index' ? 'home' : route.name
})

const canvas = useCanvas()
canvas.state.template = currentTemplate.value

let currentPage = null
let rafId = null

// Sur mobile, seul l'accueil utilise le WebGL (galerie qui défile, non interactive).
// Les autres pages détruisent les scènes pour garder leur mise en page mobile.
function changeCanvas(template) {
  if (!isMobile.value || template === 'home') canvas.onChangeEnd(template)
  else canvas.onChangeEnd('mobile')
}

function onPreloaded() {
  isLoading.value = false
  nextTick(() => {
    canvas.onResize()
    if (currentPage) {
      requestAnimationFrame(() => {
        changeCanvas(currentTemplate.value)
        onResize()
      })
    }
  })
}

function onPageReady(pageInstance) {
  currentPage = pageInstance

  if (!isLoading.value) {
    if (assetsStore.isReady) {
      requestAnimationFrame(() => {
        changeCanvas(currentTemplate.value)
        onResize()
      })
    } else {
      const unwatch = watch(() => assetsStore.isReady, (ready) => {
        if (ready) {
          unwatch()
          requestAnimationFrame(() => {
            changeCanvas(currentTemplate.value)
            onResize()
          })
        }
      })
    }
  }
}

function onResize() {
  currentPage?.onResize?.()
  window.requestAnimationFrame(() => canvas.onResize())
}

function onTouchDown(e) {
  if (!isMobile.value) canvas.onTouchDown(e)
}
function onTouchMove(e) {
  if (!isMobile.value) canvas.onTouchMove(e)
}
function onTouchUp(e) {
  if (!isMobile.value) canvas.onTouchUp(e)
}

function onWheel(e) {
  const normalized = NormalizeWheel(e)
  if (!isMobile.value) canvas.onWheel(normalized)
  currentPage?.onWheel?.(normalized)
}

function loop() {
  currentPage?.update?.()
  canvas.update()
  rafId = window.requestAnimationFrame(loop)
}

function onPageEnter(el, done) {
  GSAP.fromTo(el,
    { autoAlpha: 0 },
    { autoAlpha: 1, duration: 0.6, ease: 'power2.out', onComplete: done }
  )
}

function onPageLeave(el, done) {
  GSAP.to(el, {
    autoAlpha: 0,
    duration: 0.4,
    ease: 'power2.in',
    onComplete: done
  })
}

watch(() => route.fullPath, (newPath, oldPath) => {
  if (!oldPath) return
  canvas.onChangeStart()
}, { flush: 'pre' })

watch(() => route.name, () => {
  nextTick(() => onResize())
})

onMounted(() => {
  isMobile.value = window.innerWidth < 768

  // Canvas monté partout : sur mobile il ne sert qu'à la galerie de l'accueil
  canvas.mountCanvasToDOM()

  window.addEventListener('wheel', onWheel)
  window.addEventListener('mousedown', onTouchDown)
  window.addEventListener('mousemove', onTouchMove)
  window.addEventListener('mouseup', onTouchUp)
  window.addEventListener('touchstart', onTouchDown)
  window.addEventListener('touchmove', onTouchMove)
  window.addEventListener('touchend', onTouchUp)
  window.addEventListener('resize', () => {
    isMobile.value = window.innerWidth < 768
    onResize()
  })

  loop()
})

onUnmounted(() => {
  window.cancelAnimationFrame(rafId)
  window.removeEventListener('wheel', onWheel)
  window.removeEventListener('mousedown', onTouchDown)
  window.removeEventListener('mousemove', onTouchMove)
  window.removeEventListener('mouseup', onTouchUp)
  window.removeEventListener('touchstart', onTouchDown)
  window.removeEventListener('touchmove', onTouchMove)
  window.removeEventListener('touchend', onTouchUp)
  window.removeEventListener('resize', onResize)
})
</script>