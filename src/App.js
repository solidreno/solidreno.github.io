import { useState } from 'react';
import './App.css';
import Column from './Column';

function App() {

  return (
    <div className="app">
      <div id="grid">
        <Column></Column>
        <Column></Column>
      </div>
    </div>
  );
}

export default App;
