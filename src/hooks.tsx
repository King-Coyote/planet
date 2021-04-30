import {Pos, Size, Rect} from './types/types';
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
    is_resizing: boolean;
    client_origin: Pos,
    origin_rect: Rect,
};
type MaybeRef = HTMLDivElement | null | undefined;
type UseResizeReturn = [Rect, (e: React.MouseEvent) => void, (ref: HTMLDivElement) => void]
const useResize = (
    direction: 'ne' | 'nw' | 'se' | 'sw'
): UseResizeReturn => {
    const [size, setSize] = React.useState<Size>({width: 0, height: 0});
    const [state, setState] = React.useState<ResizeState>({
        is_resizing: false,
        client_origin: {x: 0, y: 0},
        origin_rect: {left: 0, top: 0, width: 0, height: 0},
    });
    const [rect, setRect] = React.useState<Rect>({left: 0, top: 0, width: 0, height: 0});
    let current: HTMLDivElement | null = null;
    const ref = React.useCallback((ref: HTMLDivElement) => {
        current = ref;
    }, [current]);

    if (current)
        console.log(`current is ${current}`)

    const {is_resizing, client_origin, origin_rect} = state;

    const handleMouseDown = React.useCallback((e: React.MouseEvent) => {
        if (!current) {
            return;
        }
        setState({
            ...state,
            client_origin: {x: e.clientX, y: e.clientY},
            origin_rect: current.getBoundingClientRect(),
            is_resizing: true,
        });
        console.log(`mouse down at ${e.clientX}, ${e.clientY}`);
    }, [current]);

    const handleMouseUp = (e: MouseEvent) => {
        setState({
            ...state,
            is_resizing: false,
        });
        console.log('mouse up');
    };

    const handleMouseMove = React.useCallback((e: MouseEvent) => {
        if (!current) {
            return;
        }
        const delta = {
            x: client_origin.x - e.clientX,
            y: client_origin.y - e.clientY
        };
        // resize rect thus:
        // width and height + deltas.
        // ne: top -= delta.y, left same
        // nw: top -= delta.y, left -= delta.x
        // sw: top same, left -= delta.x
        // se: same same.
        let new_rect: Rect = {
            left: origin_rect.left,
            top: origin_rect.top,
            width: origin_rect.width - delta.x,
            height: origin_rect.height - delta.y
        }
        switch (direction) {
            case 'ne':
                new_rect = {
                    ...new_rect,
                    top: new_rect.top - delta.y
                };
                break;
            case 'nw':
                new_rect = {
                    ...new_rect,
                    left: new_rect.left - delta.x,
                    top: new_rect.top - delta.y
                };
                break;
            case 'sw':
                new_rect = {
                    ...new_rect,
                    left: new_rect.left - delta.x
                };
                break;
        }
        setRect(new_rect);
        console.log(`New rect is ${Object.values(new_rect).join(',')}`);
    }, [current]);

    React.useEffect(() => {
        if (is_resizing) {
            document.addEventListener('mouseup', handleMouseUp);
            document.addEventListener('mousemove', handleMouseMove);
        }
        return () => {
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('mousemove', handleMouseMove);
        };
    }, [is_resizing]);

    return [rect, handleMouseDown, ref];
};

interface TransformHooks {
    rect: Rect | undefined;
    draggable: any;
    resizable: any;
};
const useTransform = (): TransformHooks => {
    const [rect, setRect] = React.useState<Rect>();
    // use draggable, use resizable, resolve both here.
    const [resizeRect, handleMouseDownResize, resizeRef] = useResize('se');
    const {translation, last_translation, handleMouseDown} = useDrag({x: 0, y: 0});

    // resolve rect using these side effects
    React.useEffect(() => {
        setRect(resizeRect);
    }, [resizeRect]);

    const hooks: TransformHooks = {
        rect: rect,
        draggable: null,
        resizable: {
            //mouse down handlers and ref callbacks here
            handleMouseDown: handleMouseDownResize,
            ref: resizeRef
        },
    };

    return hooks;
};

export {useDrag, useResize, useTransform};

// interface ResizeState {
//     width: number | null | undefined;
//     height: number | null | undefined;
// }
// // watches for resizing of element, returns new dims if so
// const useResize = (
//     ref: React.RefObject<HTMLElement>,
// ) => {
//     const node: HTMLElement | null = ref.current; 
//     const [state, setState] = React.useState<ResizeState>({
//         width: null, 
//         height: null,
//     });
//     const {width, height} = state;
//     console.log(`initial hook state is ${width},${height}`);

//     React.useEffect(() => {
//         if (!node) {
//             return;
//         }
//         let raf: any;
//         const aframe_callback = () => {
//             setState({
//                 width: node?.clientWidth,
//                 height: node?.clientHeight
//             });
//         };

//         const handle_mutation = () => {
//             raf = window.requestAnimationFrame(aframe_callback);
//         };
        
//         const observer = new MutationObserver(handle_mutation);
//         observer.observe((node as Node), { attributes: true, childList: true, subtree: true });
//         handle_mutation();

//         return () => {
//             window.cancelAnimationFrame(raf);
//             observer.disconnect();
//         }
//     }, [node]);

//     console.log(`Hook returning w,h  ${width},${height}`);
//     return [width, height];
// }