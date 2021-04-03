import React, { Dispatch } from 'react';
import * as Types from './types/types';
import { v4 as uuidv4 } from 'uuid';

interface ProviderProps {
    children: React.ReactNode;
};

type Action = {
    type: string;
};

interface AppState {
    dispatch: (action: Action) => void;
    graphs: Types.Graph[],
};

type AppReducer = (state: AppState, action: Action) => AppState;

const initialState: AppState = {
    dispatch: (action: Action) => {},
    graphs: [],
};
const AppContext = React.createContext<AppState>(initialState);

const save_state = (new_state: AppState) => {
    localStorage.setItem('planet_state', JSON.stringify(new_state));
}

const reducer = (state: AppState, action: Action) => {
    let new_state: AppState;
    switch (action.type) {
        case 'NEW_GRAPH':
            const graphs = [
                ...state.graphs, 
                {
                    uuid: uuidv4(),
                },
            ];
            new_state = {
                ...state, 
                graphs: graphs
            };
            break;
        default:
            throw new Error();
    }
    save_state(new_state);
    return new_state;
}

const StateProvider: React.FC = ( { children } ) => {
    const [state, dispatch] = React.useReducer<AppReducer>(reducer, initialState);
  
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