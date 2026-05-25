<script setup>
import ComponentNavbar from '../components/ComponentNavbar.vue'

import { songs } from '../data/songlist'
</script>

<template>
  <div
    class="min-h-screen bg-white text-black dark:bg-black dark:text-white"
  >
    <ComponentNavbar />

    <div class="p-6 md:p-10">
      <h1 class="text-3xl md:text-5xl font-bold mb-10">
        Music Videos
      </h1>

      <div
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <RouterLink
          v-for="song in songs"
          :key="song.id"
          :to="`/video/${song.id}`"
        >
          <div
            class="bg-zinc-900 p-4 rounded-xl hover:bg-zinc-800 hover:scale-105 transition duration-300"
          >
            <img
              :src="song.cover"
              class="w-full h-60 object-cover rounded-lg"
            />

            <div class="mt-4">
              <h2 class="text-xl font-bold text-white">
                {{ song.title }}
              </h2>

              <p class="text-zinc-400">
                {{ song.artist }}
              </p>
            </div>
          </div>
        </RouterLink>
      </div>
    </div>
  </div>
</template>
