import { useState } from "react"

function Multiplier () {

    const [stars, setStars] = useState(0)
    const [number, setNumber] = useState(0)

    function getTotal() {
        return stars * number
    }

    function updateStars(e) {
        console.log('Stars : '+e.target.value)
        setStars(e.target.value)
    }

    function updateNumber(e) {
        console.log('Number : ' + e.target.value)
        setNumber(e.target.value)
    }

    return (
        <div className="multiplier">
            <select onChange={updateStars} value={stars}>
                <option value="0">0</option>
                <option value="2">2</option>
                <option value="4">4</option>
            </select>
            <input onChange={updateNumber} value={number} type="number"></input>
            <span>{stars * number}</span>
        </div>
    )
}

export default Multiplier