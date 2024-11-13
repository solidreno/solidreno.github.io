import { useState } from "react"

function Multiplier ({update, color, starsPerTile}) {

    const MAX_TILES = 7

    const [stars, setStars] = useState(0)
    const [number, setNumber] = useState('')
    const total = stars * number

    let values = []
    for(let i=0; i<=MAX_TILES; i++) {
        values.push(i * starsPerTile)
    }

    function updateStars(e) {
        setStars(parseInt(e.target.value))
        update(parseInt(e.target.value), parseInt(number) ? parseInt(number) : 0)
    }

    function updateNumber(e) {
        setNumber(parseInt(e.target.value) ? parseInt(e.target.value) : '')
        update(parseInt(stars), parseInt(e.target.value) ? parseInt(e.target.value) : 0)
    }

    return (
        <div className={"multiplier " + color}>
            <div className="ins">
                <select onChange={updateStars} value={stars}>
                    {
                        values.map((val) => <option key={val} value={val}>{val}</option>)
                    }
                </select>
                <input onChange={updateNumber} onFocus={() => {setNumber(''); update(0, 0)}} placeholder={0} type="number" value={number}></input>
            </div>
            <div className="subTot">{total}</div>
        </div>
    )
}

export default Multiplier