import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import Board from './components/board/Board';
import { DndProvider } from 'react-dnd' 
import { TouchBackend } from 'react-dnd-touch-backend'
import { fetchItems, fetchUnits, fetchTraits } from './general/ApiCommands';
import Organizer from './components/organizer/Organizer';
import { useAsyncReference } from './hooks/useAsyncReference';
import MyPreview from './components/dnd-components/Preview';
import SetSelector from './components/SetSelector';
import Tooltip from './components/help/Tooltip';
import AutoScroll from './components/dnd-components/AutoScroll';
import { UnitType, ItemType, TraitType, HexDragData } from './general/types';

//test comment

//'https://raw.communitydragon.org/latest/game/assets/ux/tft/championsplashes/'
//'https://raw.communitydragon.org/latest/cdragon/tft/en_us.json'

function App() {
    const [, updateState] = useState(false);
    const [boardState, setBoardState] = useAsyncReference([]);
    const [activeUnits, setActiveUnits] = useAsyncReference({});
    const [activeTraits, setActiveTraits] = useAsyncReference({});
    const [errorMessage, setErrorMessage] = useAsyncReference('');
    const [currentSet, setCurrentSet] = useState(12)
    const forceUpdate = useCallback(() => updateState(s => !s), []);

    //const [augments, setAugments] = useState([]);
    const [champions, setChampions]: [UnitType[], Function] = useState([]);
    const [traits, setTraits]: [TraitType[], Function] = useState([]);
    const [items, setItems]: [ItemType[], Function] = useState([]);

    const options = {
        enableMouseEvents: true,
    }

    // fetches and loads necessary data
    useEffect(() => {
        fetch('https://raw.communitydragon.org/latest/cdragon/tft/en_us.json')
        .then(res => res.json())
        .then(res => {
            // console.log(res);
            setChampions(fetchUnits(res, currentSet));
            setItems(fetchItems(res, currentSet));
            setTraits(fetchTraits(res, currentSet));
        });

        resetBoard();
    }, [currentSet]);

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

    // Clears a hex
    const removeUnit = (row: number, column: number) => {
        var tempBoard = boardState.current;
        var tempActUnits = activeUnits.current;
        var traitsToRemove: string[] = [];
        var champName = '';

        // Confirms that the hex has something to clear
        if (!tempBoard[row][column].champData) {
            return;
        }

        // Updates the list of active traits
        traitsToRemove = [];
        champName = tempBoard[row][column].champData.name;

        // Removes unit traits if single instance of unit on board
        if (tempActUnits.hasOwnProperty(champName) && 
            tempActUnits[champName] === 1) {
            traitsToRemove = tempBoard[row][column].champData.traits;
        }

        // removes emblem traits
        tempBoard[row][column].itemData.forEach((item: ItemType) => {
            if (item) {
                traitsToRemove = traitsToRemove.concat(item.incompatibleTraits)
            }
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
    const removeItem = (name: string, row: number, column: number) => {
        var tempBoard = boardState.current;
        var hex = tempBoard[row][column];

        // Removes traits if item was an emblem;
        var remTraits = hex.itemData.filter((item: ItemType) => item && item.name === name)
        remTraits = remTraits[0].incompatibleTraits;
        changeTraits(remTraits, false);

        hex.itemData = hex.itemData.filter((item: ItemType) => item && item.name !== name);

        setBoardState(tempBoard);
        forceUpdate();
    }

    // Removes a unit from the list of units on the board
    const changeUnits = (unitName: string, isAdding: boolean) => {
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
    const changeTraits = (traits: string[], isAdding: boolean) => {
        var curActive: {[key: string]: number} = {...activeTraits.current};

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
            Object.entries(curActive).sort((
                [,t1]: [string, number],
                [,t2]: [string, number]
            ): number => {
                return t2 - t1;
            })
        );

        setActiveTraits(curActive);
    }

    const validateUnit = (data: UnitType) => {

    }

    // Adds a unit or item to a hex
    const addToHex = (
        type: string,
        data: UnitType | ItemType | HexDragData,
        row: number, 
        column: number,
    ) => {
        var temp = boardState.current;
        var hex = temp[row][column];
        var champ = hex.champData;
        var items = hex.itemData;
        var error = '';

        // checks if unit and that the hex is empty
        if (type === 'unit') {
            let champData = data as UnitType
            if (champ !== null) {
                error = 'Units can only be placed on empty hexes';
            } else {
                hex.champData = {...data};

                // If this is the first instance of unit, updates traits
                if (!activeUnits.current.hasOwnProperty(champData.name)) {
                    changeTraits(champData.traits, true);
                }

                changeUnits(champData.name, true);
            }
        
        // checks if hex and moves hex accordingly
        } else if (type === 'hex') {
            let hexData = data as HexDragData;

            // checks that the hex has a unit
            if (champ !== null) {
                error = 'Units can only be moved to empty hexes';
            } else {
                moveHex(hexData, hexData.row, hexData.column, row, column);
            }
        
        // checks if item and that the hex has a unit
        } else if (type === 'item') {
            let itemData = data as ItemType

            // checks that the hex has a unit
            if (champ === null) {
                error = 'Items can only be placed on hexes with units.';
            
            // checks if there are too many items (max 3)
            } else if (items.length > 2){
                error = 'That unit cannot hold another item.';

            // checks if the item is an invalid emblem
            // (emblems cannot be dropped on units that already have the trait)
            } else if (itemData.incompatibleTraits.some((trait: string) => champ.traits.includes(trait))) {
                error = 'This unit already has that trait.';

            // checks if the item is unique. 
            // If it is unique confirms that the item isn't already assigned
            } else if (itemData.unique && items.some((item: ItemType) => item.name === itemData.name)) {
                error = 'A unit can only have one of that item.';
            
            // Checks that the unit can hold items
            } else if (hex.champData.traits.length === 0) {
                error = 'This unit cannot hold any items';
            
            } else {
                hex.itemData.push({...data});
                changeTraits(itemData.incompatibleTraits, true);
            }
        }

        setErrorMessage(error);
        setBoardState(temp);
        forceUpdate();
    }

    // finds the first available hex and adds the unit to that hex
    const addToFirstEmpty = (unitData: UnitType) => {
        var board = boardState.current;
        var row, column;

        // finds the first empty hex and gets its row and column
        for (row = 0; row < 4; row++) {
            for (column = 0; column < 7; column++) {
                if (board[row][column].champData == null) {
                    addToHex('unit', unitData, row, column);
                    return;
                }
            }
        }

        setErrorMessage('There are no empty hexes on the board.');
    }

    // moves data from one hex to another hex
    const moveHex = (
        hexData: HexDragData, 
        oldRow: number, 
        oldCol: number, 
        newRow: number, 
        newCol: number
    ) => {
        var board = boardState.current;

        // copies over the unit
        board[newRow][newCol].champData = {...hexData.champData};

        // copies over items
        board[oldRow][oldCol].itemData.forEach((item: ItemType) => {
            board[newRow][newCol].itemData.push({...item})
        });

        // clears original hex
        board[oldRow][oldCol] = {
            'champData': null,
            'itemData': []
        };
        
        setBoardState(board, () => {
            console.log(boardState.current)
            forceUpdate()
        });
    }

    return (
        <DndProvider backend={TouchBackend} options={options}>
            <MyPreview />
            <AutoScroll/>
            <div className='App'>
                <h1 className='page-title'>TFT Team Builder</h1>
                <SetSelector onOptionClick={setCurrentSet} activeSet={currentSet}/>
                <div className='reset-container'>
                    <h3 
                        className='reset-button' 
                        onClick={() => resetBoard()}
                    >
                        Reset Board
                    </h3>
                </div>
                <h4 className='errorMessage'>{errorMessage.current}</h4>
                <div style={{ display: 'flex', justifyContent: 'center'}}>
                    <Tooltip contentPosition={'bottom-right'} content={'board'}></Tooltip>
                    <Board 
                        boardState={boardState.current}
                        traitData={traits}
                        removeUnit={removeUnit}
                        removeItem={removeItem}
                        onDrop={addToHex}
                        activeTraits={activeTraits.current}
                    /> 
                </div>
                <Organizer 
                    champions={champions}
                    items={items}
                    onUnitClick={addToFirstEmpty}
                />
            </div>
        </DndProvider>
    );
}

export default App;
