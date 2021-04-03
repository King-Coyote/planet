
// grid showing all the different graphs

import React from 'react';
import { AppContext } from '../AppState';
import GraphPreview from './GraphPreview';
import GraphAddButton from './GraphAddButton';
import * as Types from '../types/types';
import './GraphPreview.scss';

interface IGraphGridProps {
}

const GraphGrid: React.FC<IGraphGridProps> = (props: IGraphGridProps) => {
    const {graphs} = React.useContext(AppContext);

    return (
        <div 
            className='graph-grid'
        >
            {graphs.map(g => {
                return <GraphPreview 
                    graph={g}
                />
            })}
            <GraphAddButton />
        </div>
    );
};
export default GraphGrid;