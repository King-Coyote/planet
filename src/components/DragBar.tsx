
import React from 'react';
import {Pos} from '../types/types';

interface IDragBarProps {
    handleDrag: (delta: Pos) => void;
    handleDragStop: (e: MouseEvent) => void;
}

const DragBar: React.FC<IDragBarProps> = (props: IDragBarProps) => {
    const [isHovered, setIsHovered] = React.useState(false);
    const [isDragging, setIsDragging] = React.useState(false);
    const [lastClientPos, setLastClientPos] = React.useState({x:0, y:0});

    React.useEffect(() => {
        const mouse_up = (e: MouseEvent) => {
            setIsDragging(false);
            props.handleDragStop(e);
        };
        const mouse_move = (e: MouseEvent) => {
            const delta: Pos = {
                x: lastClientPos.x - e.clientX,
                y: lastClientPos.y - e.clientY
            };
            setLastClientPos({x: e.clientX, y: e.clientY});
            props.handleDrag(delta);
        }
        const on_drag_stop = () => {
            window.removeEventListener('mousemove', mouse_move);
            window.removeEventListener('mouseup', mouse_up);
        };
        if (isDragging) {
            window.addEventListener('mousemove', mouse_move);
            window.addEventListener('mouseup', mouse_up);
        } else {
            on_drag_stop();
        }
        return on_drag_stop;
    }, [isDragging]);

    const handleMouseEnter = (e: React.MouseEvent) => {
        setIsHovered(true);
    }

    const handleMouseOut = (e: React.MouseEvent) => {
        setIsHovered(false);
    }

    const handleMouseDown = (e: React.MouseEvent) => {
        e.stopPropagation();
        setLastClientPos({x: e.clientX, y: e.clientY});
        setIsDragging(true);
    }

    return (
        <div
            className='dragbar'
            onMouseEnter={handleMouseEnter}
            onMouseOut={handleMouseOut}
            onMouseDown={handleMouseDown}
            style={{height: isHovered ? '5px' : ''}}
        >
        </div>
    );
};
export default DragBar;