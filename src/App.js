import React, { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';
import Board from './components/Board.js';
import { DndProvider } from 'react-dnd' 
import { TouchBackend } from 'react-dnd-touch-backend'
import { fetchItems, fetchUnits, fetchTraits } from './scripts/ApiCommands.js';
import Organizer from './components/Organizer.js';
import { usePreview } from 'react-dnd-preview'
import { baseUrl } from './/scripts/constants.js';

//'https://raw.communitydragon.org/latest/game/assets/ux/tft/championsplashes/'
//'https://raw.communitydragon.org/latest/cdragon/tft/en_us.json'

function App() {
    // from https://css-tricks.com/dealing-with-stale-props-and-states-in-reacts-functional-components/
    const useAsyncReference = (value) => {
        const ref = useRef(value);
        const [, forceRender] = useState(false);
      
        function updateState(newState) {
          if (!Object.is(ref.current, newState)) {
            ref.current = newState;
            forceRender(s => !s);
          }
        }
      
        return [ref, updateState];
    }

    const [, updateState] = useState();
    const [boardState, setBoardState] = useAsyncReference([]);
    const [activeUnits, setActiveUnits] = useAsyncReference({});
    const [activeTraits, setActiveTraits] = useAsyncReference({});
    const forceUpdate = useCallback(() => updateState({}), []);

    const [augments, setAugments] = useState([]);
    const [champions, setChampions] = useState([]);
    const [traits, setTraits] = useState([]);
    const [items, setItems] = useState([]);

    const options = {
        enableMouseEvents: true,
    }

    const MyPreview = () => {
        const preview = usePreview()
        if (!preview.display) {
          return null
        }
        const {itemType, item, style} = preview;
        return <div 
            className="item-list__item" 
            style={{
                ...style,
                backgroundImage: `url(${baseUrl + item.data.img})`,
                height: 'min(5vw, 50px)',
                width: 'min(5vw, 50px)',
                backgroundSize: (itemType === 'unit')? '120%' : '100%',
                backgroundPosition: (itemType === 'unit')? '100% 0%' : '0% 0%',
                zIndex: 10,
                cursor: 'move',
                opacity: 0.5,
            }}
        >
        </div>
    }

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

    // resets the board
    const resetBoard = () => {
        var temp = Array(4);
        for (var i = 0; i < 4; i++) {
            temp[i] = Array(7)
            for (var j = 0; j < 7; j++) {
                temp[i][j] = { 'champData': null, 'itemData': [] };
            }
        }
        setBoardState(temp);
        setActiveUnits({});
        setActiveTraits({});
    }

    // resets board on first render
    useEffect(() => {
        resetBoard();
    }, []);

    // Clears a hex
    const removeUnit = (row, column) => {
        var tempBoard = boardState.current;
        var tempActUnits = activeUnits.current;
        var traitsToRemove = [];
        var champName = '';

        if (!tempBoard[row][column].champData) {
            return;
        }

        // Updates the list of active traits
        traitsToRemove = [];
        champName = tempBoard[row][column].champData.name;

        // Removes unit traits if single instance of unit on board
        if (tempActUnits.hasOwnProperty(champName) && tempActUnits[champName] === 1) {
            traitsToRemove = tempBoard[row][column].champData.traits;
        }

        // removes emblem traits
        tempBoard[row][column].itemData.forEach((item) => {
            traitsToRemove = traitsToRemove.concat(item.incompatibleTraits)
        });

        changeTraits(traitsToRemove, false);
        changeUnits(tempBoard[row][column].champData.name, false);

        // Clears the data for the target hex
        tempBoard[row][column].champData = null;
        tempBoard[row][column].itemData = [];
        setBoardState(tempBoard);
        forceUpdate();
    }

    // Removes an item from a hex
    const removeItem = (name, row, column) => {
        var tempBoard = boardState.current;
        var hex = tempBoard[row][column];

        // Removes traits if item was an emblem;
        var remTraits = hex.itemData.filter(item => item.name === name)
        remTraits = remTraits[0].incompatibleTraits;
        changeTraits(remTraits, false);

        hex.itemData = hex.itemData.filter(item => item.name !== name);

        setBoardState(tempBoard);
        forceUpdate();
    }

    // Removes a unit from the list of units on the board
    const changeUnits = (unitName, isAdding) => {
        var curActive = {...activeUnits.current};

        // If the trait exists in the list and should be incremented
        if (isAdding && curActive.hasOwnProperty(unitName)) {
            curActive[unitName] += 1;

        // If the trait does not exist and should be incremented
        } else if (isAdding) {
            curActive[unitName] = 1;

        // If the trait should be decremented
        } else {
            curActive[unitName] -= 1;

            if (curActive[unitName] === 0) {
                delete curActive[unitName];
            }
        }

        setActiveUnits(curActive);
    }

    // Updates the list of active traits on the board
    const changeTraits = (traits, isAdding) => {
        var curActive = {...activeTraits.current};

        // Iterates through the list of traits to update
        traits.forEach((trait) => {

            // If the trait exists in the list and should be incremented
            if (isAdding && curActive.hasOwnProperty(trait)) {
                curActive[trait] += 1;

            // If the trait does not exist and should be incremented
            } else if (isAdding) {
                curActive[trait] = 1;

            // If the trait should be decremented
            } else {
                curActive[trait] -= 1;

                if (curActive[trait] === 0) {
                    delete curActive[trait];
                }
            }
        });

        curActive = Object.fromEntries(
            Object.entries(curActive).sort(([,t1],[,t2]) => {
                return t2 - t1;
            })
        );

        setActiveTraits(curActive);
    }

    // Adds a unit or item to a hex
    const onDrop = (type, data, row, column) => {
        var temp = boardState.current;
        var hex = temp[row][column];
        var champ = hex.champData;
        var items = hex.itemData;

        // checks if unit and that the hex is empty
        if (type === 'unit' && champ == null) {
            hex.champData = data;

            // If this is the first instance of unit, updates traits
            if (!activeUnits.current.hasOwnProperty(data.name)) {
                changeTraits(data.traits, true);
            }
            changeUnits(data.name, true);
        
        // checks if item and that the hex has a unit
        } else if (type === 'item' && champ !== null) {

            // checks if there are too many items (max 3)
            if (items.length > 2){
                console.log('This unit cannot hold another item.');
                return;

            // checks if the item is an invalid emblem
            // (emblems cannot be dropped on units that already have the trait)
            } else if (data.incompatibleTraits.some((trait) => champ.traits.includes(trait))) {
                console.log('This unit already has that trait.');
                return;

            // checks if the item is unique. 
            // If it is unique confirms that the item isn't already assigned
            } else if (data.unique && items.some((item) => item.name === data.name)) {
                console.log('A unit can only have one of that item.');
                return;
            
            // Checks that the unit can hold items
            } else if (hex.champData.traits.length === 0) {
                console.log('This unit cannot hold any items');
                return;
            }
            
            hex.itemData.push(data);
            changeTraits(data.incompatibleTraits, true);
        }

        setBoardState(temp);
        forceUpdate();
    }

    return (
        <DndProvider backend={TouchBackend} options={options}>
            <MyPreview />
            <div className='App'>
                <h1 style={{width: '100%', textAlign: 'center'}}>TFT Team Builder - Set 9.5</h1>
                <div className='reset-container'>
                    <h3 className='reset-button' onClick={() => resetBoard()}>
                        Reset Board
                    </h3>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center'}}>
                    <Board 
                        boardState={boardState.current}
                        traitData={traits}
                        removeUnit={removeUnit}
                        removeItem={removeItem}
                        onDrop={onDrop}
                        activeTraits={activeTraits.current}
                    /> 
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
