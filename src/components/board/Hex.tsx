import React, { useState } from 'react';
import { useDrop, useDrag} from 'react-dnd';
import { colours, baseUrl} from '../../general/constants';
import { ItemType, HexType, DnDType} from '../../general/types';

type PropTypes = {
    content: HexType,
    onDrop: Function,
    removeItem: Function,
    removeUnit: Function,
    row: number,
    column: number,
}

// A hex on the board where users can place items and units
const Hex = ({
    content, onDrop, removeItem, removeUnit, row, column
}: PropTypes) => {
    const [counter, setCounter] = useState(0);

    const [{ isOver }, drop] = useDrop(() => ({
        accept: ['unit', 'item', 'hex'], 
        drop: (dropped: DnDType): void => {
            setCounter((count: number): number => count + 1)
            onDrop(dropped.type, dropped.data, row, column)
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver()
        })
    }));

    const [, drag] = useDrag(() => ({
        type: 'hex',
        item: { 
            'type': 'hex',
            'data': {
                'row': row,
                'column': column,
                'champData': {...content.champData},
                'itemData': [...content.itemData],
                'img': (content.champData)? content.champData.img : ''
            }
        },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging()
        })
    }), [counter]);

    return (
        <span className="hex-container">
            {/* The border for the hex */}
            <div 
                className='hex'
                ref={drag}
                style={(content.champData !== null)? { 
                    backgroundColor: colours[content.champData.cost],
                }: {}}
            >
                {/* The main image for the hex */}
                <div
                    className = {`hex-unit ${(isOver)? 'hovered' : ''}`}
                    ref={drop}
                    onContextMenu={(e) => {
                        e.preventDefault();
                        removeUnit(row,column)
                    }}
                    onClick={() => removeUnit(row,column)}
                    style={(content.champData !== null)? { 
                        backgroundImage: `url(${baseUrl + content.champData.img})`,
                        backgroundSize: '135%',
                        backgroundPosition: '100% 0%',
                        backgroundRepeat: 'no-repeat',
                    }: {}}
                >
                </div>
            </div>
            {/* The item images for the hex */}
            <div className="hex-items-container">
                {content.itemData.map((item: ItemType, i: number) => (
                    item && <img
                        className='hex-items'
                        alt={item.name}
                        key={i}
                        src={`${baseUrl + item.img}`}
                        onContextMenu={(e) => {
                            e.preventDefault()
                            removeItem(item.name, row, column)
                        }}
                        onClick={() => {
                            removeItem(item.name, row, column)
                        }}
                    ></img>
                ))}
            </div>
        </span>
    );
}

export default Hex;