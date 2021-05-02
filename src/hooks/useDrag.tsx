import React from 'react';
import {Pos, MaybeElement, DEFAULT_POS} from '../types/types';

interface DragState {
    is_dragging: boolean;
    origin_pos: Pos;
};
type UseDragReturn = [Pos, (e: React.MouseEvent) => void, boolean];
const useDrag = (transformable: MaybeElement): UseDragReturn => {
    const [pos, setPos] = React.useState<Pos>({x: 0, y: 0});
    const [state, setState] = React.useState<DragState>({
        is_dragging: false,
        origin_pos: DEFAULT_POS,
    });

    const {origin_pos, is_dragging} = state;

    const handleMouseDown = React.useCallback((e: React.MouseEvent) => {
        console.log('mouse down for drag...');
        if (!transformable) {
            return;
        }
        console.log('... node found. Starting drag state');
        setState({
            ...state,
            is_dragging: true,
            origin_pos: {x: e.clientX, y: e.clientY},
        });
    }, [transformable]);

    const handleMouseUp = (e: MouseEvent) => {
        console.log(`stopping drag.`);
        setState({
            ...state,
            is_dragging: false
        });
    };

    const handleMouseMove = React.useCallback((e: MouseEvent) => {
        console.log(`starting drag move at ${state.origin_pos.x},${state.origin_pos.y}...`);
        if (!transformable) {
            return;
        }
        const delta = {
            x:  e.clientX - origin_pos.x,
            y:  e.clientY - origin_pos.y
        };
        console.log(`... node found: dragging with delta ${delta.x},${delta.y}.`);
        setPos({
            x: pos.x + delta.x,
            y: pos.y + delta.y
        });
    }, [transformable]);

    React.useEffect(() => {
        if (is_dragging) {
            document.addEventListener('mouseup', handleMouseUp);
            document.addEventListener('mousemove', handleMouseMove);
        }
        return () => {
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('mousemove', handleMouseMove);
        };
    }, [is_dragging]);

    return [pos, handleMouseDown, is_dragging];
};

export default useDrag;