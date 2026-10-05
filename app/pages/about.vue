<template>
  <div class="about" data-background="#F5F0E6" data-color="#1A2A2F">
    <div ref="wrapperEl" class="about__wrapper">

      <!-- ① HERO — "About Me." en dur, lignes en dessous depuis Prismic -->
      <section class="about__hero">
        <div class="about__hero__line" ref="heroLine1">
          <span>About</span>
        </div>
        <div class="about__hero__line" ref="heroLine2">
          <span>Me.</span>
        </div>
        <p class="about__hero__sub" ref="heroSub">
          <template v-for="(line, i) in heroLines" :key="i">
            {{ line }}<br v-if="i < heroLines.length - 1">
          </template>
        </p>
      </section>

      <!-- ② INTRO -->
      <section class="about__intro">
        <div class="about__intro__media" ref="photoEl">
          <div class="about__intro__media__inner">
            <img
              class="about__intro__photo loaded"
              :src="portrait?.url ? `${portrait.url}&w=800&q=80&auto=format` : ''"
              :alt="portrait?.alt || 'Portrait'"
            >
            <div class="about__intro__media__overlay"></div>
          </div>
          <span class="about__intro__media__label">{{ portraitLabel }}</span>
        </div>

        <div class="about__intro__content">
          <p class="about__intro__tag" ref="bioTag">{{ bioLabel }}</p>

          <p
            v-for="(para, i) in bioParagraphs"
            :key="i"
            class="about__intro__bio"
            :ref="el => { if (i === 0) bio1 = el; if (i === 1) bio2 = el }"
          >
            {{ para }}
          </p>

          <div class="about__intro__meta">
            <div class="about__intro__meta__item">
              <span class="about__intro__meta__label">Based in</span>
              <span class="about__intro__meta__value">{{ location }}</span>
            </div>
            <div class="about__intro__meta__item">
              <span class="about__intro__meta__label">Available for</span>
              <span class="about__intro__meta__value">{{ availability }}</span>
            </div>
            <div class="about__intro__meta__item">
              <span class="about__intro__meta__label">Experience</span>
              <span class="about__intro__meta__value">{{ experience }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- ③ SKILLS — title en v-html car contient <br> -->
      <section class="about__skills" ref="skillsSection">
        <div class="about__skills__header">
          <span class="about__skills__tag">{{ skillsLabel }}</span>
          <h2 class="about__skills__title" v-html="skillsTitle"></h2>
        </div>

        <div class="about__skills__grid">
          <div
            v-for="(category, i) in skillCategories"
            :key="i"
            class="about__skills__category"
            :ref="el => { if (el) skillCats[i] = el }"
          >
            <span class="about__skills__category__name">{{ category.name }}</span>
            <ul class="about__skills__list">
              <li v-for="skill in category.items" :key="skill" class="about__skills__item">
                {{ skill }}
              </li>
            </ul>
          </div>
        </div>
      </section>

      <!-- ④ PHILOSOPHY — quote en v-html car contient <em> -->
      <section class="about__philosophy" ref="philosophyEl">
        <div class="about__philosophy__inner">
          <span class="about__philosophy__tag">{{ philosophyLabel }}</span>

          <blockquote
            class="about__philosophy__quote"
            v-html="philosophyQuote"
          ></blockquote>

          <div class="about__philosophy__pillars">
            <div
              v-for="pillar in pillars"
              :key="pillar.pillar_number"
              class="about__philosophy__pillar"
            >
              <span class="about__philosophy__pillar__number">{{ pillar.pillar_number }}</span>
              <h3>{{ pillar.pillar_title }}</h3>
              <p>{{ pillar.pillar_text }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- ⑤ CTA — en dur -->
      <section class="about__cta" ref="ctaEl">
        <div class="about__cta__inner">
          <h2 class="about__cta__title">
            Let's build<br>
            <em>something great.</em>
          </h2>
          <a href="mailto:gabindevelops@gmail.com" class="about__cta__email">
            gabindevelops@gmail.com
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M5 19L19 5M19 5H5M19 5V19" stroke="currentColor" stroke-width="1.5"/>
            </svg>
          </a>
          <div class="about__cta__links">
            <a href="https://github.com/gabcaron" target="_blank" class="about__cta__link">GitHub ↗</a>
            <a href="https://linkedin.com/in/gab-caron/" target="_blank" class="about__cta__link">LinkedIn ↗</a>
          </div>
        </div>
      </section>

      <footer class="footer">
        <span class="footer__copy">© {{ new Date().getFullYear() }} Gabin Caron — All rights reserved</span>
        <NuxtLink to="/legal" class="footer__legal">Mentions légales / Legal Notice</NuxtLink>
      </footer>

    </div>
  </div>
</template>

<script setup>
import GSAP from 'gsap'
import { useScroll } from '~/composables/useScroll'
import { useColors } from '~/composables/useColors'

// --- Fetch Prismic ---
const { data } = await useFetch('/api/about')
const about = computed(() => data.value?.about)

const { data: layoutData } = await useFetch('/api/layout')
const ogImage = computed(() => layoutData.value?.meta?.data?.image?.url || '')

useSEO({
  title: 'About - Gabin Caron | Web Developer',
  description: 'French web developer based in France, passionate about crafting immersive web experiences. Vue.js, Nuxt, WebGL, GSAP.',
  image: ogImage.value,
  path: '/about'
})

// Slice helpers
const titleSlice = computed(() =>
  about.value?.data?.body?.find(s => s.slice_type === 'title')
)
const meSlice = computed(() =>
  about.value?.data?.body?.find(s => s.slice_type === 'me')
)
const skillsSlice = computed(() =>
  about.value?.data?.body?.find(s => s.slice_type === 'skills')
)
const skillsLists = computed(() =>
  about.value?.data?.body?.filter(s => s.slice_type === 'skills_list') || []
)
const philosophySlice = computed(() =>
  about.value?.data?.body?.find(s => s.slice_type === 'philosophy')
)

// Hero lines
const heroLines = computed(() => titleSlice.value?.items?.map(i => i.line) || [])

// Me slice
const portrait = computed(() => meSlice.value?.primary?.image)
const portraitLabel = computed(() => meSlice.value?.primary?.image_infos)
const bioLabel = computed(() => meSlice.value?.primary?.label)
const location = computed(() => meSlice.value?.primary?.localisation)
const availability = computed(() => meSlice.value?.primary?.availability)
const experience = computed(() => meSlice.value?.primary?.experience)
const bioParagraphs = computed(() => meSlice.value?.items?.map(i => i.paragraph) || [])

// Skills
const skillsLabel = computed(() => skillsSlice.value?.primary?.label)
const skillsTitle = computed(() => skillsSlice.value?.primary?.title)
const skillCategories = computed(() =>
  skillsLists.value.map(s => ({
    name: s.primary?.category,
    items: s.items?.map(i => i.skill) || []
  }))
)

// Philosophy
const philosophyLabel = computed(() => philosophySlice.value?.primary?.label)
const philosophyQuote = computed(() => philosophySlice.value?.primary?.quote)
const pillars = computed(() => philosophySlice.value?.items || [])

// --- Refs DOM ---
const wrapperEl = ref(null)
const heroLine1 = ref(null)
const heroLine2 = ref(null)
const heroSub = ref(null)
const photoEl = ref(null)
const bioTag = ref(null)
const bio1 = ref(null)
const bio2 = ref(null)
const skillsSection = ref(null)
const skillCats = ref([])
const philosophyEl = ref(null)
const ctaEl = ref(null)

// --- Composables ---
const emit = defineEmits(['page-ready'])
const { scroll, onWheel, onTouchStart, onTouchMove, onTouchEnd, onResize, update, reset } = useScroll()
let resizeObserver = null
const { change: changeColors } = useColors()

// --- Animations (inchangées) ---
function animateHero() {
  const span1 = heroLine1.value?.querySelector('span')
  const span2 = heroLine2.value?.querySelector('span')
  if (!span1 || !span2) return
  GSAP.set([span1, span2], { yPercent: 110 })
  GSAP.set(heroSub.value, { autoAlpha: 0, y: 20 })
  const tl = GSAP.timeline({ delay: 0.2 })
  tl.to([span1, span2], { yPercent: 0, duration: 1.2, ease: 'expo.out', stagger: 0.08 })
    .to(heroSub.value, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6')
}

function observeSection(el, animation) {
  if (!el) return
  const observer = new IntersectionObserver(
    entries => { entries.forEach(e => { if (e.isIntersecting) { animation(); observer.unobserve(el) } }) },
    { threshold: 0.15 }
  )
  observer.observe(el)
}

function animateIntro() {
  observeSection(photoEl.value, () => {
    GSAP.fromTo(photoEl.value, { autoAlpha: 0, x: -40 }, { autoAlpha: 1, x: 0, duration: 1, ease: 'expo.out' })
    GSAP.fromTo(photoEl.value.querySelector('.about__intro__media__inner'), { scale: 1.1 }, { scale: 1, duration: 1.4, ease: 'expo.out' })
  })
  observeSection(bio1.value, () => {
    GSAP.fromTo([bioTag.value, bio1.value, bio2.value], { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.12 })
  })
}

function animateSkills() {
  observeSection(skillsSection.value, () => {
    GSAP.fromTo(skillCats.value, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1 })
  })
}

function animatePhilosophy() {
  observeSection(philosophyEl.value, () => {
    const els = philosophyEl.value.querySelectorAll('.about__philosophy__pillar')
    GSAP.fromTo(philosophyEl.value.querySelector('.about__philosophy__quote'), { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 1, ease: 'power3.out' })
    GSAP.fromTo(els, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.12, delay: 0.3 })
  })
}

function animateCta() {
  observeSection(ctaEl.value, () => {
    GSAP.fromTo(ctaEl.value.querySelector('.about__cta__title'), { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 1.2, ease: 'expo.out' })
    GSAP.fromTo(
      [ctaEl.value.querySelector('.about__cta__email'), ctaEl.value.querySelector('.about__cta__links')],
      { autoAlpha: 0, y: 20 },
      { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.15, delay: 0.4 }
    )
  })
}

onMounted(() => {
  changeColors({ backgroundColor: '#F5F0E6', color: '#1A2A2F' })
  nextTick(() => {
    onResize(wrapperEl.value)

    // Recalcule la limite de scroll quand la hauteur change (images, polices, responsive)
    resizeObserver = new ResizeObserver(() => onResize(wrapperEl.value))
    resizeObserver.observe(wrapperEl.value)

    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    animateHero()
    animateIntro()
    animateSkills()
    animatePhilosophy()
    animateCta()
    emit('page-ready', {
      scroll,
      update: () => update(wrapperEl.value),
      onWheel,
      onResize: () => onResize(wrapperEl.value)
    })
  })
})

onUnmounted(() => {
  resizeObserver?.disconnect()
  window.removeEventListener('touchstart', onTouchStart)
  window.removeEventListener('touchmove', onTouchMove)
  window.removeEventListener('touchend', onTouchEnd)
  reset()
})
</script>