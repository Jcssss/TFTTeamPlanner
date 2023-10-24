import React from 'react';
import { useDrag } from 'react-dnd';
import { baseUrl } from '../scripts/constants.js';

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
            key={itemData.name}
            className = 'item'
            style={{
                opacity: isDragging ? 0.5 : 1,
                cursor: 'move',
                backgroundImage: `url(${baseUrl + itemData.img})`,
                backgroundSize: 'cover',
                borderStyle: 'solid',
                borderWidth: '3px'
            }}
            onClick = {() => console.log(itemData.apiName)}
            alt={itemData.name} 
        >
            <div className='item-name'>
                {itemData.name}
            </div>
        </div>
    );
}

export default Item;