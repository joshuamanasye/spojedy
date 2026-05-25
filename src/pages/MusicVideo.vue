<script setup>
import ComponentNavbar from '../components/ComponentNavbar.vue'
import { songs } from '../data/songlist'
</script>

<template>
  <div class="min-h-screen bg-[#F7F4EF] dark:bg-[#0D0B14] text-[#1C1917] dark:text-[#F5F3FF]">
    <ComponentNavbar />

    <!-- ─── Hero ──────────────────────────────────────────────────────── -->
    <div class="relative overflow-hidden">
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

      <div class="relative max-w-7xl mx-auto px-4 md:px-8 py-12">
        <p class="text-xs font-bold tracking-[0.2em] uppercase gradient-text mb-3">
          ✦ Now Streaming
        </p>
        <h1 class="text-4xl md:text-6xl font-black">
          Music <span class="gradient-text">Videos</span>
        </h1>
        <p class="text-[#78716C] dark:text-[#9089A8] mt-3 text-lg max-w-md">
          Watch your favourite artists come alive on screen.
        </p>
      </div>
    </div>

    <!-- ─── Video Grid ─────────────────────────────────────────────────── -->
    <div class="max-w-7xl mx-auto px-4 md:px-8 pb-16">
      <h2 class="text-2xl font-bold mb-6">All Videos</h2>

      <div
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4"
      >
        <RouterLink
          v-for="song in songs"
          :key="song.id"
          :to="`/video/${song.id}`"
          class="group block animate-fade-up"
        >
          <div
            class="bg-white dark:bg-[#18152A] rounded-2xl overflow-hidden border border-black/5 dark:border-white/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <!-- Thumbnail with video-play overlay -->
            <div class="relative overflow-hidden aspect-square">
              <img
                :src="song.cover"
                :alt="song.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div
                class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
              >
                <div
                  class="w-14 h-14 rounded-full gradient-bg flex items-center justify-center shadow-lg scale-75 group-hover:scale-100 transition-transform duration-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="white"
                    class="w-6 h-6"
                  >
                    <path
                      d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <!-- Info -->
            <div class="px-4 py-3">
              <h2 class="font-bold text-[#1C1917] dark:text-[#F5F3FF] truncate text-sm">
                {{ song.title }}
              </h2>
              <p class="text-xs text-[#78716C] dark:text-[#9089A8] mt-0.5 truncate">
                {{ song.artist }}
              </p>
            </div>
          </div>
        </RouterLink>
      </div>
    </div>
  </div>
</template>
