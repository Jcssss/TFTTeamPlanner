import React, { useState } from 'react';
import Unit from './Unit.js';
import Item from './Item.js';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Organizer = ({ champions, items }) => {
    const [displayState, setDisplayState] = useState('All');
    const [searchTerm, setSearchTerm] = useState('')
    const displayStateOptions = ['All', 'Items', 'Units'];

    // Given the name of an item/champion, checks if the name matches
    // the search term
    const filterDisplay = (data) => {
        var nameOrigin = data.name.toLowerCase();
        var clippedName = nameOrigin.replace(/[^\w]/, '');
        var searchOrigin = searchTerm.toLowerCase()
        var clippedSearch = searchOrigin.replace(/[^\w]/, '');
        
        return (nameOrigin.includes(searchOrigin) 
            || clippedName.includes(clippedSearch));
    }

    // Filters and displays the set of units
    const displayChampions = () => {

        // Checks if units should be shown
        if (displayState === 'All' || displayState === 'Units') {

            // filters the units based on the search filter
            return <div className='unit-images'>
                {champions.filter(champ => filterDisplay(champ))
                    .map((champion) =>
                        <Unit championData={champion} key={champion.name}/>
                    )
                }
            </div>
        }
    }

    // Filters and displays the set of items
    const displayItems = () => {

        // Checks if items should be displayed
        if (displayState === 'All' || displayState === 'Items') {

            // Filters the set of items based on the search term
            return <div className='item-images'>
                {items.filter(item => filterDisplay(item))
                    .map((item) => 
                        <Item itemData={item} key={item.name}></Item>
                    )
                }
            </div>
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
                        placeholder='Search by name...'
                    ></input>
                </div>
            </div>
            <div className='img-container'>
                {displayChampions()}
                {displayItems()}
            </div>
        </div>
    );
}

export default Organizer;