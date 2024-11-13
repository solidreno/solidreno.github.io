import { useState } from 'react';
import './App.css';
import Column from './Column';
import FirstColumn from './FirstColumn';

function App() {

  return (
    <div className="app">
        {/* <FirstColumn></FirstColumn> */}
        <Column></Column>
        <Column></Column>
        <Column></Column>
        <Column></Column>
    </div>
  );
}

export default App;
