import React, {useEffect} from 'react';
import { useDrop } from 'react-dnd';

const AutoScroll = (props) => {

    const [{ isOverUp }, upScroll] = useDrop(() => ({
        accept: ['unit', 'item', 'hex'],
        collect: (monitor) => ({
            isOverUp: monitor.isOver()
        })
    }))

    const [{ isOverDown }, downScroll] = useDrop(() => ({
        accept: ['unit', 'item', 'hex'],
        collect: (monitor) => ({
            isOverDown: monitor.isOver()
        })
    }))

    const generalStyle = {
        height: '20px',
        opacity: '0px',
        position: 'fixed',
        width: '100vw',
        zIndex: 400,
    }

    useEffect(() => {
        const interval = setInterval(() => {
            if (isOverDown) {
                window.scrollBy(0, 5);
            } else if (isOverUp) {
                window.scrollBy(0, -5);
            } else {
                clearInterval(interval);
            }
        }, 5);

        return () => {
            clearInterval(interval);
        };
    }, [isOverDown, isOverUp]);

    return (
        <>
            <div 
                className='top-auto-scroll'
                style={{...generalStyle, top: '0px'}}
                ref={upScroll}
            ></div>
            <div 
                className='bottom-auto-scroll'
                style={{...generalStyle, bottom: '0px'}}
                ref={downScroll}
            ></div>
        </>
    );
}

export default AutoScroll;