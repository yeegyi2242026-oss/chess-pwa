import React, { useState, useEffect } from 'react'
import { Chess } from 'chess.js'
import { Chessboard } from 'react-chessboard'
import { soundManager } from './soundUtils'
import './App.css'

const translations = {
  en: { 
    title: "Offline Chess", 
    status: "Game in Progress", 
    switch: "Switch Language",
    gameOver: "Game Over",
    draw: "Draw",
    sound: "Sound",
    soundOn: "Sound On",
    soundOff: "Sound Off"
  },
  my: { 
    title: "အော့ဖ်လိုင်း စစ်တုရင်", 
    status: "ဂိမ်းကစားနေသည်", 
    switch: "ဘာသာစကားပြောင်းရန်",
    gameOver: "ဂိမ်းပြီးဆုံးသည်",
    draw: "ညီမျှသည်",
    sound: "အသံ",
    soundOn: "အသံ ဖွင့်",
    soundOff: "အသံ ပိတ်"
  }
}

export default function App() {
  const [game, setGame] = useState(new Chess())
  const [lang, setLang] = useState(localStorage.getItem('lang') || 'en')
  const [soundEnabled, setSoundEnabled] = useState(soundManager.areSoundsEnabled())

  useEffect(() => {
    localStorage.setItem('lang', lang)
  }, [lang])

  useEffect(() => {
    // Initialize audio context on first user interaction
    const handleUserInteraction = () => {
      soundManager.resumeAudioContext()
      window.removeEventListener('click', handleUserInteraction)
      window.removeEventListener('touchstart', handleUserInteraction)
    }
    window.addEventListener('click', handleUserInteraction)
    window.addEventListener('touchstart', handleUserInteraction)

    return () => {
      window.removeEventListener('click', handleUserInteraction)
      window.removeEventListener('touchstart', handleUserInteraction)
    }
  }, [])

  function makeRandomMove() {
    const possibleMoves = game.moves()
    if (game.isGameOver() || game.isDraw() || possibleMoves.length === 0) return
    
    const randomIndex = Math.floor(Math.random() * possibleMoves.length)
    const move = game.move(possibleMoves[randomIndex])
    
    // Play sound based on move type
    if (soundEnabled) {
      if (move.captured) {
        soundManager.playCaptureSound()
      } else {
        soundManager.playMoveSound()
      }

      // Play check sound if opponent is in check
      if (game.inCheck()) {
        setTimeout(() => soundManager.playCheckSound(), 200)
      }
    }

    setGame(new Chess(game.fen()))
  }

  function onDrop(sourceSquare, targetSquare) {
    try {
      const move = game.move({ from: sourceSquare, to: targetSquare, promotion: 'q' })
      if (move === null) {
        // Invalid move
        if (soundEnabled) {
          soundManager.playErrorSound()
        }
        return false
      }

      // Play sound for player's move
      if (soundEnabled) {
        if (move.captured) {
          soundManager.playCaptureSound()
        } else {
          soundManager.playMoveSound()
        }

        // Play check sound if player put opponent in check
        if (game.inCheck()) {
          setTimeout(() => soundManager.playCheckSound(), 200)
        }
      }

      setGame(new Chess(game.fen()))

      // AI makes move after delay
      setTimeout(makeRandomMove, 500)
      return true
    } catch (e) { 
      if (soundEnabled) {
        soundManager.playErrorSound()
      }
      return false 
    }
  }

  function resetGame() {
    setGame(new Chess())
    if (soundEnabled) {
      soundManager.playMoveSound()
    }
  }

  function toggleSound() {
    const newState = soundManager.toggleSounds()
    setSoundEnabled(newState)
  }

  const getGameStatus = () => {
    if (game.isGameOver()) {
      if (soundEnabled) {
        // Play game over sound when game ends
        if (!soundManager.gameOverSoundPlayed) {
          soundManager.playGameOverSound()
          soundManager.gameOverSoundPlayed = true
        }
      }
      return translations[lang].gameOver
    }
    soundManager.gameOverSoundPlayed = false
    if (game.isDraw()) {
      return translations[lang].draw
    }
    return translations[lang].status
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>{translations[lang].title}</h1>
        <div className="header-controls">
          <button 
            className="sound-toggle" 
            onClick={toggleSound}
            title={soundEnabled ? translations[lang].soundOn : translations[lang].soundOff}
          >
            {soundEnabled ? '🔊' : '🔇'}
          </button>
          <button className="language-toggle" onClick={() => setLang(lang === 'en' ? 'my' : 'en')}>
            {translations[lang].switch}
          </button>
        </div>
      </header>

      <main className="app-main">
        <div className="chessboard-container">
          <Chessboard position={game.fen()} onPieceDrop={onDrop} />
        </div>
        <p className="game-status">{getGameStatus()}</p>
        <button className="reset-button" onClick={resetGame}>
          {lang === 'en' ? 'New Game' : 'နည်းလမ်းအသစ်'}
        </button>
      </main>

      <footer className="app-footer">
        <p>{lang === 'en' ? 'Drag pieces to move' : 'အကွက်များကို ရွှေ့ခြင်းအတွက် ဆွဲခြင်း'}</p>
      </footer>
    </div>
  )
}
