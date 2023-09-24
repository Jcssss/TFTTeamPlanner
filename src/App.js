import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import Board from './components/Board.js';
import Unit from './components/Unit.js';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
//'https://raw.communitydragon.org/latest/game/assets/ux/tft/championsplashes/'
//'https://raw.communitydragon.org/latest/cdragon/tft/en_us.json'

function App() {
    const patch = '13.18.1';
    const [, updateState] = useState();
    const [augments, setAugments] = useState([]);
    const [champions, setChampions] = useState([]);
    const [boardState, setBoardState] = useState([]);

    const forceUpdate = useCallback(() => updateState({}), []);
    
    useEffect(() => {
        var temp = Array(4);
        for (var i = 0; i < 4; i++) {
            temp[i] = Array(7).fill('')
        }
        setBoardState(temp);
    }, []);

    useEffect(() => {
        fetch('https://raw.communitydragon.org/latest/cdragon/tft/en_us.json')
            .then(res => res.json())
            .then(res => {
                setChampions( res.setData['0'].champions.map((champion) => {
                    if (champion.squareIcon != null) {
                        return ({ 
                            "name": champion.name, 
                            "cost": champion.cost, 
                            "img": champion.tileIcon.substring(0, champion.tileIcon.length - 3).toLowerCase() + 'png', 
                            "traits": champion.traits
                        })
                    }
                }).filter(elm => elm))
            });
    }, []);

    const onRightClick = (row, column) => {
        var temp = boardState;
        temp[row][column] = '';
        setBoardState(temp);
        forceUpdate();
    }

    const onDrop = (img, row, column) => {
        var temp = boardState;
        temp[row][column] = img;
        setBoardState(temp);
        forceUpdate();
    }

    return (
        <DndProvider backend={HTML5Backend}>
            <div className='App'>
                {
                //augments.map((item) => <img src={require(`./assets/tft-augment/${item.image.full}`)}></img>)
                }
                <Board 
                    boardState={boardState} 
                    onDrop={onDrop} 
                    onRightClick={onRightClick}
                /> 
                <div>
                    {champions.map((champion, i) => {
                        return <Unit championData={champion} key={i}/>
                    })}
                </div>
            </div>
        </DndProvider>
    );
}

export default App;
