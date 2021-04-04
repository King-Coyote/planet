import React from 'react';
import './App.scss';
import Node from './components/Node';
import GraphGrid from './components/GraphGrid'
import Deleter from './components/Deleter';
import Graph from './components/Graph';
import { AppContext } from './AppState';

function App() {
    const {currentlyDragging, appStage, graphs, currentGraph, dispatch} = React.useContext(AppContext);

    // let esc_listener: (e: KeyboardEvent) => void;

    React.useEffect(() => {
        const esc_listener = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                dispatch({type: 'UNLOAD_GRAPH'});
            }
        };
        document.addEventListener('keydown', esc_listener);
        return () => {
            document.removeEventListener('keydown', esc_listener);
        }
    }, []);

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
        <div id="app">
                {load_correct_stage(currentGraph)}
        </div>
    );
}

export default App;