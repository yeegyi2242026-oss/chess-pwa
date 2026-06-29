// Sound Utilities for Chess App
// Uses Web Audio API to generate beep sounds

class SoundManager {
  constructor() {
    this.audioContext = null
    this.masterVolume = 0.3 // 30% volume
    this.soundsEnabled = localStorage.getItem('soundsEnabled') !== 'false'
  }

  // Initialize Web Audio API
  initAudioContext() {
    if (!this.audioContext) {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext
        this.audioContext = new AudioContext()
      } catch (error) {
        console.log('Web Audio API not supported:', error)
        return false
      }
    }
    return true
  }

  // Resume audio context if suspended (required for user interaction)
  resumeAudioContext() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume()
    }
  }

  // Play a beep sound with specified frequency and duration
  playBeep(frequency = 800, duration = 100, type = 'sine') {
    if (!this.soundsEnabled) return

    if (!this.initAudioContext()) {
      console.log('Cannot play sound - Web Audio API not available')
      return
    }

    this.resumeAudioContext()

    try {
      const now = this.audioContext.currentTime
      const endTime = now + duration / 1000

      // Create oscillator
      const oscillator = this.audioContext.createOscillator()
      oscillator.type = type
      oscillator.frequency.value = frequency

      // Create gain node for volume control
      const gainNode = this.audioContext.createGain()
      gainNode.gain.setValueAtTime(this.masterVolume, now)
      gainNode.gain.exponentialRampToValueAtTime(0.01, endTime)

      // Connect nodes
      oscillator.connect(gainNode)
      gainNode.connect(this.audioContext.destination)

      // Play sound
      oscillator.start(now)
      oscillator.stop(endTime)
    } catch (error) {
      console.error('Error playing sound:', error)
    }
  }

  // Play move sound (higher pitch, shorter duration)
  playMoveSound() {
    this.playBeep(800, 100, 'sine')
  }

  // Play capture sound (lower pitch, slightly longer)
  playCaptureSound() {
    this.playBeep(600, 150, 'sine')
  }

  // Play check sound (ascending tones)
  playCheckSound() {
    this.playBeep(600, 100, 'sine')
    setTimeout(() => this.playBeep(800, 100, 'sine'), 150)
  }

  // Play game over sound (descending tones)
  playGameOverSound() {
    this.playBeep(800, 150, 'sine')
    setTimeout(() => this.playBeep(600, 150, 'sine'), 200)
    setTimeout(() => this.playBeep(400, 200, 'sine'), 400)
  }

  // Play error sound (buzzer)
  playErrorSound() {
    this.playBeep(300, 200, 'square')
  }

  // Toggle sounds on/off
  toggleSounds() {
    this.soundsEnabled = !this.soundsEnabled
    localStorage.setItem('soundsEnabled', this.soundsEnabled)
    return this.soundsEnabled
  }

  // Set master volume (0 to 1)
  setVolume(volume) {
    this.masterVolume = Math.max(0, Math.min(1, volume))
  }

  // Get current sound state
  areSoundsEnabled() {
    return this.soundsEnabled
  }
}

// Create and export singleton instance
export const soundManager = new SoundManager()

// Alternative: Play sound from audio file
export function playAudioFile(filePath) {
  try {
    const audio = new Audio(filePath)
    audio.volume = 0.3
    audio.play().catch((error) => {
      console.log('Could not play audio file:', error)
    })
  } catch (error) {
    console.error('Error playing audio file:', error)
  }
}

// Preload audio files
export function preloadAudioFile(filePath) {
  try {
    const audio = new Audio(filePath)
    audio.preload = 'auto'
    return audio
  } catch (error) {
    console.error('Error preloading audio file:', error)
    return null
  }
}
