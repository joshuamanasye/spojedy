<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ComponentNavbar from '../components/ComponentNavbar.vue'
import { songs } from '../data/songlist'
import { useQueue } from '../composables/useQueue'
import { usePlayer } from '../composables/usePlayer'

const route = useRoute()
const router = useRouter()

// queue
const { queue, queueLength, addToQueue, removeFromQueue, shiftQueue, clearQueue, moveUp, moveDown } = useQueue()

// global player
const { currentSong: playerSong, isPlaying, currentTime, duration, volume,
        pct, fmt, loadSong, togglePlay, setProgress, changeVolume } = usePlayer()

// route-derived song (used for display)
const songId = computed(() => Number(route.params.id))
const currentIndex = computed(() => songs.findIndex(s => s.id === songId.value))
const currentSong = computed(() => songs[currentIndex.value])

// sync route → player
watch(songId, (id) => {
    const song = songs.find(s => s.id === id)
    if (song && (!playerSong.value || playerSong.value.id !== id)) {
        console.log('detail: route changed, loading', id)
        loadSong(song, isPlaying.value)
    }
}, { immediate: true })

// when the player auto-advances (song ended), navigate so this page stays in sync
watch(playerSong, (newSong) => {
    if (newSong && newSong.id !== songId.value) {
        console.log('detail: player moved on, push to', newSong.id)
        router.push(`/song/${newSong.id}`)
    }
})

// manual prev / next
const nextSong = () => {
    const wasPlaying = isPlaying.value
    const queued = shiftQueue()
    const next = queued || songs[(currentIndex.value + 1) % songs.length]
    console.log('detail: next ->', next.title)
    loadSong(next, wasPlaying)
}

const prevSong = () => {
    loadSong(songs[(currentIndex.value - 1 + songs.length) % songs.length], isPlaying.value)
}

// misc UI state
const zoomLevel = ref(1)
const showQueue = ref(true)
const toasted = ref(false)

const openArtModal = () => {
    zoomLevel.value = 1
    const modal = new window.bootstrap.Modal(document.getElementById('artModal'))
    modal.show()
}

function handleAddToQueue() {
    addToQueue(currentSong.value)
    toasted.value = true
    setTimeout(() => (toasted.value = false), 1200)
}
</script>

