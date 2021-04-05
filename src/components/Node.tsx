import React from 'react';
import { AppContext } from '../AppState';
import * as Types from '../types/types';

interface INodeProps {
    node: Types.Node;
}

const Node: React.FC<INodeProps> = (props: INodeProps) => {
    const [position, setPosition] = React.useState<Types.Pos>(props.node?.position);
    const [isDragging, setIsDragging] = React.useState(false);
    const [isEditing, setIsEditing] = React.useState(false);

    const textInput = React.useRef<HTMLDivElement>(null);

    const {dispatch} = React.useContext(AppContext);

    const handleChange = () => {
        
    }

    const handleSubmit = () => {

    }

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!isEditing)
            setIsDragging(true);
    }
    
    const handleMouseUp = (e: React.MouseEvent): void => {
        setIsDragging(false);
        dispatch({type: 'SET_NODE_POS', node_id: props.node.uuid, pos: position});
    }

    const handleDrag = (e: React.MouseEvent): void => {
        if (!isDragging || isEditing)
            return;
        const newPos = {
            x: position.x + e.movementX,
            y: position.y + e.movementY
        };
        setPosition(newPos);
    }

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
        return position
            ? `translate(${position.x}px, ${position.y}px)`
            : '';
    }

    return (
        <div 
            className="node" 
            // onMouseDown={handleMouseDown}
            // onMouseOut={handleMouseUp}
            // onMouseMove={handleDrag}
            // onMouseUp={handleMouseUp}
            onDoubleClick={handleDoubleClick}
            style={{transform: getTransform()}}
        >
            <div 
                className='node-dragbar'
            ></div>
            <div 
                className='node-editable'
                contentEditable
                ref={textInput}
            >

            </div>
            {/* <form>
                <textarea 
                    disabled={!isEditing} 
                    ref={textInput}
                    onBlur={handleBlur}
                >
                </textarea>
            </form> */}
        </div>
    );
};

export default Node;