<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ComponentNavbar from '../components/ComponentNavbar.vue'
import { songs } from '../data/songlist'

const route = useRoute()
const router = useRouter()

const songId = computed(() => Number(route.params.id))
const currentIndex = computed(() => songs.findIndex(s => s.id === songId.value))
const currentSong = computed(() => songs[currentIndex.value])

const audioPlayer = ref(null)
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(1)
const isFullscreen = ref(false)
const zoomLevel = ref(1)

const togglePlay = () => {
    if (isPlaying.value) {
        audioPlayer.value.pause()
        isPlaying.value = false
        console.log('paused:', currentSong.value.title)
    } else {
        audioPlayer.value.play()
        isPlaying.value = true
        console.log('playing:', currentSong.value.title)
    }
}

const nextSong = () => {
    isPlaying.value = false
    const nextId = songs[(currentIndex.value + 1) % songs.length].id
    console.log('next song, id:', nextId)
    router.push(`/song/${nextId}`)
}

const prevSong = () => {
    isPlaying.value = false
    const prevId = songs[(currentIndex.value - 1 + songs.length) % songs.length].id
    console.log('prev song, id:', prevId)
    router.push(`/song/${prevId}`)
}

const updateProgress = () => {
    currentTime.value = audioPlayer.value.currentTime
    duration.value    = audioPlayer.value.duration || 0
}

const setProgress = (e) => {
    const r       = e.currentTarget.getBoundingClientRect()
    const newTime = ((e.clientX - r.left) / r.width) * duration.value
    console.log('seek to:', newTime.toFixed(2), '/', duration.value.toFixed(2))
    audioPlayer.value.currentTime = newTime
}

const fmt = (t) => {
    if (!t || isNaN(t)) return '0:00'
    return `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`
}

const changeVolume = () => {
    audioPlayer.value.volume = volume.value
    console.log('volume:', volume.value)
}

const pct = computed(() => (duration.value ? (currentTime.value / duration.value) * 100 : 0))
</script>

