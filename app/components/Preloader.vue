<template>
  <div ref="preloaderEl" class="preloader">
    <div class="preloader__inner">
      <p ref="titleEl" class="preloader__text" v-html="formattedTitle"></p>

      <div class="preloader__bottom">
        <div class="preloader__number">
          <span ref="numberTextEl" class="preloader__number__text">0%</span>
        </div>
        <div class="preloader__bar">
          <div ref="barEl" class="preloader__bar__fill"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import GSAP from 'gsap'
import { Texture } from 'ogl'
import { useAssetsStore } from '~/stores/assets'
import { useGL } from '~/composables/useGL'

const props = defineProps({
  title: { type: String, default: '' }
})

const emit = defineEmits(['completed'])

const preloaderEl = ref(null)
const titleEl = ref(null)
const numberTextEl = ref(null)
const barEl = ref(null)

const assetsStore = useAssetsStore()
const { gl } = useGL()

const progress = { value: 0 }

let startTime = 0
let loadedCount = 0
let totalAssets = 0
let fakeProgressTween = null

const formattedTitle = computed(() => (props.title || '').replace(/\n/g, '<br>'))

// --- Entrée : anime le texte dès le montage ---
function animateIn() {
  GSAP.set(barEl.value, { scaleX: 0})

  GSAP.fromTo(titleEl.value,
    { autoAlpha: 0, y: 30 },
    { autoAlpha: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.2 }
  )
  GSAP.fromTo(numberTextEl.value,
    { autoAlpha: 0 },
    { autoAlpha: 1, duration: 0.6, ease: 'power2.out', delay: 0.4 }
  )
  GSAP.fromTo(barEl.value,
    { scaleX: 0, autoAlpha: 0 },
    { autoAlpha: 1, duration: 0.6, ease: 'power2.out', delay: 0.4 }
  )
}

// --- Progression réelle : met à jour % et barre ---
function setProgress(percent) {
  if (numberTextEl.value) {
    numberTextEl.value.textContent = `${Math.round(percent)}%`
  }
  if (barEl.value) {
    GSAP.set(barEl.value, { scaleX: percent / 100 })
  }
}

function startFakeProgress() {
  GSAP.to(progress, {
    value: 85,
    duration: 2.5,
    ease: 'power1.inOut',
    onUpdate: () => setProgress(progress.value)
  })
}

// --- Chargement des textures ---
function loadTexture(src) {
  return new Promise((resolve) => {
    const image = new Image()
    image.crossOrigin = 'anonymous'

    image.onload = () => {
      const glContext = gl.value
      if (glContext) {
        assetsStore.setTexture(src, new Texture(glContext, { image }))
      }
      loadedCount++
      resolve()
    }

    image.onerror = () => {
      loadedCount++
      resolve()
    }

    image.src = src
  })
}

async function loadAssets() {
  // 1. Images déjà présentes dans le DOM (page courante)
  const domSources = [...document.querySelectorAll('[data-src]')]
    .map(el => el.dataset.src)
    .filter(Boolean)

  // 2. Galerie de l'accueil (seule page en WebGL), même si on arrive sur une autre page
  let apiSources = []
  try {
    const homeData = await $fetch('/api/home')
    apiSources = (homeData?.home?.data?.gallery || [])
      .map(m => m.image?.url)
      .filter(Boolean)
  } catch (e) {
    console.warn('[Preloader] Erreur fetch API:', e)
  }

  const allSources = [...new Set([...domSources, ...apiSources])]
  totalAssets = allSources.length

  if (totalAssets === 0) {
    onLoaded()
    return
  }

  await Promise.all(allSources.map(loadTexture))
  onLoaded()
}

// --- Sortie vers le haut ---
function onLoaded() {
  const elapsed = Date.now() - startTime
  const remaining = Math.max(0, 3000 - elapsed)

  setTimeout(() => {
    // Stoppe la fausse progression et finit à 100%
    GSAP.killTweensOf(progress)

    GSAP.to(progress, {
      value: 100,
      duration: 0.4,
      ease: 'power2.out',
      onUpdate: () => setProgress(progress.value),
      onComplete: () => {
        assetsStore.markReady()
        emit('completed')
        setTimeout(animateOut, 300)
      }
    })
  }, remaining)
}

function animateOut() {
  const tl = GSAP.timeline({ delay: 0.3 })

  tl.to([titleEl.value, numberTextEl.value, barEl.value], {
    autoAlpha: 0,
    duration: 0.3,
    ease: 'power2.in'
  })

  // Panel remonte entièrement en 1s
  tl.to(preloaderEl.value, {
    yPercent: -100,
    duration: 1,
    ease: 'expo.inOut'
  }, '-=0.05')
}

onMounted(() => {
  // Cache tout immédiatement avant toute animation
  GSAP.set(barEl.value, { scaleX: 0, autoAlpha: 0 })
  GSAP.set(numberTextEl.value, { autoAlpha: 0 })
  GSAP.set(titleEl.value, { autoAlpha: 0, y: 30 })

  startTime = Date.now()
  animateIn()
  startFakeProgress()
  loadAssets()
})
</script>