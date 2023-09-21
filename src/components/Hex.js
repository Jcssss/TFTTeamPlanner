import React from 'react';
import { useDrop } from 'react-dnd';

const Hex = ({content, onDrop, onRightClick, row, column}) => {
    const ItemTypes = {
        UNIT: 'unit'
    }

    const [{ isOver }, drop] = useDrop(
        () => ({
            accept: ItemTypes.UNIT,
            drop: () => {
                onDrop(row, column)
            },
            collect: (monitor) => ({
                isOver: !!monitor.isOver()
            })
        }),
    )

    return (
        <div 
            className={`hex ${(isOver || content)? 'green' : 'black'}`}
            onContextMenu={(e) => {
                e.preventDefault();
                onRightClick(row,column)
            }}
            ref={drop}
        >
        </div>
    );
}

export default Hex;