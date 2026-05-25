<script setup>
import ComponentNavbar from '../components/ComponentNavbar.vue'
import SongCard from '../components/SongCard.vue'
import { songs } from '../data/songlist'
</script>

<template>
  <div class="min-h-screen bg-[#F7F4EF] dark:bg-[#0D0B14] text-[#1C1917] dark:text-[#F5F3FF]">
    <ComponentNavbar />

    <!-- ─── Hero: Featured Track ──────────────────────────────────────── -->
    <div class="relative overflow-hidden">
      <!-- Blurred album art as atmospheric background -->
      <div class="absolute inset-0 pointer-events-none">
        <img
          :src="songs[0].cover"
          aria-hidden="true"
          class="w-full h-full object-cover scale-110 blur-3xl opacity-25 dark:opacity-15"
        />
        <div
          class="absolute inset-0 bg-gradient-to-b from-[#F7F4EF]/70 via-[#F7F4EF]/90 to-[#F7F4EF] dark:from-[#0D0B14]/70 dark:via-[#0D0B14]/90 dark:to-[#0D0B14]"
        />
      </div>

      <div class="relative max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
        <div class="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <!-- Cover art -->
          <RouterLink
            :to="`/song/${songs[0].id}`"
            class="shrink-0 group"
          >
            <img
              :src="songs[0].cover"
              :alt="songs[0].title"
              class="w-44 h-44 md:w-56 md:h-56 rounded-3xl object-cover shadow-2xl group-hover:scale-105 group-hover:shadow-violet-400/20 transition-all duration-300"
            />
          </RouterLink>

          <!-- Info -->
          <div class="text-center md:text-left">
            <p
              class="text-xs font-bold tracking-[0.2em] uppercase gradient-text mb-3"
            >
              ✦ Featured Track
            </p>
            <h1
              class="text-4xl md:text-6xl font-black text-[#1C1917] dark:text-[#F5F3FF] leading-tight"
            >
              {{ songs[0].title }}
            </h1>
            <p class="text-xl text-[#78716C] dark:text-[#9089A8] mt-2 font-medium">
              {{ songs[0].artist }}
            </p>

            <RouterLink
              :to="`/song/${songs[0].id}`"
              class="inline-flex items-center gap-2 mt-6 px-7 py-3 rounded-full gradient-bg text-white font-semibold shadow-lg shadow-violet-500/25 hover:opacity-90 hover:scale-105 hover:shadow-violet-500/40 transition-all duration-200 text-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="w-4 h-4 ml-0.5"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
              Play Now
            </RouterLink>
          </div>
        </div>
      </div>
    </div>

    <!-- ─── Song Grid ──────────────────────────────────────────────────── -->
    <div class="max-w-7xl mx-auto px-4 md:px-8 pb-16">
      <h2 class="text-2xl font-bold mb-6">
        Trending Songs
      </h2>

      <div
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4"
      >
        <SongCard
          v-for="song in songs"
          :key="song.id"
          :song="song"
        />
      </div>
    </div>
  </div>
</template>
