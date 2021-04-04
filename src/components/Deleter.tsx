import React from 'react';

interface IDeleterProps {
    display: boolean;
}

const Deleter: React.FC<IDeleterProps> = (props: IDeleterProps) => {
    return (
        <div className='deleter-outer' style={{display: props.display ? '' : 'none'}}>
            <div className='deleter'>
                <p>X</p>
            </div>
        </div>
    );
};
export default Deleter;