import React, { useEffect } from 'react';
import { AppContext } from '../AppState';
import * as Types from '../types/types';
import DragBar from './DragBar';

interface INodeProps {
    node: Types.Node;
}

const Node: React.FC<INodeProps> = (props: INodeProps) => {
    const [position, setPosition] = React.useState<Types.Pos>(props.node?.position);
    const [isEditing, setIsEditing] = React.useState(false);

    const textInput = React.useRef<HTMLDivElement>(null);

    const {dispatch} = React.useContext(AppContext);

    const handleChange = () => {
        
    }

    const handleSubmit = () => {

    }

    const handleDrag = (delta: Types.Pos): void => {
        const newPos = {
            x: position.x - delta.x,
            y: position.y - delta.y
        };
        setPosition(newPos);
    }

    const handleDragStop = (e: MouseEvent) => {
        dispatch({type: 'SET_NODE_POS', node_id: props.node.uuid, position: position});
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
        if (!position) {
            console.log('shit aint found capn');
        }
        return position
            ? `translate(${position.x}px, ${position.y}px)`
            : '';
    }

    return (
        <div 
            className="node" 
            onDoubleClick={handleDoubleClick}
            style={{transform: getTransform()}}
        >
            <DragBar 
                handleDrag={handleDrag}
                handleDragStop={handleDragStop}
            />
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