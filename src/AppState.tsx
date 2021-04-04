import React, { Dispatch } from 'react';
import {AppState, AppReducer, Action} from './types/types';
import {appstate_reducer} from './reducers';

interface ProviderProps {
    children: React.ReactNode;
};

const initialState: AppState = {
    dispatch: (action: Action) => {},
    currentlyDragging: '',
    graphs: {},
    nodes: {},
    appStage: 'HOME',
    currentGraph: '',
};
const AppContext = React.createContext<AppState>(initialState);

const StateProvider: React.FC = ( { children } ) => {
    const [state, dispatch] = React.useReducer<AppReducer>(appstate_reducer, initialState);
  
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