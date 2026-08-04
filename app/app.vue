<template>
  <div id="app">
    <Preloader
      v-if="isLoading"
      :title="layout?.preloader?.data?.title"
      @completed="onPreloaded"
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

const { data: layout } = await useFetch('/api/layout')
const assetsStore = useAssetsStore()

watch(() => layout.value, (data) => {
  if (data?.meta?.data?.image?.url) {
    useHead({
      meta: [
        { property: 'og:image', content: data.meta.data.image.url },
        { name: 'twitter:image', content: data.meta.data.image.url }
      ]
    })
  }
}, { immediate: true })

const isLoading = ref(true)
const isMobile = ref(false)
const route = useRoute()

const currentTemplate = computed(() => {
  return route.name === 'index' ? 'home' : route.name
})

const canvas = useCanvas()
canvas.state.template = currentTemplate.value

let currentPage = null
let rafId = null

function onPreloaded() {
  isLoading.value = false
  nextTick(() => {
    if (!isMobile.value) canvas.onResize()
    if (currentPage) {
      requestAnimationFrame(() => {
        if (!isMobile.value) canvas.onChangeEnd(currentTemplate.value)
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
        if (!isMobile.value) canvas.onChangeEnd(currentTemplate.value)
        onResize()
      })
    } else {
      const unwatch = watch(() => assetsStore.isReady, (ready) => {
        if (ready) {
          unwatch()
          requestAnimationFrame(() => {
            if (!isMobile.value) canvas.onChangeEnd(currentTemplate.value)
            onResize()
          })
        }
      })
    }
  }
}

function onResize() {
  currentPage?.onResize?.()
  if (!isMobile.value) {
    window.requestAnimationFrame(() => canvas.onResize())
  }
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
  if (!isMobile.value) canvas.update(currentPage?.scroll)
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
  if (!isMobile.value) canvas.onChangeStart(canvas.state.template, newPath)
}, { flush: 'pre' })

watch(() => route.name, () => {
  nextTick(() => onResize())
})

onMounted(() => {
  isMobile.value = window.innerWidth < 768

  // Monte le Canvas uniquement sur desktop
  if (!isMobile.value) {
    canvas.mountCanvasToDOM()
  }

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