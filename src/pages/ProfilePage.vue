<script setup>
import { onMounted, ref } from 'vue'
import imageCompression from 'browser-image-compression'
import ComponentNavbar from '../components/ComponentNavbar.vue'

const username = ref('User')
const profileImage = ref(
    'https://cdn.joman.id/images/photo.jpg'
)
const theme = ref('light')
const loading = ref(false)
const saved = ref(false)

onMounted(() => {
    const u = localStorage.getItem('username')
    const th = localStorage.getItem('theme')
    const img = localStorage.getItem('profileImage')
    if (u) username.value = u
    if (th) theme.value = th
    if (img) profileImage.value = img
    applyTheme()
})

const applyTheme = () => {
    document.body.classList.toggle('dark', theme.value === 'dark')
}

const toggleTheme = () => {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
    applyTheme()
}

const saveProfile = () => {
    localStorage.setItem('username', username.value)
    localStorage.setItem('theme', theme.value)
    localStorage.setItem('profileImage', profileImage.value)
    applyTheme()
    saved.value = true
    setTimeout(() => (saved.value = false), 2000)
}

/* Compress to ≤1 MB then store as base64 blob */
const uploadImage = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    loading.value = true
    try {
        const compressed = await imageCompression(file, {
            maxSizeMB: 1,
            maxWidthOrHeight: 1000,
            useWebWorker: true,
        })
        const reader = new FileReader()
        reader.readAsDataURL(compressed)
        reader.onload = () => {
            profileImage.value = reader.result
            loading.value = false
        }
    } catch {
        loading.value = false
    }
}
</script>

<template>
    <div class="min-h-screen bg-[#F9F8F4] dark:bg-[#141310] text-[#1A1916] dark:text-[#EDE9DF]">
        <ComponentNavbar />

        <div class="max-w-5xl mx-auto px-5 py-10">

            <!-- Page label -->
            <h1 class="text-[3.2rem] leading-none font-black tracking-[-0.04em] mb-8">
                Profile
            </h1>

            <div class="border-t border-[#E2DDD4] dark:border-[#2E2B25]">

                <!-- Avatar row -->
                <div class="flex items-center justify-between py-6 border-b border-[#E2DDD4] dark:border-[#2E2B25]">
                    <div>
                        <p class="text-sm font-bold tracking-[0.12em] uppercase text-[#8A8679] dark:text-[#7A7870]">
                            Photo
                        </p>
                        <label for="avatar-upload" class="mt-1.5 text-sm text-[var(--accent)] cursor-pointer hover:underline">
                            Change photo ↗
                        </label>
                        <input id="avatar-upload" type="file" accept="image/*" class="sr-only" @change="uploadImage" />
                    </div>

                    <!-- Avatar — square, not circle -->
                    <div class="w-16 h-16 shrink-0 border border-[#E2DDD4] dark:border-[#2E2B25] overflow-hidden relative">
                        <div v-if="loading" class="w-full h-full bg-[#F2EDE3] dark:bg-[#1E1C19] flex items-center justify-center animate-pulse">
                            <div class="w-4 h-4 rounded-full border-2 border-[var(--accent)] border-t-transparent animate-spin" />
                        </div>
                        <img v-else :src="profileImage" alt="Profile" class="w-full h-full object-cover" />
                    </div>
                </div>

                <!-- Username row -->
                <div class="flex items-center justify-between py-6 border-b border-[#E2DDD4] dark:border-[#2E2B25] gap-8">
                    <p class="text-sm font-bold tracking-[0.12em] uppercase text-[#8A8679] dark:text-[#7A7870] shrink-0">
                        Username
                    </p>
                    <input
                        v-model="username"
                        type="text"
                        placeholder="Your name"
                        class="flex-1 min-w-0 max-w-xs bg-transparent border-b border-[#E2DDD4] dark:border-[#2E2B25] focus:border-[#1A1916] dark:focus:border-[#EDE9DF] outline-none py-1 text-base text-right transition-colors placeholder-[#8A8679] dark:placeholder-[#7A7870]"
                    />
                </div>

                <!-- Theme row -->
                <div class="flex items-center justify-between py-6 border-b border-[#E2DDD4] dark:border-[#2E2B25]">
                    <div>
                        <p class="text-sm font-bold tracking-[0.12em] uppercase text-[#8A8679] dark:text-[#7A7870]">
                            Appearance
                        </p>
                        <p class="text-base mt-0.5">{{ theme === 'dark' ? 'Dark' : 'Light' }}</p>
                    </div>

                    <!-- Toggle switch -->
                    <button
                        @click="toggleTheme"
                        :class="[
                            'relative w-11 h-6 border transition-colors',
                            theme === 'dark'
                                ? 'bg-[#1A1916] dark:bg-[#EDE9DF] border-[#1A1916] dark:border-[#EDE9DF]'
                                : 'bg-transparent border-[#E2DDD4] dark:border-[#2E2B25]'
                        ]"
                        role="switch"
                        :aria-checked="theme === 'dark'"
                    >
                        <span
                            :class="[
                                'absolute top-[3px] w-[18px] h-[18px] transition-all duration-200',
                                theme === 'dark'
                                    ? 'left-[23px] bg-[#F9F8F4] dark:bg-[#141310]'
                                    : 'left-[3px] bg-[#1A1916] dark:bg-[#EDE9DF]'
                            ]"
                        />
                    </button>
                </div>

                <!-- Save row -->
                <div class="flex items-center justify-between py-6">
                    <p class="text-sm text-[#8A8679] dark:text-[#7A7870]">
                        Changes are saved to your browser.
                    </p>
                    <button
                        @click="saveProfile"
                        :class="[
                            'text-sm font-bold tracking-[0.12em] uppercase px-5 py-2.5 border transition-colors',
                            saved
                                ? 'border-green-600 text-green-600'
                                : 'border-[#1A1916] dark:border-[#EDE9DF] text-[#1A1916] dark:text-[#EDE9DF] hover:bg-[#1A1916] dark:hover:bg-[#EDE9DF] hover:text-[#F9F8F4] dark:hover:text-[#141310]'
                        ]"
                    >
                        {{ saved ? 'Saved ✓' : 'Save' }}
                    </button>
                </div>

            </div>
        </div>
    </div>
</template>
