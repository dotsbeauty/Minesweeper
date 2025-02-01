import './Cell.css';
import React from 'react';

const Cell = ({ value, onClick, isRevealed, onRightClick, isFlagged }) => {
  return (
    <div className="cell_wrapper">
      <button
        className={`cell ${isRevealed ? 'revealed' : ''} ${isFlagged ? 'flagged' : ''}`}
        onClick={onClick}
        onContextMenu={onRightClick}
        disabled={isRevealed}
      >
        {isRevealed ? value : isFlagged ? "🚩" : ""}
      </button>
    </div>
  );
};

export default Cell;
