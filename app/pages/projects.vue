<template>
  <div class="projects" data-background="#F5F0E6" data-color="#1A2A2F">
    <div ref="wrapperEl" class="projects__wrapper">

      <!-- ① HERO + LISTE -->
      <section class="projects__hero">
        <div class="projects__hero__top">
          <div>
            <span class="projects__hero__tag">Selected work — {{ yearRange }}</span>
            <h1 class="projects__hero__title">
              Projects<sup class="projects__hero__count">({{ String(projects.length).padStart(2, '0') }})</sup>
            </h1>
          </div>
          <p class="projects__hero__intro">
            Websites for real clients and creative experiments in WebGL — built with the same care for
            <em>performance, accessibility and motion.</em>
          </p>
        </div>

        <ul class="projects__list">
          <li
            v-for="(project, i) in projects"
            :key="project.uid"
            class="projects__list__row"
            @click="scrollToProject(i)"
          >
            <span class="projects__list__number">{{ number(i) }}</span>
            <span class="projects__list__title">{{ project.title }}</span>
            <span class="projects__list__summary">{{ project.extra.summary }}</span>
            <span class="projects__list__year">{{ project.year }} ↗</span>
          </li>
        </ul>
      </section>

      <!-- ② PROJETS -->
      <article
        v-for="(project, i) in projects"
        :key="project.uid"
        class="projects__item"
        :ref="el => { if (el) itemEls[i] = el }"
      >
        <header class="projects__item__head">
          <span class="projects__item__type">{{ number(i) }} — {{ project.extra.type }}</span>
          <span class="projects__item__stack">{{ project.year }}</span>
        </header>

        <div class="projects__item__body">
          <NuxtLink :to="`/projects/${project.uid}`" class="projects__item__media">
            <img :src="project.image" :alt="project.title" class="loaded">
          </NuxtLink>

          <div class="projects__item__info">
            <div class="projects__item__text">
              <h2 class="projects__item__title">{{ project.title }}</h2>
              <p class="projects__item__description">{{ project.description }}</p>
            </div>

            <div class="projects__item__aside">
              <dl class="projects__item__meta">
                <div>
                  <dt>Role</dt>
                  <dd>{{ project.category }}</dd>
                </div>
                <div>
                  <dt>Stack</dt>
                  <dd>{{ project.tech.join(' · ') }}</dd>
                </div>
                <div>
                  <dt>Focus</dt>
                  <dd>{{ project.extra.focus }}</dd>
                </div>
              </dl>
              <NuxtLink :to="`/projects/${project.uid}`" class="projects__item__link">
                Read case study
<svg class="arrow" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M2.5 17.5L17.5 2.5M17.5 2.5H2.5M17.5 2.5V17.5" stroke="currentColor" stroke-width="1.5"/>
                </svg>
              </NuxtLink>
            </div>
          </div>
        </div>
      </article>

      <ContactCta />

      <Footer />

    </div>
  </div>
</template>

<script setup>
import GSAP from 'gsap'
import { useColors } from '~/composables/useColors'
import { usePageScroll } from '~/composables/usePageScroll'
import { useReveal } from '~/composables/useReveal'

useSEO({
  title: 'Projects - Gabin Caron | Web Developer',
  description: 'Selected web development projects by Gabin Caron — full-stack applications, creative websites and WebGL experiments.',
  path: '/projects'
})

const { data } = await useFetch('/api/projects')
const projects = computed(() => data.value?.projects || [])

const yearRange = computed(() => {
  const years = projects.value.map(p => parseInt(p.year)).filter(Boolean)
  if (!years.length) return ''
  const min = Math.min(...years)
  const max = Math.max(...years)
  return min === max ? `${min}` : `${min} to ${max}`
})

const number = i => String(i + 1).padStart(2, '0')

// --- Refs ---
const wrapperEl = ref(null)
const itemEls = ref([])

// --- Scroll ---
const emit = defineEmits(['page-ready'])
const { change: changeColors } = useColors()
const { observeOnce } = useReveal()
const { scroll } = usePageScroll(wrapperEl, emit, animateIn)

// Clic sur une ligne de la liste → scroll jusqu'au projet
function scrollToProject(i) {
  const el = itemEls.value[i]
  if (!el || !wrapperEl.value) return
  const offset = el.getBoundingClientRect().top - wrapperEl.value.getBoundingClientRect().top
  const navHeight = window.innerWidth < 768 ? 60 : 80
  scroll.target = Math.min(Math.max(offset - navHeight, 0), scroll.limit)
}

// --- Animations ---
function animateIn() {
  GSAP.fromTo('.projects__hero__top > *, .projects__list__row',
    { autoAlpha: 0, y: 30 },
    { autoAlpha: 1, y: 0, duration: 1, ease: 'expo.out', stagger: 0.06, delay: 0.2 }
  )

  itemEls.value.forEach(el => {
    observeOnce(el, () => {
      GSAP.fromTo(el, { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, duration: 1.1, ease: 'expo.out' })
    })
  })
}

onMounted(() => {
  changeColors({ backgroundColor: '#F5F0E6', color: '#1A2A2F' })
})
</script>
