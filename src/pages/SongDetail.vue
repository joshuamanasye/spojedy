<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ComponentNavbar from '../components/ComponentNavbar.vue'
import { songs } from '../data/songlist'
import { useQueue } from '../composables/useQueue'

const route = useRoute()
const router = useRouter()

const { queue, queueLength, addToQueue, removeFromQueue, shiftQueue, clearQueue, moveUp, moveDown } = useQueue()

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
const showQueue = ref(false)   // toggle queue panel

// toast for "Add to Queue" button in detail view
const toasted = ref(false)
function handleAddToQueue() {
    addToQueue(currentSong.value)
    toasted.value = true
    setTimeout(() => (toasted.value = false), 1200)
}

const togglePlay = () => {
    if (isPlaying.value) {
        audioPlayer.value.pause()
        isPlaying.value = false
    } else {
        audioPlayer.value.play()
        isPlaying.value = true
    }
}

// nextSong: if queue has items, play the next queued song; otherwise fall through to next in list
const nextSong = () => {
    isPlaying.value = false
    const queued = shiftQueue()
    if (queued) {
        router.push(`/song/${queued.id}`)
    } else {
        const nextId = songs[(currentIndex.value + 1) % songs.length].id
        router.push(`/song/${nextId}`)
    }
}

const prevSong = () => {
    isPlaying.value = false
    const prevId = songs[(currentIndex.value - 1 + songs.length) % songs.length].id
    router.push(`/song/${prevId}`)
}

const updateProgress = () => {
    currentTime.value = audioPlayer.value.currentTime
    duration.value = audioPlayer.value.duration || 0
}

const setProgress = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    const newTime = ((e.clientX - r.left) / r.width) * duration.value
    audioPlayer.value.currentTime = newTime
}

const fmt = (t) => {
    if (!t || isNaN(t)) return '0:00'
    return `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`
}

const changeVolume = () => {
    audioPlayer.value.volume = volume.value
}

const pct = computed(() => (duration.value ? (currentTime.value / duration.value) * 100 : 0))
</script>

