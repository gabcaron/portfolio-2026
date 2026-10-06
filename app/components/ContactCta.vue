<template>
  <!-- Section contact partagée (About, Projects…) — styles : pages/about/about.scss (.about__cta) -->
  <section ref="ctaEl" class="about__cta">
    <div class="about__cta__inner">
      <h2 ref="titleEl" class="about__cta__title">
        Let's build<br>
        <em>something great.</em>
      </h2>
      <a ref="emailEl" href="mailto:gabindevelops@gmail.com" class="about__cta__email">
        gabindevelops@gmail.com
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M5 19L19 5M19 5H5M19 5V19" stroke="currentColor" stroke-width="1.5"/>
        </svg>
      </a>
      <div ref="linksEl" class="about__cta__links">
        <a href="https://github.com/gabcaron" target="_blank" class="about__cta__link">GitHub ↗</a>
        <a href="https://linkedin.com/in/gab-caron/" target="_blank" class="about__cta__link">LinkedIn ↗</a>
      </div>
    </div>
  </section>
</template>

<script setup>
import GSAP from 'gsap'

const ctaEl = ref(null)
const titleEl = ref(null)
const emailEl = ref(null)
const linksEl = ref(null)
let observer = null

// Animation d'entrée quand la section arrive à l'écran
onMounted(() => {
  observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return
      GSAP.fromTo(titleEl.value, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 1.2, ease: 'expo.out' })
      GSAP.fromTo(
        [emailEl.value, linksEl.value],
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.15, delay: 0.4 }
      )
      observer.disconnect()
    })
  }, { threshold: 0.15 })
  observer.observe(ctaEl.value)
})

onUnmounted(() => observer?.disconnect())
</script>
