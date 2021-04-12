import {AppState, Action, Graph, Node} from './types/types';
import { v4 as uuidv4 } from 'uuid';

export const appstate_reducer = (state: AppState, action: Action) => {
    let new_state: AppState;
    switch (action.type) {
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
            new_state = load_graph(state, action);
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
    const {name} = action;
    const uuid = uuidv4();
    console.log(`Creating new graph ${uuid} with name "${name}"`);
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
    const {graph_id, name} = action;
    console.log(`Renaming graph ${graph_id} to ${name}`);
    let new_graph = {
        ...state.graphs[graph_id],
        name: name
    };
    return {
        ...state,
        graphs: {
            ...state.graphs,
            [new_graph.uuid]: new_graph
        }
    };
}

const load_graph = (state: AppState, action: Action): AppState => {
    const {graph_id} = action;
    console.log(`loading graph: ${graph_id}`)
    return {
        ...state,
        currentGraph: action.graph_id
    };
}

const new_node = (state: AppState, action: Action): AppState => {
    const {graph_id, position} = action;
    const uuid = uuidv4();
    console.log(`Creating new node ${uuid} under graph ${graph_id} at ${position.x},${position.y}`);
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
    const {node_id, position} = action;
    console.log(`setting node ${action.node_id} pos to ${position.x},${position.y}`);
    const updated_node = {
        ...state.nodes[node_id],
        position: position
    };
    return {
        ...state,
        nodes: {
            ...state.nodes,
            [node_id]: updated_node
        }
    };
}