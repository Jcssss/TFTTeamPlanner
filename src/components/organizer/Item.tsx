import React from 'react';
import { useDrag } from 'react-dnd';
import { baseUrl } from '../../general/constants';
import { ItemType } from '../../general/types';

type PropTypes = {
    itemData: ItemType
}

// An item image stored in the organizer
const Item = ({ itemData }: PropTypes) => {
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
            onClick={() => {
                console.log(itemData.apiName)
                console.log(itemData.incompatibleTraits)
                console.log(`${baseUrl + itemData.img}`)
            }}
        >
            <div className='item-name'>
                {itemData.name}
            </div>
        </div>
    );
}

export default Item;