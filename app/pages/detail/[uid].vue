<template>
  <div class="case" data-background="#F5F0E6" data-color="#1A2A2F">
    <div ref="wrapperEl" class="case__wrapper">

      <template v-if="project">
        <!-- ① HERO -->
        <section class="case__hero">
          <NuxtLink to="/projects" class="case__back">← All projects</NuxtLink>
          <span class="case__tag">Case study {{ number }} — {{ project.extra.type }}</span>
          <h1 class="case__title">
            {{ project.extra.titleSplit.start }}<br v-if="project.extra.titleSplit.last">
            <em>{{ project.extra.titleSplit.last }}</em>
          </h1>
          <p class="case__tagline">{{ project.extra.tagline || project.description }}</p>
        </section>

        <!-- ② META -->
        <dl class="case__meta">
          <div>
            <dt>Client</dt>
            <dd>{{ project.extra.client }}</dd>
          </div>
          <div>
            <dt>Role</dt>
            <dd>{{ project.category }}</dd>
          </div>
          <div>
            <dt>Year</dt>
            <dd>{{ project.year }}</dd>
          </div>
          <div>
            <dt>Stack</dt>
            <dd>{{ project.tech.join(' · ') }}</dd>
          </div>
          <div>
            <dt>Live site</dt>
            <dd>
              <a v-if="project.link" :href="project.link" target="_blank" rel="noopener" class="case__meta__link">
                Visit site
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M2.5 17.5L17.5 2.5M17.5 2.5H2.5M17.5 2.5V17.5" stroke="currentColor" stroke-width="1.5"/>
                </svg>
              </a>
              <span v-else>—</span>
            </dd>
          </div>
        </dl>

        <!-- ③ IMAGE -->
        <figure class="case__media">
          <img :src="project.image" :alt="project.title" class="loaded">
        </figure>

        <!-- ④ CHALLENGE / APPROACH / OUTCOME -->
        <section class="case__steps">
          <div class="case__step">
            <span class="case__step__label">01 · The challenge</span>
            <p>{{ project.extra.challenge }}</p>
          </div>
          <div class="case__step">
            <span class="case__step__label">02 · The approach</span>
            <p>{{ project.extra.approach }}</p>
          </div>
          <div class="case__step">
            <span class="case__step__label">03 · The outcome</span>
            <p>{{ project.extra.outcome }}</p>
          </div>
        </section>

        <!-- ⑤ VISUELS (placeholders) -->
        <section class="case__visuals">
          <div class="case__placeholder">[Mobile screens]</div>
          <div class="case__placeholder">[Detail: a key page or component]</div>
        </section>

        <!-- ⑥ NEXT PROJECT -->
        <NuxtLink v-if="next" :to="`/detail/${next.uid}`" class="case__next">
          <span class="case__next__label">Next project</span>
          <span class="case__next__row">
            <span class="case__next__title">{{ next.title }} <em>{{ next.year }}</em></span>
            <span class="case__next__arrow">→</span>
          </span>
        </NuxtLink>
      </template>

      <section v-else class="case__hero">
        <NuxtLink to="/projects" class="case__back">← All projects</NuxtLink>
        <h1 class="case__title">Project not found</h1>
      </section>

      <Footer />

    </div>
  </div>
</template>

<script setup>
import GSAP from 'gsap'
import { useScroll } from '~/composables/useScroll'
import { useColors } from '~/composables/useColors'
import { getProjectExtra, splitTitle } from '~/utils/projectsExtra'

// Remonte la page quand on passe d'un case study à l'autre
definePageMeta({ key: route => route.fullPath })

const route = useRoute()
const { data } = await useFetch('/api/projects')

const projects = computed(() =>
  (data.value?.projects || []).map(p => ({
    ...p,
    extra: { ...getProjectExtra(p), titleSplit: splitTitle(p.title) }
  }))
)
const index = computed(() => projects.value.findIndex(p => p.uid === route.params.uid))
const project = computed(() => projects.value[index.value] || null)
const number = computed(() => String(index.value + 1).padStart(2, '0'))
// Projet suivant dans la liste (revient au premier après le dernier)
const next = computed(() => {
  if (projects.value.length < 2 || index.value < 0) return null
  return projects.value[(index.value + 1) % projects.value.length]
})

useSEO({
  title: `${project.value?.title || 'Case study'} - Gabin Caron | Web Developer`,
  description: project.value?.description || '',
  image: project.value?.image || '',
  path: `/detail/${route.params.uid}`
})

// --- Scroll ---
const wrapperEl = ref(null)
const emit = defineEmits(['page-ready'])
const { scroll, onWheel, onTouchStart, onTouchMove, onTouchEnd, onResize, update, reset } = useScroll()
const { change: changeColors } = useColors()
let resizeObserver = null

onMounted(() => {
  changeColors({ backgroundColor: '#F5F0E6', color: '#1A2A2F' })

  nextTick(() => {
    onResize(wrapperEl.value)

    resizeObserver = new ResizeObserver(() => onResize(wrapperEl.value))
    resizeObserver.observe(wrapperEl.value)

    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })

    GSAP.fromTo('.case__hero > *, .case__meta',
      { autoAlpha: 0, y: 30 },
      { autoAlpha: 1, y: 0, duration: 1, ease: 'expo.out', stagger: 0.07, delay: 0.2 }
    )

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
