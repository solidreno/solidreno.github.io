import { useState } from "react"
import Multiplier from "./Multiplier"

function Column () {

    let [blue, setBlue] = useState(0)
    let [yellow, setYellow] = useState(0)
    let [red, setRed] = useState(0)
    let [purple, setPurple] = useState(0)
    let [green, setGreen] = useState(0)
    let [stones, setStones] = useState(0)
    let [total, setTotal] = useState(0)

    function getTotal() {
        return parseInt(blue) +
            parseInt(yellow) +
            parseInt(red) +
            parseInt(purple) +
            parseInt(green) +
            parseInt(stones)
    }

    return (
        <div className="column">
            <Multiplier color="blue" update={(stars, number) => setBlue(stars * number)}></Multiplier>
            <Multiplier color="yellow" update={(stars, number) => setYellow(stars * number)}></Multiplier>
            <Multiplier color="red" update={(stars, number) => setRed(stars * number)}></Multiplier>
            <Multiplier color="purple" update={(stars, number) => setPurple(stars * number)}></Multiplier>
            <Multiplier color="green" update={(stars, number) => setGreen(stars * number)}></Multiplier>
            <input className="stones" onChange={(e) => setStones(e.target.value)} value={stones} type="number"></input>
            <span className="total">{getTotal()}</span>
        </div>
    )
}

export default Column
