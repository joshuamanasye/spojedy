<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import PlayerBar from './components/PlayerBar.vue'
import { usePlayer } from './composables/usePlayer'

const route = useRoute()
const { currentSong } = usePlayer()

// show the bar on every page except the full song detail and video detail
const showPlayerBar = computed(() =>
    !route.path.match(/^\/(song|video)\//)
)

// always pad when the bar is present (bar renders even with no song loaded)
const hasBar = computed(() => showPlayerBar.value)

onMounted(() => {
    const saved = localStorage.getItem('theme')
    document.body.classList.toggle('dark', saved === 'dark')
})
</script>

<template>
    <div :class="hasBar ? 'pb-20' : ''">
        <router-view />
    </div>
    <PlayerBar v-if="showPlayerBar" />
</template>
