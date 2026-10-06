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
          <span class="error-page__board__flight">GC{{ code }}</span>
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
          <span class="error-page__board__status">{{ board.status }}</span>
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
          <span class="error-page__board__status error-page__board__status--dim">{{ board.statusSub }}</span>
        </div>
      </div>

    </div>

    <!-- Message et CTA -->
    <div class="error-page__content" ref="contentEl">
      <p class="error-page__message">
        {{ board.message[0] }}<br>
        {{ board.message[1] }}
      </p>
      <!-- clearError : sort proprement de l'état d'erreur de Nuxt avant de revenir à l'accueil -->
      <a href="/" class="error-page__cta" @click.prevent="goHome">
        Find my way back
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M2 14L14 2M14 2H2M14 2V14" stroke="currentColor" stroke-width="1.2"/>
        </svg>
      </a>
    </div>

    <!-- Heure style aéroport -->
    <div class="error-page__clock" ref="clockEl">
      <span>{{ currentTime }}</span>
    </div>

  </div>
</template>

<script setup>
import GSAP from 'gsap'

// Nuxt passe l'erreur à cette page : { statusCode, statusMessage, message }
const props = defineProps({
  error: { type: Object, default: () => ({}) }
})

// Textes du tableau selon le code d'erreur
const BOARDS = {
  400: {
    main: 'INVALID ROUTE',
    sub: 'BAD REQUEST',
    status: 'REROUTED',
    statusSub: 'CHECK TICKET',
    message: ["This route doesn't look right.", 'Please check the address and try again.']
  },
  401: {
    main: 'BOARDING PASS NEEDED',
    sub: 'UNAUTHORIZED',
    status: 'CHECK-IN',
    statusSub: 'REQUIRED',
    message: ['You need to be signed in to board this flight.', 'Please check in and try again.']
  },
  403: {
    main: 'RESTRICTED AREA',
    sub: 'ACCESS FORBIDDEN',
    status: 'DENIED',
    statusSub: 'CLOSED',
    message: ['This gate is closed to passengers.', "You don't have access to this page."]
  },
  404: {
    main: 'DESTINATION UNKNOWN',
    sub: 'PAGE NOT FOUND',
    status: 'NOT FOUND',
    statusSub: 'CANCELLED',
    message: ["This destination doesn't exist on our map.", "The page you're looking for has been lost in transit."]
  },
  500: {
    main: 'TECHNICAL ISSUE',
    sub: 'SERVER ERROR',
    status: 'DELAYED',
    statusSub: 'GROUNDED',
    message: ['Something went wrong on our side.', 'Our ground crew is already on it — please try again shortly.']
  },
  503: {
    main: 'SERVICE SUSPENDED',
    sub: 'UNAVAILABLE',
    status: 'DELAYED',
    statusSub: 'ON HOLD',
    message: ['This service is temporarily unavailable.', 'Please try again in a few minutes.']
  }
}

const code = computed(() => props.error?.statusCode || 500)

// Codes non listés : texte générique (4xx = côté visiteur, 5xx = côté serveur)
const board = computed(() => {
  if (BOARDS[code.value]) return BOARDS[code.value]
  const isClient = code.value >= 400 && code.value < 500
  const sub = (props.error?.statusMessage || `ERROR ${code.value}`)
    .toUpperCase()
    .normalize('NFD')
    .replace(/[^A-Z0-9 ]/g, '')
    .slice(0, 20)
  return {
    main: isClient ? 'ROUTE UNAVAILABLE' : 'UNEXPECTED ISSUE',
    sub,
    status: isClient ? 'CANCELLED' : 'DELAYED',
    statusSub: `CODE ${code.value}`,
    message: isClient
      ? ["This flight can't depart.", 'Something is wrong with this request.']
      : ['Something went wrong on our side.', 'Please try again shortly.']
  }
})

useHead({
  // Une page d'erreur ne doit jamais être indexée par les moteurs de recherche
  meta: [{ key: 'robots', name: 'robots', content: 'noindex, nofollow' }],
  title: computed(() => `${code.value} — ${props.error?.statusMessage || board.value.sub} | Gabin Caron`)
})

// Les deux lignes du tableau font la même longueur (comme sur un vrai panneau)
const width = computed(() => Math.max(board.value.main.length, board.value.sub.length))
const TARGET_MAIN = board.value.main.padEnd(width.value, ' ')
const TARGET_SUB = board.value.sub.padEnd(width.value, ' ')
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 —·'

function goHome() {
  clearError({ redirect: '/' })
}

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