<template>
    <div class="min-h-screen bg-[#F9F8F4] dark:bg-[#141310] text-[#1A1916] dark:text-[#EDE9DF]">
        <ComponentNavbar />

        <!-- Two-column layout -->
        <div class="max-w-5xl mx-auto px-5 py-10">
            <div class="flex flex-col md:flex-row gap-10 md:gap-14 items-start">

                <!-- Album art -->
                <div class="md:w-80 md:shrink-0 w-full">
                    <div class="relative w-full md:w-80 aspect-square">
                        <img
                            :src="currentSong.cover"
                            :alt="currentSong.title"
                            :class="[
                                'w-full h-full object-cover cursor-pointer border border-[#E2DDD4] dark:border-[#2E2B25]',
                                isPlaying ? 'animate-spin-slow rounded-full' : ''
                            ]"
                            @click="isFullscreen = true"
                        />
                        <span class="absolute bottom-2 right-2 text-[10px] text-white/50 select-none pointer-events-none">
                            click to expand
                        </span>
                    </div>

                    <!-- Track position -->
                    <p class="mt-3 text-xs tracking-[0.15em] uppercase text-[#8A8679] dark:text-[#7A7870]">
                        {{ String(currentIndex + 1).padStart(2, '0') }} /
                        {{ String(songs.length).padStart(2, '0') }}
                    </p>
                </div>

                <!-- Controls -->
                <div class="flex-1 min-w-0 pt-1">

                    <!-- Title and artist -->
                    <h1 class="text-4xl md:text-5xl font-black tracking-tight leading-none">
                        {{ currentSong.title }}
                    </h1>
                    <p class="mt-2 text-base font-medium tracking-[0.08em] uppercase text-[#8A8679] dark:text-[#7A7870]">
                        {{ currentSong.artist }}
                    </p>

                    <audio
                        ref="audioPlayer"
                        :src="currentSong.audio"
                        @timeupdate="updateProgress"
                        @loadedmetadata="updateProgress"
                        @ended="nextSong"
                    />

                    <!-- Progress bar -->
                    <div class="mt-8">
                        <div
                            class="relative w-full h-px bg-[#E2DDD4] dark:bg-[#2E2B25] cursor-pointer group"
                            @click="setProgress"
                        >
                            <!-- Filled -->
                            <div
                                class="absolute top-0 left-0 h-full bg-[#1A1916] dark:bg-[#EDE9DF] transition-none"
                                :style="{ width: pct + '%' }"
                            />
                            <!-- Playhead dot -->
                            <div
                                class="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[var(--accent)] -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                                :style="{ left: pct + '%' }"
                            />
                        </div>
                        <div class="flex justify-between text-xs tabular-nums text-[#8A8679] dark:text-[#7A7870] mt-1.5">
                            <span>{{ fmt(currentTime) }}</span>
                            <span>{{ fmt(duration) }}</span>
                        </div>
                    </div>

                    <!-- Playback controls -->
                    <div class="flex items-center gap-5 mt-6">
                        <button
                            @click="prevSong"
                            class="text-[#8A8679] dark:text-[#7A7870] hover:text-[#1A1916] dark:hover:text-[#EDE9DF] transition-colors"
                            title="Previous"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" class="w-6 h-6">
                                <path d="M6 5h2v14H6zm3.5 7 8.5 7V5z" />
                            </svg>
                        </button>

                        <!-- Play / Pause -->
                        <button
                            @click="togglePlay"
                            class="w-14 h-14 flex items-center justify-center bg-[#1A1916] dark:bg-[#EDE9DF] text-[#F9F8F4] dark:text-[#141310] hover:bg-[var(--accent)] dark:hover:bg-[var(--accent)] dark:hover:text-white transition-colors"
                            title="Play / Pause"
                        >
                            <svg v-if="!isPlaying" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 ml-0.5">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                            <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
                                <path d="M6 5h4v14H6zm8 0h4v14h-4z" />
                            </svg>
                        </button>

                        <button
                            @click="nextSong"
                            class="text-[#8A8679] dark:text-[#7A7870] hover:text-[#1A1916] dark:hover:text-[#EDE9DF] transition-colors"
                            title="Next"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" class="w-6 h-6">
                                <path d="M16 5h2v14h-2zm-1.5 7-8.5 7V5z" />
                            </svg>
                        </button>
                    </div>

                    <!-- Volume -->
                    <div class="flex items-center gap-3 mt-5 max-w-xs">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 shrink-0 text-[#8A8679] dark:text-[#7A7870]">
                            <path d="M18.5 12A4.5 4.5 0 0 0 16 8v8a4.5 4.5 0 0 0 2.5-4zM5 9v6h4l5 5V4L9 9H5z" />
                        </svg>
                        <input v-model="volume" type="range" min="0" max="1" step="0.01" @input="changeVolume" class="w-full" />
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 shrink-0 text-[#8A8679] dark:text-[#7A7870]">
                            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                        </svg>
                    </div>

                    <!-- Watch video link -->
                    <div class="border-t border-[#E2DDD4] dark:border-[#2E2B25] mt-8 pt-5">
                        <button
                            @click="$router.push(`/video/${currentSong.id}`)"
                            class="text-sm font-medium tracking-wide text-[#8A8679] dark:text-[#7A7870] hover:text-[var(--accent)] transition-colors"
                        >
                            Watch music video
                        </button>
                    </div>

                </div>
            </div>
        </div>

        <!-- Fullscreen overlay -->
        <Transition name="fs">
            <div
                v-if="isFullscreen"
                class="fixed inset-0 z-50 bg-[#141310]/97 flex items-center justify-center"
                @click.self="isFullscreen = false; zoomLevel = 1"
            >
                <img
                    :src="currentSong.cover"
                    :alt="currentSong.title"
                    :style="{ transform: `scale(${zoomLevel})`, transition: 'transform 0.2s ease' }"
                    class="max-w-[85vw] max-h-[82vh] object-contain"
                />

                <!-- Zoom controls -->
                <div class="absolute bottom-7 flex items-center gap-1 border border-white/10 px-3 py-2">
                    <button @click="zoomLevel = Math.max(zoomLevel - 0.25, 0.5)" class="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white transition-colors text-lg font-light">−</button>
                    <span class="text-white/40 text-xs w-10 text-center select-none">{{ Math.round(zoomLevel * 100) }}%</span>
                    <button @click="zoomLevel = Math.min(zoomLevel + 0.25, 3)" class="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white transition-colors text-lg font-light">+</button>
                    <div class="w-px h-4 bg-white/10 mx-1" />
                    <button @click="isFullscreen = false; zoomLevel = 1" class="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white transition-colors text-xs tracking-widest">✕</button>
                </div>
            </div>
        </Transition>
    </div>
</template>

<style scoped>
.fs-enter-active, .fs-leave-active { transition: opacity 0.18s ease; }
.fs-enter-from, .fs-leave-to       { opacity: 0; }
</style>
