import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import Board from './components/Board.js';
import Unit from './components/Unit.js';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

function App() {
    const patch = '13.18.1';
    const [, updateState] = useState();
    const [augments, setAugments] = useState([]);
    const [boardState, setBoardState] = useState([]);

    const forceUpdate = useCallback(() => updateState({}), []);
    
    useEffect(() => {
        var temp = Array(4);
        for (var i = 0; i < 4; i++) {
            temp[i] = Array(7).fill(true)
        }
        setBoardState(temp);
    }, []);

    useEffect(() => {
        fetch('http://ddragon.leagueoflegends.com/cdn/' + patch + '/data/en_US/tft-augments.json')
            .then(res => res.json())
            .then(res => {
                Object.keys(res.data).forEach(item => {
                    setAugments(prev => [...prev, res.data[item]])
                })
            });
    }, []);

    const onDrop = (row, column) => {
        var temp = boardState;
        temp[row][column] = !temp[row][column];
        setBoardState(temp);
        forceUpdate();
    }

    return (
        <DndProvider backend={HTML5Backend}>
            <div className='App'>
                {
                //augments.map((item) => <img src={require(`./assets/tft-augment/${item.image.full}`)}></img>)
                }
                <Board boardState={boardState} onDrop={onDrop}/> 
                <Unit />
            </div>
        </DndProvider>
    );
}

export default App;
