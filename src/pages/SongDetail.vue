<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import ComponentNavbar from '../components/ComponentNavbar.vue'
import { songs } from '../data/songlist'

const route = useRoute()
const router = useRouter()

const songId = Number(route.params.id)

const currentSongIndex = computed(() =>
  songs.findIndex((song) => song.id === songId)
)

const currentSong = computed(
  () => songs[currentSongIndex.value]
)

const audioPlayer = ref(null)

const isPlaying = ref(false)

const currentTime = ref(0)
const duration = ref(0)

const volume = ref(1)

const isFullscreen = ref(false)
const zoomLevel = ref(1)

const playSong = () => {
  audioPlayer.value.play()
  isPlaying.value = true
}

const pauseSong = () => {
  audioPlayer.value.pause()
  isPlaying.value = false
}

const togglePlay = () => {
  if (isPlaying.value) {
    pauseSong()
  } else {
    playSong()
  }
}

const nextSong = () => {
  const nextIndex =
    (currentSongIndex.value + 1) % songs.length

  router.push(`/song/${songs[nextIndex].id}`)
}

const previousSong = () => {
  const previousIndex =
    (currentSongIndex.value - 1 + songs.length) %
    songs.length

  router.push(`/song/${songs[previousIndex].id}`)
}

const updateProgress = () => {
  currentTime.value = audioPlayer.value.currentTime
  duration.value = audioPlayer.value.duration
}

const setProgress = (event) => {
  const width = event.target.clientWidth
  const clickX = event.offsetX

  audioPlayer.value.currentTime =
    (clickX / width) * duration.value
}

const formatTime = (time) => {
  if (!time) return '0:00'

  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)

  return `${minutes}:${
    seconds < 10 ? '0' : ''
  }${seconds}`
}

const changeVolume = () => {
  audioPlayer.value.volume = volume.value
}

const openFullscreen = () => {
  isFullscreen.value = true
}

const closeFullscreen = () => {
  isFullscreen.value = false
  zoomLevel.value = 1
}

const zoomIn = () => {
  zoomLevel.value += 0.2
}

const zoomOut = () => {
  if (zoomLevel.value > 1) {
    zoomLevel.value -= 0.2
  }
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
      <!-- RESPONSIVE COVER -->
      <img
        :src="currentSong.cover"
        @click="openFullscreen"
        class="w-64 h-64 md:w-80 md:h-80 object-cover rounded-2xl shadow-2xl hover:scale-105 transition duration-300 cursor-pointer"
      />

      <!-- RESPONSIVE TITLE -->
      <h1 class="text-3xl md:text-5xl font-bold mt-8 text-center">
        {{ currentSong.title }}
      </h1>

      <p class="text-zinc-400 text-lg md:text-2xl mt-3">
        {{ currentSong.artist }}
      </p>

      <!-- AUDIO -->
      <audio
        ref="audioPlayer"
        :src="currentSong.audio"
        @timeupdate="updateProgress"
        @loadedmetadata="updateProgress"
        @ended="nextSong"
      />

      <!-- PROGRESS BAR -->
      <div class="w-full max-w-3xl mt-10">
        <div
          class="w-full h-2 bg-zinc-700 rounded-full cursor-pointer"
          @click="setProgress"
        >
          <div
            class="h-2 bg-white rounded-full"
            :style="{
              width:
                (currentTime / duration) * 100 + '%',
            }"
          />
        </div>

        <div
          class="flex justify-between text-zinc-400 mt-2 text-sm"
        >
          <span>{{ formatTime(currentTime) }}</span>

          <span>{{ formatTime(duration) }}</span>
        </div>
      </div>

      <!-- CONTROLS -->
      <div class="flex items-center gap-10 mt-10">
        <!-- PREVIOUS -->
        <button
          @click="previousSong"
          class="hover:scale-110 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
            class="w-12 h-12"
          >
            <path
              d="M6 5h2v14H6zm3.5 7 8.5 7V5z"
            />
          </svg>
        </button>

        <!-- PLAY / PAUSE -->
        <button
          @click="togglePlay"
          class="w-24 h-24 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition"
        >
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
          @click="nextSong"
          class="hover:scale-110 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
            class="w-12 h-12"
          >
            <path
              d="M16 5h2v14h-2zm-10.5 7L14 19V5z"
            />
          </svg>
        </button>
      </div>

      <!-- VOLUME -->
      <div
        class="flex items-center gap-4 mt-10 w-full max-w-sm"
      >
        <span class="text-zinc-400 text-xl">
          🔊
        </span>

        <input
          v-model="volume"
          type="range"
          min="0"
          max="1"
          step="0.1"
          @input="changeVolume"
          class="w-full accent-white"
        />
      </div>
    </div>

    <!-- FULLSCREEN -->
    <div
      v-if="isFullscreen"
      class="fixed inset-0 bg-black/95 flex flex-col items-center justify-center z-50"
    >
      <img
        :src="currentSong.cover"
        :style="{
          transform: `scale(${zoomLevel})`,
        }"
        class="max-w-[80%] max-h-[80%] object-contain transition duration-300"
      />

      <div class="flex gap-6 mt-10">
        <button
          @click="zoomOut"
          class="bg-zinc-800 px-6 py-3 rounded-lg hover:bg-zinc-700"
        >
          Zoom Out
        </button>

        <button
          @click="zoomIn"
          class="bg-zinc-800 px-6 py-3 rounded-lg hover:bg-zinc-700"
        >
          Zoom In
        </button>

        <button
          @click="closeFullscreen"
          class="bg-red-500 px-6 py-3 rounded-lg hover:bg-red-400"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>
