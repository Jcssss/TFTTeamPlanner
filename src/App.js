import React, { useState, useEffect } from 'react';
import './App.css';
import Board from './components/Board.js';
import { DndProvider } from 'react-dnd' 
import { HTML5Backend } from 'react-dnd-html5-backend'
import { fetchItems, fetchUnits, fetchTraits } from './scripts/ApiCommands.js';
import Organizer from './components/Organizer.js';

//'https://raw.communitydragon.org/latest/game/assets/ux/tft/championsplashes/'
//'https://raw.communitydragon.org/latest/cdragon/tft/en_us.json'

function App() {
    const [augments, setAugments] = useState([]);
    const [champions, setChampions] = useState([]);
    const [traits, setTraits] = useState([]);
    const [items, setItems] = useState([]);

    // fetches and loads necessary data
    useEffect(() => {
        fetch('https://raw.communitydragon.org/latest/cdragon/tft/en_us.json')
            .then(res => res.json())
            .then(res => {
                setChampions(fetchUnits(res));
                setItems(fetchItems(res));
                setTraits(fetchTraits(res));
            });
    }, []);

    return (
        <DndProvider backend={HTML5Backend}>
            <div className='App'>
                <h1 style={{width: '100%', textAlign: 'center'}}>TFT Team Builder - Set 9.5</h1>
                <div style={{ display: 'flex', justifyContent: 'center'}}>
                    <Board traitData={traits}/> 
                </div>
                <Organizer 
                    champions={champions}
                    items={items}
                />
            </div>
        </DndProvider>
    );
}

export default App;
