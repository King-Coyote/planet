
import React from 'react';
import {AppContext} from '../AppState';
import * as Types from '../types/types';
import Node from './Node';

interface IGraphProps {
    graph: Types.Graph;
}

const Graph: React.FC<IGraphProps> = (props: IGraphProps) => {
    const {dispatch, nodes} = React.useContext(AppContext);

    const handleBlur = (e: React.FormEvent) => {
        const new_name = e.currentTarget.innerHTML;
        dispatch({type: 'RENAME_GRAPH', graph_id: props.graph.uuid, name: new_name});
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key !== 'Enter') {
            return;
        }
        (e.currentTarget as HTMLElement).blur();
    }

    const handleRightClickWorkArea = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const pos: Types.Pos = {x: e.clientX, y: e.clientY};
        dispatch({type: 'NEW_NODE', position: pos, graph_id: props.graph.uuid});
    }

    const get_nodes = () => {
        return props.graph.nodes.map(n => {
            const node = nodes[n];
            return (
                <Node node={node}/>
            );
        });
    }

    return (
        <div className='graph'>
            <h1 
                contentEditable 
                onBlur={handleBlur}
                onKeyDown={handleKeyPress}
                suppressContentEditableWarning={true}
                spellCheck={false}
            >
                {props.graph.name}
            </h1>
            <div className='graph-workarea' onContextMenu={handleRightClickWorkArea}>
                {get_nodes()}
            </div>
        </div>
    );
};
export default Graph;