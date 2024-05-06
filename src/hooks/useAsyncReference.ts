import React, {useRef, useState} from 'react';
import { ToAddType } from '../general/types';

export const useAsyncReference = <T>(value: T): [ToAddType, Function] => {
    const ref = useRef(value);
    const [, forceRender] = useState(false);
  
    function updateState(newState: T) {
        if (!Object.is(ref.current, newState)) {
            ref.current = newState;
            forceRender(s => !s);
        }
    }
  
    return [ref, updateState];
}