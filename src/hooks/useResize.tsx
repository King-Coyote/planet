import React from 'react';
import {Pos, Rect, MaybeElement, Size} from '../types/types';

interface ResizeState {
    is_resizing: boolean;
    client_origin: Pos;
    origin_size: Size;
};
interface ResizeHooks {
    size: Size;
    handleMouseDown: (e: React.MouseEvent<HTMLElement>) => void,
    is_resizing: boolean;
};
const useResize = (transformable: MaybeElement, initial_rect: Rect): ResizeHooks => {
    const [size, setSize] = React.useState<Size>({width: initial_rect.width, height: initial_rect.height});
    const [state, setState] = React.useState<ResizeState>({
        is_resizing: false,
        client_origin: {x: 0, y: 0},
        origin_size: size,
    });
    const {is_resizing, client_origin, origin_size} = state;

    let bb: any;

    bb = transformable?.getBoundingClientRect();

    const handleMouseDown = React.useCallback((e: React.MouseEvent<HTMLElement>) => {
        if (!transformable) {
            return;
        }
        setState({
            ...state,
            is_resizing: true,
            client_origin: {x: e.clientX, y: e.clientY},
            origin_size: {width: bb.width, height: bb.height},
        });
    }, [bb]);

    const handleMouseUp = (e: MouseEvent) => {
        setState({
            ...state,
            is_resizing: false,
        });
    };

    const handleMouseMove = React.useCallback((e: MouseEvent) => {
        if (!transformable) {
            return;
        }
        const delta = {
            x: client_origin.x - e.clientX,
            y: client_origin.y - e.clientY
        };
        let new_size: Size = {
            width: origin_size.width - delta.x,
            height: origin_size.height - delta.y
        };
        setSize(new_size);
    }, [bb, size]);

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
        size: size,
        handleMouseDown: handleMouseDown,
        is_resizing: is_resizing,
    };
};

export default useResize;