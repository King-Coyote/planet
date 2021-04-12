import {Pos} from './types/types';
import * as React from 'react';

interface DragState {
    is_dragging: boolean;
    origin: Pos;
    translation: Pos;
    last_translation: Pos;
}

const useDrag = (startPos: Pos) => {
    const [dragState, setDragState] = React.useState<DragState>({
        is_dragging: false,
        origin: {x: 0, y: 0},
        translation: startPos,
        last_translation: startPos
    });

    const {is_dragging, translation} = dragState;

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!is_dragging) {
            setDragState({
                ...dragState,
                is_dragging: true,
                origin: {x: e.clientX, y: e.clientY}
            });
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!is_dragging) {
            return;
        }
        const {origin, last_translation} = dragState;
        setDragState({
            ...dragState,
            translation: {
                x: Math.abs(e.clientX - (origin.x + last_translation.x)),
                y: Math.abs(e.clientY - (origin.y + last_translation.y))
            }
        });
    }

    const handleMouseUp = (e: React.MouseEvent) => {
        if (!is_dragging) {
            return;
        }
        const {translation} = dragState;
        setDragState({
            ...dragState,
            is_dragging: false,
            last_translation: {x: translation.x, y: translation.y}
        });
    }

    return {
        translation,
        handleMouseUp,
        handleMouseMove,
        handleMouseDown,
    };
}

export {useDrag};