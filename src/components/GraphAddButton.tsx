
// a small card with the name, maybe list of nodes,m and filled to some degree depending on progress

import { AppContext } from '../AppState';
import * as Types from '../types/types';

import React from 'react';

interface IGraphAddButtonProps {
}

const GraphAddButton: React.FC<IGraphAddButtonProps> = (props: IGraphAddButtonProps) => {
    const {dispatch} = React.useContext(AppContext);
    
    const handleOnClick = (e: React.MouseEvent) => {
        dispatch({type: 'NEW_GRAPH', name: ''});
    }

    return (
        <div 
            className="graph-preview graph-add-button"
            onClick={handleOnClick}
        >
            <p>+</p>
        </div>
    );
};
export default GraphAddButton;