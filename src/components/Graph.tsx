
import React from 'react';
import {AppContext} from '../AppState';
import * as Types from '../types/types';

interface IGraphProps {
    graph: Types.Graph;
}

const Graph: React.FC<IGraphProps> = (props: IGraphProps) => {
    const {dispatch} = React.useContext(AppContext);

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
        </div>
    );
};
export default Graph;