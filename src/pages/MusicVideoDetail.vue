<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import ComponentNavbar from '../components/ComponentNavbar.vue'
import { songs } from '../data/songlist'

const route = useRoute()
const router = useRouter()

const videoPlayer = ref(null)

const songId = Number(route.params.id)

const currentSongIndex = computed(() =>
  songs.findIndex((song) => song.id === songId)
)

const currentSong = computed(
  () => songs[currentSongIndex.value]
)

const isPlaying = ref(false)

const playVideo = () => {
  videoPlayer.value.play()
  isPlaying.value = true
}

const pauseVideo = () => {
  videoPlayer.value.pause()
  isPlaying.value = false
}

const toggleVideo = () => {
  if (isPlaying.value) {
    pauseVideo()
  } else {
    playVideo()
  }
}

const nextVideo = () => {
  const nextIndex =
    (currentSongIndex.value + 1) % songs.length

  router.push(`/video/${songs[nextIndex].id}`)
}

const previousVideo = () => {
  const previousIndex =
    (currentSongIndex.value - 1 + songs.length) %
    songs.length

  router.push(`/video/${songs[previousIndex].id}`)
}

const goToSong = () => {
  router.push(`/song/${currentSong.value.id}`)
}

const fullscreenVideo = () => {
  videoPlayer.value.requestFullscreen()
}
</script>

<template>
  <div
  class="min-h-screen bg-white text-black dark:bg-black dark:text-white"
>
    <ComponentNavbar />

    <div
      class="flex flex-col items-center justify-center px-6 py-12"
    >
      <!-- VIDEO -->
      <video
        ref="videoPlayer"
        :src="currentSong.video"
        class="w-full max-w-5xl rounded-2xl shadow-2xl"
      />

      <!-- INFO -->
      <h1 class="text-5xl font-bold mt-8">
        {{ currentSong.title }}
      </h1>

      <p class="text-zinc-400 text-2xl mt-3">
        {{ currentSong.artist }}
      </p>

      <!-- CONTROLS -->
      <div class="flex items-center gap-10 mt-10">
        <!-- PREVIOUS -->
        <button
          @click="previousVideo"
          class="hover:scale-110 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="white"
            viewBox="0 0 24 24"
            class="w-12 h-12"
          >
            <path
              d="M6 5h2v14H6zm3.5 7 8.5 7V5z"
            />
          </svg>
        </button>

        <!-- PLAY PAUSE -->
        <button
          @click="toggleVideo"
          class="w-24 h-24 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition"
        >
          <!-- PLAY -->
          <svg
            v-if="!isPlaying"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="black"
            class="w-12 h-12 ml-1"
          >
            <path
              d="M8 5v14l11-7z"
            />
          </svg>

          <!-- PAUSE -->
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="black"
            class="w-12 h-12"
          >
            <path
              d="M6 5h4v14H6zm8 0h4v14h-4z"
            />
          </svg>
        </button>

        <!-- NEXT -->
        <button
          @click="nextVideo"
          class="hover:scale-110 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="white"
            viewBox="0 0 24 24"
            class="w-12 h-12"
          >
            <path
              d="M16 5h2v14h-2zm-10.5 7L14 19V5z"
            />
          </svg>
        </button>
      </div>

      <!-- EXTRA BUTTON -->
      <div class="flex gap-6 mt-10">
        <button
          @click="fullscreenVideo"
          class="bg-zinc-800 px-6 py-3 rounded-lg hover:bg-zinc-700"
        >
          Fullscreen
        </button>

        <button
          @click="goToSong"
          class="bg-green-500 px-6 py-3 rounded-lg hover:bg-green-400"
        >
          Go To Song
        </button>
      </div>
    </div>
  </div>
</template>
