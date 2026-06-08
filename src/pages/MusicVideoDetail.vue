<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ComponentNavbar from '../components/ComponentNavbar.vue'
import { songs } from '../data/songlist'
import { usePlayer } from '../composables/usePlayer'

const route = useRoute()
const router = useRouter()

const { pauseForVideo } = usePlayer()

const videoPlayer = ref(null)
const isPlaying = ref(false)
const volume = ref(1)
const currentTime = ref(0)
const duration = ref(0)

const updateProgress = () => {
    currentTime.value = videoPlayer.value.currentTime
    duration.value = videoPlayer.value.duration || 0
}

const setProgress = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    const newTime = ((e.clientX - r.left) / r.width) * duration.value
    console.log('video seek to:', newTime.toFixed(2), '/', duration.value.toFixed(2))
    videoPlayer.value.currentTime = newTime
}

const fmt = (t) => {
    if (!t || isNaN(t)) return '0:00'
    return `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`
}

const pct = computed(() => (duration.value ? (currentTime.value / duration.value) * 100 : 0))

const songId = computed(() => Number(route.params.id))
const currentIndex = computed(() => songs.findIndex(s => s.id === songId.value))
const currentSong = computed(() => songs[currentIndex.value])

const toggleVideo = () => {
    if (isPlaying.value) {
        videoPlayer.value.pause()
        isPlaying.value = false
        console.log('video paused')
    } else {
        pauseForVideo()   // pause music — user must click play on music to resume
        videoPlayer.value.play()
        isPlaying.value = true
        console.log('video playing:', currentSong.value.title)
    }
}

const nextVideo = () => {
    isPlaying.value = false
    currentTime.value = 0
    duration.value = 0
    console.log('next video index:', currentIndex.value)
    router.push(`/video/${songs[(currentIndex.value + 1) % songs.length].id}`)
}

const prevVideo = () => {
    isPlaying.value = false
    currentTime.value = 0
    duration.value = 0
    console.log('prev video index:', currentIndex.value)
    router.push(`/video/${songs[(currentIndex.value - 1 + songs.length) % songs.length].id}`)
}

const changeVolume = () => {
    videoPlayer.value.volume = volume.value
    console.log('video volume:', volume.value)
}

const fullscreen = () => { videoPlayer.value.requestFullscreen() }
const goToSong = () => { router.push(`/song/${currentSong.value.id}`) }
</script>

<template>
    <div class="min-h-screen bg-[#F9F8F4] dark:bg-[#141310] text-[#1A1916] dark:text-[#EDE9DF]">
        <ComponentNavbar />

        <div class="max-w-5xl mx-auto px-5 py-8">

            <!-- Video -->
            <div class="bg-black border border-[#E2DDD4] dark:border-[#2E2B25]">
                <video
                    ref="videoPlayer"
                    :src="currentSong.video"
                    class="w-full aspect-video"
                    @timeupdate="updateProgress"
                    @loadedmetadata="updateProgress"
                    @ended="nextVideo"
                />
            </div>

            <!-- Progress bar -->
            <div class="mt-3">
                <div
                    class="relative w-full h-5 flex items-center cursor-pointer group"
                    @click="setProgress"
                >
                    <div class="relative w-full h-px bg-[#E2DDD4] dark:bg-[#2E2B25]">
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
                </div>
                <div class="flex justify-between text-xs tabular-nums text-[#8A8679] dark:text-[#7A7870]">
                    <span>{{ fmt(currentTime) }}</span>
                    <span>{{ fmt(duration) }}</span>
                </div>
            </div>

            <!-- Title row -->
            <div class="mt-5 flex items-start justify-between gap-6">
                <div class="min-w-0">
                    <p class="text-xs font-bold tracking-[0.15em] uppercase text-[#8A8679] dark:text-[#7A7870] mb-1">
                        {{ String(currentIndex + 1).padStart(2, '0') }} / {{ String(songs.length).padStart(2, '0') }}
                    </p>
                    <h1 class="text-3xl font-black tracking-tight leading-none">
                        {{ currentSong.title }}
                    </h1>
                    <p class="text-base font-medium tracking-[0.06em] uppercase text-[#8A8679] dark:text-[#7A7870] mt-1.5">
                        {{ currentSong.artist }}
                    </p>
                </div>

                <!-- Go to song -->
                <button
                    @click="goToSong"
                    class="cursor-pointer shrink-0 text-sm font-medium tracking-wide text-[#8A8679] dark:text-[#7A7870] hover:text-[var(--accent)] transition-colors mt-1 whitespace-nowrap"
                >
                    Listen to song →
                </button>
            </div>

            <!-- Controls -->
            <div class="mt-5 flex items-center gap-5 flex-wrap border-t border-[#E2DDD4] dark:border-[#2E2B25] pt-5">

                <!-- Prev / Play / Next -->
                <div class="flex items-center gap-4">
                    <button @click="prevVideo" class="w-12 h-12 flex items-center justify-center cursor-pointer text-[#8A8679] dark:text-[#7A7870] hover:text-[#1A1916] dark:hover:text-[#EDE9DF] transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" class="w-6 h-6">
                            <path d="M6 5h2v14H6zm3.5 7 8.5 7V5z" />
                        </svg>
                    </button>

                    <button
                        @click="toggleVideo"
                        class="w-12 h-12 flex items-center justify-center cursor-pointer bg-[#1A1916] dark:bg-[#EDE9DF] text-[#F9F8F4] dark:text-[#141310] hover:bg-[var(--accent)] dark:hover:bg-[var(--accent)] dark:hover:text-white transition-colors"
                    >
                        <svg v-if="!isPlaying" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 ml-0.5">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                        <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
                            <path d="M6 5h4v14H6zm8 0h4v14h-4z" />
                        </svg>
                    </button>

                    <button @click="nextVideo" class="w-12 h-12 flex items-center justify-center cursor-pointer text-[#8A8679] dark:text-[#7A7870] hover:text-[#1A1916] dark:hover:text-[#EDE9DF] transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" class="w-6 h-6">
                            <path d="M16 5h2v14h-2zm-1.5 7-8.5 7V5z" />
                        </svg>
                    </button>
                </div>

                <!-- Volume -->
                <div class="flex items-center gap-2 w-44">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 shrink-0 text-[#8A8679] dark:text-[#7A7870]">
                        <path d="M18.5 12A4.5 4.5 0 0 0 16 8v8a4.5 4.5 0 0 0 2.5-4zM5 9v6h4l5 5V4L9 9H5z" />
                    </svg>
                    <input v-model="volume" type="range" min="0" max="1" step="0.01" @input="changeVolume" class="w-full" />
                </div>

                <!-- Fullscreen -->
                <button
                    @click="fullscreen"
                    class="ml-auto cursor-pointer text-sm font-medium tracking-wide text-[#8A8679] dark:text-[#7A7870] hover:text-[#1A1916] dark:hover:text-[#EDE9DF] transition-colors flex items-center gap-1.5"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
                        <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
                    </svg>
                    Fullscreen
                </button>

            </div>
        </div>
    </div>
</template>
