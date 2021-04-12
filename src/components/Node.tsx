import React, { useEffect } from 'react';
import { AppContext } from '../AppState';
import * as Types from '../types/types';
import DragBar from './DragBar';
import {useDrag} from '../hooks';

interface INodeProps {
    node: Types.Node;
}

const Node: React.FC<INodeProps> = (props: INodeProps) => {
    const [isEditing, setIsEditing] = React.useState(false);
    const {
        translation,
        handleMouseUp,
        handleMouseMove,
        handleMouseDown,
    } = useDrag({x: 0, y: 0});

    const textInput = React.useRef<HTMLDivElement>(null);

    const {dispatch} = React.useContext(AppContext);

    const handleChange = () => {
        
    }

    const handleSubmit = () => {

    }

    // React.useEffect(() => {
    //     console.log(`position changed to ${position.y},${position.y}`);
    // }, [position]);

    // const handleDrag = (delta: Types.Pos): void => {
    //     const newPos = {
    //         x: position.x - delta.x,
    //         y: position.y - delta.y
    //     };
    //     setPosition(newPos);
    // }

    // const handleDragStop = React.useCallback((e: MouseEvent) => {
    //     console.log(`saving pos: ${position.x},${position.y}`);
    //     dispatch({type: 'SET_NODE_POS', node_id: props.node.uuid, position: position});
    // }, [position]);

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
            onDoubleClick={handleDoubleClick}
            style={{transform: getTransform()}}
        >
            <div 
                className='dragbar'
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseMove}
                onMouseUp={handleMouseUp}
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