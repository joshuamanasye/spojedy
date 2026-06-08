import { ref, computed } from 'vue'
import { songs } from '../data/songlist'
import { useQueue } from './useQueue'

// ── Singleton — one Audio instance for the entire app lifetime ───────────────
const audio = new Audio()
const currentSong = ref(null)
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(1)
const pct = computed(() => (duration.value ? (currentTime.value / duration.value) * 100 : 0))

// Pull shiftQueue from the shared queue composable (module-level call is fine —
// ref/computed don't need a component context in Vue 3)
const { shiftQueue } = useQueue()

// ── Private helpers ──────────────────────────────────────────────────────────
function _load(song, autoPlay) {
    currentSong.value = song
    audio.src = song.audio
    audio.currentTime = 0
    currentTime.value = 0
    duration.value = 0
    if (autoPlay) audio.play().catch(() => {})
}

function _nextSong(autoPlay) {
    if (!currentSong.value) return
    const queued = shiftQueue()
    const idx = songs.findIndex(s => s.id === currentSong.value.id)
    _load(queued || songs[(idx + 1) % songs.length], autoPlay)
}

// ── Wire audio events once ───────────────────────────────────────────────────
audio.volume = volume.value
audio.addEventListener('timeupdate',    () => { currentTime.value = audio.currentTime })
audio.addEventListener('loadedmetadata',() => { duration.value = audio.duration || 0 })
audio.addEventListener('play',          () => { isPlaying.value = true })
audio.addEventListener('pause',         () => { isPlaying.value = false })
audio.addEventListener('ended',         () => { _nextSong(true) })

// ── Public composable ────────────────────────────────────────────────────────
export function usePlayer() {
    return {
        // State (refs — auto-unwrapped in templates)
        currentSong,
        isPlaying,
        currentTime,
        duration,
        volume,
        pct,

        // Helpers
        fmt(t) {
            if (!t || isNaN(t)) return '0:00'
            return `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`
        },

        // Load a song into the player (autoPlay = false by default so navigating
        // to a song detail page doesn't auto-start unless music was already playing)
        loadSong(song, autoPlay = false) { _load(song, autoPlay) },

        togglePlay() {
            if (!currentSong.value) return
            isPlaying.value ? audio.pause() : audio.play().catch(() => {})
        },

        // Called by MusicVideoDetail when the video starts — pauses music.
        // Music won't resume automatically; user must click play again.
        pauseForVideo() {
            if (isPlaying.value) audio.pause()
        },

        // Advance (respects the queue, then falls through to sequential list)
        nextSong() { _nextSong(isPlaying.value) },

        prevSong() {
            if (!currentSong.value) return
            const idx = songs.findIndex(s => s.id === currentSong.value.id)
            _load(songs[(idx - 1 + songs.length) % songs.length], isPlaying.value)
        },

        setProgress(e) {
            if (!duration.value) return
            const r = e.currentTarget.getBoundingClientRect()
            audio.currentTime = ((e.clientX - r.left) / r.width) * duration.value
        },

        changeVolume(val) {
            volume.value = val
            audio.volume = val
        },
    }
}
