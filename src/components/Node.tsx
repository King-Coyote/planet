import React from 'react';
import { AppContext } from '../AppState';
import * as Types from '../types/types';
import useTransform from '../hooks/useTransform';
import ContextMenu from './ContextMenu';

interface INodeProps {
    node: Types.Node;
}

const Node: React.FC<INodeProps> = (props: INodeProps) => {
    const {dispatch} = React.useContext(AppContext);
    const [isEditing, setIsEditing] = React.useState(false);
    
    const transformable = React.useRef<HTMLDivElement>(null);
    const transform = useTransform(transformable, props.node.rect);
    const rect = transform.rect;

    let rectTimeoutId: any;
    React.useEffect(() => {
        rectTimeoutId = setTimeout(() => {
            dispatch({type: 'SET_NODE_RECT', node_id: props.node.uuid, rect: rect});
        }, 300);
        return () => clearTimeout(rectTimeoutId);
    }, [rect]);

    const textInput = React.useRef<HTMLDivElement>(null);

    const [contextMenuState, setContextMenuState] = React.useState<any>({
        is_open: false,
        pos: {x: 0, y: 0}
    });
    const handleBlurContextMenu = () => {
        setContextMenuState({
            ...contextMenuState,
            is_open: false
        });
    };
    const renderContextMenu = React.useCallback(() => {
        if (!contextMenuState.is_open) {
            return null;
        }
        return (
            <ContextMenu 
                pos={contextMenuState.pos}
                handleBlur={handleBlurContextMenu}
                items={[
                    {
                        label: 'Make subgraph', 
                        on_click: () => console.log('surr')
                    },
                    {
                        label: 'Delete',
                        on_click: () => dispatch({type: 'DELETE_NODE', node_id: props.node.uuid})
                    },
                ]}
            />
        );
    }, [contextMenuState]);

    const handleDoubleClick = (e: React.MouseEvent): void => {
        setIsEditing(true);

        // setTimeout(() => {
        //     if (textInput && textInput.current) {
        //         textInput.current.focus();
        //         const end = textInput.current.textLength;
        //         textInput.current.setSelectionRange(end, end);
        //     }
        // }, 0);
    };

    const handleContextMenu = (e: React.MouseEvent): void => {
        e.stopPropagation();
        e.preventDefault();
        console.log(`Opened cm on node with id ${props.node.uuid}`);
        setContextMenuState({
            is_open: true,
            pos: {x: e.clientX, y: e.clientY},
        });
    };

    const handleBlur = (e: React.FocusEvent): void => {
        setIsEditing(false);
    };

    return (
        <div
            className="node" 
            id={props.node.uuid}
            onDoubleClick={handleDoubleClick}
            onContextMenu={handleContextMenu}
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
                className='resize-handle handle-se' 
                onMouseDown={transform.resizable.handler}
            ></div>
            {renderContextMenu()}
        </div>
    );
};

export default Node;