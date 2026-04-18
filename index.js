const container = document.getElementById('container')
const btn = document.getElementById('btn')
const formatBtns = document.querySelectorAll('.format-btn')

let currentFormat = 'hex'

// --- Color generation & conversion ---

function randomHex() {
    return "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0').toUpperCase()
}

function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return { r, g, b }
}

function hexToHsl(hex) {
    let { r, g, b } = hexToRgb(hex)
    r /= 255; g /= 255; b /= 255
    const max = Math.max(r, g, b), min = Math.min(r, g, b)
    let h, s, l = (max + min) / 2

    if (max === min) {
        h = s = 0
    } else {
        const d = max - min
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
        switch (max) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
            case g: h = ((b - r) / d + 2) / 6; break
            case b: h = ((r - g) / d + 4) / 6; break
        }
    }

    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
    }
}

function formatColor(hex, format) {
    if (format === 'hex') return hex
    if (format === 'rgb') {
        const { r, g, b } = hexToRgb(hex)
        return `rgb(${r}, ${g}, ${b})`
    }
    if (format === 'hsl') {
        const { h, s, l } = hexToHsl(hex)
        return `hsl(${h}, ${s}%, ${l}%)`
    }
}

// Decide white or black label based on luminance
function getLabelColor(hex) {
    const { r, g, b } = hexToRgb(hex)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
    return luminance > 0.5 ? '#111111' : '#ffffff'
}

// --- State: store the current hex values ---
let currentColors = ['#CCCCCC', '#AAAAAA', '#888888', '#666666']

// --- Render boxes from current state ---
function renderBoxes() {
    const boxes = document.querySelectorAll('.box')
    boxes.forEach((box, i) => {
        const hex = currentColors[i]
        const label = formatColor(hex, currentFormat)
        const textColor = getLabelColor(hex)

        box.style.backgroundColor = hex
        box.innerHTML = ''

        const p = document.createElement('p')
        p.classList.add('text')
        p.textContent = label
        p.style.color = textColor

        const copyBtn = document.createElement('button')
        copyBtn.classList.add('copy-btn')
        copyBtn.textContent = 'Copy'
        copyBtn.style.color = textColor
        copyBtn.style.borderColor = textColor + '66'

        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(label).then(() => {
                copyBtn.textContent = 'Copied!'
                copyBtn.classList.add('copied')
                setTimeout(() => {
                    copyBtn.textContent = 'Copy'
                    copyBtn.classList.remove('copied')
                }, 1500)
            })
        })

        box.appendChild(p)
        box.appendChild(copyBtn)
    })
}

// --- Generate new colors ---
function generateColors() {
    currentColors = currentColors.map(() => randomHex())
    renderBoxes()
}

// --- Format switcher ---
formatBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        formatBtns.forEach(b => b.classList.remove('active'))
        btn.classList.add('active')
        currentFormat = btn.dataset.format
        renderBoxes()
    })
})

// --- Spacebar shortcut ---
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault()
        generateColors()
    }
})

btn.addEventListener('click', generateColors)

// Init with some colors on load
generateColors()