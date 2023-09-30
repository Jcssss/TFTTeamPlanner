import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import Board from './components/Board.js';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { fetchItems, fetchUnits } from './scripts/ApiCommands.js';
import Organizer from './components/Organizer.js';

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

    const removeUnit = (row, column) => {
        var temp = boardState;
        temp[row][column].champData = null;
        temp[row][column].itemData = [];
        setBoardState(temp);
        forceUpdate();
    }

    const removeItem = (name, row, column) => {
        var temp = boardState;
        var hex = temp[row][column];

        hex.itemData = hex.itemData.filter(item => item.name !== name);

        setBoardState(temp);
        forceUpdate();
    }

    const onDrop = (type, data, row, column) => {
        var temp = boardState;
        var hex = temp[row][column];
        var champ = hex.champData;
        var items = hex.itemData;

        if (type === 'unit') {
            hex.champData = data;
        } else if (type === 'item' && champ !== null) {
            if (items.length > 2) {
                console.log('This unit cannot hold another item.')
                return
            } else if (data.incompatibleTraits.some((trait) => champ.traits.includes(trait))) {
                console.log('This unit already has that trait.')
                return
            } else if (data.unique && items.some((item) => item.name === data.name)) {
                console.log('A unit can only have one of that item.')
                return
            }

            hex.itemData.push(data);
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
                    removeUnit={removeUnit}
                    removeItem={removeItem}
                /> 
                <Organizer 
                    champions={champions}
                    items={items}
                />
            </div>
        </DndProvider>
    );
}

export default App;
