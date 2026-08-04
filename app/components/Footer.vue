<template>
    <footer class="footer">
        <span class="footer__copy">© {{ year }} Gabin Caron — All rights reserved</span>
        <NuxtLink to="/legal" class="footer__legal">Mentions légales / Inprint</NuxtLink>
    </footer>
</template>

<script setup>
const year = new Date().getFullYear()
</script>