import React, { useEffect, useLayoutEffect } from 'react';
import { AppContext } from '../AppState';
import * as Types from '../types/types';
import {useDrag, useResize} from '../hooks';

interface INodeProps {
    node: Types.Node;
}

const Node: React.FC<INodeProps> = (props: INodeProps) => {
    const {dispatch} = React.useContext(AppContext);
    const [isEditing, setIsEditing] = React.useState(false);
    const {
        translation,
        last_translation,
        handleMouseDown,
    } = useDrag(props.node.position);

    const textInput = React.useRef<HTMLDivElement>(null);
    const nodeRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        dispatch({type: 'SET_NODE_POS', node_id: props.node.uuid, position: last_translation});
    }, [last_translation]);

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

    const [width, height] = useResize(nodeRef);

    let timeout_id: any;
    React.useEffect(() => {
        timeout_id = setTimeout(() => {
            dispatch({type: 'SET_NODE_SIZE', node_id: props.node.uuid, width: width, height: height});
        }, 200);
        return () => clearTimeout(timeout_id);
    }, [width, height]);

    React.useEffect(() => {
        if (!nodeRef?.current)
            return;
        nodeRef.current.style.width = `${props.node.size.width}px`;
        nodeRef.current.style.height = `${props.node.size.height}px`;
    }, [nodeRef]);

    const getTransform = (): string => {
        return translation
            ? `translate(${translation.x}px, ${translation.y}px)`
            : '';
    }

    return (
        <div 
            className="node" 
            id={props.node.uuid} 
            onDoubleClick={handleDoubleClick}
            style={{
                transform: getTransform(),
            }}
            ref={nodeRef}
        >
            <div 
                className='dragbar'
                onMouseDown={handleMouseDown}
            ></div>
            <div 
                className='node-editable'
                contentEditable
                ref={textInput}
            ></div>
        </div>
    );
};

export default Node;