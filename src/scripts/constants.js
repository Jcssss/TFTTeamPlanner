import {useState, useRef} from 'react';

export const colours = ['#000000', '#909994', '#12a339', '#1e83e8', '#9b1ee8', '#c7c91a'];
export const baseUrl = 'https://raw.communitydragon.org/latest/game/';

// from https://css-tricks.com/dealing-with-stale-props-and-states-in-reacts-functional-components/
export const useAsyncReference = (value) => {
    const ref = useRef(value);
    const [, forceRender] = useState(false);
  
    function updateState(newState) {
        if (!Object.is(ref.current, newState)) {
            ref.current = newState;
            forceRender(s => !s);
        }
    }
  
    return [ref, updateState];
}