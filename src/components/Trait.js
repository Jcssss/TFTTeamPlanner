import React from 'react';
import { baseUrl }from '../scripts/constants.js';

const Trait = ({ traitData, numActive }) => {

    const createInterval = (num, i) => {
        return <>
            <div className={`arrow ${(numActive < num)? '':'highlight'}`}>
                {(i !== 0)? '>' : ''}
            </div>
            <div className={`num ${(numActive < num)? '':'highlight'}`}>
                {num}
            </div>
        </>
    }

    return (
        <div className='trait-container'>
            <div className='trait-header flex'>
                <img className='trait-icon' src={baseUrl + traitData.img}></img>
                <div className='trait-name'>{traitData.name}</div>
            </div>
            <div className='trait-intervals flex'>
            {
                traitData.intervals.map((num, i) => {
                    return createInterval(num, i)
                })
            }
            </div>
        </div>
    );
}

export default Trait;