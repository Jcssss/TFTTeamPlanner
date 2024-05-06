import Hex from './Hex';
import Trait from './Trait';
import {TraitType, HexType} from '../../general/types';

type PropTypes = {
    boardState: HexType[][],
    traitData: TraitType[],
    removeUnit: Function,
    removeItem: Function,
    onDrop: Function,
    activeTraits: {[key: string]: number}
}

// The board holding the hexes and the traits
const Board = ({
    boardState, traitData, removeUnit, removeItem, onDrop, activeTraits
}: PropTypes) => {
    return (
        <div className='board'>

            {/* The board hexes */}
            <div className="container">
                {boardState.map((arr, i) => (
                    <div className="row" key={i}>
                        {arr.map((hexData: HexType, j: number) => {
                            return (<Hex 
                                key={j}
                                content={hexData}
                                onDrop={onDrop}
                                removeUnit={removeUnit}
                                removeItem={removeItem}
                                row={i}
                                column={j}
                            />)
                        })}
                    </div>
                ))}
            </div>

            {/* The board traits */}
            <div className="traits">
                {Object.keys(activeTraits).map((traitName: string) => (
                    <Trait 
                        traitData={traitData.filter((trait: TraitType) =>
                            trait.name === traitName
                        )[0]} 
                        key={traitName}
                        numActive={activeTraits[traitName]}
                    />
                ))}
            </div>
        </div>
    );
}

export default Board;