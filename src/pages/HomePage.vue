<script setup>
import ComponentNavbar from '../components/ComponentNavbar.vue'
import SongCard from '../components/SongCard.vue'
import { songs } from '../data/songlist'
</script>

<template>
    <div class="min-h-screen bg-[#F9F8F4] dark:bg-[#141310] text-[#1A1916] dark:text-[#EDE9DF]">
        <ComponentNavbar />

        <div class="max-w-5xl mx-auto">

            <!-- Page header -->
            <div class="flex items-end justify-between px-5 pt-10 pb-4">
                <h1 class="text-[3.2rem] leading-none font-black tracking-[-0.04em]">
                    Trending
                </h1>
                <span class="text-sm text-[#8A8679] dark:text-[#7A7870] mb-1.5 tabular-nums">
                    {{ songs.length }} songs
                </span>
            </div>

            <!-- Featured song -->
            <RouterLink
                :to="`/song/${songs[0].id}`"
                class="group flex items-stretch border-t border-b border-[#E2DDD4] dark:border-[#2E2B25] hover:bg-[#F2EDE3] dark:hover:bg-[#1E1C19] transition-colors"
            >
                <!-- Art -->
                <img
                    :src="songs[0].cover"
                    :alt="songs[0].title"
                    class="w-24 h-24 object-cover shrink-0 self-center ml-5 my-4"
                />

                <!-- Info -->
                <div class="flex-1 min-w-0 px-5 py-4 flex flex-col justify-center">
                    <p class="text-xs font-bold tracking-[0.15em] uppercase text-[var(--accent)] mb-1">
                        Featured
                    </p>
                    <p class="text-2xl font-black tracking-tight leading-tight text-[#1A1916] dark:text-[#EDE9DF] truncate">
                        {{ songs[0].title }}
                    </p>
                    <p class="text-base text-[#8A8679] dark:text-[#7A7870] mt-0.5">
                        {{ songs[0].artist }}
                    </p>
                </div>

                <!-- Play cue -->
                <div class="flex items-center pr-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span class="text-sm font-bold tracking-widest text-[var(--accent)]">PLAY →</span>
                </div>
            </RouterLink>

            <!-- Column headers -->
            <div class="flex items-center gap-4 px-5 pt-5 pb-2">
                <span class="w-6" />
                <span class="w-11 shrink-0" />
                <span class="flex-1 text-xs font-bold tracking-[0.15em] uppercase text-[#8A8679] dark:text-[#7A7870]">
                    Title
                </span>
                <span class="hidden md:block text-xs font-bold tracking-[0.15em] uppercase text-[#8A8679] dark:text-[#7A7870] w-44">
                    Artist
                </span>
            </div>

            <!-- Tracklist -->
            <div class="border-t border-[#E2DDD4] dark:border-[#2E2B25]">
                <SongCard
                    v-for="(song, i) in songs"
                    :key="song.id"
                    :song="song"
                    :index="i"
                    class="animate-enter"
                    :style="{ animationDelay: `${i * 40}ms` }"
                />
            </div>

        </div>
    </div>
</template>
