import React, { useEffect, useLayoutEffect } from 'react';
import { AppContext } from '../AppState';
import * as Types from '../types/types';
import {Size} from '../types/types';
import {useDrag, useResize} from '../hooks';

interface INodeProps {
    node: Types.Node;
}

const PADDING_PX: number = 7;

const get_dim_for_css = (dim: number | null | undefined): string => {
    return dim ? `${dim - PADDING_PX * 2}px` : '';
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
                padding: `${PADDING_PX}px`,
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