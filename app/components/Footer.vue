<template>
  <footer class="footer">
    <span class="footer__copy">© {{ year }} Gabin Caron — All rights reserved</span>

    <!-- Même infos que le popup contact (Prismic > navigation) -->
    <span class="footer__status">
      <span v-if="localisation">Based in {{ localisation }}</span>
      <span
        class="footer__availability"
        :class="{ 'footer__availability--open': isAvailable }"
      >
        <span class="footer__availability__dot"></span>
        {{ isAvailable ? 'Available now' : 'Not available' }}
      </span>
    </span>

    <NuxtLink to="/legal" class="footer__legal">Mentions légales / Legal Notice</NuxtLink>
  </footer>
</template>

<script setup>
// Même clé que app.vue / les pages : la requête n'est faite qu'une fois
const { data: layout } = await useFetch('/api/layout')

const year = new Date().getFullYear()
const localisation = computed(() => layout.value?.navigation?.data?.localisation)
const isAvailable = computed(() => layout.value?.navigation?.data?.available ?? true)
</script>
