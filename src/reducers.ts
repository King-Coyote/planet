import {AppState, Action, Graph, Node} from './types/types';
import { v4 as uuidv4 } from 'uuid';

export const appstate_reducer = (state: AppState, action: Action) => {
    let new_state: AppState;
    switch (action.type) {
        case 'SET_DRAG':
            new_state = {
                ...state,
                currentlyDragging: action.uuid,
            }
            break;
        case 'CLEAR_DRAG':
            new_state = {
                ...state,
                currentlyDragging: ''
            }
            break;
        case 'SET_APP_STAGE':
            new_state = {
                ...state,
                appStage: action.appStage,
            }
            break;
        case 'NEW_GRAPH':
            new_state = new_graph(state, action)
            break;
        case 'RENAME_GRAPH':
            new_state = rename_graph(state, action);
            break;
        case 'LOAD_GRAPH':
            console.log(`loading graph: ${action.graph_id}`)
            new_state = {
                ...state,
                currentGraph: action.graph_id
            };
            break;
        case 'UNLOAD_GRAPH':
            new_state = {
                ...state,
                currentGraph: ''
            };
            break;
        case 'NEW_NODE':
            new_state = new_node(state, action);
            break;
        case 'SET_NODE_POS':
            new_state = set_node_pos(state, action);
            break;
        default:
            throw new Error();
    }
    // SIDE EFFECT - this cannot live here
    save_state(new_state);
    return new_state;
}

const save_state = (new_state: AppState) => {
    localStorage.setItem('planet_state', JSON.stringify(new_state));
}

const new_graph = (state: AppState, action: Action): AppState => {
    const uuid = uuidv4();
    let graphs = {...state.graphs};
    graphs[uuid] = {
        name: action.name,
        uuid: uuid,
        nodes: [],
    } as Graph;
    return {
        ...state, 
        graphs: graphs
    };
}

const rename_graph = (state: AppState, action: Action): AppState => {
    let new_graph = {
        ...state.graphs[action.graph_id],
        name: action.name
    };
    return {
        ...state,
        graphs: {
            ...state.graphs,
            [new_graph.uuid]: new_graph
        }
    };
}

const new_node = (state: AppState, action: Action): AppState => {
    const uuid = uuidv4();
    const graph = state.graphs[action.graph_id];
    const new_node = {
        uuid: uuid,
        text: '',
        neighbors: [],
        position: action.position,
    };
    const updated_graph = {
        ...graph,
        nodes: [...graph.nodes, uuid]
    };
    return {
        ...state,
        nodes: {
            ...state.nodes,
            [uuid]: new_node,
        },
        graphs: {
            ...state.graphs,
            [updated_graph.uuid]: updated_graph
        }
    };
}

const set_node_pos = (state: AppState, action: Action): AppState => {
    const updated_node = {
        ...state.nodes[action.node_id],
        position: action.position
    };
    return {
        ...state,
        nodes: {
            ...state.nodes,
            [action.node_id]: updated_node
        }
    };
}