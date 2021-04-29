import React from 'react';
import {useResize} from '../hooks';

// wants to add drag handles to each corner, and resize children
const ResizableDiv: React.FC<any> = (props) => {
    const {
        className,
        ...rest
    } = props;
    const [handleMouseDown, rect, refSE] = useResize('se');
    return (
        <div 
            className={`resizable ${className}`}
            style={{
                ...props.style,
                width: `${rect.width}px`,
                height: `${rect.height}px`,
                top: `${rect.top}px`,
                left: `${rect.left}px`,
            }}
            {...rest}
        >
            <div className='resize-handle handle-tl' ></div>
            <div className='resize-handle handle-tr' ></div>
            <div className='resize-handle handle-br' onMouseDown={handleMouseDown} ref={refSE}></div>
            <div className='resize-handle handle-bl' ></div>
            {props.children}
        </div>
    );
};
export default ResizableDiv;