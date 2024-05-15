import { ItemType } from "../../general/types";
import Item from "./Item";
import { useAsyncReference } from "../../hooks/useAsyncReference";
import { useState } from "react";
import Search from "./Search";

type PropTypes = {
    items: ItemType[],
}

// The organizer for units and items. Built with preset and search filters
const ItemOrganizer = ({ 
    items
}: PropTypes) => {
    const displayStates = ['Normal', 'Artifact', 'Support', 'Emblem', 'Other'];
    const [display, setDisplay] = useAsyncReference('Normal');
    const [searchTerm, setSearchTerm] = useState('');

    /*
    Given the name of an item/champion, checks if the name matches
    the search term. Searching Az'ir will return Azir and searching
    Reksai will return Rek'sai.
    */
    const filterDisplay = (data: ItemType) => {
        if (!data) {
            return;
        }

        var nameOrigin = data.name.toLowerCase();
        var clippedName = nameOrigin.replace(/[^\w]/, '');
        var searchOrigin = searchTerm.toLowerCase()
        var clippedSearch = searchOrigin.replace(/[^\w]/, '');
        
        return (data.itemType == display.current.toLowerCase() && 
            (nameOrigin.includes(searchOrigin) || clippedName.includes(clippedSearch)));
    }

    // Filters and displays the set of items
    const displayItems = () => {

        let filteredList = items.filter(item => filterDisplay(item))
        // Filters the set of items based on the search term
        return <div className='item-images'>
            {(filteredList.length != 0)? filteredList.map((item) => 
                    <Item 
                        itemData={item} 
                        key={item.name}
                    />
                ) : '**No Items match your criteria**'
            }
        </div>
    }

    return (
        <div className='organizer__item-container'>
            <div className='organizer__container-header'>
                <div className='organizer__item-title'>Items</div>
                <Search 
                    setSearchTerm={setSearchTerm}
                    placeholder={'Search items...'}
                />
            </div>
            <div className='organizer__item_filter'>
                {displayStates.map((state) => (
                    <div 
                        className={`organizer__item-filter-button ${(display.current === state)? 'active' : ''}`}
                        onClick={() => setDisplay(state)}
                        key={state}
                    >
                        {state}
                    </div>
                ))}
            </div>
            {displayItems()}
        </div>
    );
}
export default ItemOrganizer;