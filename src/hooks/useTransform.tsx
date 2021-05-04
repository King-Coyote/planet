import React from 'react';
import {Rect, Pos, MaybeElement, DEFAULT_RECT} from '../types/types';
import useResize from './useResize';
import useDrag from './useDrag';

interface TransformHooks {
    rect: Rect;
    drag_handler: (e: React.MouseEvent) => void;
    resizable: any;
};
const useTransform = (transformable: React.RefObject<HTMLElement>, initial_rect: Rect): TransformHooks => {
    const [rect, setRect] = React.useState<Rect>(initial_rect ?? DEFAULT_RECT);

    const resizeHooks = useResize(transformable.current, initial_rect);
    const [dragPos, handleMouseDownDrag, isDragging] = useDrag(transformable.current, initial_rect);

    // resolve rect using these side effects
    React.useEffect(() => {
        setRect({
            ...resizeHooks.size,
            left: dragPos.x,
            top: dragPos.y
        });
    }, [resizeHooks.size, dragPos]);
    
    // React.useEffect(() => {
    //     setRect({
    //         ...rect,
    //         left: dragPos.x,
    //         top: dragPos.y
    //     });
    // }, [resizeHooks.rect, dragPos]);

    const hooks: TransformHooks = {
        rect: rect,
        drag_handler: handleMouseDownDrag,
        resizable: {
            handler: resizeHooks.handleMouseDown,
            handles: resizeHooks.handle,
        },
    };

    return hooks;
};

export default useTransform;