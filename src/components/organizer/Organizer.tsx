import { useState, useEffect } from 'react';
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

    return (
        <div className='organizer-container'>
            <div className='img-container'>
                <ItemOrganizer 
                    items={items}
                />
                <UnitOrganizer
                    units={champions}
                    onUnitClick={onUnitClick}
                />
            </div>
        </div>
    );
}

export default Organizer;