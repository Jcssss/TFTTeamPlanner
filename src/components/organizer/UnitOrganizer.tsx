import { UnitType } from "../../general/types";
import Unit from "./Unit";
import { useState } from "react";
import Search from "./Search";
import { useAsyncReference } from "../../hooks/useAsyncReference";

type PropTypes = {
    units: UnitType[],
    onUnitClick: Function,
}

// The organizer for units and items. Built with preset and search filters
const UnitOrganizer = ({ 
    units, onUnitClick
}: PropTypes) => {

    const [display, setDisplay] = useAsyncReference('All');
    const displayStates = ['All', '1 Cost', '2 Cost', '3 Cost', '4 Cost', '5 Cost'];
    const [searchTerm, setSearchTerm] = useState('');

    /*
    Given the name of an item/champion, checks if the name matches
    the search term. Searching Az'ir will return Azir and searching
    Reksai will return Rek'sai.
    */
    const filterDisplay = (data: UnitType) => {
        if (!data) {
            return;
        }

        var nameOrigin = data.name.toLowerCase();
        var clippedName = nameOrigin.replace(/[^\w]/, '');
        var searchOrigin = searchTerm.toLowerCase()
        var clippedSearch = searchOrigin.replace(/[^\w]/, '');
        
        return (display.current == 'All' || data.cost == display.current.substring(0, 1))
            && (nameOrigin.includes(searchOrigin) || clippedName.includes(clippedSearch));
    }

    // Filters and displays the set of units
    const displayChampions = () => {

        let filteredList = units.filter(unit => filterDisplay(unit));

        // filters the units based on the search filter
        return <div className='unit-images'>
            {(filteredList.length != 0)? units.filter(unit => filterDisplay(unit))
                .map((champion: UnitType)  =>
                    <Unit 
                        championData={champion} 
                        key={champion.name + ' ' + champion.uid}
                        onUnitClick={onUnitClick}
                    />
                ) : '**No Units match your search criteria**'}
        </div>
    }

    return (
        <div className='organizer__unit-container'>
            <div className='organizer__container-header'>
                <div className='organizer__unit-title'>Units</div>
                <Search 
                    setSearchTerm={setSearchTerm}
                    placeholder={'Search units...'}
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
            {displayChampions()}
        </div>
    );
}
export default UnitOrganizer;