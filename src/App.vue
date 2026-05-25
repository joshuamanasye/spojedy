<script setup>
import { onMounted } from 'vue'

/* Apply persisted theme before first render */
onMounted(() => {
    const saved = localStorage.getItem('theme')
    if (saved === 'dark') {
        document.body.classList.add('dark')
    } else {
        document.body.classList.remove('dark')
    }
})
</script>

<template>
    <router-view />
</template>
