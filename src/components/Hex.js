import React, { useState } from 'react';
import { useDrop, useDrag} from 'react-dnd';
import { colours, baseUrl} from '../scripts/constants.js'

const Hex = ({content, onDrop, removeItem, removeUnit, row, column}) => {
    const [counter, setCounter] = useState(content);

    const [{ isOver }, drop] = useDrop(() => ({
        accept: ['unit', 'item', 'hex'], 
        drop: (dropped) => {
            setCounter((count) => count + 1)
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
            <div 
                className='hex'
                ref={drag}
                style={(content.champData !== null)? { 
                    backgroundColor: colours[content.champData.cost],
                }: {}}
            >
                <div
                    className = {`hex-unit ${(isOver)? 'blue' : ''}`}
                    onContextMenu={(e) => {
                        e.preventDefault();
                        removeUnit(row,column)
                    }}
                    ref={drop}
                    style={(content.champData !== null)? { 
                        backgroundImage: `url(${baseUrl + content.champData.img})`,
                        backgroundSize: '135%',
                        backgroundPosition: '100% 0%',
                        backgroundRepeat: 'no-repeat',
                    }: {}}
                >
                </div>
            </div>
            <div className="hex-items">
                {content.itemData.map((item, i) => (
                    <img
                        alt={item.name}
                        key={i}
                        src={`${baseUrl + item.img}`}
                        onContextMenu={(e) => {
                            e.preventDefault()
                            removeItem(item.name, row, column)
                        }}
                        style={{ 
                            height: '16px',
                            width: '16px',
                            borderWidth: '1px',
                            borderColor: 'black',
                            borderStyle: 'solid'
                        }}
                    ></img>
                ))}
            </div>
        </span>
    );
}

export default Hex;