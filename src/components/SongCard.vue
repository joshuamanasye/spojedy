<script setup>
import { ref } from 'vue'
import { useQueue } from '../composables/useQueue'

defineProps({
    song: Object,
    index: { type: Number, default: 0 },
})

const { addToQueue } = useQueue()
const toasted = ref(false)

function handleAddToQueue(e, song) {
    e.preventDefault()
    e.stopPropagation()
    addToQueue(song)
    toasted.value = true
    setTimeout(() => (toasted.value = false), 1200)
}
</script>

<!-- Tracklist row — not a card -->
<template>
    <RouterLink :to="`/song/${song.id}`" class="group flex items-center gap-4 px-5 py-4 border-b border-[#E2DDD4] dark:border-[#2E2B25] hover:bg-[#F2EDE3] dark:hover:bg-[#1E1C19] transition-colors">

        <!-- Index / play indicator -->
        <span class="w-6 text-right text-sm tabular-nums text-[#8A8679] dark:text-[#7A7870] shrink-0 group-hover:hidden">
            {{ String(index + 1).padStart(2, '0') }}
        </span>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="w-4 h-4 text-[var(--accent)] hidden group-hover:block shrink-0"
        >
            <path d="M8 5v14l11-7z" />
        </svg>

        <img
            :src="song.cover"
            :alt="song.title"
            loading="lazy"
            class="w-11 h-11 object-cover shrink-0"
        />

        <!-- Title -->
        <p class="flex-1 min-w-0 text-base font-semibold text-[#1A1916] dark:text-[#EDE9DF] truncate">
            {{ song.title }}
        </p>

        <!-- Artist -->
        <p class="hidden md:block text-sm text-[#8A8679] dark:text-[#7A7870] shrink-0 w-44 truncate">
            {{ song.artist }}
        </p>

        <!-- Add-to-queue button — icon only -->
        <button
            @click="handleAddToQueue($event, song)"
            :title="toasted ? 'Added to queue!' : 'Add to queue'"
            class="shrink-0 hidden md:flex w-8 h-8 items-center justify-center border transition-colors cursor-pointer"
            :class="toasted
                ? 'border-[var(--accent)] text-[var(--accent)]'
                : 'border-[#E2DDD4] dark:border-[#2E2B25] text-[#8A8679] dark:text-[#7A7870] hover:border-[#1A1916] dark:hover:border-[#EDE9DF] hover:text-[#1A1916] dark:hover:text-[#EDE9DF]'"
        >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
                <path d="M19 11H13V5h-2v6H5v2h6v6h2v-6h6z" />
            </svg>
        </button>

    </RouterLink>
</template>
