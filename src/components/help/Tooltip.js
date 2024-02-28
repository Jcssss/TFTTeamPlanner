import React, {useState} from 'react';
import { faQuestion } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Tooltip.css';
import { HelpContents } from './HelpContents';

const Tooltip = ({content, contentPosition}) => {
    const [active, setActive] = useState(false);
    const [delayHandler, setDelayHandler] = useState(null);

    const handleMouseEnter = () => {
        setDelayHandler(setTimeout(() => {
            setActive(true)
        }, 500))
    }

    const handleMouseLeave = () => {
        clearTimeout(delayHandler)
        setActive(false)
    }

    const tooltipStyle = {
        display: (active)? 'block': 'none'
    }

    return (
        <div 
            className={`tooltip__container`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <FontAwesomeIcon 
                className='tooltip__icon'
                icon={faQuestion}
            />
            <span className={`tooltip__content ${contentPosition}`} style={tooltipStyle}>
                {HelpContents[content]}
            </span>
        </div>
    );
}

export default Tooltip;