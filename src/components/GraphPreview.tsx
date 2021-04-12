
// a small card with the name, maybe list of nodes,m and filled to some degree depending on progress

import React from 'react';
import { AppContext } from '../AppState';
import * as Types from '../types/types';

interface IGraphPreviewProps {
    graph: Types.Graph,
}

const GraphPreview: React.FC<IGraphPreviewProps> = (props: IGraphPreviewProps) => {
    const [position, setPosition] = React.useState<Types.Pos>({x: 0, y: 0});
    const [isDragging, setIsDragging] = React.useState(false);

    const {dispatch} = React.useContext(AppContext);

    const handleClick = (e: React.MouseEvent) => {
        dispatch({type: 'LOAD_GRAPH', graph_id: props.graph.uuid});
    }

    return (
        <div 
            className="graph-preview"
            onClick={handleClick}
        >
            <h1>{props.graph.name}</h1>
            <div className='graph-preview-window'></div>
        </div>
    );
};
export default GraphPreview;