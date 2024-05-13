import { ItemType } from "../../general/types";
import Item from "./Item";
import { useAsyncReference } from "../../hooks/useAsyncReference";

type PropTypes = {
    items: ItemType[],
    searchTerm: string,
}

// The organizer for units and items. Built with preset and search filters
const ItemOrganizer = ({ 
    items, searchTerm
}: PropTypes) => {
    const displayStates = ['Normal', 'Artifact', 'Support', 'Emblem', 'Other'];
    const [display, setDisplay] = useAsyncReference('Normal');

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

        // Filters the set of items based on the search term
        return <div className='item-images'>
            {items.filter(item => filterDisplay(item))
                .map((item) => 
                    <Item 
                        itemData={item} 
                        key={item.name}
                    />
                )
            }
        </div>
    }

    return (
        <div className='organizer__item-container'>
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