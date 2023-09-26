import React from 'react';
import { useDrop } from 'react-dnd';
import { colours, baseUrl } from '../scripts/constants.js'

const Hex = ({content, onDrop, onRightClick, row, column}) => {

    const [{ isOver }, drop] = useDrop(
        () => ({
            accept: ['unit', 'item'], 
            drop: (dropped) => {
                onDrop(dropped.type, dropped.data, row, column)
            },
            collect: (monitor) => ({
                isOver: !!monitor.isOver()
            })
        }),
    )

    return (
        <span className="hex-container">
            <div 
                id={row * 70 + column}
                className='hex'
                style={(content.champData !== null)? { 
                    backgroundColor: colours[content.champData.cost],
                }: {}}
            >
                <div
                    className = {`hex-unit ${(isOver)? 'blue' : ''}`}
                    onContextMenu={(e) => {
                        e.preventDefault();
                        onRightClick(row,column)
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
                        style={{ 
                            height: '16px',
                            width: '16px'
                        }}
                    ></img>
                ))}
            </div>
        </span>
    );
}

export default Hex;