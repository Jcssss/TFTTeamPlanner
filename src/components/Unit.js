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
            }}
            alt={championData.name} 
            src={require(`../assets/tft-champion/${championData.img}`)}
        >
        </img>
    );
}

export default Unit;