<template>
    <div class="min-h-screen bg-[#F9F8F4] dark:bg-[#141310] text-[#1A1916] dark:text-[#EDE9DF]">
        <ComponentNavbar />

        <!-- main content — always full width; queue is a fixed overlay -->
        <div class="max-w-5xl mx-auto px-5 py-10">
            <div class="flex flex-col md:flex-row gap-10 md:gap-14 items-start">

                <!-- album art -->
                <div class="md:w-80 md:shrink-0 w-full">
                    <div class="relative w-full md:w-80 aspect-square overflow-hidden">
                        <img
                            :src="currentSong.cover"
                            :alt="currentSong.title"
                            :class="[
                                'w-full h-full object-cover cursor-pointer border border-[#E2DDD4] dark:border-[#2E2B25]',
                                isPlaying ? 'animate-spin-slow rounded-full' : ''
                            ]"
                            @click="openArtModal"
                        />
                        <span class="absolute bottom-2 right-2 text-[10px] text-white/50 select-none pointer-events-none">
                            click to expand
                        </span>
                    </div>
                    <p class="mt-3 text-xs tracking-[0.15em] uppercase text-[#8A8679] dark:text-[#7A7870]">
                        {{ String(currentIndex + 1).padStart(2, '0') }} /
                        {{ String(songs.length).padStart(2, '0') }}
                    </p>
                </div>

                <!-- controls column -->
                <div class="flex-1 min-w-0 pt-1">

                    <!-- title + artist -->
                    <h1 class="text-4xl md:text-5xl font-black tracking-tight leading-none">
                        {{ currentSong.title }}
                    </h1>
                    <p class="mt-2 text-base font-medium tracking-[0.08em] uppercase text-[#8A8679] dark:text-[#7A7870]">
                        {{ currentSong.artist }}
                    </p>

                    <!-- progress bar -->
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

                    <!-- play controls -->
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

                    <!-- volume -->
                    <div class="flex items-center gap-3 mt-5 max-w-xs">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 shrink-0 text-[#8A8679] dark:text-[#7A7870]">
                            <path d="M18.5 12A4.5 4.5 0 0 0 16 8v8a4.5 4.5 0 0 0 2.5-4zM5 9v6h4l5 5V4L9 9H5z" />
                        </svg>
                        <input
                            :value="volume"
                            type="range" min="0" max="1" step="0.01"
                            @input="changeVolume(Number($event.target.value))"
                            class="w-full"
                        />
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 shrink-0 text-[#8A8679] dark:text-[#7A7870]">
                            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                        </svg>
                    </div>

                    <!-- bottom action row -->
                    <div class="border-t border-[#E2DDD4] dark:border-[#2E2B25] mt-8 pt-5 flex items-center gap-3">

                        <!-- add to queue — icon only ('+') -->
                        <button
                            @click="handleAddToQueue"
                            :title="toasted ? 'Added to queue!' : 'Add to queue'"
                            class="w-9 h-9 flex items-center justify-center border transition-colors cursor-pointer"
                            :class="toasted
                                ? 'border-[var(--accent)] text-[var(--accent)]'
                                : 'border-[#E2DDD4] dark:border-[#2E2B25] text-[#8A8679] dark:text-[#7A7870] hover:border-[#1A1916] dark:hover:border-[#EDE9DF] hover:text-[#1A1916] dark:hover:text-[#EDE9DF]'"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
                                <path d="M19 11H13V5h-2v6H5v2h6v6h2v-6h6z"/>
                            </svg>
                        </button>

                        <!-- show queue — icon only (3 lines + count badge) -->
                        <button
                            @click="showQueue = !showQueue"
                            :title="showQueue ? 'Hide queue' : 'Show queue'"
                            class="relative w-9 h-9 flex items-center justify-center border transition-colors cursor-pointer"
                            :class="showQueue
                                ? 'border-[#1A1916] dark:border-[#EDE9DF] text-[#1A1916] dark:text-[#EDE9DF]'
                                : 'border-[#E2DDD4] dark:border-[#2E2B25] text-[#8A8679] dark:text-[#7A7870] hover:border-[#1A1916] dark:hover:border-[#EDE9DF] hover:text-[#1A1916] dark:hover:text-[#EDE9DF]'"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
                                <path d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z"/>
                            </svg>
                            <span
                                v-if="queueLength > 0"
                                class="absolute -top-1.5 -right-1.5 bg-[var(--accent)] text-white rounded-full w-4 h-4 flex items-center justify-center text-[9px] font-bold leading-none"
                            >{{ queueLength }}</span>
                        </button>

                        <!-- watch music video — pushed to the right -->
                        <button
                            @click="$router.push(`/video/${currentSong.id}`)"
                            class="ml-auto cursor-pointer text-sm font-medium tracking-wide text-[#8A8679] dark:text-[#7A7870] hover:text-[var(--accent)] transition-colors"
                        >
                            Watch music video →
                        </button>
                    </div>

                </div>
            </div>
        </div>

        <!-- ── queue panel — fixed right overlay ─────────────────────────── -->
        <Transition name="queue-slide">
            <div
                v-if="showQueue"
                class="fixed top-14 right-0 bottom-0 w-full sm:w-[26rem] z-50 flex flex-col bg-[#F9F8F4] dark:bg-[#141310] border-l border-[#E2DDD4] dark:border-[#2E2B25] shadow-[-8px_0_24px_rgba(0,0,0,0.07)]"
            >
                <!-- panel header -->
                <div class="flex items-center justify-between px-5 py-4 border-b border-[#E2DDD4] dark:border-[#2E2B25] shrink-0">
                    <h2 class="text-xs font-bold tracking-[0.15em] uppercase text-[#8A8679] dark:text-[#7A7870]">
                        Up Next
                        <span v-if="queueLength > 0" class="ml-1 text-[var(--accent)]">· {{ queueLength }}</span>
                    </h2>
                    <div class="flex items-center gap-3">
                        <button
                            v-if="queueLength > 0"
                            @click="clearQueue"
                            class="text-[10px] tracking-wide font-medium text-[#8A8679] dark:text-[#7A7870] hover:text-[var(--accent)] transition-colors cursor-pointer"
                        >
                            Clear
                        </button>
                        <button
                            @click="showQueue = false"
                            class="w-6 h-6 flex items-center justify-center text-[#8A8679] dark:text-[#7A7870] hover:text-[#1A1916] dark:hover:text-[#EDE9DF] transition-colors cursor-pointer"
                            title="Close"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
                                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                            </svg>
                        </button>
                    </div>
                </div>

                <!-- panel body (scrollable) -->
                <div class="flex-1 overflow-y-auto">

                    <!-- empty state -->
                    <div v-if="queueLength === 0" class="py-12 text-center px-5">
                        <p class="text-sm text-[#8A8679] dark:text-[#7A7870]">Queue is empty</p>
                        <p class="text-xs text-[#8A8679]/60 dark:text-[#7A7870]/60 mt-1">Add songs from the tracklist</p>
                    </div>

                    <!-- queue list -->
                    <ul v-else>
                        <li
                            v-for="(song, i) in queue"
                            :key="i"
                            class="group flex items-center gap-3 px-5 py-3 border-b border-[#E2DDD4] dark:border-[#2E2B25] last:border-b-0"
                        >
                            <span class="text-xs tabular-nums text-[#8A8679] dark:text-[#7A7870] w-5 shrink-0">{{ i + 1 }}</span>
                            <img :src="song.cover" :alt="song.title" class="w-10 h-10 object-cover shrink-0" />
                            <div class="flex-1 min-w-0 pr-1">
                                <p class="text-sm font-semibold text-[#1A1916] dark:text-[#EDE9DF] truncate leading-tight">{{ song.title }}</p>
                                <p class="text-xs text-[#8A8679] dark:text-[#7A7870] truncate mt-0.5">{{ song.artist }}</p>
                            </div>
                            <div class="hidden group-hover:flex items-center gap-1 shrink-0">
                                <button @click="moveUp(i)" :disabled="i === 0"
                                    class="w-7 h-7 flex items-center justify-center cursor-pointer text-[#8A8679] dark:text-[#7A7870] hover:text-[#1A1916] dark:hover:text-[#EDE9DF] disabled:opacity-25 disabled:cursor-not-allowed transition-colors" title="Move up">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-3.5 h-3.5"><path d="M12 8l-6 6h12z"/></svg>
                                </button>
                                <button @click="moveDown(i)" :disabled="i === queue.length - 1"
                                    class="w-7 h-7 flex items-center justify-center cursor-pointer text-[#8A8679] dark:text-[#7A7870] hover:text-[#1A1916] dark:hover:text-[#EDE9DF] disabled:opacity-25 disabled:cursor-not-allowed transition-colors" title="Move down">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-3.5 h-3.5"><path d="M12 16l6-6H6z"/></svg>
                                </button>
                                <button @click="removeFromQueue(i)"
                                    class="w-7 h-7 flex items-center justify-center cursor-pointer text-[#8A8679] dark:text-[#7A7870] hover:text-[var(--accent)] transition-colors" title="Remove">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-3.5 h-3.5"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
                                </button>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </Transition>

        <!-- ── bootstrap Modal: fullscreen album art ── -->
        <div class="modal fade" id="artModal" tabindex="-1" data-bs-theme="dark" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content border-0" style="background: rgba(20,19,16,0.97);">
                    <div class="modal-body d-flex justify-content-center align-items-center p-5">
                        <img
                            :src="currentSong.cover"
                            :alt="currentSong.title"
                            :style="{ transform: `scale(${zoomLevel})`, transition: 'transform 0.2s ease' }"
                            style="max-width: 85vw; max-height: 65vh; object-fit: contain;"
                        />
                    </div>
                    <div class="modal-footer border-0 justify-content-center pb-4" style="background: rgba(20,19,16,0.97);">
                        <div class="d-flex align-items-center" style="border: 1px solid rgba(255,255,255,0.1); padding: 8px 12px; gap: 4px;">
                            <button @click="zoomLevel = Math.max(zoomLevel - 0.25, 0.5)" class="btn btn-link p-0" style="width:32px;height:32px;font-size:18px;color:rgba(255,255,255,0.6);text-decoration:none;line-height:1;">−</button>
                            <span style="color:rgba(255,255,255,0.4);font-size:12px;width:40px;text-align:center;user-select:none;">{{ Math.round(zoomLevel * 100) }}%</span>
                            <button @click="zoomLevel = Math.min(zoomLevel + 0.25, 3)" class="btn btn-link p-0" style="width:32px;height:32px;font-size:18px;color:rgba(255,255,255,0.6);text-decoration:none;line-height:1;">+</button>
                            <div style="width:1px;height:16px;background:rgba(255,255,255,0.1);margin:0 4px;"></div>
                            <button data-bs-dismiss="modal" @click="zoomLevel = 1" class="btn btn-link p-0" style="width:32px;height:32px;font-size:11px;color:rgba(255,255,255,0.6);text-decoration:none;letter-spacing:0.1em;">✕</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* slide in from the right */
.queue-slide-enter-active { transition: transform 0.22s ease, opacity 0.22s ease; }
.queue-slide-leave-active { transition: transform 0.16s ease, opacity 0.16s ease; }
.queue-slide-enter-from   { transform: translateX(100%); opacity: 0; }
.queue-slide-leave-to     { transform: translateX(100%); opacity: 0; }
</style>
