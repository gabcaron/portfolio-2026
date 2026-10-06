<template>
  <nav class="navigation" :class="{ 'navigation--home': isHome }">

    <NuxtLink class="navigation__link__left" to="/">{{ meta?.data?.title }}</NuxtLink>

    <!-- Desktop : liens centrés -->
    <ul class="navigation__list navigation__list--desktop">
      <li v-for="(item, index) in navigation?.data?.list" :key="index" class="navigation__list__item">
        <NuxtLink class="navigation__list__link" :to="resolveLink(item.link)">{{ item.text }}</NuxtLink>
      </li>
    </ul>

    <!-- Desktop : bouton contact -->
    <button type="button" class="navigation__link__right navigation__link__right--desktop" @click="openPopup">
      {{ navigation?.data?.contact }}
    </button>

    <!-- Mobile : hamburger -->
    <button
      class="navigation__hamburger"
      :class="{ 'navigation__hamburger--open': mobileMenuOpen }"
      @click="toggleMobileMenu"
      aria-label="Menu"
    >
      <span></span>
      <span></span>
      <span></span>
    </button>

    <!-- Mobile : menu drawer -->
    <div class="navigation__mobile" :class="{ 'navigation__mobile--open': mobileMenuOpen }">
      <div class="navigation__mobile__header">
        <NuxtLink to="/" class="navigation__mobile__logo" @click="closeMobileMenu">
          Gabin Caron
        </NuxtLink>
        <button class="navigation__mobile__close" @click="closeMobileMenu" aria-label="Fermer">
          <span></span>
          <span></span>
        </button>
      </div>

      <ul class="navigation__mobile__list">
        <li v-for="(item, index) in navigation?.data?.list" :key="index">
          <NuxtLink
            class="navigation__mobile__link"
            :to="resolveLink(item.link)"
            @click="closeMobileMenu"
          >{{ item.text }}</NuxtLink>
        </li>
        <li>
          <button
            class="navigation__mobile__link navigation__mobile__contact"
            @click="openContactMobile"
          >
            {{ navigation?.data?.contact }}
          </button>
        </li>
      </ul>

      <div class="navigation__mobile__footer">
        <span
          class="navigation__mobile__availability"
          :class="{ 'navigation__mobile__availability--open': isAvailable }"
        >
          <span class="navigation__mobile__availability__dot"></span>
          {{ isAvailable ? 'Available now' : 'Not available' }}
        </span>
      </div>
    </div>

  </nav>

  <!-- Contact panel -->
  <div
    class="contact-panel"
    ref="popupEl"
    :style="{
      visibility: isOpen ? 'visible' : 'hidden',
      pointerEvents: isOpen ? 'auto' : 'none'
    }"
  >
    <div class="contact-panel__backdrop" @click="closePopup"></div>
    <div class="contact-panel__drawer">
      <button class="contact-panel__close" @click="closePopup">
        <span></span><span></span>
      </button>
      <div class="contact-panel__content">
        <p class="contact-panel__tag">Get in touch</p>
        <h2 class="contact-panel__title">
          Let's build<br><em>something</em><br>great.
        </h2>
        <p class="contact-panel__desc">
          Open to new roles and creative collaborations.
        </p>
        <a href="mailto:gabindevelops@gmail.com" class="contact-panel__email">
          gabindevelops@gmail.com
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M2.5 17.5L17.5 2.5M17.5 2.5H2.5M17.5 2.5V17.5" stroke="currentColor" stroke-width="1.5"/>
          </svg>
        </a>
        <div class="contact-panel__socials">
          <a href="https://github.com/gabcaron" target="_blank" rel="noopener noreferrer" class="contact-panel__social">GitHub ↗</a>
          <a href="https://linkedin.com/in/gab-caron/" target="_blank" rel="noopener noreferrer" class="contact-panel__social">LinkedIn ↗</a>
        </div>
        <div class="contact-panel__footer">
          <span>Based in {{ props.navigation?.data?.localisation }}</span>
          <span
            class="contact-panel__availability"
            :class="{ 'contact-panel__availability--open': isAvailable }"
          >
            <span class="contact-panel__availability__dot"></span>
            {{ isAvailable ? 'Available now' : 'Not available' }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import GSAP from 'gsap'

const props = defineProps({
  navigation: Object,
  meta: Object
})

const route = useRoute()
const isHome = computed(() => route.name === 'index')
const isOpen = ref(false)
const popupEl = ref(null)
const mobileMenuOpen = ref(false)

// Flag pour ignorer le prochain click outside (évite fermeture immédiate depuis mobile)
let ignoreNextOutside = false

const isAvailable = computed(() => props.navigation?.data?.available ?? true)

function resolveLink(link) {
  if (!link) return '/'
  if (link.type === 'collections') return '/projects'
  if (link.type === 'about') return '/about'
  if (link.type === 'product') return `/projects/${link.slug}`
  return '/'
}

// --- Menu mobile ---
function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

function closeMobileMenu() {
  mobileMenuOpen.value = false
}

function openContactMobile() {
  mobileMenuOpen.value = false
  // Flag pour ignorer le click outside qui suit la fermeture du menu
  ignoreNextOutside = true
  setTimeout(() => {
    openPopup()
    // Réactive le click outside après l'animation d'ouverture
    setTimeout(() => { ignoreNextOutside = false }, 800)
  }, 350)
}

watch(() => route.path, () => {
  mobileMenuOpen.value = false
})

// --- Contact panel ---
function openPopup() {
  if (isOpen.value) return
  isOpen.value = true

  nextTick(() => {
    const drawer = popupEl.value?.querySelector('.contact-panel__drawer')
    const backdrop = popupEl.value?.querySelector('.contact-panel__backdrop')
    const items = popupEl.value?.querySelectorAll(
      '.contact-panel__tag, .contact-panel__title, .contact-panel__desc, .contact-panel__email, .contact-panel__socials, .contact-panel__footer'
    )

    if (!drawer) return

    GSAP.fromTo(backdrop,
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 0.4, ease: 'power2.out' }
    )

    GSAP.set(drawer, { x: '100%' })
    GSAP.to(drawer, { x: 0, duration: 0.7, ease: 'expo.out' })

    GSAP.fromTo(items,
      { autoAlpha: 0, y: 20 },
      { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.07, delay: 0.35 }
    )
  })
}

function closePopup() {
  if (!isOpen.value) return

  const drawer = popupEl.value?.querySelector('.contact-panel__drawer')
  const backdrop = popupEl.value?.querySelector('.contact-panel__backdrop')

  GSAP.to(backdrop, { autoAlpha: 0, duration: 0.3, ease: 'power2.in' })
  GSAP.to(drawer, {
    x: '100%',
    duration: 0.5,
    ease: 'expo.in',
    onComplete: () => { isOpen.value = false }
  })
}

function onClickOutside(event) {
  if (ignoreNextOutside) return

  if (
    isOpen.value &&
    popupEl.value &&
    !popupEl.value.contains(event.target) &&
    !event.target.closest('.navigation__link__right') &&
    !event.target.closest('.navigation__hamburger') &&
    !event.target.closest('.navigation__mobile')
  ) {
    closePopup()
  }
}

onMounted(() => document.addEventListener('click', onClickOutside))
onUnmounted(() => document.removeEventListener('click', onClickOutside))
</script>