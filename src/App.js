import { useState } from 'react';
import './App.css';
import Column from './Column';
import FirstColumn from './FirstColumn';

function App() {

  return (
    <div className="app">
      <div id="grid">
        <FirstColumn></FirstColumn>
        <Column></Column>
        <Column></Column>
      </div>
    </div>
  );
}

export default App;
