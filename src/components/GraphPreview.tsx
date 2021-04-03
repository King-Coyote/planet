
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

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
    }
    
    const handleMouseUp = (e: React.MouseEvent): void => {
        setPosition({x: 0, y: 0});
        setIsDragging(false);
    }

    const handleDrag = (e: React.MouseEvent): void => {
        if (!isDragging)
            return;
        const newPos = {
            x: position.x + e.movementX,
            y: position.y + e.movementY
        };
        setPosition(newPos);
    }

    return (
        <div 
            className="graph-preview"
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleDrag}
            onMouseOut={handleMouseUp}
            style={{
                transform: isDragging ? `translate(${position.x}px, ${position.y}px)` : '',
                transition: isDragging ? '' : 'transform 0.15s ease-out 0s',
            }}
        >
        </div>
    );
};
export default GraphPreview;