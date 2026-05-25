<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ComponentNavbar from '../components/ComponentNavbar.vue'
import { songs } from '../data/songlist'

const route = useRoute()
const router = useRouter()

const songId = computed(() => Number(route.params.id))
const currentSongIndex = computed(() =>
  songs.findIndex((s) => s.id === songId.value)
)
const currentSong = computed(() => songs[currentSongIndex.value])

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
  } else {
    audioPlayer.value.play()
    isPlaying.value = true
  }
}

const nextSong = () => {
  isPlaying.value = false
  const next = (currentSongIndex.value + 1) % songs.length
  router.push(`/song/${songs[next].id}`)
}

const previousSong = () => {
  isPlaying.value = false
  const prev = (currentSongIndex.value - 1 + songs.length) % songs.length
  router.push(`/song/${songs[prev].id}`)
}

const updateProgress = () => {
  currentTime.value = audioPlayer.value.currentTime
  duration.value = audioPlayer.value.duration || 0
}

/* Uses clientX + bounding rect for accurate click position */
const setProgress = (event) => {
  const rect = event.currentTarget.getBoundingClientRect()
  const ratio = (event.clientX - rect.left) / rect.width
  audioPlayer.value.currentTime = ratio * duration.value
}

const formatTime = (time) => {
  if (!time || isNaN(time)) return '0:00'
  const m = Math.floor(time / 60)
  const s = Math.floor(time % 60)
  return `${m}:${s < 10 ? '0' : ''}${s}`
}

const changeVolume = () => {
  audioPlayer.value.volume = volume.value
}

const openFullscreen = () => {
  isFullscreen.value = true
  zoomLevel.value = 1
}

const closeFullscreen = () => {
  isFullscreen.value = false
}

const zoomIn = () => {
  zoomLevel.value = Math.min(zoomLevel.value + 0.25, 3)
}

const zoomOut = () => {
  zoomLevel.value = Math.max(zoomLevel.value - 0.25, 0.5)
}

const goToVideo = () => {
  router.push(`/video/${currentSong.value.id}`)
}

const progressPercent = computed(() =>
  duration.value ? (currentTime.value / duration.value) * 100 : 0
)
</script>

