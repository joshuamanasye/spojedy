import { ref, computed } from 'vue'

// Module-level state — shared across every component that imports useQueue
const queue = ref([])

export function useQueue() {
    const queueLength = computed(() => queue.value.length)

    const addToQueue = (song) => {
        queue.value.push(song)
        console.log('queue: added', song.title, '| length:', queue.value.length)
    }

    const removeFromQueue = (index) => {
        queue.value.splice(index, 1)
        console.log('queue: removed index', index, '| remaining:', queue.value.length)
    }

    // Pop the first item — used by nextSong to consume the queue
    const shiftQueue = () => {
        if (queue.value.length === 0) return null
        const song = queue.value.shift()
        console.log('queue: shifted', song.title, '| remaining:', queue.value.length)
        return song
    }

    const clearQueue = () => {
        queue.value = []
        console.log('queue: cleared')
    }

    const moveUp = (index) => {
        if (index === 0) return
        queue.value.splice(index - 1, 2, queue.value[index], queue.value[index - 1])
        console.log('queue: moved up index', index)
    }

    const moveDown = (index) => {
        if (index === queue.value.length - 1) return
        queue.value.splice(index, 2, queue.value[index + 1], queue.value[index])
        console.log('queue: moved down index', index)
    }

    return { queue, queueLength, addToQueue, removeFromQueue, shiftQueue, clearQueue, moveUp, moveDown }
}
