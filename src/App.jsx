import React, { useState, useEffect, useRef } from 'react'
import { Chess } from 'chess.js'
import { Chessboard } from 'react-chessboard'
import { soundManager } from './soundUtils'
import './App.css'

export default function App() {
  const [game, setGame] = useState(new Chess())
  const engine = useRef(null)

  useEffect(() => {
    // Stockfish ကို စတင်ခြင်း
    engine.current = new Worker('/stockfish.js')
    engine.current.postMessage('uci')

    return () => engine.current.terminate()
  }, [])

  function makeAIMove() {
    engine.current.postMessage(`position fen ${game.fen()}`)
    engine.current.postMessage('go depth 10')
    engine.current.onmessage = (e) => {
      if (e.data.startsWith('bestmove')) {
        const move = e.data.split(' ')[1]
        game.move({ from: move.substring(0, 2), to: move.substring(2, 4), promotion: 'q' })
        setGame(new Chess(game.fen()))
      }
    }
  }

  function onSquareClick(square) {
    // Click-to-move logic
    const moves = game.moves({ square: square, verbose: true })
    if (moves.length === 0) return 
    
    // ရွေးချယ်မှု ပြုလုပ်ပါ (ဒီနေရာမှာ ရိုးရှင်းတဲ့ Click-to-Move ထည့်ထားပါတယ်)
    game.move(moves[0].san) 
    setGame(new Chess(game.fen()))
    setTimeout(makeAIMove, 500)
  }

  return (
    <div className="app-container">
      <Chessboard 
        position={game.fen()} 
        onSquareClick={onSquareClick} // Dragအစား Click သုံးခြင်း
      />
    </div>
  )
}
