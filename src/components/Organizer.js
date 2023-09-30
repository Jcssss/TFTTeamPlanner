import React, { useState } from 'react';
import Unit from './Unit.js';
import Item from './Item.js';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Organizer = ({ champions, items }) => {

    return (
        <div className='organizer-container'>
            <div className='organizer-header flex'>
                <div className='filter flex'>
                    <div className='filter-button'> All </div>
                    <div className='filter-button'> Items </div>
                    <div className='filter-button'> Units </div>
                </div>
                <div className='search-bar'>
                    <FontAwesomeIcon icon={faMagnifyingGlass}/>
                    <input className='search-field'></input>
                </div>
            </div>
            <div className='img-container flex'>
                {champions.map((champion, i) => {
                    return <Unit championData={champion} key={i}/>
                })}
                {items.map((item) => 
                    <Item itemData={item}></Item>
                )}
            </div>
        </div>
    );
}

export default Organizer;