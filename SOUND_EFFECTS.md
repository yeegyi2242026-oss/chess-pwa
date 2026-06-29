# Sound Effects Implementation Guide

This document explains how sound effects have been integrated into the Offline Chess app.

## Files Created/Modified

### 1. **src/soundUtils.js** (New)
A comprehensive sound management utility that provides:

#### SoundManager Class
- **playMoveSound()**: Standard move sound (800Hz sine wave, 100ms)
- **playCaptureSound()**: Capture sound (600Hz sine wave, 150ms) - lower pitch than move
- **playCheckSound()**: Check sound (ascending tones: 600Hz → 800Hz)
- **playGameOverSound()**: Game over sound (descending tones: 800Hz → 600Hz → 400Hz)
- **playErrorSound()**: Invalid move sound (300Hz square wave, 200ms - buzzer)
- **toggleSounds()**: Enable/disable all sounds
- **setVolume(volume)**: Adjust master volume (0 to 1)
- **areSoundsEnabled()**: Check if sounds are currently enabled

#### Features
- **Web Audio API**: Uses native browser audio synthesis
- **No external files needed**: Generates beeps programmatically
- **Persistent settings**: Sound preference saved in localStorage
- **Volume control**: Master volume set to 30% by default
- **Graceful fallback**: Works even if Web Audio API is unavailable

### 2. **src/App.jsx** (Updated)
Enhanced with sound effects for:

#### Game Events
- **Player moves**: Plays move sound
- **Piece captured**: Plays capture sound (lower pitch)
- **Check detected**: Plays check sound after move
- **Invalid move**: Plays error sound (buzzer)
- **Game over**: Plays descending tone sequence
- **New game**: Plays move sound

#### UI Controls
- **Sound toggle button**: 🔊 (sound on) / 🔇 (sound off)
- **Language switcher**: Unchanged
- **New Game button**: Unchanged

#### Audio Context Management
- Initializes Web Audio API on first user interaction
- Resumes audio context if suspended (required by browsers)
- Handles errors gracefully

### 3. **src/App.css** (Updated)
Added styling for:
- **.sound-toggle**: Orange button with speaker emoji
- **.header-controls**: Container for sound and language buttons
- Mobile responsive layout for buttons

## How It Works

### Sound Generation
The app uses the **Web Audio API** to generate sounds programmatically:

```javascript
// Example: Generate a 800Hz beep for 100ms
const oscillator = audioContext.createOscillator()
oscillator.frequency.value = 800
oscillator.type = 'sine'
oscillator.start()
oscillator.stop(currentTime + 0.1)
```

### Sound Types

| Sound | Frequency | Duration | Type | Use Case |
|-------|-----------|----------|------|----------|
| Move | 800Hz | 100ms | Sine | Normal piece movement |
| Capture | 600Hz | 150ms | Sine | Capturing opponent piece |
| Check | 600→800Hz | 100ms each | Sine | Opponent in check |
| Game Over | 800→600→400Hz | 150ms each | Sine | Game ends |
| Error | 300Hz | 200ms | Square | Invalid move |

### User Interaction Flow

1. **First interaction**: Audio context is initialized (required by browsers)
2. **Player moves**: Sound plays based on move type
3. **AI responds**: Sound plays for AI's move
4. **Toggle button**: User can enable/disable sounds anytime
5. **Preference saved**: Sound setting persists in localStorage

## Using Custom Audio Files

If you want to use custom audio files instead of generated beeps:

### Option 1: Replace Individual Sounds

```javascript
// In soundUtils.js
export function playMoveSound() {
  playAudioFile('/sounds/move.mp3')
}

export function playCaptureSound() {
  playAudioFile('/sounds/capture.mp3')
}
```

### Option 2: Use Both (Fallback)

```javascript
function playMoveSound() {
  try {
    playAudioFile('/sounds/move.mp3')
  } catch (error) {
    // Fallback to generated beep
    this.playBeep(800, 100, 'sine')
  }
}
```

### Adding Audio Files

1. Create a `/public/sounds/` directory
2. Add your audio files:
   - `move.mp3` - Normal move sound
   - `capture.mp3` - Capture sound
   - `check.mp3` - Check sound
   - `gameover.mp3` - Game over sound
   - `error.mp3` - Error sound

3. Update soundUtils.js to use the files

## Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Web Audio API | ✅ | ✅ | ✅ | ✅ |
| Oscillator | ✅ | ✅ | ✅ | ✅ |
| Audio Files | ✅ | ✅ | ✅ | ✅ |
| localStorage | ✅ | ✅ | ✅ | ✅ |

## Volume Control

The default master volume is set to **30%** to avoid startling users. To adjust:

```javascript
// In App.jsx
soundManager.setVolume(0.5) // 50% volume
```

## Troubleshooting

### No sound is playing
1. Check if sounds are enabled (click the 🔊 button)
2. Check browser console for errors
3. Ensure audio context is initialized (click on the page first)
4. Check browser volume settings

### Sound is too loud/quiet
1. Adjust master volume in soundUtils.js:
   ```javascript
   this.masterVolume = 0.5 // Change from 0.3
   ```

### Audio context is suspended
This is normal behavior in modern browsers. The app automatically resumes the audio context on the first user interaction.

### Custom audio files not playing
1. Ensure files are in `/public/sounds/` directory
2. Check file paths in soundUtils.js
3. Verify files are in supported format (MP3, WAV, OGG)
4. Check browser console for CORS errors

## Performance Considerations

- **Web Audio API**: Minimal CPU usage, no file downloads
- **Generated beeps**: Instant playback, no latency
- **Audio files**: Requires file download, slight latency
- **Volume**: Kept at 30% to prevent audio clipping

## Accessibility

- Sound toggle button is clearly visible
- Keyboard accessible (can be tabbed to)
- Visual feedback (emoji changes)
- Preference persists across sessions
- Works with screen readers

## Future Enhancements

Possible improvements:
- [ ] Volume slider for fine control
- [ ] Different sound themes
- [ ] Haptic feedback on mobile
- [ ] Background music
- [ ] Sound effects library
- [ ] Custom sound upload

## Testing

### Manual Testing
1. Play a move - should hear beep
2. Capture a piece - should hear lower beep
3. Put opponent in check - should hear ascending tones
4. Click sound toggle - should mute/unmute
5. Refresh page - sound preference should persist

### Automated Testing
```javascript
// Test sound generation
soundManager.playMoveSound()
soundManager.playCaptureSound()
soundManager.playCheckSound()
soundManager.playGameOverSound()
soundManager.playErrorSound()
```

## License

Sound generation uses native Web Audio API - no external libraries or licenses required.
