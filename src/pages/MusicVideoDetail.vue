<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ComponentNavbar from '../components/ComponentNavbar.vue'
import { songs } from '../data/songlist'

const route  = useRoute()
const router = useRouter()

const videoPlayer  = ref(null)
const isPlaying    = ref(false)
const volume       = ref(1)

const songId       = computed(() => Number(route.params.id))
const currentIndex = computed(() => songs.findIndex(s => s.id === songId.value))
const currentSong  = computed(() => songs[currentIndex.value])

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
  router.push(`/video/${songs[(currentIndex.value + 1) % songs.length].id}`)
}

const prevVideo = () => {
  isPlaying.value = false
  router.push(`/video/${songs[(currentIndex.value - 1 + songs.length) % songs.length].id}`)
}

const changeVolume  = () => { videoPlayer.value.volume = volume.value }
const fullscreen    = ()  => { videoPlayer.value.requestFullscreen() }
const goToSong      = ()  => { router.push(`/song/${currentSong.value.id}`) }
</script>

<template>
  <div class="min-h-screen bg-[#F9F8F4] dark:bg-[#141310] text-[#1A1916] dark:text-[#EDE9DF]">
    <ComponentNavbar />

    <div class="max-w-5xl mx-auto px-5 py-8">

      <!-- ── Video ──────────────────────────────────────────── -->
      <div class="bg-black border border-[#E2DDD4] dark:border-[#2E2B25]">
        <video
          ref="videoPlayer"
          :src="currentSong.video"
          class="w-full aspect-video"
          @ended="nextVideo"
        />
      </div>

      <!-- ── Title row ──────────────────────────────────────── -->
      <div class="mt-5 flex items-start justify-between gap-6">
        <div class="min-w-0">
          <p class="text-[10px] font-bold tracking-[0.15em] uppercase text-[#8A8679] dark:text-[#7A7870] mb-1">
            {{ String(currentIndex + 1).padStart(2, '0') }} / {{ String(songs.length).padStart(2, '0') }}
          </p>
          <h1 class="text-2xl font-black tracking-tight leading-none">
            {{ currentSong.title }}
          </h1>
          <p class="text-sm font-medium tracking-[0.06em] uppercase text-[#8A8679] dark:text-[#7A7870] mt-1.5">
            {{ currentSong.artist }}
          </p>
        </div>

        <!-- Go to song link — right-aligned -->
        <button
          @click="goToSong"
          class="shrink-0 text-xs font-medium tracking-wide text-[#8A8679] dark:text-[#7A7870] hover:text-[var(--accent)] transition-colors mt-1 whitespace-nowrap"
        >
          Listen to song →
        </button>
      </div>

      <!-- ── Controls row ───────────────────────────────────── -->
      <div class="mt-5 flex items-center gap-5 flex-wrap border-t border-[#E2DDD4] dark:border-[#2E2B25] pt-5">

        <!-- Prev / Play / Next -->
        <div class="flex items-center gap-3">
          <button @click="prevVideo" class="text-[#8A8679] dark:text-[#7A7870] hover:text-[#1A1916] dark:hover:text-[#EDE9DF] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" class="w-5 h-5">
              <path d="M6 5h2v14H6zm3.5 7 8.5 7V5z" />
            </svg>
          </button>

          <button
            @click="toggleVideo"
            class="w-11 h-11 flex items-center justify-center bg-[#1A1916] dark:bg-[#EDE9DF] text-[#F9F8F4] dark:text-[#141310] hover:bg-[var(--accent)] dark:hover:bg-[var(--accent)] dark:hover:text-white transition-colors"
          >
            <svg v-if="!isPlaying" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 ml-0.5">
              <path d="M8 5v14l11-7z" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
              <path d="M6 5h4v14H6zm8 0h4v14h-4z" />
            </svg>
          </button>

          <button @click="nextVideo" class="text-[#8A8679] dark:text-[#7A7870] hover:text-[#1A1916] dark:hover:text-[#EDE9DF] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" class="w-5 h-5">
              <path d="M16 5h2v14h-2zm-10.5 7L14 19V5z" />
            </svg>
          </button>
        </div>

        <!-- Volume -->
        <div class="flex items-center gap-2 w-36">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-3.5 h-3.5 shrink-0 text-[#8A8679] dark:text-[#7A7870]">
            <path d="M18.5 12A4.5 4.5 0 0 0 16 8v8a4.5 4.5 0 0 0 2.5-4zM5 9v6h4l5 5V4L9 9H5z" />
          </svg>
          <input v-model="volume" type="range" min="0" max="1" step="0.01" @input="changeVolume" class="w-full" />
        </div>

        <!-- Fullscreen — pushed to far right on desktop -->
        <button
          @click="fullscreen"
          class="ml-auto text-xs font-medium tracking-wide text-[#8A8679] dark:text-[#7A7870] hover:text-[#1A1916] dark:hover:text-[#EDE9DF] transition-colors flex items-center gap-1.5"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-3.5 h-3.5">
            <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
          </svg>
          Fullscreen
        </button>

      </div>
    </div>
  </div>
</template>
