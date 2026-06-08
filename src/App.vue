<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import PlayerBar from './components/PlayerBar.vue'
import { usePlayer } from './composables/usePlayer'

const route = useRoute()
const { currentSong } = usePlayer()

// Show the bar on every page except the full song detail and video detail
const showPlayerBar = computed(() =>
    !route.path.match(/^\/(song|video)\//)
)

// Add bottom padding when the bar is visible and has a song loaded
const hasBar = computed(() => showPlayerBar.value && currentSong.value)

onMounted(() => {
    const saved = localStorage.getItem('theme')
    document.body.classList.toggle('dark', saved === 'dark')
})
</script>

<template>
    <div :class="hasBar ? 'pb-28' : ''">
        <router-view />
    </div>
    <PlayerBar v-if="showPlayerBar" />
</template>
