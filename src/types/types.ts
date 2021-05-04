export interface Graph {
    uuid: string;
    name: string;
    nodes: string[]; // node ids
}

export interface Pos {
    x: number;
    y: number;
}
export const DEFAULT_POS: Pos = {x: 0, y: 0}

export interface Size {
    width: number;
    height: number;
}

export interface Rect extends Size {
    left: number;
    top: number;
};
export const DEFAULT_RECT: Rect = {
    left: DEFAULT_POS.x,
    top: DEFAULT_POS.y,
    width: 137,
    height: 137
};

export type AppStage = 'HOME' | 'GRAPH';

export interface Node {
    uuid: string;
    text: string;
    rect: Rect,
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

export type MaybeElement = HTMLElement | null | undefined;