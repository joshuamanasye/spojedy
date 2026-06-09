<script setup>
import ComponentNavbar from '../components/ComponentNavbar.vue'
import { songs } from '../data/songlist'
</script>

<template>
    <div class="min-h-screen bg-[#F9F8F4] dark:bg-[#141310] text-[#1A1916] dark:text-[#EDE9DF]">
        <ComponentNavbar />

        <div class="max-w-5xl mx-auto">

            <!-- page header -->
            <div class="flex items-end justify-between px-5 pt-10 pb-4">
                <h1 class="text-[3.2rem] leading-none font-black tracking-[-0.04em]">
                    Videos
                </h1>
                <span class="text-sm text-[#8A8679] dark:text-[#7A7870] mb-1.5 tabular-nums">
                    {{ songs.length }} clips
                </span>
            </div>

            <!-- video grid -->
            <div class="border-t border-[#E2DDD4] dark:border-[#2E2B25] px-5 py-6">
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#E2DDD4] dark:bg-[#2E2B25]">
                    <RouterLink
                        v-for="(song, i) in songs"
                        :key="song.id"
                        :to="`/video/${song.id}`"
                        class="group relative bg-[#F9F8F4] dark:bg-[#141310] overflow-hidden animate-enter"
                        :style="{ animationDelay: `${i * 50}ms` }"
                    >
                        <!-- 16:9 thumbnail -->
                        <div class="relative aspect-video overflow-hidden">
                            <img
                                :src="song.cover"
                                :alt="song.title"
                                loading="lazy"
                                class="w-full h-full object-cover group-hover:scale-103 transition-transform duration-400"
                            />
                            <!-- play overlay -->
                            <div class="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                                <div class="w-12 h-12 bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" class="w-5 h-5 ml-0.5">
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                </div>
                            </div>
                            <!-- index badge -->
                            <span class="absolute top-2 left-2 text-xs font-bold tabular-nums text-white/60">
                                {{ String(i + 1).padStart(2, '0') }}
                            </span>
                        </div>

                        <!-- info -->
                        <div class="px-4 py-3">
                            <p class="text-base font-semibold text-[#1A1916] dark:text-[#EDE9DF] truncate leading-snug">
                                {{ song.title }}
                            </p>
                            <p class="text-sm text-[#8A8679] dark:text-[#7A7870] truncate mt-0.5">
                                {{ song.artist }}
                            </p>
                        </div>
                    </RouterLink>
                </div>
            </div>

        </div>
    </div>
</template>
