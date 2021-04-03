import React from 'react';
import './App.scss';
import Node from './components/Node';
import GraphGrid from './components/GraphGrid'

function App() {
  return (
    <div id="app">
      <h1>planet</h1>
      <GraphGrid 
      
      />
    </div>
  );
}

export default App;

// Opening screen: name then a grid of saved graphs
// clicking on a grid item takes you to that graph