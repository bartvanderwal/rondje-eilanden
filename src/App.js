import React from 'react';
import './App.css';
import ParticipantList from './components/ParticipantList.js';
import ParticipantDetails from './components/ParticipantDetails.js';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Het 13e Rondje Eilanden Deelnemers</h1>
      </header>
      <main>
        <ParticipantList />
        <ParticipantDetails />
      </main>
    </div>
  );
}

export default App;
