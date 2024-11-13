import { useState } from "react"
import Multiplier from "./Multiplier"

function Column () {

    let [blue, setBlue] = useState(0)
    let [yellow, setYellow] = useState(0)
    let [red, setRed] = useState(0)
    let [purple, setPurple] = useState(0)
    let [green, setGreen] = useState(0)
    let [stones, setStones] = useState('')

    function getTotal() {
        return parseInt(blue) +
            parseInt(yellow) +
            parseInt(red) +
            parseInt(purple) +
            parseInt(green) +
            (parseInt(stones) ? parseInt(stones) : 0)
    }

    return (
        <div className="column">
            <Multiplier color="blue" update={(stars, number) => setBlue(stars * number)} starsPerTile={1}></Multiplier>
            <Multiplier color="yellow" update={(stars, number) => setYellow(stars * number)} starsPerTile={2}></Multiplier>
            <Multiplier color="red" update={(stars, number) => setRed(stars * number)} starsPerTile={2}></Multiplier>
            <Multiplier color="purple" update={(stars, number) => setPurple(stars * number)} starsPerTile={2}></Multiplier>
            <Multiplier color="green" update={(stars, number) => setGreen(stars * number)} starsPerTile={3}></Multiplier>
            <input className="stones"
                onFocus={() => setStones('')}
                onChange={(e) => setStones(parseInt(e.target.value) ? parseInt(e.target.value) : 0 )}
                value={stones} type="number"
                placeholder={0}></input>
            <div className="total"><span>{getTotal()}</span></div>
        </div>
    )
}

export default Column
