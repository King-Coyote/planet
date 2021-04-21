export interface Graph {
    uuid: string;
    name: string;
    nodes: string[]; // node ids
}

export interface Pos {
    x: number;
    y: number;
}

export interface Size {
    width: number;
    height: number;
}

export type AppStage = 'HOME' | 'GRAPH';

export interface Node {
    uuid: string;
    text: string;
    position: Pos;
    size: Size;
    neighbors: string[]; // node ids
}

export type Action = {
    type: string;
    [arg_name: string]: any;
};

export interface AppState {
    dispatch: (action: Action) => void;
    currentlyDragging: string; // uuid of thing being dragged.
    graphs: {[uuid: string]: Graph};
    nodes: {[uuid: string]: Node};
    appStage: AppStage;
    currentGraph: string;
};

export type AppReducer = (state: AppState, action: Action) => AppState;