<template>
  <div class="home" data-background="#F5F0E6" data-color="#1A2A2F">
    <div class="home__wrapper">
      <div class="home__titles">
        <h1 ref="titleEl" class="home__titles__title">Gabin</h1>
        <div ref="labelEl" class="home__titles__label">Web Developer & Explorer</div>
        <NuxtLink to="/projects" class="home__titles__link">
          See my work
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 14L14 2M14 2H2M14 2V14" stroke="currentColor" stroke-width="1.2"/>
          </svg>
        </NuxtLink>
      </div>

      <div class="home__gallery">
        <figure
          v-for="(media, index) in home?.data?.gallery"
          :key="index"
          class="home__gallery__media"
        >
          <img
            class="home__gallery__media__image"
            :class="{ loaded: true }"
            :data-src="media.image.url"
            :src="media.image.url"
            :alt="media.image.alt"
          >
        </figure>
      </div>
    </div>
  </div>
</template>

<script setup>
const { data: layoutData } = await useFetch('/api/layout')
const ogImage = computed(() => layoutData.value?.meta?.data?.image?.url || '')

useSEO({
  title: 'Gabin Caron | Web Developer',
  description: 'French web developer crafting immersive digital experiences at the intersection of code & design. WebGL, Vue.js, Nuxt, GSAP.',
  image: ogImage.value,
  path: '/'
})

const { data } = await useFetch('/api/home')
const home = computed(() => data.value?.home)

const emit = defineEmits(['page-ready'])

const titleEl = ref(null)
const labelEl = ref(null)

// Ajuste la taille du label pour qu'il ait la même largeur que "Gabin"
function fitLabel() {
  const title = titleEl.value
  const label = labelEl.value
  if (!title || !label) return

  label.style.fontSize = ''

  const titleWidth = title.getBoundingClientRect().width
  const labelWidth = label.getBoundingClientRect().width
  if (!labelWidth) return

  const currentSize = parseFloat(getComputedStyle(label).fontSize)
  label.style.fontSize = `${currentSize * (titleWidth / labelWidth)}px`
}

onMounted(() => {
  document.fonts?.ready.then(fitLabel)
  fitLabel()
  window.addEventListener('resize', fitLabel)

  nextTick(() => {
    emit('page-ready', {
      scroll: null,  // Home n'a pas de scroll DOM
      update: null,
      onWheel: null,
      onResize: null
    })
  })
})

onUnmounted(() => window.removeEventListener('resize', fitLabel))

// NB: la classe webgl Home s'appuie sur document.querySelector('.home__gallery')
// et les <img data-src> du DOM réel ci-dessus — il faut donc que ce template
// soit monté (et le Preloader terminé) avant que useCanvas.createHome() s'exécute.
// C'est garanti par le flow onPreloaded() -> onChangeEnd() dans App.vue.
</script>