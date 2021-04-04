import React from 'react';
import './App.scss';
import Node from './components/Node';
import GraphGrid from './components/GraphGrid'
import Deleter from './components/Deleter';
import Graph from './components/Graph';
import { AppContext } from './AppState';

function App() {
  const {currentlyDragging, appStage, graphs, currentGraph, dispatch} = React.useContext(AppContext);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && currentGraph !== '') {
        dispatch({type: 'UNLOAD_GRAPH'});
    }
  }

  const load_correct_stage = (current: string) => {
    if (current === '') {
      // landing page
      return (
        <div>
          <h1 className='spaced-header'>planet</h1>
          <GraphGrid />
        </div>
      );
    } else {
      // inside graph
      return (
        <div>
          <Graph 
            graph={graphs[currentGraph]}
          />
        </div>
      );
    }
  }

  return (
    <div id="app" onKeyDown={handleKeyPress} tabIndex={0}>
        {load_correct_stage(currentGraph)}
    </div>
  );
}

export default App;