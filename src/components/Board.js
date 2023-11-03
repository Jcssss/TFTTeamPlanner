import Hex from './Hex.js';
import Trait from './Trait.js';

const Board = ( props ) => {
    return (
        <div className='board'>
            <div className="container">
                {props.boardState.map((arr, i) => (
                    <div className="row" key={i}>
                        {arr.map((hexData, j) => {
                            return (<Hex 
                                key={j}
                                index={j}
                                content={hexData}
                                onDrop={props.onDrop}
                                removeUnit={props.removeUnit}
                                removeItem={props.removeItem}
                                row={i}
                                column={j}
                            />)
                        })}
                    </div>
                ))}
            </div>
            <div className="traits">
                {Object.keys(props.activeTraits).map((traitName) => (
                    <Trait 
                        traitData={props.traitData.filter((trait) =>
                            trait.name === traitName
                        )[0]} 
                        key={traitName}
                        numActive={props.activeTraits[traitName]}
                    />
                ))}
            </div>
        </div>
    );
}

export default Board;