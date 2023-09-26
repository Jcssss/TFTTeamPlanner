import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import Board from './components/Board.js';
import Unit from './components/Unit.js';
import Item from './components/Item.js';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { fetchItems, fetchUnits } from './scripts/ApiCommands.js';

//'https://raw.communitydragon.org/latest/game/assets/ux/tft/championsplashes/'
//'https://raw.communitydragon.org/latest/cdragon/tft/en_us.json'

function App() {
    const [, updateState] = useState();
    const [augments, setAugments] = useState([]);
    const [champions, setChampions] = useState([]);
    const [items, setItems] = useState([]);
    const [boardState, setBoardState] = useState([]);

    const forceUpdate = useCallback(() => updateState({}), []);

    // resets board
    useEffect(() => {
        var temp = Array(4);
        for (var i = 0; i < 4; i++) {
            temp[i] = Array(7)
            for (var j = 0; j < 7; j++) {
                temp[i][j] = { 'champData': null, 'itemData': [] };
            }
        }
        setBoardState(temp);
    }, []);

    // fetches and loads necessary data
    useEffect(() => {
        fetch('https://raw.communitydragon.org/latest/cdragon/tft/en_us.json')
            .then(res => res.json())
            .then(res => {
                setChampions(fetchUnits(res));
                setItems(fetchItems(res));
            });
    });

    const onRightClick = (row, column) => {
        var temp = boardState;
        temp[row][column].champData = null;
        temp[row][column].itemData = [];
        setBoardState(temp);
        forceUpdate();
    }

    const onDrop = (type, data, row, column) => {
        var temp = boardState;

        if (type === 'unit') {
            temp[row][column].champData = data;
        } else if (type === 'item' && temp[row][column].champData !== null) {
            if (temp[row][column].itemData.length > 2) {
                return
            }

            temp[row][column].itemData.push(data);
        }

        setBoardState(temp);
        forceUpdate();
    }

    return (
        <DndProvider backend={HTML5Backend}>
            <div className='App'>
                <Board 
                    boardState={boardState} 
                    onDrop={onDrop} 
                    onRightClick={onRightClick}
                /> 
                <div className='unit-container'>
                    {champions.map((champion, i) => {
                        return <Unit championData={champion} key={i}/>
                    })}
                </div>
                <div className='item-container'>
                    {items.map((item) => 
                        <Item itemData={item}></Item>
                    )}
                </div>
            </div>
        </DndProvider>
    );
}

export default App;
