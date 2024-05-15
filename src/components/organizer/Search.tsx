import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type PropTypes = {
    setSearchTerm: Function,
    placeholder: string,
}

const Search = ({setSearchTerm, placeholder}: PropTypes) => {
    return (
        <div className='search-bar__container'>
            <div className='search-bar'>
                <FontAwesomeIcon 
                    className='search-icon' 
                    icon={faMagnifyingGlass}
                />
                <input 
                    className='search-field'
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={placeholder}
                ></input>
            </div>
        </div>
    );
}

export default Search;