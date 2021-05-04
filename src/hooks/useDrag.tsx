import React from 'react';
import {Pos, MaybeElement, DEFAULT_POS, Rect} from '../types/types';

interface DragState {
    is_dragging: boolean;
    origin_client_pos: Pos;
    origin_element_pos: Pos;
};
type UseDragReturn = [Pos, (e: React.MouseEvent) => void, boolean];
const useDrag = (transformable: MaybeElement, initial_rect: Rect): UseDragReturn => {
    const [pos, setPos] = React.useState<Pos>({x: initial_rect.left, y: initial_rect.top});
    const [state, setState] = React.useState<DragState>({
        is_dragging: false,
        origin_client_pos: DEFAULT_POS,
        origin_element_pos: pos,
    });

    const {origin_client_pos, origin_element_pos, is_dragging} = state;

    const handleMouseDown = React.useCallback((e: React.MouseEvent) => {
        if (!transformable) {
            return;
        }
        const bb = transformable.getBoundingClientRect();
        setState({
            ...state,
            is_dragging: true,
            origin_client_pos: {x: e.clientX, y: e.clientY},
            origin_element_pos: {x: bb.left, y: bb.top},
        });
    }, [transformable]);

    const handleMouseUp = (e: MouseEvent) => {
        setState({
            ...state,
            is_dragging: false
        });
    };

    const handleMouseMove = React.useCallback((e: MouseEvent) => {
        if (!transformable) {
            return;
        }
        const delta = {
            x:  e.clientX - origin_client_pos.x,
            y:  e.clientY - origin_client_pos.y
        };
        setPos({
            x: origin_element_pos.x + delta.x,
            y: origin_element_pos.y + delta.y
        });
    }, [transformable, state]);

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