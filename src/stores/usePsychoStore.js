import { defineStore } from 'pinia'

export const usePsychoStore = defineStore('psycho', {
  state: () => ({
    depth: 0,
    activePersonality: 'Ego',
    audioPlaying: false
  }),

  actions: {
    setDepth(val) {
      const depth = Number(val)

      if (!Number.isFinite(depth)) return

      this.depth = Math.min(100, Math.max(0, depth))
    },

    setActivePersonality(layer) {
      const validLayers = ['Id', 'Ego', 'Superego']

      if (!validLayers.includes(layer)) return

      this.activePersonality = layer
    },

    toggleAudio() {
      this.audioPlaying = !this.audioPlaying
    },

    setAudioPlaying(val) {
      this.audioPlaying = Boolean(val)
    }
  }
})