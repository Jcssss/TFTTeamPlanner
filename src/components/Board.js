import React from 'react';
import Hex from './Hex.js';

const Board = ({ boardState, onDrop, removeUnit, removeItem }) => {
    return (
        <div className='board'>
            <div className="container">
                {boardState.map((arr, i) => (
                    <div className="row" id={i}>
                        {arr.map((hexData, j) => {
                            return (<Hex 
                                content={hexData} 
                                onDrop={onDrop}
                                removeUnit={removeUnit}
                                removeItem={removeItem}
                                row={i}
                                column={j}
                            />)
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Board;