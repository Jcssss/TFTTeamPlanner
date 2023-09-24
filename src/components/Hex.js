import React from 'react';
import { useDrop } from 'react-dnd';

const Hex = ({content, id, onDrop, onRightClick, row, column}) => {
    const ItemTypes = {
        UNIT: 'unit'
    }

    const [{ isOver }, drop] = useDrop(
        () => ({
            accept: ItemTypes.UNIT,
            drop: (item) => {
                onDrop(item.img, row, column)
            },
            collect: (monitor) => ({
                isOver: !!monitor.isOver()
            })
        }),
    )

    return (
        <div 
            className={`hex ${(isOver)? 'blue' : 'black'}`}
            onContextMenu={(e) => {
                e.preventDefault();
                onRightClick(row,column)
            }}
            id={id}
            ref={drop}
            style={{ 
                backgroundImage: `url(https://raw.communitydragon.org/latest/game/${content})`,
                backgroundSize: 'cover',
                backgroundPosition: '30% 60%',
                backgroundRepeat: 'no-repeat'
            }}
        >
        </div>
    );
}

export default Hex;