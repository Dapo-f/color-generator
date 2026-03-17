const container = document.getElementById('container')
const btn = document.getElementById('btn')
const divs = document.querySelectorAll('.box')

// color generator function
function RandomClr() {
    return "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6,'0').toUpperCase();
}

function ColorGenerator() {
    divs.forEach(
        (div) => {
            const p = document.createElement('p')
            div.style.backgroundColor = RandomClr()
            div.innerHTML = ""
            p.innerHTML = RandomClr()
            p.classList.add('text')
            div.appendChild(p)
        }
    )
}

btn.addEventListener('click', function() {
    ColorGenerator()
})