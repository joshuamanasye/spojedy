<script setup>
defineProps({
  song: Object,
})
</script>

<template>
  <RouterLink :to="`/song/${song.id}`" class="group block animate-fade-up">
    <div
      class="bg-white dark:bg-[#18152A] rounded-2xl overflow-hidden border border-black/5 dark:border-white/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      <!-- Cover with play overlay on hover -->
      <div class="relative overflow-hidden aspect-square">
        <img
          :src="song.cover"
          :alt="song.title"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div
          class="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
        >
          <div
            class="w-13 h-13 rounded-full gradient-bg flex items-center justify-center shadow-lg scale-75 group-hover:scale-100 transition-transform duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="white"
              class="w-6 h-6 ml-0.5"
            >
              <path d="M8 5v14l11-7z" />
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
</template>
