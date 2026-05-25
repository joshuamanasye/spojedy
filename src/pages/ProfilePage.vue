<script setup>
import { onMounted, ref } from 'vue'
import imageCompression from 'browser-image-compression'
import ComponentNavbar from '../components/ComponentNavbar.vue'

const username = ref('User')
const profileImage = ref(
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=300&auto=format&fit=crop'
)
const theme = ref('light')
const loading = ref(false)
const saved = ref(false)

onMounted(() => {
  const savedUsername = localStorage.getItem('username')
  const savedTheme = localStorage.getItem('theme')
  const savedImage = localStorage.getItem('profileImage')
  if (savedUsername) username.value = savedUsername
  if (savedTheme) theme.value = savedTheme
  if (savedImage) profileImage.value = savedImage
  applyTheme()
})

const applyTheme = () => {
  if (theme.value === 'dark') {
    document.body.classList.add('dark')
  } else {
    document.body.classList.remove('dark')
  }
}

/* Toggle without requiring save, so the preview is instant */
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
  setTimeout(() => (saved.value = false), 2200)
}

/* Compress then convert to base64 blob for localStorage */
const uploadImage = async (event) => {
  const file = event.target.files[0]
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
  <div class="min-h-screen bg-[#F7F4EF] dark:bg-[#0D0B14] text-[#1C1917] dark:text-[#F5F3FF]">
    <ComponentNavbar />

    <div class="max-w-md mx-auto px-4 py-12 animate-fade-up">
      <h1 class="text-3xl font-black mb-2">Your Profile</h1>
      <p class="text-sm text-[#78716C] dark:text-[#9089A8] mb-10">
        Personalise your SpoJeDy experience.
      </p>

      <!-- ─── Avatar upload ─────────────────────────────────────────────── -->
      <div class="flex flex-col items-center mb-10">
        <label for="avatar-upload" class="cursor-pointer group">
          <!-- Progressive loading state -->
          <div
            v-if="loading"
            class="w-28 h-28 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center"
          >
            <div
              class="w-8 h-8 rounded-full border-[3px] border-violet-500 border-t-transparent animate-spin"
            />
          </div>

          <!-- Avatar with gradient ring -->
          <div v-else class="relative">
            <div class="p-[3px] rounded-full bg-gradient-to-br from-violet-500 to-pink-500">
              <img
                :src="profileImage"
                alt="Profile photo"
                class="w-28 h-28 rounded-full object-cover border-[3px] border-[#F7F4EF] dark:border-[#0D0B14]"
              />
            </div>
            <!-- Camera overlay on hover -->
            <div
              class="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="white"
                class="w-7 h-7"
              >
                <path
                  d="M12 15.2A3.2 3.2 0 0 0 15.2 12 3.2 3.2 0 0 0 12 8.8 3.2 3.2 0 0 0 8.8 12a3.2 3.2 0 0 0 3.2 3.2M9 2 7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"
                />
              </svg>
            </div>
          </div>
        </label>

        <input
          id="avatar-upload"
          type="file"
          accept="image/*"
          class="sr-only"
          @change="uploadImage"
        />
        <p class="text-xs text-[#78716C] dark:text-[#9089A8] mt-3">
          Click to upload · max 1 MB
        </p>
      </div>

      <!-- ─── Form ─────────────────────────────────────────────────────── -->
      <div class="space-y-4">
        <!-- Username input -->
        <div>
          <label class="block text-sm font-semibold mb-2">Username</label>
          <input
            v-model="username"
            type="text"
            placeholder="Enter your username"
            class="w-full bg-white dark:bg-[#18152A] border border-black/8 dark:border-white/8 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-violet-400/30 focus:border-violet-500 dark:focus:border-violet-400 placeholder-[#78716C] dark:placeholder-[#9089A8] transition"
          />
        </div>

        <!-- Theme toggle card -->
        <div
          class="flex items-center justify-between bg-white dark:bg-[#18152A] border border-black/8 dark:border-white/8 rounded-xl px-4 py-4"
        >
          <div>
            <p class="text-sm font-semibold">
              {{ theme === 'dark' ? '🌙 Dark Mode' : '☀️ Light Mode' }}
            </p>
            <p class="text-xs text-[#78716C] dark:text-[#9089A8] mt-0.5">
              {{ theme === 'dark' ? 'Easy on the eyes at night' : 'Crisp and clean by day' }}
            </p>
          </div>

          <!-- Toggle switch -->
          <button
            @click="toggleTheme"
            :class="[
              'relative w-12 h-6 rounded-full transition-all duration-300',
              theme === 'dark' ? 'gradient-bg' : 'bg-black/15 dark:bg-white/15',
            ]"
            role="switch"
            :aria-checked="theme === 'dark'"
          >
            <span
              :class="[
                'absolute top-[3px] w-[18px] h-[18px] rounded-full bg-white shadow transition-all duration-300',
                theme === 'dark' ? 'left-[26px]' : 'left-[3px]',
              ]"
            />
          </button>
        </div>

        <!-- Save button -->
        <button
          @click="saveProfile"
          :class="[
            'w-full py-3.5 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all duration-300',
            saved
              ? 'bg-emerald-500 scale-[0.99]'
              : 'gradient-bg hover:opacity-90 hover:scale-[1.01] shadow-lg shadow-violet-500/20',
          ]"
        >
          <svg
            v-if="saved"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="w-5 h-5"
          >
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="w-5 h-5"
          >
            <path
              d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"
            />
          </svg>
          {{ saved ? 'Saved!' : 'Save Changes' }}
        </button>
      </div>
    </div>
  </div>
</template>
