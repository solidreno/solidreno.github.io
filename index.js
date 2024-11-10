const nbJoueur = 2
const content = document.querySelector('#content')

for(let i=0; i<nbJoueur; i++) {
    addColumn()
}

function addColumn() {
    let col = document.createElement('div')
    col.className = 'col'
    col.appendChild(getMultiplyElem())
    content.appendChild(col)
}

function getMultiplyElem(type) {
    let div = document.createElement('div')
    div.className = 'multiplyElem'

    let stars = document.createElement('select')
    for(let i = 0; i<10; i++) {
        let option = document.createElement('option')
        option.innerText = type == 'GREEN' ? i * 3 : i * 2
        option.value = type == 'GREEN' ? i * 3 : i * 2
        stars.appendChild(option)
    }
    stars.className = 'stars'
    
    let number = document.createElement('input')
    number.type = 'number'
    number.placeholder = 0
    number.min = 0
    
    let total = document.createElement('span')
    total.innerText = 0
    
    stars.addEventListener('change', () => {recalculate(stars, number, total)})
    number.addEventListener('change', () => {recalculate(stars, number, total)})

    div.appendChild(stars)
    div.appendChild(number)
    div.appendChild(total)

    return div
}

function recalculate(stars, number, total) {
    total.innerText = stars.value * number.value
}