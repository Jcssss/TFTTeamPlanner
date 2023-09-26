import React from 'react';
import Hex from './Hex.js';

const Board = ({ boardState, onDrop, onRightClick }) => {
    return (
        <div className='board'>
            <div className="container">
                {boardState.map((arr, i) => (
                    <div className="row" id={i}>
                        {arr.map((hexData, j) => {
                            return (<Hex 
                                content={hexData} 
                                onDrop={onDrop}
                                onRightClick={onRightClick}
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