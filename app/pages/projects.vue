<template>
  <div
    class="projects"
    @touchstart.passive="onTouchStart"
    @touchend.passive="onTouchEnd"
    data-background="#F5F0E6" data-color="#1A2A2F">

    <!-- Image — src direct, WebGL par-dessus via canvas global -->
    <div class="projects__media" ref="mediaEl">
      <img
        ref="imgEl"
        class="projects__media__image"
        :class="{ loaded: imgLoaded }"
        :src="currentProject.image"
        :alt="currentProject.title"
        @load="onImageLoad"
      >
    </div>

    <!-- Infos droite -->
    <div class="projects__content" ref="contentEl">
      <div class="projects__article">
        <span class="projects__article__year">{{ currentProject.year }}</span>
        <span class="projects__article__category">{{ currentProject.category }}</span>
        <h2 class="projects__article__title" ref="titleEl">{{ currentProject.title }}</h2>
        <p class="projects__article__description">{{ currentProject.description }}</p>
        <ul class="projects__article__tech">
          <li v-for="tech in currentProject.tech" :key="tech">{{ tech }}</li>
        </ul>
        <a :href="currentProject.link" target="_blank" class="projects__article__link">
          View project
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 14L14 2M14 2H2M14 2V14" stroke="currentColor" stroke-width="1.2"/>
          </svg>
        </a>
      </div>
    </div>

    <!-- Compteur -->
    <div class="projects__counter" ref="counterEl">
      <span class="projects__counter__current">{{ String(activeIndex + 1).padStart(2, '0') }}</span>
      <span class="projects__counter__sep"> — </span>
      <span class="projects__counter__total">{{ String(projects.length).padStart(2, '0') }}</span>
    </div>

    <!-- Dots -->
    <div class="projects__dots" ref="dotsEl">
      <button
        v-for="(_, i) in projects"
        :key="i"
        class="projects__dot"
        :class="{ 'projects__dot--active': i === activeIndex }"
        :aria-label="`Projet ${i + 1}`"
        @click="goTo(i)"
      />
    </div>

  </div>
</template>

<script setup>
import GSAP from 'gsap'
import { useGL } from '~/composables/useGL'
import { useColors } from '~/composables/useColors'
import { useCanvas } from '~/composables/useCanvas'

const { data: layoutData } = await useFetch('/api/layout')
const ogImage = computed(() => layoutData.value?.meta?.data?.image?.url || '')

useSEO({
  title: 'Projects - Gabin Caron | Web Developer',
  description: 'Selected web development projects by Gabin Caron — full-stack applications, creative websites and WebGL experiments.',
  image: ogImage.value,
  path: '/projects'
})

const { data } = await useFetch('/api/projects')
const projects = computed(() => data.value?.projects || [])
const activeIndex = ref(0)
const currentProject = computed(() => projects.value[activeIndex.value] || {})

const emit = defineEmits(['page-ready'])
const imgEl = ref(null)
const contentEl = ref(null)
const counterEl = ref(null)
const dotsEl = ref(null)
const mediaEl = ref(null)

const { change: changeColors } = useColors()
const canvas = useCanvas()

let isAnimating = false

const { gl } = useGL()

const imgLoaded = ref(false)

function loadImageToCanvas(src) {
  if (!src) return
  const image = new Image()
  image.crossOrigin = 'anonymous'
  image.onload = () => {
    nextTick(() => {
      canvas.state.collections?.media?.setImage(image)
      canvas.state.collections?.media?.createBounds()
    })
  }
  image.src = src
}

function onImageLoad() {
  if (!imgEl.value) return
  imgLoaded.value = true
  // Retire tout style inline que GSAP aurait pu mettre
  imgEl.value.removeAttribute('style')
  loadImageToCanvas(imgEl.value.src)
}

watch(() => currentProject.value.image, (newSrc) => {
  if (!newSrc) return
  imgLoaded.value = false
  // Retire les styles GSAP inline avant le rechargement
  if (imgEl.value) imgEl.value.removeAttribute('style')
})

function goTo(index) {
  if (isAnimating || index === activeIndex.value) return
  isAnimating = true

  // Texte : fade out → change → fade in
  GSAP.to('.projects__article', {
    autoAlpha: 0,
    x: -20,
    duration: 0.25,
    ease: 'power2.in',
    onComplete: () => {
      activeIndex.value = index
      nextTick(() => {
        GSAP.fromTo('.projects__article',
          { autoAlpha: 0, x: 30 },
          { autoAlpha: 1, x: 0, duration: 0.4, ease: 'power3.out' }
        )
      })
    }
  })

  // Image : même sortie/entrée que le texte (le mesh WebGL suit les bounds du cadre)
  GSAP.to(mediaEl.value, {
    autoAlpha: 0,
    x: -20,
    duration: 0.25,
    ease: 'power2.in',
    onComplete: () => {
      nextTick(() => {
        GSAP.fromTo(mediaEl.value,
          { autoAlpha: 0, x: 30 },
          { autoAlpha: 1, x: 0, duration: 0.5, ease: 'power3.out', clearProps: 'transform,opacity,visibility' }
        )
      })
    }
  })
  setTimeout(() => { isAnimating = false }, 600)
}

function onWheel(e) {
  if (e.pixelY > 5) goTo(Math.min(activeIndex.value + 1, projects.value.length - 1))
  else if (e.pixelY < -5) goTo(Math.max(activeIndex.value - 1, 0))
}

// Swipe gauche/droite (mobile) pour changer de projet
let touchStartX = 0
let touchStartY = 0

function onTouchStart(e) {
  touchStartX = e.touches[0].clientX
  touchStartY = e.touches[0].clientY
}

function onTouchEnd(e) {
  const dx = e.changedTouches[0].clientX - touchStartX
  const dy = e.changedTouches[0].clientY - touchStartY
  if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy)) return
  if (dx < 0) goTo(Math.min(activeIndex.value + 1, projects.value.length - 1))
  else goTo(Math.max(activeIndex.value - 1, 0))
}

function animateIn() {
  GSAP.fromTo('.projects__article',
    { autoAlpha: 0, x: 30 },
    { autoAlpha: 1, x: 0, duration: 1, ease: 'expo.out', delay: 0.2 }
  )
  GSAP.fromTo(mediaEl.value,
    { autoAlpha: 0, x: 30 },
    { autoAlpha: 1, x: 0, duration: 1, ease: 'expo.out', delay: 0.1, clearProps: 'transform,opacity,visibility' }
  )
  GSAP.fromTo(counterEl.value,
    { autoAlpha: 0 },
    { autoAlpha: 1, duration: 0.6, delay: 0.5 }
  )
  GSAP.fromTo(dotsEl.value,
    { autoAlpha: 0 },
    { autoAlpha: 1, duration: 0.6, delay: 0.6 }
  )
}

onMounted(() => {
  changeColors({ backgroundColor: '#F5F0E6', color: '#1A2A2F' })

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      animateIn()
      emit('page-ready', {
        scroll: null,
        update: null,
        onWheel,
        onResize: null
      })
    })
  })
})
</script>