<template>
  <div class="min-h-screen bg-[#F7F4EF] dark:bg-[#0D0B14] text-[#1C1917] dark:text-[#F5F3FF]">
    <ComponentNavbar />

    <!-- ─── Atmospheric background glow ──────────────────────────────── -->
    <div class="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      <div
        class="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-10 dark:opacity-5 blur-3xl gradient-bg"
      />
    </div>

    <div class="max-w-sm mx-auto px-4 py-10 flex flex-col items-center">

      <!-- ─── Album Art (vinyl) ─────────────────────────────────────── -->
      <div class="relative mt-4 mb-8">
        <!-- Glow halo behind art -->
        <div
          class="absolute inset-[-20%] rounded-full gradient-bg animate-glow-pulse blur-2xl"
        />
        <img
          :src="currentSong.cover"
          :alt="currentSong.title"
          :class="[
            'relative w-64 h-64 rounded-full object-cover shadow-2xl cursor-pointer border-4 border-white/20 dark:border-white/10',
            isPlaying ? 'animate-spin-slow' : '',
          ]"
          @click="openFullscreen"
        />
        <!-- Center hole of vinyl -->
        <div
          class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#F7F4EF] dark:bg-[#0D0B14] shadow-inner pointer-events-none"
        />
      </div>

      <!-- ─── Song Info ──────────────────────────────────────────────── -->
      <h1 class="text-2xl font-black text-center">
        {{ currentSong.title }}
      </h1>
      <p class="text-[#78716C] dark:text-[#9089A8] mt-1 font-medium">
        {{ currentSong.artist }}
      </p>

      <!-- Hidden audio element -->
      <audio
        ref="audioPlayer"
        :src="currentSong.audio"
        @timeupdate="updateProgress"
        @loadedmetadata="updateProgress"
        @ended="nextSong"
      />

      <!-- ─── Progress Bar ───────────────────────────────────────────── -->
      <div class="w-full mt-8">
        <div
          class="group relative w-full h-1.5 rounded-full bg-black/10 dark:bg-white/10 cursor-pointer"
          @click="setProgress"
        >
          <div
            class="h-full rounded-full gradient-bg relative transition-none"
            :style="{ width: progressPercent + '%' }"
          >
            <span
              class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3.5 h-3.5 rounded-full bg-white shadow opacity-0 group-hover:opacity-100 transition-opacity"
            />
          </div>
        </div>
        <div
          class="flex justify-between text-xs text-[#78716C] dark:text-[#9089A8] mt-2"
        >
          <span>{{ formatTime(currentTime) }}</span>
          <span>{{ formatTime(duration) }}</span>
        </div>
      </div>

      <!-- ─── Playback Controls ──────────────────────────────────────── -->
      <div class="flex items-center gap-6 mt-7">
        <!-- Previous -->
        <button
          @click="previousSong"
          class="w-11 h-11 flex items-center justify-center rounded-full text-[#78716C] dark:text-[#9089A8] hover:text-[#1C1917] dark:hover:text-[#F5F3FF] hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
            class="w-6 h-6"
          >
            <path d="M6 5h2v14H6zm3.5 7 8.5 7V5z" />
          </svg>
        </button>

        <!-- Play / Pause -->
        <button
          @click="togglePlay"
          class="w-16 h-16 rounded-full gradient-bg flex items-center justify-center text-white shadow-lg shadow-violet-500/30 hover:scale-110 hover:shadow-violet-500/50 hover:shadow-xl transition-all duration-200"
        >
          <svg
            v-if="!isPlaying"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="white"
            class="w-7 h-7 ml-1"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="white"
            class="w-7 h-7"
          >
            <path d="M6 5h4v14H6zm8 0h4v14h-4z" />
          </svg>
        </button>

        <!-- Next -->
        <button
          @click="nextSong"
          class="w-11 h-11 flex items-center justify-center rounded-full text-[#78716C] dark:text-[#9089A8] hover:text-[#1C1917] dark:hover:text-[#F5F3FF] hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
            class="w-6 h-6"
          >
            <path d="M16 5h2v14h-2zm-10.5 7L14 19V5z" />
          </svg>
        </button>
      </div>

      <!-- ─── Volume ─────────────────────────────────────────────────── -->
      <div class="flex items-center gap-3 mt-6 w-full max-w-[260px]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="w-4 h-4 shrink-0 text-[#78716C] dark:text-[#9089A8]"
        >
          <path d="M18.5 12A4.5 4.5 0 0 0 16 8v8a4.5 4.5 0 0 0 2.5-4zM5 9v6h4l5 5V4L9 9H5z" />
        </svg>
        <input
          v-model="volume"
          type="range"
          min="0"
          max="1"
          step="0.01"
          @input="changeVolume"
          class="w-full"
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="w-4 h-4 shrink-0 text-[#78716C] dark:text-[#9089A8]"
        >
          <path
            d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"
          />
        </svg>
      </div>

      <!-- ─── Watch Music Video Button ───────────────────────────────── -->
      <button
        @click="goToVideo"
        class="mt-8 flex items-center gap-2 px-5 py-2.5 rounded-full border border-black/10 dark:border-white/10 text-sm font-medium text-[#78716C] dark:text-[#9089A8] hover:border-violet-400 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/15 transition-all duration-200"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="w-4 h-4"
        >
          <path
            d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 14H3V5h18v12zm-9-3.5 6-3.5-6-3.5v7z"
          />
        </svg>
        Watch Music Video
      </button>
    </div>

    <!-- ─── Fullscreen cover viewer ───────────────────────────────────── -->
    <Transition name="fs">
      <div
        v-if="isFullscreen"
        class="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center"
        @click.self="closeFullscreen"
      >
        <img
          :src="currentSong.cover"
          :alt="currentSong.title"
          :style="{ transform: `scale(${zoomLevel})`, transition: 'transform 0.25s ease' }"
          class="max-w-[85vw] max-h-[80vh] object-contain rounded-2xl"
        />

        <!-- Controls bar -->
        <div
          class="absolute bottom-8 flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-full"
        >
          <button
            @click="zoomOut"
            class="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/20 text-white transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="w-5 h-5"
            >
              <path d="M19 13H5v-2h14v2z" />
            </svg>
          </button>
          <span class="text-white/70 text-xs w-10 text-center select-none">
            {{ Math.round(zoomLevel * 100) }}%
          </span>
          <button
            @click="zoomIn"
            class="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/20 text-white transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="w-5 h-5"
            >
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            </svg>
          </button>
          <div class="w-px h-5 bg-white/20 mx-1" />
          <button
            @click="closeFullscreen"
            class="w-9 h-9 flex items-center justify-center rounded-full hover:bg-red-500/30 text-white/70 hover:text-red-300 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="w-5 h-5"
            >
              <path
                d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
              />
            </svg>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.fs-enter-active,
.fs-leave-active {
  transition: opacity 0.2s ease;
}
.fs-enter-from,
.fs-leave-to {
  opacity: 0;
}
</style>
