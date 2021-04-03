import React from 'react';
import * as Types from '../types/types';

interface INodeProps {
}

const Node: React.FC<INodeProps> = (props: INodeProps) => {
    const [text, setText] = React.useState('');
    const [position, setPosition] = React.useState<Types.Pos>({x: 0, y: 0});
    const [isDragging, setIsDragging] = React.useState(false);
    const [isEditing, setIsEditing] = React.useState(false);

    const textInput = React.useRef<HTMLTextAreaElement>(null);

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

        setTimeout(() => {
            if (textInput && textInput.current) {
                textInput.current.focus();
                const end = textInput.current.textLength;
                textInput.current.setSelectionRange(end, end);
            }
        }, 0);
    }

    const handleBlur = (e: React.FocusEvent): void => {
        setIsEditing(false);
    }

    return (
        <div 
            className="node" 
            onMouseDown={handleMouseDown}
            onMouseOut={handleMouseUp}
            onMouseMove={handleDrag}
            onMouseUp={handleMouseUp}
            onDoubleClick={handleDoubleClick}
            style={{transform: `translate(${position.x}px, ${position.y}px)`}}
        >
            <form>
                <textarea 
                    disabled={!isEditing} 
                    ref={textInput}
                    onBlur={handleBlur}
                >
                </textarea>
            </form>
        </div>
    );
};

export default Node;