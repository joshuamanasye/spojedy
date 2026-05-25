<script setup>
defineProps({
  song: Object,
})
</script>

<template>
  <RouterLink :to="`/song/${song.id}`">
    <div
      class="bg-zinc-900 p-4 rounded-xl hover:bg-zinc-800 hover:scale-105 transition duration-300 cursor-pointer"
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
</template>
