import './App.css';
import { useState } from 'react';
import Game from './Game.js';

function App() {
  const [selectedLevel, setSelectedLevel] = useState(null);

  const handleLevelChange = (event) => {
    setSelectedLevel(event.target.value);
  };

  const handleGoBack = () => {
    setSelectedLevel(null);
  };

  return (
    <div className="home_wrapper">
      <div className="header_wrapper">
        <h1>💣 Minesweeper 🚩</h1>
      </div>
      <div className="home_container">
        {selectedLevel === null ? (
          <div className='header_container level_container'>
            <h2>Choose the level:</h2>
            <select name="level" defaultValue="---Select a Level---" onChange={handleLevelChange}>
              <option value="---Select a Level---" disabled>---Select a Level---</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        ) : (
          <div className="header_container game_container">
            <Game selectedLevel={selectedLevel} onGoBack={handleGoBack} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
