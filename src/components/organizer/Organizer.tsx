import { useState, useEffect, ReactElement } from 'react';
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
    const [displayState, setDisplayState] = useAsyncReference('Units');
    const [viewportState, setviewportState] = useState('mobile');
    const displayStateOptions = ['Units', 'Items'];

    // sets a resize event listener
    useEffect(() => {
        window.addEventListener("resize", detectWidth);
        detectWidth();
    }, []);

    // based on the screen width, adjust settings
    const detectWidth = () => {
        if (window.innerWidth < 800) {
            setviewportState('mobile');
        } else {
            setviewportState('desktop');
        }
    }

    const displayMobileHeader = (): ReactElement => {
        if (viewportState == 'mobile') {
            return <div className='organizer__mobile-header'>
                {
                displayStateOptions.map((state) => {
                    return <div
                        key={state}
                        className={`organizer__mobile-filter ${(displayState.current == state)? 'active': ''}`}
                        onClick={() => setDisplayState(state)}
                    >
                        {state}
                    </div>
                })
                }
            </div>
        }
        return <></>
    }

    const displayUnits = (): ReactElement => {
        if (viewportState == 'desktop' || displayState.current == 'Units') {
            return <UnitOrganizer
                units={champions}
                onUnitClick={onUnitClick}
            />
        } else {
            return <></>
        }
    }

    const displayItems = (): ReactElement => {
        if (viewportState == 'desktop' || displayState.current == 'Items') {
            return <ItemOrganizer 
                items={items}
            />
        } else {
            return <></>
        }
    }

    return (
        <div className='organizer__container'>
            {displayMobileHeader()}
            <div className='organizer__unit-item-container'>
                {displayUnits()}
                {displayItems()} 
            </div>          
        </div>
    );
}

export default Organizer;