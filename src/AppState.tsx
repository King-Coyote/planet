import React, { Dispatch } from 'react';
import {AppState, AppReducer, Action} from './types/types';
import {appstate_reducer} from './reducers';

const get_initial_state = () => {
    const local_stored = localStorage.getItem('planet_state');
    if (local_stored) {
        return JSON.parse(local_stored);
    }
    return {
        dispatch: (action: Action) => {},
        currentlyDragging: '',
        graphs: {},
        nodes: {},
        appStage: 'HOME',
        currentGraph: '',
    };
}


const AppContext = React.createContext<AppState>(get_initial_state());

const StateProvider: React.FC = ( { children } ) => {
    const [state, dispatch] = React.useReducer<AppReducer>(appstate_reducer, get_initial_state());
  
    return (
        <AppContext.Provider 
            value={{ 
                ...state,
                dispatch: (action: Action) => dispatch(action),
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export {
    AppContext, 
    StateProvider
};