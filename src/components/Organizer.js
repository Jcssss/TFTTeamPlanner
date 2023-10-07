import React, { useState } from 'react';
import Unit from './Unit.js';
import Item from './Item.js';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Organizer = ({ champions, items }) => {
    const [displayState, setDisplayState] = useState('All');
    const [searchTerm, setSearchTerm] = useState('')
    const displayStateOptions = ['All', 'Items', 'Units'];

    const displayChampions = () => {
        if (displayState === 'All' || displayState === 'Units') {
            return champions.filter(champ => filterDisplay(champ))
                .map((champion) => {
                    return <Unit championData={champion}/>
                })
        }
    }

    const filterDisplay = (name) => {
        var nameOrigin = name.name.toLowerCase();
        var clippedName = nameOrigin.replace(/[^\w]/, '');
        var searchOrigin = searchTerm.toLowerCase()
        var clippedSearch = searchOrigin.replace(/[^\w]/, '');
        
        return (nameOrigin.includes(searchOrigin) 
            || clippedName.includes(clippedSearch));
    }

    const displayItems = () => {
        if (displayState === 'All' || displayState === 'Items') {
            return items.filter(item => filterDisplay(item))
                .map((item) => 
                    <Item itemData={item}></Item>
                )
        }
    }

    return (
        <div className='organizer-container'>
            <div className='organizer-header flex'>
                <div className='filter flex'>
                    {displayStateOptions.map((state) => (
                        <div 
                            className={`filter-button ${(displayState === state)? 'active' : ''}`}
                            onClick={() => setDisplayState(state)}
                            key={state}
                        >
                            {state}
                        </div>
                    ))}
                </div>
                <div className='search-bar'>
                    <FontAwesomeIcon className='search-icon' icon={faMagnifyingGlass}/>
                    <input 
                        className='search-field'
                        onChange={(e) => setSearchTerm(e.target.value)}
                    ></input>
                </div>
            </div>
            <div className='img-container flex'>
                { displayChampions() }
                { displayItems() }
            </div>
        </div>
    );
}

export default Organizer;