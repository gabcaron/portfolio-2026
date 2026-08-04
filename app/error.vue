<template>
  <div class="error-page">

    <!-- Navigation -->
    <nav class="error-page__nav">
      <NuxtLink to="/" class="error-page__nav__logo">Gabin Caron</NuxtLink>
      <div class="error-page__nav__links">
        <NuxtLink to="/projects" class="error-page__nav__link">Projects</NuxtLink>
        <NuxtLink to="/about" class="error-page__nav__link">About</NuxtLink>
      </div>
    </nav>

    <div class="error-page__board">

      <!-- En-tête style tableau d'aéroport -->
      <div class="error-page__board__header">
        <span class="error-page__board__label">FLIGHT</span>
        <span class="error-page__board__label">DESTINATION</span>
        <span class="error-page__board__label">STATUS</span>
      </div>

      <!-- Ligne principale split-flap -->
      <div class="error-page__board__row">
        <div class="error-page__board__cell">
          <span class="error-page__board__flight">GC404</span>
        </div>
        <div class="error-page__board__cell error-page__board__cell--wide">
          <div class="error-page__flap">
            <span
              v-for="(char, i) in displayChars"
              :key="i"
              class="error-page__flap__char"
            >{{ char }}</span>
          </div>
        </div>
        <div class="error-page__board__cell">
          <span class="error-page__board__status">NOT FOUND</span>
        </div>
      </div>

      <!-- Ligne secondaire -->
      <div class="error-page__board__row error-page__board__row--sub">
        <div class="error-page__board__cell">
          <span class="error-page__board__flight error-page__board__flight--dim">——————</span>
        </div>
        <div class="error-page__board__cell error-page__board__cell--wide">
          <div class="error-page__flap error-page__flap--sub">
            <span
              v-for="(char, i) in displayCharsSub"
              :key="i"
              class="error-page__flap__char error-page__flap__char--sub"
            >{{ char }}</span>
          </div>
        </div>
        <div class="error-page__board__cell">
          <span class="error-page__board__status error-page__board__status--dim">CANCELLED</span>
        </div>
      </div>

    </div>

    <!-- Message et CTA -->
    <div class="error-page__content" ref="contentEl">
      <p class="error-page__message">
        This destination doesn't exist on our map.<br>
        The page you're looking for has been lost in transit.
      </p>
      <NuxtLink to="/" class="error-page__cta">
        Find my way back
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M2 14L14 2M14 2H2M14 2V14" stroke="currentColor" stroke-width="1.2"/>
        </svg>
      </NuxtLink>
    </div>

    <!-- Heure style aéroport -->
    <div class="error-page__clock" ref="clockEl">
      <span>{{ currentTime }}</span>
    </div>

  </div>
</template>

<script setup>
import GSAP from 'gsap'

useHead({ title: '404 — Page Not Found | Gabin Caron' })

const TARGET_MAIN = 'DESTINATION UNKNOWN'
const TARGET_SUB  = 'PAGE NOT FOUND    '
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 —·'

const displayChars = ref(TARGET_MAIN.split('').map(() => ' '))
const displayCharsSub = ref(TARGET_SUB.split('').map(() => ' '))

const contentEl = ref(null)
const clockEl = ref(null)

const currentTime = ref('')
let clockInterval = null
let loopTimeout = null

function updateClock() {
  const now = new Date()
  const h = String(now.getHours()).padStart(2, '0')
  const m = String(now.getMinutes()).padStart(2, '0')
  const s = String(now.getSeconds()).padStart(2, '0')
  currentTime.value = `${h}:${m}:${s}`
}

function animateChar(el, targetChar, onUpdate) {
  const totalSteps = Math.floor(Math.random() * 12) + 8
  let step = 0

  const interval = setInterval(() => {
    if (step < totalSteps - 1) {
      const randomChar = CHARS[Math.floor(Math.random() * CHARS.length)]
      el.textContent = randomChar
      onUpdate(randomChar)
      GSAP.fromTo(el,
        { rotateX: -90, opacity: 0 },
        { rotateX: 0, opacity: 1, duration: 0.08, ease: 'power2.out' }
      )
    } else {
      clearInterval(interval)
      el.textContent = targetChar
      onUpdate(targetChar)
      GSAP.fromTo(el,
        { rotateX: -90, opacity: 0 },
        { rotateX: 0, opacity: 1, duration: 0.12, ease: 'power2.out' }
      )
    }
    step++
  }, 60)
}

function runSplitFlap(targetText, selector, displayRef, baseDelay = 0) {
  const els = document.querySelectorAll(selector)
  targetText.split('').forEach((char, i) => {
    const el = els[i]
    if (!el) return
    setTimeout(() => {
      animateChar(el, char, (c) => {
        displayRef.value[i] = c
      })
    }, baseDelay + i * 80)
  })
}

function startLoop() {
  // Réinitialise les caractères
  // displayChars.value = TARGET_MAIN.split('').map(() => ' ')
  // displayCharsSub.value = TARGET_SUB.split('').map(() => ' ')

  nextTick(() => {
    setTimeout(() => {
      runSplitFlap(
        TARGET_MAIN,
        '.error-page__flap:not(.error-page__flap--sub) .error-page__flap__char',
        displayChars,
        0
      )
    }, 200)

    setTimeout(() => {
      runSplitFlap(
        TARGET_SUB,
        '.error-page__flap--sub .error-page__flap__char',
        displayCharsSub,
        0
      )
    }, 600)
  })

  // Relance toutes les 8 secondes
  loopTimeout = setTimeout(startLoop, 8000)
}

function animateContent() {
  GSAP.fromTo(contentEl.value,
    { autoAlpha: 0, y: 30 },
    { autoAlpha: 1, y: 0, duration: 1, ease: 'power3.out', delay: 2.5 }
  )
  GSAP.fromTo(clockEl.value,
    { autoAlpha: 0 },
    { autoAlpha: 1, duration: 0.6, delay: 0.3 }
  )
}

onMounted(() => {
  updateClock()
  clockInterval = setInterval(updateClock, 1000)
  animateContent()
  startLoop()
})

onUnmounted(() => {
  clearInterval(clockInterval)
  clearTimeout(loopTimeout)
})
</script>