import { useState } from "react"

function Multiplier ({update, color, starsPerTile}) {

    const MAX_TILES = 7

    const [stars, setStars] = useState(0)
    const [number, setNumber] = useState(0)

    let values = []
    for(let i=0; i<=MAX_TILES; i++) {
        values.push(i * starsPerTile)
    }

    function updateStars(e) {
        setStars(parseInt(e.target.value))
        update(parseInt(e.target.value), parseInt(number))
    }

    function updateNumber(e) {
        setNumber(parseInt(e.target.value))
        update(parseInt(stars), parseInt(e.target.value))
    }

    return (
        <div className={"multiplier " + color}>
            <div className="ins">
                <select onChange={updateStars} value={stars}>
                    {
                        values.map((val) => <option key={val} value={val}>{val}</option>)
                    }
                </select>
                <input onChange={updateNumber} type="number" value={number}></input>
            </div>
            <div className="subTot">{stars * number}</div>
        </div>
    )
}

export default Multiplier