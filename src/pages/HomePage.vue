<script setup>
import ComponentNavbar from '../components/ComponentNavbar.vue'
import SongCard from '../components/SongCard.vue'

import { songs } from '../data/songlist'
</script>

<template>
  <div
    class="min-h-screen bg-white text-black dark:bg-black dark:text-white"
  >
    <ComponentNavbar />

    <div class="p-6 md:p-10">
      <h1 class="text-3xl md:text-5xl font-bold mb-10">
        Trending Songs
      </h1>

      <!-- RESPONSIVE GRID -->
      <div
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
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
