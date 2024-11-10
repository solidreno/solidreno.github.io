import { useState } from "react"
import Multiplier from "./Multiplier"

function Column () {

    let initMultipliers = []
    for(let i=0; i<5; i++)  {
        initMultipliers.push(<Multiplier></Multiplier>)
    }

    const [multipliers, setMultipliers] = useState(initMultipliers)

    function getTotal () {
        console.log(multipliers.reduce((sum, m) => sum + m.total, 0))
    }

    return (
        <div className="column">
            {multipliers.map((val, i) => {
                return val
            })}
            <button onClick={getTotal}>Total</button>
        </div>
    )
}

export default Column
