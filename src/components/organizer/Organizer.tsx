import React, { useState, useEffect } from 'react';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAsyncReference } from '../../hooks/useAsyncReference';
import Tooltip from '../help/Tooltip';
import { UnitType, ItemType } from '../../general/types';
import ItemOrganizer from './ItemOrganizer';
import UnitOrganizer from './UnitOrganizer';

type PropTypes = {
    champions: UnitType[],
    items: ItemType[],
    onUnitClick: Function,
}

// The organizer for units and items. Built with preset and search filters
const Organizer = ({ 
    champions, items, onUnitClick 
}: PropTypes) => {
    const [displayState, setDisplayState] = useAsyncReference('All');
    const [viewportState, setviewportState] = useState('mobile');
    const [searchTerm, setSearchTerm] = useState('')
    const displayStateOptions: {[key: string]: string[]} = {
        desktop: ['All', 'Units', 'Items'],
        mobile: ['Units', 'Items']
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
    const filterDisplay = (data: UnitType | ItemType) => {
        if (!data) {
            return;
        }

        var nameOrigin = data.name.toLowerCase();
        var clippedName = nameOrigin.replace(/[^\w]/, '');
        var searchOrigin = searchTerm.toLowerCase()
        var clippedSearch = searchOrigin.replace(/[^\w]/, '');
        
        return (nameOrigin.includes(searchOrigin) 
            || clippedName.includes(clippedSearch));
    }

    return (
        <div className='organizer-container'>
            <div className='organizer-header flex'>
                {/* <div className='filter flex'>
                    {displayStateOptions[viewportState].map((state) => (
                        <div 
                            className={`filter-button ${(displayState.current === state)? 'active' : ''}`}
                            onClick={() => setDisplayState(state)}
                            key={state}
                        >
                            {state}
                        </div>
                    ))}
                </div> */}
                <Tooltip contentPosition={'bottom-right'} content={'organizer'}/>
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
                <ItemOrganizer 
                    searchTerm={searchTerm}
                    items={items}
                />
                <UnitOrganizer
                    searchTerm={searchTerm}
                    units={champions}
                    onUnitClick={onUnitClick}
                />
            </div>
        </div>
    );
}

export default Organizer;