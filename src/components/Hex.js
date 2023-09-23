import React from 'react';
import { useDrop } from 'react-dnd';

const Hex = ({content, id, onDrop, onRightClick, row, column}) => {
    const ItemTypes = {
        UNIT: 'unit'
    }

    const getImage = (imageName) => {
        if (imageName === '') {
            return 'none'
        }

        return `url(${require(`../assets/tft-champion/${content}`)})`
    };

    const [{ isOver }, drop] = useDrop(
        () => ({
            accept: ItemTypes.UNIT,
            drop: (item) => {
                onDrop(item.img, row, column)
            },
            collect: (monitor) => ({
                isOver: !!monitor.isOver()
            })
        }),
    )

    return (
        <div 
            className={`hex ${(isOver)? 'blue' : 'black'}`}
            onContextMenu={(e) => {
                e.preventDefault();
                onRightClick(row,column)
            }}
            id={id}
            ref={drop}
            style={{ 
                backgroundImage: getImage(content),
                backgroundPosition: '90% -10px;',
            }}
        >
        </div>
    );
}

export default Hex;