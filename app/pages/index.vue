<template>
  <div class="home" data-background="#F5F0E6" data-color="#1A2A2F">
    <div class="home__wrapper">
      <div class="home__titles">
        <div class="home__titles__title">Gabin</div>
        <div class="home__titles__label">Web Developer & Explorer</div>
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

onMounted(() => {
  nextTick(() => {
    emit('page-ready', {
      scroll: null,  // Home n'a pas de scroll DOM
      update: null,
      onWheel: null,
      onResize: null
    })
  })
})

// NB: la classe webgl Home s'appuie sur document.querySelector('.home__gallery')
// et les <img data-src> du DOM réel ci-dessus — il faut donc que ce template
// soit monté (et le Preloader terminé) avant que useCanvas.createHome() s'exécute.
// C'est garanti par le flow onPreloaded() -> onChangeEnd() dans App.vue.
</script>