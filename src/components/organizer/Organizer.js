import React, { useState, useEffect } from 'react';
import Unit from './Unit.js';
import Item from './Item.js';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAsyncReference } from '../../hooks/useAsyncReference.js';

// The organizer for units and items. Built with preset and search filters
const Organizer = ({ champions, items, onUnitClick }) => {
    const [displayState, setDisplayState] = useAsyncReference('All');
    const [viewportState, setviewportState] = useState('mobile');
    const [searchTerm, setSearchTerm] = useState('')
    const displayStateOptions = {
        'desktop': ['All', 'Units', 'Items'],
        'mobile': ['Units', 'Items']
    }

    // sets a resize event listener
    useEffect(() => {
        window.addEventListener("resize", detectWidth);
        detectWidth();
    }, []);

    // based on the screen width, adjust settings
    const detectWidth = () => {
        if (window.innerWidth < 700) {
            setviewportState('mobile');
            if (displayState.current == 'All') {
                setDisplayState('Units');
            }
        } else {
            setviewportState('desktop');
        }
    }

    /*
    Given the name of an item/champion, checks if the name matches
    the search term. Searching Az'ir will return Azir and searching
    Reksai will return Rek'sai.
    */
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
        if (['All', 'Units'].includes(displayState.current)) {

            // filters the units based on the search filter
            return <div className='unit-images'>
                {champions.filter(champ => filterDisplay(champ))
                    .map((champion) =>
                        <Unit 
                            championData={champion} 
                            key={champion.name}
                            onUnitClick={onUnitClick}
                        />
                    )
                }
            </div>
        }
    }

    // Filters and displays the set of items
    const displayItems = () => {

        // Checks if items should be displayed
        if (['All', 'Items'].includes(displayState.current)) {

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
                    {displayStateOptions[viewportState].map((state) => (
                        <div 
                            className={`filter-button ${(displayState.current === state)? 'active' : ''}`}
                            onClick={() => setDisplayState(state)}
                            key={state}
                        >
                            {state}
                        </div>
                    ))}
                </div>
                <div className='search-bar'>
                    <FontAwesomeIcon 
                        className='search-icon' 
                        icon={faMagnifyingGlass}
                    />
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