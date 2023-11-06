import React from 'react';
import { useDrag } from 'react-dnd';
import { baseUrl } from '../scripts/constants.js';

// An item image stored in the organizer
const Item = ({ itemData }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'item',
        item: { 'type': 'item', 'data': itemData },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging()
        })
    }));

    return (
        <div
            ref={drag}
            className = 'item'
            style={{
                opacity: isDragging ? 0.5 : 1,
                cursor: 'move',
                backgroundImage: `url(${baseUrl + itemData.img})`,
                backgroundSize: 'cover',
                borderStyle: 'solid',
                borderWidth: '3px'
            }}
            alt={itemData.name} 
        >
            <div className='item-name'>
                {itemData.name}
            </div>
        </div>
    );
}

export default Item;