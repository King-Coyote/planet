import React from 'react';
import {Pos} from '../types/types'

interface ContextMenuItem {
    label: string,
    on_click: () => void,
};

interface IContextMenuProps {
    pos: Pos;
    handleBlur: () => void;
    items: ContextMenuItem[];
}

const ContextMenu: React.FC<IContextMenuProps> = (props: IContextMenuProps) => {

    const handleClickInside = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    const handleBlur = () => {
        props.handleBlur();
    };

    React.useEffect(() => {
        window.addEventListener('click', handleBlur);
        return () => window.removeEventListener('click', handleBlur);
    }, []);

    return (
        <div 
            className='context-menu'
            onClick={handleClickInside}
            style={{
                left: props.pos.x,
                top: props.pos.y
            }}
        >
            {props.items.map(i => {
                return (
                    <div 
                        className='context-menu-item' 
                        onClick={() => {
                            i.on_click();
                            handleBlur();
                        }}
                    >
                        <p>{i.label}</p>
                    </div>
                );
            })}
        </div>
    );
};
export default ContextMenu;