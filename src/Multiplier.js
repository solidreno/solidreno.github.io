import { useState } from "react"

function Multiplier ({update, isGreen}) {

    const [stars, setStars] = useState(0)
    const [number, setNumber] = useState(0)

    function updateStars(e) {
        setStars(parseInt(e.target.value))
        update(parseInt(e.target.value), parseInt(number))
    }

    function updateNumber(e) {
        setNumber(parseInt(e.target.value))
        update(parseInt(stars), parseInt(e.target.value))
    }

    return (
        <div className="multiplier">
            <div className="ins">
                {
                    (isGreen) ?
                    <select onChange={updateStars} value={stars}>
                        <option value="0">0</option>
                        <option value="3">3</option>
                        <option value="6">6</option>
                        <option value="9">9</option>
                        <option value="12">12</option>
                        <option value="15">15</option>
                    </select> :
                    <select onChange={updateStars} value={stars}>
                        <option value="0">0</option>
                        <option value="2">2</option>
                        <option value="4">4</option>
                        <option value="6">6</option>
                        <option value="8">8</option>
                        <option value="10">10</option>
                        <option value="12">12</option>
                    </select>
                }
                <input onChange={updateNumber} type="number" value={number}></input>
            </div>
            <div className="subTot">{stars * number}</div>
        </div>
    )
}

export default Multiplier