import './Game.css';
import { useState } from 'react';
import Board from './Board.js';

function checkWinCondition(grid, mines) {
  let revealedCount = 0;
  let correctFlags = 0;
  let totalCells = grid.length * grid[0].length;

  grid.forEach(row => {
    row.forEach(cell => {
      if (cell.isRevealed) revealedCount++;
      if (cell.isFlagged && cell.isBomb) correctFlags++;
    });
  });

  return revealedCount + mines === totalCells || correctFlags === mines;
}

function Game({ selectedLevel, onGoBack }) {
  const rows = selectedLevel === "beginner" ? 9 : selectedLevel === "intermediate" ? 16 : 24;
  const mines = rows === 9 ? 10 : rows === 16 ? 40 : 99;

  const [gameStatus, setGameStatus] = useState('playing'); // 'playing', 'won', or 'lost'
  const [grid, setGrid] = useState(null);

  const handleGameUpdate = (updatedGrid) => {
    setGrid(updatedGrid);

    if (gameStatus === "playing") {
      if (checkWinCondition(updatedGrid, mines)) {
        setGameStatus("won");
        return;
      }

      const bombHit = updatedGrid.some(row =>
        row.some(cell => cell.isRevealed && cell.isBomb)
      );
      if (bombHit) {
        setGameStatus("lost");
      }
    }
  };

  const resetGame = () => {
    setGameStatus('playing');
    setGrid(null);
  };

  return (
    <div className="game_wrapper">
      <div className="game_container">
        {gameStatus === 'won' && (
          <div className="game_status won">
            <p>🎉 You Won! </p>
            <button onClick={resetGame}>Play Again</button>
          </div>
        )}
        {gameStatus === 'lost' && (
          <div className="game_status lost">
            <p>💥 You Lost!</p>
            <button onClick={resetGame}>Try Again</button>
          </div>
        )}
      </div>

      <button className="go_back_button" onClick={onGoBack}>
        Go Back to Home
      </button>

      {gameStatus === 'playing' && (<Board
        rows={rows}
        selectedLevel={selectedLevel}
        mines={mines}
        grid={grid}
        setGrid={handleGameUpdate}
        setGameStatus={setGameStatus}
        gameStatus={gameStatus}
      />)}
    </div>
  );
}

export default Game;