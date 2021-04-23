import {Pos, Size} from './types/types';
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
    width: number | null | undefined;
    height: number | null | undefined;
}
// watches for resizing of element, returns new dims if so
const useResize = (
    ref: React.RefObject<HTMLElement>,
) => {
    const node: HTMLElement | null = ref.current; 
    const [state, setState] = React.useState<ResizeState>({
        width: null, 
        height: null,
    });
    const {width, height} = state;
    console.log(`initial hook state is ${width},${height}`);

    React.useEffect(() => {
        if (!node) {
            return;
        }
        let raf: any;
        const aframe_callback = () => {
            setState({
                width: node?.clientWidth,
                height: node?.clientHeight
            });
        };

        const handle_mutation = () => {
            raf = window.requestAnimationFrame(aframe_callback);
        };
        
        const observer = new MutationObserver(handle_mutation);
        observer.observe((node as Node), { attributes: true, childList: true, subtree: true });
        handle_mutation();

        return () => {
            window.cancelAnimationFrame(raf);
            observer.disconnect();
        }
    }, [node]);

    console.log(`Hook returning w,h  ${width},${height}`);
    return [width, height];
}

export {useDrag, useResize};