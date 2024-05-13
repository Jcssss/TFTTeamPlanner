import React from 'react';
import { useDrag } from 'react-dnd';
import { colours, baseUrl } from '../../general/constants';
import { UnitType } from '../../general/types';

type PropTypes = {
    championData: UnitType,
    onUnitClick: Function,
}

// A unit image that can be dragged
const Unit = ({ 
    championData, onUnitClick 
}: PropTypes) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'unit',
        item: { 'type': 'unit', 'data': championData },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging()
        })
    }));

    return (
        <div
            ref={drag}
            className = "unit"
            style={{
                opacity: isDragging ? 0.5 : 1,
                cursor: 'move',
                backgroundImage: `url(${baseUrl + championData.img})`,
                backgroundSize: '120%',
                backgroundPosition: '100% 0%',
                borderColor: colours[championData.cost],
                borderStyle: 'solid',
                borderWidth: '3px'
            }}
            onClick={() => {
                console.log(championData.name)
                onUnitClick(championData)
            }}
        >
            <div className='unit-name'>
                {championData.name}
            </div>
            {/* <div 
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
            </div> */}
        </div>
    );
}

export default Unit;