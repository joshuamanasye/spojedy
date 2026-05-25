<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ComponentNavbar from '../components/ComponentNavbar.vue'
import { songs } from '../data/songlist'

const route = useRoute()
const router = useRouter()

const videoPlayer = ref(null)
const isPlaying = ref(false)
const volume = ref(1)

const songId = computed(() => Number(route.params.id))
const currentSongIndex = computed(() =>
  songs.findIndex((s) => s.id === songId.value)
)
const currentSong = computed(() => songs[currentSongIndex.value])

const toggleVideo = () => {
  if (isPlaying.value) {
    videoPlayer.value.pause()
    isPlaying.value = false
  } else {
    videoPlayer.value.play()
    isPlaying.value = true
  }
}

const nextVideo = () => {
  isPlaying.value = false
  const next = (currentSongIndex.value + 1) % songs.length
  router.push(`/video/${songs[next].id}`)
}

const previousVideo = () => {
  isPlaying.value = false
  const prev = (currentSongIndex.value - 1 + songs.length) % songs.length
  router.push(`/video/${songs[prev].id}`)
}

const changeVolume = () => {
  videoPlayer.value.volume = volume.value
}

const fullscreenVideo = () => {
  videoPlayer.value.requestFullscreen()
}

const goToSong = () => {
  router.push(`/song/${currentSong.value.id}`)
}
</script>

<template>
  <div class="min-h-screen bg-[#F7F4EF] dark:bg-[#0D0B14] text-[#1C1917] dark:text-[#F5F3FF]">
    <ComponentNavbar />

    <div class="max-w-4xl mx-auto px-4 py-10">
      <!-- ─── Video Player ─────────────────────────────────────────────── -->
      <div class="rounded-2xl overflow-hidden shadow-2xl bg-black">
        <video
          ref="videoPlayer"
          :src="currentSong.video"
          class="w-full aspect-video"
          @ended="nextVideo"
        />
      </div>

      <!-- ─── Song Info ──────────────────────────────────────────────── -->
      <div class="mt-6">
        <h1 class="text-3xl font-black">{{ currentSong.title }}</h1>
        <p class="text-[#78716C] dark:text-[#9089A8] text-lg mt-1 font-medium">
          {{ currentSong.artist }}
        </p>
      </div>

      <!-- ─── Controls row ──────────────────────────────────────────────── -->
      <div
        class="mt-6 flex flex-wrap items-center gap-4"
      >
        <!-- Prev / Play-Pause / Next -->
        <div class="flex items-center gap-3">
          <button
            @click="previousVideo"
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

          <button
            @click="toggleVideo"
            class="w-14 h-14 rounded-full gradient-bg flex items-center justify-center text-white shadow-lg shadow-violet-500/30 hover:scale-110 hover:shadow-violet-500/50 hover:shadow-xl transition-all duration-200"
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

          <button
            @click="nextVideo"
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

        <!-- Volume -->
        <div class="flex items-center gap-2 flex-1 min-w-[140px] max-w-xs">
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

        <!-- Action buttons (push to right on wider screens) -->
        <div class="flex items-center gap-2 ml-auto">
          <button
            @click="fullscreenVideo"
            class="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border border-black/10 dark:border-white/10 text-[#78716C] dark:text-[#9089A8] hover:bg-black/5 dark:hover:bg-white/5 hover:text-[#1C1917] dark:hover:text-[#F5F3FF] transition-all duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="w-4 h-4"
            >
              <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
            </svg>
            Fullscreen
          </button>

          <button
            @click="goToSong"
            class="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold gradient-bg text-white shadow-md shadow-violet-500/20 hover:opacity-90 hover:scale-105 transition-all duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="w-4 h-4"
            >
              <path
                d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"
              />
            </svg>
            Listen to Song
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
