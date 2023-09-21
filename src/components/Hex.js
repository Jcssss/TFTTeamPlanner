import React from 'react';
import { useDrop } from 'react-dnd';

const Hex = ({content, onDrop, row, column}) => {
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
            className={`hex ${(isOver || !content)? 'green': 'black'}`}
            ref={drop}
        >
        </div>
    );
}

export default Hex;