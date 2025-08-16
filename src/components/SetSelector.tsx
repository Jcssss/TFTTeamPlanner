import React, {useState} from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';

type PropTypes = {
    onOptionClick: Function,
    activeSet: number,
}

const SetSelector = ({
    onOptionClick, activeSet
}: PropTypes) => {
    const [active, setActive] = useState(false);
    const setOptions = [11, 12, 13, 14, 15];

    const setButton = (setNum: number) => {
        return (
            <div
                key={setNum}
                className='dropdown-button'
                style={{
                    display: `${(active)? 'block' : 'none'}`,
                }}
                onClick={() => onOptionClick(setNum)}
            >
                {setNum}
            </div>
        );
    }

    return (
        <div className='dropdown-container'>
            <div 
                className='dropdown-toggle' 
                onClick={() => setActive((prev) => !prev)}
            >
                <div>{`Set ${activeSet}`}</div>
                <FontAwesomeIcon 
                    className='dropdown-icon' 
                    icon={faCaretDown}
                />
            </div>
            <div className='dropdown-options'>
                {setOptions.map((setNum) => setButton(setNum))}
            </div>
        </div>
    );
}

export default SetSelector;