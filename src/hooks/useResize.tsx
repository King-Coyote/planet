import React from 'react';
import {Pos, Rect, MaybeElement} from '../types/types';

type HandleStr = 'nw' | 'ne' | 'se' | 'sw';
interface ResizeState {
    is_resizing: boolean;
    resizing_direction: HandleStr;
    client_origin: Pos;
    origin_rect: Rect;
};
type ResizeHandleObject = {[name: string]: HTMLElement | null} | undefined;
interface ResizeHooks {
    rect: Rect;
    handler: (e: React.MouseEvent<HTMLElement>) => void,
    handles: ResizeHandleObject;
    is_resizing: boolean;
};
const resolve_handle = (handles: ResizeHandleObject | undefined, target: HTMLElement): HandleStr => {
    if (!handles)
        return 'se';
    if (target === handles.nw)
        return 'nw';
    if (target === handles.ne)
        return 'ne';
    if (target === handles.se)
        return 'se';
    if (target === handles.sw)
        return 'sw';
    throw new Error("Unresolved resize handle target!");
};
const useResize = (transformable: MaybeElement): ResizeHooks => {
    const [state, setState] = React.useState<ResizeState>({
        is_resizing: false,
        resizing_direction: 'se',
        client_origin: {x: 0, y: 0},
        origin_rect: {left: 0, top: 0, width: 0, height: 0},
    });
    const [rect, setRect] = React.useState<Rect>({left: 0, top: 0, width: 199, height: 199});
    
    let handles: ResizeHandleObject;
    const refNW = React.useCallback((ref: HTMLElement) => {
        if (handles)
            handles.nw = ref;
    }, [handles?.nw]);
    const refNE = React.useCallback((ref: HTMLElement) => {
        if (handles)
            handles.ne = ref;
    }, [handles?.ne]);
    const refSE = React.useCallback((ref: HTMLElement) => {
        if (handles)
            handles.se = ref;
    }, [handles?.se]);
    const refSW = React.useCallback((ref: HTMLElement) => {
        if (handles)
            handles.sw = ref;
    }, [handles?.sw]);

    const {is_resizing, client_origin, origin_rect} = state;

    const handleMouseDown = React.useCallback((e: React.MouseEvent<HTMLElement>) => {
        console.log(`Starting resize...`);
        if (!transformable) {
            return;
        }
        console.log(`... element found. Resizing.`);
        setState({
            ...state,
            is_resizing: true,
            resizing_direction: resolve_handle(handles, e.currentTarget),
            client_origin: {x: e.clientX, y: e.clientY},
            origin_rect: transformable.getBoundingClientRect(),
        });
    }, [transformable]);

    const handleMouseUp = (e: MouseEvent) => {
        console.log(`Finishing resize.`);
        setState({
            ...state,
            is_resizing: false,
        });
    };

    const handleMouseMove = React.useCallback((e: MouseEvent) => {
        console.log(`resolving resize mousemove...`);
        if (!transformable) {
            return;
        }
        const delta = {
            x: client_origin.x - e.clientX,
            y: client_origin.y - e.clientY
        };
        let new_rect: Rect = {
            left: origin_rect.left,
            top: origin_rect.top,
            width: origin_rect.width - delta.x,
            height: origin_rect.height - delta.y
        };
        console.log(`...Element found. New rect is:`);
        console.log(`${Object.entries(new_rect).map(e => `${e[0]}: ${e[1]}`).join(';')}`);
        switch (state.resizing_direction) {
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
    }, [transformable]);

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

    return {
        rect: rect,
        handler: handleMouseDown,
        handles: handles,
        is_resizing: is_resizing,
    };
};

export default useResize;