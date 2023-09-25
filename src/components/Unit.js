import React from 'react';
import { useDrag } from 'react-dnd';

const Unit = ({ championData }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'unit',
        item: championData,
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging()
        })
    }));

    const colours = ['#000000', '#909994', '#12a339', '#1e83e8', '#9b1ee8', '#c7c91a'] 

    return (
        <div
            ref={drag}
            className = "unit"
            style={{
                opacity: isDragging ? 0.5 : 1,
                cursor: 'move',
                height: '60px',
                width: '60px',
                backgroundImage: `url(https://raw.communitydragon.org/latest/game/${championData.img})`,
                backgroundSize: 'cover',
                borderColor: colours[championData.cost],
                borderStyle: 'solid',
                borderWidth: '3px'
            }}
            alt={championData.name} 
        >
            <div className='unit-name'>
                {championData.name}
            </div>
            <div 
                className = 'unit-cost'
                style={{
                    backgroundColor: colours[championData.cost],
                    position: 'absolute',
                    zIndex: 300,
                    width: '25%',
                    right: '0px',
                    top: '-2px'
                }}
            >
                {`${(championData.cost !== 0)? `$${championData.cost}` : ''}`}
            </div>
        </div>
    );
}

export default Unit;