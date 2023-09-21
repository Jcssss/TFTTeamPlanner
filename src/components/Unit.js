import React from 'react';
import { useDrag } from 'react-dnd';

const Unit = () => {
    const ItemTypes = {
        UNIT: 'unit'
    }

    const [{ isDragging }, drag] = useDrag(() => ({
        type: ItemTypes.UNIT,
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
            alt="Augment" 
            src={require(`../assets/tft-augment/100-Duck-Sized-Horses-III.TFT_Set9.png`)}
        >
        </img>
    );
}

export default Unit;