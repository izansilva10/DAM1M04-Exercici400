// Mida del tauler
const FILES = 3;
const COLUMNES = 3;

// Estat inicial resolt
const taulerResolt = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 0]
];

// Estat actual (començarem amb el tauler resolt per provar)
let tauler = JSON.parse(JSON.stringify(taulerResolt)); // còpia profunda

let moviments = 0;

// Elements del DOM
const gridElement = document.getElementById('puzzle-grid');
const movimentSpan = document.getElementById('moviment-count');
const resetButton = document.getElementById('reset-button');
const missatgeDiv = document.getElementById('missatge');

// Funció per dibuixar el tauler
function renderTauler() {
    gridElement.innerHTML = ''; // Netejar

    for (let fila = 0; fila < FILES; fila++) {
        for (let col = 0; col < COLUMNES; col++) {
            const valor = tauler[fila][col];
            const casella = document.createElement('div');
            casella.className = 'casella';
            if (valor === 0) {
                casella.classList.add('buit');
                casella.textContent = '';
            } else {
                casella.textContent = valor;
            }
            // Afegir event listener (de moment buit)
            casella.addEventListener('click', () => clicCasella(fila, col));
            gridElement.appendChild(casella);
        }
    }
}

// Funció que es crida quan es clica una casella
function clicCasella(fila, col) {
    console.log(`Has clicat la casella (${fila}, ${col}) amb valor ${tauler[fila][col]}`);
    // Aquí després hi posarem la lògica de moviment
}

// Funció per reiniciar (de moment només torna al resolt)
function reiniciar() {
    tauler = JSON.parse(JSON.stringify(taulerResolt));
    moviments = 0;
    movimentSpan.textContent = moviments;
    missatgeDiv.textContent = '';
    renderTauler();
}

// Event listener del botó reset
resetButton.addEventListener('click', reiniciar);

// Inicialitzar
renderTauler();

// Troba la posició del buit (retorna {fila, col})
function trobaBuit() {
    for (let f = 0; f < FILES; f++) {
        for (let c = 0; c < COLUMNES; c++) {
            if (tauler[f][c] === 0) {
                return { fila: f, columna: c };
            }
        }
    }
    return null; // no hauria de passar mai
}

function clicCasella(fila, col) {
    const buit = trobaBuit();
    const df = fila - buit.fila;
    const dc = col - buit.columna;

    if (Math.abs(df) + Math.abs(dc) === 1) {
        console.log('Moviment vàlid!');
        // Aquí farem l'intercanvi després
    } else {
        console.log('Moviment invalid!');
    }
}

function clicCasella(fila, col) {
    const buit = trobaBuit();
    const df = fila - buit.fila;
    const dc = col - buit.columna;

    if (Math.abs(df) + Math.abs(dc) === 1) {
        // Intercanviar valors a la matriu
        tauler[buit.fila][buit.columna] = tauler[fila][col];
        tauler[fila][col] = 0;

        // Incrementar moviments
        moviments++;
        movimentSpan.textContent = moviments;

        // Tornar a dibuixar el tauler
        renderTauler();

        // Comprovar si està resolt
        comprovaResolt();
    }
}

function comprovaResolt() {
    for (let f = 0; f < FILES; f++) {
        for (let c = 0; c < COLUMNES; c++) {
            if (tauler[f][c] !== taulerResolt[f][c]) {
                return; // encara no està resolt
            }
        }
    }
    // Si arribem aquí, està resolt!
    missatgeDiv.textContent = `Has resolt el puzle en ${moviments} moviments.`;
}