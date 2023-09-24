import React from 'react';
import { useDrag } from 'react-dnd';

const Unit = ({ championData }) => {
    const ItemTypes = {
        UNIT: 'unit'
    }

    const [{ isDragging }, drag] = useDrag(() => ({
        type: ItemTypes.UNIT,
        item: championData,
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging()
        })
    }));

    return (
        <img 
            ref={drag}
            style={{
                opacity: isDragging ? 0.5 : 1,
                fontSize: 25,
                fontWeight: 'bold',
                cursor: 'move',
                height: '50px',
                width: '50px'
            }}
            alt={championData.name} 
            src={`https://raw.communitydragon.org/latest/game/${championData.img}`}
        >
        </img>
    );
}

export default Unit;