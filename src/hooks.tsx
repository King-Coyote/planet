import {Pos} from './types/types';
import * as React from 'react';

interface DragState {
    is_dragging: boolean;
    client_origin: Pos;
    translation: Pos;
    trans_origin: Pos;
}

const useDrag = (startPos: Pos) => {
    const [dragState, setDragState] = React.useState<DragState>({
        is_dragging: false,
        client_origin: {x: 0, y: 0},
        translation: startPos,
        trans_origin: startPos
    });

    const {is_dragging, translation, trans_origin} = dragState;

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!is_dragging) {
            setDragState({
                ...dragState,
                is_dragging: true,
                client_origin: {x: e.clientX, y: e.clientY}
            });
        }
    };

    const handleMouseMove = React.useCallback((e: MouseEvent) => {
        if (!is_dragging) {
            return;
        }
        const {client_origin, trans_origin} = dragState;
        setDragState({
            ...dragState,
            translation: {
                x: Math.abs(e.clientX - (client_origin.x - trans_origin.x)),
                y: Math.abs(e.clientY - (client_origin.y - trans_origin.y))
            }
        });
    }, [is_dragging]);

    const handleMouseUp = React.useCallback((e: MouseEvent) => {
        const {translation} = dragState;
        setDragState({
            ...dragState,
            is_dragging: false,
            trans_origin: {x: translation.x, y: translation.y}
        });
    }, [is_dragging, translation]);

    React.useEffect(() => {
        if (is_dragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [is_dragging, handleMouseUp, handleMouseMove]);

    return {
        translation,
        last_translation: trans_origin,
        handleMouseDown,
    };
}


interface ResizeState {
    running: boolean;
    width: number;
    height: number;
}
// watches for resizing of element, returns new dims if so
const useResize = (
    id: string, 
    on_resize: () => void,
    on_resize_end: () => void
) => {
    let has_mounted = !!document.getElementById(id);
    let element = document.getElementById(id) || document.body;
    const [state, setState] = React.useState<ResizeState>({
        running: false, 
        width: element.offsetWidth, 
        height: element.offsetHeight
    });
    const {running, width, height} = state;

    React.useEffect(() => {
        let raf: any;
        let timeout_id: any;
        const aframe_callback = () => {
            const {offsetWidth, offsetHeight} = element;
            on_resize();
            clearTimeout(timeout_id);
            timeout_id = setTimeout(on_resize_end, 500);
            setState({
                running: false,
                width: offsetWidth,
                height: offsetHeight
            });
        };

        const handle_mutation = () => {
            if (running) {
                return;
            }
            setState({
                ...state,
                running: true
            });
            raf = window.requestAnimationFrame(aframe_callback);
        };
        
        const observer = new MutationObserver(handle_mutation);
        observer.observe(element, { attributes: true, childList: true, subtree: true });
        handle_mutation();

        return () => {
            window.cancelAnimationFrame(raf);
            observer.disconnect();
        }
    }, []);

    return has_mounted ? [width, height] : [null, null];
}

export {useDrag, useResize};