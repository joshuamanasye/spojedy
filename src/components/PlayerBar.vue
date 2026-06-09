<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { usePlayer } from '../composables/usePlayer'
import { useQueue } from '../composables/useQueue'

const router = useRouter()
const player = usePlayer()
const { queue, queueLength, removeFromQueue, clearQueue, moveUp, moveDown } = useQueue()
const { currentSong, isPlaying, currentTime, duration, volume, pct, fmt,
        togglePlay, nextSong, prevSong, setProgress, changeVolume } = player

// open by default so the queue is always visible on first load
const showQueue = ref(true)
</script>

<template>
    <!-- always rendered on eligible pages (no v-if on currentSong) -->
    <div class="fixed bottom-0 left-0 right-0 z-40">

        <!-- ── queue panel — fixed right overlay, stops above the bar ── -->
        <Transition name="queue-slide">
            <div
                v-if="showQueue"
                class="fixed top-14 right-0 bottom-[68px] w-full sm:w-[26rem] z-50 flex flex-col
                       bg-[#F9F8F4] dark:bg-[#141310]
                       border-l border-[#E2DDD4] dark:border-[#2E2B25]
                       shadow-[-8px_0_24px_rgba(0,0,0,0.07)]"
            >
                <!-- panel header -->
                <div class="flex items-center justify-between px-5 py-4 border-b border-[#E2DDD4] dark:border-[#2E2B25] shrink-0">
                    <h2 class="text-xs font-bold tracking-[0.15em] uppercase text-[#8A8679] dark:text-[#7A7870]">
                        Up Next
                        <span v-if="queueLength > 0" class="ml-1 text-[var(--accent)]">· {{ queueLength }}</span>
                    </h2>
                    <div class="flex items-center gap-3">
                        <button
                            v-if="queueLength > 0"
                            @click="clearQueue"
                            class="text-[10px] tracking-wide font-medium text-[#8A8679] dark:text-[#7A7870] hover:text-[var(--accent)] transition-colors cursor-pointer"
                        >
                            Clear
                        </button>
                        <button
                            @click="showQueue = false"
                            class="w-6 h-6 flex items-center justify-center text-[#8A8679] dark:text-[#7A7870] hover:text-[#1A1916] dark:hover:text-[#EDE9DF] transition-colors cursor-pointer"
                            title="Close"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
                                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                            </svg>
                        </button>
                    </div>
                </div>

                <!-- panel body (scrollable) -->
                <div class="flex-1 overflow-y-auto">
                    <div v-if="queueLength === 0" class="py-12 text-center px-5">
                        <p class="text-sm text-[#8A8679] dark:text-[#7A7870]">Queue is empty</p>
                        <p class="text-xs text-[#8A8679]/60 dark:text-[#7A7870]/60 mt-1">Add songs from the tracklist</p>
                    </div>

                    <ul v-else>
                        <li
                            v-for="(song, i) in queue"
                            :key="i"
                            class="group flex items-center gap-3 px-5 py-3 border-b border-[#E2DDD4] dark:border-[#2E2B25] last:border-b-0"
                        >
                            <span class="text-xs tabular-nums text-[#8A8679] dark:text-[#7A7870] w-5 shrink-0">{{ i + 1 }}</span>
                            <img :src="song.cover" :alt="song.title" class="w-10 h-10 object-cover shrink-0" />
                            <div class="flex-1 min-w-0 pr-1">
                                <p class="text-sm font-semibold text-[#1A1916] dark:text-[#EDE9DF] truncate leading-tight">{{ song.title }}</p>
                                <p class="text-xs text-[#8A8679] dark:text-[#7A7870] truncate mt-0.5">{{ song.artist }}</p>
                            </div>
                            <div class="hidden group-hover:flex items-center gap-1 shrink-0">
                                <button @click="moveUp(i)" :disabled="i === 0"
                                    class="w-7 h-7 flex items-center justify-center cursor-pointer text-[#8A8679] dark:text-[#7A7870] hover:text-[#1A1916] dark:hover:text-[#EDE9DF] disabled:opacity-25 disabled:cursor-not-allowed transition-colors" title="Move up">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-3.5 h-3.5"><path d="M12 8l-6 6h12z"/></svg>
                                </button>
                                <button @click="moveDown(i)" :disabled="i === queue.length - 1"
                                    class="w-7 h-7 flex items-center justify-center cursor-pointer text-[#8A8679] dark:text-[#7A7870] hover:text-[#1A1916] dark:hover:text-[#EDE9DF] disabled:opacity-25 disabled:cursor-not-allowed transition-colors" title="Move down">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-3.5 h-3.5"><path d="M12 16l6-6H6z"/></svg>
                                </button>
                                <button @click="removeFromQueue(i)"
                                    class="w-7 h-7 flex items-center justify-center cursor-pointer text-[#8A8679] dark:text-[#7A7870] hover:text-[var(--accent)] transition-colors" title="Remove">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-3.5 h-3.5"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
                                </button>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </Transition>

        <!-- ── main bar — z-[60] sits above the z-50 queue panel ── -->
        <div class="relative z-[60] bg-[#F9F8F4] dark:bg-[#141310] border-t border-[#E2DDD4] dark:border-[#2E2B25]">

            <!-- thin progress line — only when a song is loaded.
                 single h-1 element: no transparent wrapper, no thickness issue. -->
            <div
                v-if="currentSong"
                class="relative w-full h-1 cursor-pointer group"
                @click="setProgress"
            >
                <!-- track fill -->
                <div class="absolute inset-0 bg-[#E2DDD4] dark:bg-[#2E2B25]">
                    <div
                        class="absolute top-0 left-0 h-full bg-[#1A1916] dark:bg-[#EDE9DF] transition-none"
                        :style="{ width: pct + '%' }"
                    />
                </div>
                <!-- seek dot (extends above/below on hover) -->
                <div
                    class="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[var(--accent)] -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    :style="{ left: pct + '%' }"
                />
            </div>

            <!-- controls row -->
            <div class="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">

                <!-- ── song info (flex-1 on mobile, fixed w on desktop) ── -->
                <div class="flex-1 sm:flex-none sm:w-56 min-w-0">
                    <button
                        v-if="currentSong"
                        @click="router.push(`/song/${currentSong.id}`)"
                        class="flex items-center gap-3 w-full cursor-pointer text-left group/info"
                        title="Go to song detail"
                    >
                        <img
                            :src="currentSong.cover"
                            :alt="currentSong.title"
                            :class="[
                                'w-10 h-10 object-cover shrink-0 border border-[#E2DDD4] dark:border-[#2E2B25]',
                                isPlaying ? 'animate-spin-slow rounded-full' : ''
                            ]"
                        />
                        <div class="min-w-0">
                            <p class="text-sm font-semibold text-[#1A1916] dark:text-[#EDE9DF] truncate leading-tight group-hover/info:text-[var(--accent)] transition-colors">
                                {{ currentSong.title }}
                            </p>
                            <p class="text-xs text-[#8A8679] dark:text-[#7A7870] truncate mt-0.5">
                                {{ currentSong.artist }}
                            </p>
                        </div>
                    </button>
                    <!-- placeholder when nothing is loaded -->
                    <p v-else class="text-xs text-[#8A8679] dark:text-[#7A7870] select-none">
                        Nothing playing
                    </p>
                </div>

                <!-- ── playback controls ── -->
                <!-- prev hidden on mobile, visible on sm+ -->
                <div class="flex items-center gap-2 sm:flex-1 sm:justify-center">
                    <button
                        @click="prevSong"
                        :disabled="!currentSong"
                        class="hidden sm:flex w-10 h-10 items-center justify-center cursor-pointer text-[#8A8679] dark:text-[#7A7870] hover:text-[#1A1916] dark:hover:text-[#EDE9DF] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        title="Previous"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" class="w-5 h-5">
                            <path d="M6 5h2v14H6zm3.5 7 8.5 7V5z" />
                        </svg>
                    </button>

                    <button
                        @click="togglePlay"
                        :disabled="!currentSong"
                        class="w-10 h-10 flex items-center justify-center cursor-pointer bg-[#1A1916] dark:bg-[#EDE9DF] text-[#F9F8F4] dark:text-[#141310] hover:bg-[var(--accent)] dark:hover:bg-[var(--accent)] dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        title="Play / Pause"
                    >
                        <svg v-if="!isPlaying" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 ml-0.5">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                        <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                            <path d="M6 5h4v14H6zm8 0h4v14h-4z" />
                        </svg>
                    </button>

                    <button
                        @click="nextSong"
                        :disabled="!currentSong"
                        class="hidden sm:flex w-10 h-10 items-center justify-center cursor-pointer text-[#8A8679] dark:text-[#7A7870] hover:text-[#1A1916] dark:hover:text-[#EDE9DF] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        title="Next"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" class="w-5 h-5">
                            <path d="M16 5h2v14h-2zm-1.5 7-8.5 7V5z" />
                        </svg>
                    </button>

                    <span class="hidden sm:block text-xs tabular-nums text-[#8A8679] dark:text-[#7A7870] ml-1 select-none">
                        {{ fmt(currentTime) }} / {{ fmt(duration) }}
                    </span>
                </div>

                <!-- ── volume + queue toggle ── -->
                <div class="flex items-center gap-2 sm:w-56 sm:justify-end shrink-0">
                    <!-- volume: desktop only -->
                    <div class="hidden md:flex items-center gap-2 w-28">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 shrink-0 text-[#8A8679] dark:text-[#7A7870]">
                            <path d="M18.5 12A4.5 4.5 0 0 0 16 8v8a4.5 4.5 0 0 0 2.5-4zM5 9v6h4l5 5V4L9 9H5z" />
                        </svg>
                        <input
                            :value="volume"
                            type="range" min="0" max="1" step="0.01"
                            @input="changeVolume(Number($event.target.value))"
                            class="w-full"
                        />
                    </div>

                    <!-- queue toggle icon -->
                    <button
                        @click="showQueue = !showQueue"
                        class="relative w-9 h-9 flex items-center justify-center border transition-colors cursor-pointer"
                        :class="showQueue
                            ? 'border-[#1A1916] dark:border-[#EDE9DF] text-[#1A1916] dark:text-[#EDE9DF]'
                            : 'border-[#E2DDD4] dark:border-[#2E2B25] text-[#8A8679] dark:text-[#7A7870] hover:border-[#1A1916] dark:hover:border-[#EDE9DF] hover:text-[#1A1916] dark:hover:text-[#EDE9DF]'"
                        title="Toggle queue"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
                            <path d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z"/>
                        </svg>
                        <span
                            v-if="queueLength > 0"
                            class="absolute -top-1.5 -right-1.5 bg-[var(--accent)] text-white rounded-full w-4 h-4 flex items-center justify-center text-[9px] font-bold leading-none"
                        >{{ queueLength }}</span>
                    </button>
                </div>

            </div>
        </div>

    </div>
</template>

<style scoped>
.queue-slide-enter-active { transition: transform 0.22s ease, opacity 0.22s ease; }
.queue-slide-leave-active { transition: transform 0.16s ease, opacity 0.16s ease; }
.queue-slide-enter-from   { transform: translateX(100%); opacity: 0; }
.queue-slide-leave-to     { transform: translateX(100%); opacity: 0; }
</style>
