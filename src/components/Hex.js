import React from 'react';
import { useDrop } from 'react-dnd';

const Hex = ({content, onDrop, onRightClick, row, column}) => {

    const [{ isOver }, drop] = useDrop(
        () => ({
            accept: ['unit', 'item'], 
            drop: (dropped) => {
                onDrop(dropped.type, dropped.data.img, row, column)
            },
            collect: (monitor) => ({
                isOver: !!monitor.isOver()
            })
        }),
    )

    return (
        <div 
            id={row * 70 + column}
            className={`hex ${(isOver)? 'blue' : 'black'}`}
            onContextMenu={(e) => {
                e.preventDefault();
                onRightClick(row,column)
            }}
            ref={drop}
            style={{ 
                backgroundImage: `url(https://raw.communitydragon.org/latest/game/${content.champImg})`,
                backgroundSize: 'cover',
                backgroundPosition: '30% 60%',
                backgroundRepeat: 'no-repeat'
            }}
        >
        </div>
    );
}

export default Hex;