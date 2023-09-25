import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import Board from './components/Board.js';
import Unit from './components/Unit.js';
import Item from './components/Item.js';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
//'https://raw.communitydragon.org/latest/game/assets/ux/tft/championsplashes/'
//'https://raw.communitydragon.org/latest/cdragon/tft/en_us.json'

function App() {
    const [, updateState] = useState();
    const [augments, setAugments] = useState([]);
    const [champions, setChampions] = useState([]);
    const [items, setItems] = useState([]);
    const [boardState, setBoardState] = useState([]);

    const forceUpdate = useCallback(() => updateState({}), []);
    const ignorableItems = [
        'TFT_Item_ThiefsGloves_Empty',
        'TFT_Item_BlankSlot',
        'TFT_Item_EmptyBag',
        'TFT_Item_JammedSlot',
        'TFT_Item_Unknown',
        'TFT_Item_UnusableSlot',
        'TFT9_Item_WorldEnder_DarkinBlade',
        'TFT9_Item_QuickdrawEmblem',
        'TFT9_Item_ShadowIslesEmblem',
        'TFT9_Item_ForsakenEmblem',
        'TFT9_Item_SeekerEmblem',
        'TFT9_Item_DeadeyeEmblem',
        'TFT9_Item_BaronsHead',
        'TFT9_Item_PiltoverCharges',
        'TFT9_Item_PiltoverProgress',
        'TFT_Item_YoumuusGhostblade',
        'TFT_Item_FreeBFSword',
        'TFT9_Item_CrownOfDemacia_DU',
        'TFT_Item_MortalReminder',
        'TFT_Item_SeraphsEmbrace',
        'TFT_Item_GrantTomeOfTraits',
        'TFT_Item_KnightsVow',
        'TFT_Item_TitanicHydra',
    ]

    // resets board
    useEffect(() => {
        var temp = Array(4);
        for (var i = 0; i < 4; i++) {
            temp[i] = Array(7)
            for (var j = 0; j < 7; j++) {
                temp[i][j] = { 'champImg': '', 'itemImg': [] };
            }
        }
        setBoardState(temp);
    }, []);

    // fetches and loads necessary data
    useEffect(() => {
        fetch('https://raw.communitydragon.org/latest/cdragon/tft/en_us.json')
            .then(res => res.json())
            .then(res => {
                getChampions(res);
                getItems(res);
            });
    });

    // collects data on items from api
    const getItems = (data) => {
        var imgName = '';

        setItems( data.items.map((item) => { 
            imgName = item.icon;
            if (item.apiName.includes('TFT9_Item') || item.apiName.includes('TFT_Item')) {
                if(item.name != null && !ignorableItems.includes(item.apiName)) {
                    if (!item.name.toLowerCase().includes('orb') && !item.name.toLowerCase().includes('component') && !item.name.toLowerCase().includes('item')) {
                        return ({
                            "apiName": item.apiName,
                            "name": item.name,
                            "composition": item.composition,
                            "img": item.icon.substring(0, imgName.length - 3).toLowerCase() + 'png'
                        })
                    }
                }
            }
        }).filter(item => item))
    }

    // collects data on champions from api
    const getChampions = (data) => {
        var addedUnits = [];
        var imgName = '';

        setChampions( data.setData['0'].champions.map((champion) => {
            if (!Object.values(champion.stats).includes(null) && !addedUnits.includes(champion.name)) {
                imgName = champion.tileIcon;
                addedUnits.push(champion.name)
                return ({ 
                    "name": champion.name, 
                    "cost": (champion.traits.length === 0)? 0 : champion.cost, 
                    "img": imgName.substring(0, imgName.length - 3).toLowerCase() + 'png', 
                    "traits": champion.traits
                })
            }

            return null;
        }).filter(champ => champ))
    }

    const onRightClick = (row, column) => {
        var temp = boardState;
        temp[row][column].champImg = '';
        temp[row][column].itemImg = [];
        setBoardState(temp);
        forceUpdate();
    }

    const onDrop = (type, img, row, column) => {
        var temp = boardState;

        if (type === 'unit') {
            temp[row][column].champImg = img;
        } else if (type === 'item' && temp[row][column].champImg !== '') {
            if (temp[row][column].itemImg.length > 2) {
                return
            }

            temp[row][column].itemImg.push(img);
            console.log(temp[row][column].itemImg);
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
                        <Item itemData={item}
                        ></Item>
                    )}
                </div>
            </div>
        </DndProvider>
    );
}

export default App;
