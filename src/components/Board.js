import React from 'react';
import Hex from './Hex.js';

const Board = ({boardState, onDrop}) => {
    return (
        <div className='board'>
            <div className="container">
                {
                    boardState.map((arr, i) => (
                        <div className="row" id={i}>
                            {arr.map((item, j) => (
                                <Hex 
                                    content={item} 
                                    id={j} 
                                    onDrop={onDrop}
                                    row={i}
                                    column={j}
                                />
                            ))}
                        </div>
                    ))
                }
            </div>
        </div>
    );
}

export default Board;