<template>
    <div class="min-h-screen bg-[#F9F8F4] dark:bg-[#141310] text-[#1A1916] dark:text-[#EDE9DF]">
        <ComponentNavbar />

        <!-- Two-column layout (main + optional queue panel) -->
        <div class="max-w-5xl mx-auto px-5 py-10">
            <div class="flex gap-8 items-start">

                <!-- ── MAIN CONTENT ── -->
                <div class="flex-1 min-w-0">
                    <div class="flex flex-col md:flex-row gap-10 md:gap-14 items-start">

                        <!-- Album art -->
                        <div class="md:w-80 md:shrink-0 w-full">
                            <div class="relative w-full md:w-80 aspect-square overflow-hidden">
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
                                    class="relative w-full h-5 flex items-center cursor-pointer group"
                                    @click="setProgress"
                                >
                                    <div class="relative w-full h-px bg-[#E2DDD4] dark:bg-[#2E2B25]">
                                        <div
                                            class="absolute top-0 left-0 h-full bg-[#1A1916] dark:bg-[#EDE9DF] transition-none"
                                            :style="{ width: pct + '%' }"
                                        />
                                        <div
                                            class="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[var(--accent)] -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                                            :style="{ left: pct + '%' }"
                                        />
                                    </div>
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
                                    class="w-14 h-14 flex items-center justify-center cursor-pointer text-[#8A8679] dark:text-[#7A7870] hover:text-[#1A1916] dark:hover:text-[#EDE9DF] transition-colors"
                                    title="Previous"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" class="w-6 h-6">
                                        <path d="M6 5h2v14H6zm3.5 7 8.5 7V5z" />
                                    </svg>
                                </button>

                                <button
                                    @click="togglePlay"
                                    class="w-14 h-14 flex items-center justify-center cursor-pointer bg-[#1A1916] dark:bg-[#EDE9DF] text-[#F9F8F4] dark:text-[#141310] hover:bg-[var(--accent)] dark:hover:bg-[var(--accent)] dark:hover:text-white transition-colors"
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
                                    class="w-14 h-14 flex items-center justify-center cursor-pointer text-[#8A8679] dark:text-[#7A7870] hover:text-[#1A1916] dark:hover:text-[#EDE9DF] transition-colors"
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

                            <!-- Bottom actions row -->
                            <div class="border-t border-[#E2DDD4] dark:border-[#2E2B25] mt-8 pt-5 flex items-center gap-5">
                                <!-- Watch video -->
                                <button
                                    @click="$router.push(`/video/${currentSong.id}`)"
                                    class="cursor-pointer text-sm font-medium tracking-wide text-[#8A8679] dark:text-[#7A7870] hover:text-[var(--accent)] transition-colors"
                                >
                                    Watch music video →
                                </button>

                                <!-- Add to Queue -->
                                <button
                                    @click="handleAddToQueue"
                                    :title="toasted ? 'Added!' : 'Add this song to queue'"
                                    class="ml-auto flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold tracking-wide border transition-colors"
                                    :class="toasted
                                        ? 'border-[var(--accent)] text-[var(--accent)]'
                                        : 'border-[#E2DDD4] dark:border-[#2E2B25] text-[#8A8679] dark:text-[#7A7870] hover:border-[#1A1916] dark:hover:border-[#EDE9DF] hover:text-[#1A1916] dark:hover:text-[#EDE9DF]'"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-3.5 h-3.5">
                                        <path d="M19 11H13V5h-2v6H5v2h6v6h2v-6h6z"/>
                                    </svg>
                                    {{ toasted ? 'Added to Queue' : '+ Queue' }}
                                </button>

                                <!-- Toggle queue panel -->
                                <button
                                    @click="showQueue = !showQueue"
                                    :title="showQueue ? 'Hide queue' : 'Show queue'"
                                    class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold tracking-wide border transition-colors"
                                    :class="showQueue
                                        ? 'border-[#1A1916] dark:border-[#EDE9DF] text-[#1A1916] dark:text-[#EDE9DF]'
                                        : 'border-[#E2DDD4] dark:border-[#2E2B25] text-[#8A8679] dark:text-[#7A7870] hover:border-[#1A1916] dark:hover:border-[#EDE9DF] hover:text-[#1A1916] dark:hover:text-[#EDE9DF]'"
                                >
                                    <!-- list icon -->
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-3.5 h-3.5">
                                        <path d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z"/>
                                    </svg>
                                    Queue
                                    <span v-if="queueLength > 0" class="ml-0.5 bg-[var(--accent)] text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
                                        {{ queueLength }}
                                    </span>
                                </button>
                            </div>

                        </div>
                    </div>
                </div>

                <!-- ── QUEUE PANEL ── -->
                <Transition name="queue-panel">
                    <div
                        v-if="showQueue"
                        class="w-72 shrink-0 border-l border-[#E2DDD4] dark:border-[#2E2B25] pl-6 hidden md:block"
                    >
                        <!-- Panel header -->
                        <div class="flex items-center justify-between mb-4">
                            <h2 class="text-xs font-bold tracking-[0.15em] uppercase text-[#8A8679] dark:text-[#7A7870]">
                                Up Next
                                <span v-if="queueLength > 0" class="ml-1 text-[var(--accent)]">· {{ queueLength }}</span>
                            </h2>
                            <button
                                v-if="queueLength > 0"
                                @click="clearQueue"
                                class="text-[10px] tracking-wide font-medium text-[#8A8679] dark:text-[#7A7870] hover:text-[var(--accent)] transition-colors"
                            >
                                Clear all
                            </button>
                        </div>

                        <!-- Empty state -->
                        <div v-if="queueLength === 0" class="py-8 text-center">
                            <p class="text-sm text-[#8A8679] dark:text-[#7A7870]">Queue is empty</p>
                            <p class="text-xs text-[#8A8679]/60 dark:text-[#7A7870]/60 mt-1">Add songs from the tracklist</p>
                        </div>

                        <!-- Queue list -->
                        <ul v-else class="space-y-0">
                            <li
                                v-for="(song, i) in queue"
                                :key="i"
                                class="group flex items-center gap-3 py-3 border-b border-[#E2DDD4] dark:border-[#2E2B25] last:border-b-0"
                            >
                                <!-- Position number -->
                                <span class="text-xs tabular-nums text-[#8A8679] dark:text-[#7A7870] w-4 shrink-0">
                                    {{ i + 1 }}
                                </span>

                                <!-- Cover -->
                                <img :src="song.cover" :alt="song.title" class="w-9 h-9 object-cover shrink-0" />

                                <!-- Info -->
                                <div class="flex-1 min-w-0">
                                    <p class="text-sm font-semibold text-[#1A1916] dark:text-[#EDE9DF] truncate leading-tight">
                                        {{ song.title }}
                                    </p>
                                    <p class="text-xs text-[#8A8679] dark:text-[#7A7870] truncate mt-0.5">
                                        {{ song.artist }}
                                    </p>
                                </div>

                                <!-- Row actions (visible on hover) -->
                                <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                    <!-- Move up -->
                                    <button
                                        @click="moveUp(i)"
                                        :disabled="i === 0"
                                        class="w-6 h-6 flex items-center justify-center text-[#8A8679] dark:text-[#7A7870] hover:text-[#1A1916] dark:hover:text-[#EDE9DF] disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
                                        title="Move up"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-3 h-3">
                                            <path d="M12 8l-6 6h12z"/>
                                        </svg>
                                    </button>
                                    <!-- Move down -->
                                    <button
                                        @click="moveDown(i)"
                                        :disabled="i === queue.length - 1"
                                        class="w-6 h-6 flex items-center justify-center text-[#8A8679] dark:text-[#7A7870] hover:text-[#1A1916] dark:hover:text-[#EDE9DF] disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
                                        title="Move down"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-3 h-3">
                                            <path d="M12 16l6-6H6z"/>
                                        </svg>
                                    </button>
                                    <!-- Remove -->
                                    <button
                                        @click="removeFromQueue(i)"
                                        class="w-6 h-6 flex items-center justify-center text-[#8A8679] dark:text-[#7A7870] hover:text-[var(--accent)] transition-colors"
                                        title="Remove"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-3 h-3">
                                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                                        </svg>
                                    </button>
                                </div>
                            </li>
                        </ul>
                    </div>
                </Transition>

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

.queue-panel-enter-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.queue-panel-leave-active { transition: opacity 0.15s ease, transform 0.15s ease; }
.queue-panel-enter-from   { opacity: 0; transform: translateX(12px); }
.queue-panel-leave-to     { opacity: 0; transform: translateX(12px); }
</style>
