import './Board.css';
import { useState, useEffect } from 'react';
import Cell from './Cell.js';

function Board({ rows, selectedLevel, mines, grid: parentGrid, setGrid: setParentGrid, setGameStatus, gameStatus }) {
  const [timer, setTimer] = useState(0);
  const [localGrid, setLocalGrid] = useState([]);

  const grid = parentGrid || localGrid;
  const setGrid = parentGrid ? setParentGrid : setLocalGrid;

  function createGrid(rows) {
    return Array(rows)
      .fill(null)
      .map(() =>
        Array(rows).fill().map(() => ({
          value: "",
          isBomb: false,
          isRevealed: false,
          isFlagged: false,
        }))
      );
  }

  function calculateNearbyBombs(grid, row, col) {
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1], [0, 1],
      [1, -1], [1, 0], [1, 1],
    ];
    return directions.reduce((count, [dx, dy]) => {
      const newRow = row + dx;
      const newCol = col + dy;
      if (
        newRow >= 0 &&
        newRow < grid.length &&
        newCol >= 0 &&
        newCol < grid.length &&
        grid[newRow][newCol].isBomb
      ) {
        count++;
      }
      return count;
    }, 0);
  }

  useEffect(() => {
    function placeBombs(grid, mines) {
      const newGrid = grid.map(row => row.map(cell => ({ ...cell })));
      let placedMines = 0;

      while (placedMines < mines) {
        const row = Math.floor(Math.random() * rows);
        const col = Math.floor(Math.random() * rows);

        if (!newGrid[row][col].isBomb) {
          newGrid[row][col].isBomb = true;
          placedMines++;
        }
      }

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < rows; col++) {
          if (!newGrid[row][col].isBomb) {
            const bombCount = calculateNearbyBombs(newGrid, row, col);
            newGrid[row][col].value = bombCount > 0 ? bombCount : "";
          }
        }
      }

      return newGrid;
    }

    if (rows > 0 && mines > 0) {
      const emptyGrid = createGrid(rows);
      const gridWithBombs = placeBombs(emptyGrid, mines);
      setGrid(gridWithBombs);
    }
  }, [rows, mines, setGrid]);

  useEffect(() => {
    if (!parentGrid) {
      setTimer(0);
      const interval = setInterval(() => setTimer(prev => prev + 1), 1000);
      return () => clearInterval(interval);
    }
  }, [parentGrid]);

  function revealCell(row, col) {
    if (gameStatus !== "playing") return;

    if (
      row < 0 ||
      row >= grid.length ||
      col < 0 ||
      col >= grid.length ||
      grid[row][col].isRevealed ||
      grid[row][col].isFlagged
    ) {
      return;
    }

    const newGrid = grid.map(row => row.map(cell => ({ ...cell })));

    if (newGrid[row][col].isBomb) {
      newGrid.forEach(row =>
        row.forEach(cell => {
          if (cell.isBomb) cell.isRevealed = true;
        })
      );
      setTimeout(() => {
        setGrid(newGrid);
        if (parentGrid) setParentGrid(newGrid);
        setGameStatus("lost");
        return;
      }, 1500);
    }

    const queue = [[row, col]];
    while (queue.length > 0) {
      const [currentRow, currentCol] = queue.shift();

      if (
        currentRow < 0 ||
        currentRow >= newGrid.length ||
        currentCol < 0 ||
        currentCol >= newGrid.length ||
        newGrid[currentRow][currentCol].isRevealed
      ) {
        continue;
      }

      newGrid[currentRow][currentCol].isRevealed = true;

      if (newGrid[currentRow][currentCol].value === "") {
        const directions = [
          [-1, -1], [-1, 0], [-1, 1],
          [0, -1], [0, 1],
          [1, -1], [1, 0], [1, 1],
        ];
        directions.forEach(([dx, dy]) => {
          queue.push([currentRow + dx, currentCol + dy]);
        });
      }
    }

    setGrid(newGrid);
    if (parentGrid) setParentGrid(newGrid);
  }

  function handleRightClick(event, row, col) {
    event.preventDefault();

    if (gameStatus !== 'playing') {
      return;
    }

    const newGrid = grid.map(row => row.map(cell => ({ ...cell })));
    if (!newGrid[row][col].isRevealed) {
      newGrid[row][col].isFlagged = !newGrid[row][col].isFlagged;
      setGrid(newGrid);
      if (parentGrid) setParentGrid(newGrid);
    }
  }

  function countFlags(grid) {
    return grid.reduce(
      (total, row) => total + row.filter(cell => cell.isFlagged).length,
      0
    );
  }

  return (
    <div className="board_wrapper">
      <div className="board_data">
        <h2 className='level_data'>Level: {selectedLevel.charAt(0).toUpperCase() + selectedLevel.slice(1)}</h2>
        <p className='grid_data'>▦ Grid: {rows} x {rows}</p>
        <p className='time_data'>⏱️ Time: {timer}s</p>
        <p className='flag_data'>🚩 Flags: {mines - countFlags(grid)}</p>
      </div>
      <div
        className={`grid_wrapper ${selectedLevel==='advanced' ? 'adv_class' : ''}`}
        style={{
          gridTemplateColumns: `repeat(${rows}, minmax(auto,auto))`,
        }}
      >
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              value={cell.isBomb ? "💣" : cell.value}
              isRevealed={cell.isRevealed}
              isFlagged={cell.isFlagged}
              onClick={() => revealCell(rowIndex, colIndex)}
              onRightClick={(e) => handleRightClick(e, rowIndex, colIndex)}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default Board;