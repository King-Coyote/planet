import React, { useEffect, useLayoutEffect } from 'react';
import { AppContext } from '../AppState';
import * as Types from '../types/types';
import {Size} from '../types/types';
import useTransform from '../hooks/useTransform';

interface INodeProps {
    node: Types.Node;
}

const Node: React.FC<INodeProps> = (props: INodeProps) => {
    const {dispatch} = React.useContext(AppContext);
    const [isEditing, setIsEditing] = React.useState(false);
    
    const transformable = React.useRef<HTMLDivElement>(null);
    const transform = useTransform(transformable);
    const rect = transform.rect ?? Types.DEFAULT_RECT;

    const textInput = React.useRef<HTMLDivElement>(null);

    // React.useEffect(() => {
    //     dispatch({type: 'SET_NODE_POS', node_id: props.node.uuid, position: last_translation});
    // }, [last_translation]);

    const handleDoubleClick = (e: React.MouseEvent): void => {
        setIsEditing(true);

        // setTimeout(() => {
        //     if (textInput && textInput.current) {
        //         textInput.current.focus();
        //         const end = textInput.current.textLength;
        //         textInput.current.setSelectionRange(end, end);
        //     }
        // }, 0);
    }

    const handleBlur = (e: React.FocusEvent): void => {
        setIsEditing(false);
    }

    return (
        <div
            className="node" 
            id={props.node.uuid}
            onDoubleClick={handleDoubleClick}
            ref={transformable}
            style={{
                top: rect.top,
                left: rect.left,
                width: rect.width,
                height: rect.height,
            }}
        >
            <div 
                className='dragbar'
                onMouseDown={transform.drag_handler}
            ></div>
            <div 
                className='node-editable'
                contentEditable
                ref={textInput}
            ></div>
            <div></div>
            <div 
                className='resize-handle handle-nw' 
                ref={transform.resizable.handles?.nw}
                onMouseDown={transform.resizable.handler}
            ></div>
            <div 
                className='resize-handle handle-ne' 
                ref={transform.resizable.handles?.ne}
                onMouseDown={transform.resizable.handler}
            ></div>
            <div 
                className='resize-handle handle-se' 
                ref={transform.resizable.handles?.se}
                onMouseDown={transform.resizable.handler}
            ></div>
            <div 
                className='resize-handle handle-sw' 
                ref={transform.resizable.handles?.sw}
                onMouseDown={transform.resizable.handler}
            ></div>
        </div>
    );
};

export default Node;