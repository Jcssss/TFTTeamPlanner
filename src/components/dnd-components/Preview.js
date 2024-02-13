import { usePreview } from 'react-dnd-preview';
import { baseUrl } from '../../scripts/constants.js';

// Draws the previews when dragging an image with react dnd
const MyPreview = () => {
    const preview = usePreview()
    if (!preview.display) {
        return null
    }
    const {itemType, item, style} = preview;
    return <div 
        className="item-list__item" 
        style={{
            ...style,
            backgroundImage: `url(${baseUrl + item.data.img})`,
            height: 'min(5vw, 50px)',
            width: 'min(5vw, 50px)',
            backgroundSize: (itemType === 'unit')? '120%' : '100%',
            backgroundPosition: (itemType === 'unit')? '100% 0%' : '0% 0%',
            zIndex: 10,
            cursor: 'move',
            opacity: 0.5,
        }}
    >
    </div>
}

export default MyPreview;