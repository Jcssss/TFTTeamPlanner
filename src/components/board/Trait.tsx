import React from 'react';
import { baseUrl }from '../../general/constants';
import {TraitType} from '../../general/types';

type PropTypes = {
    traitData: TraitType,
    numActive: number,
}

// An active trait with intervals and current number of units
const Trait = ({ 
    traitData, numActive 
}: PropTypes) => {

    // Renders the intervals for the given Trait
    const createInterval = (interval: number, index: number) => {
        
        let mod = (numActive < interval)? '':'highlight'
        return <React.Fragment key={interval}>
            <div className={`arrow ${mod}`}>
                {(index !== 0)? '>' : ''}
            </div>
            <div className={`num ${mod}`}>
                {interval}
            </div>
        </React.Fragment>
    }

    return (
        <div className='trait-container flex'>
            <div 
                className='trait-icon'
                style={{
                    backgroundImage: `url(${baseUrl + traitData.img})`,
                }}
            >
            </div>
            <div className='trait-active'>{numActive}</div>
            <div className='trait-body flex'>
                <div className='trait-name'>{traitData.name}</div>
                <div className='trait-intervals flex'>
                {
                    traitData.intervals.map((num, i) => {
                        return createInterval(num, i)
                    })
                }
                </div>
            </div>
        </div>
    );
}

export default Trait;