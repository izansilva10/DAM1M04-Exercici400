// Mida del tauler
const FILES = 3;
const COLUMNES = 3;

// Estat inicial resolt
const taulerResolt = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 0]
];

// Estat actual (començarà barrejat gràcies a reiniciar)
let tauler = [];
let moviments = 0;

// Elements del DOM
const gridElement = document.getElementById('puzzle-grid');
const movimentSpan = document.getElementById('moviment-count');
const resetButton = document.getElementById('reset-button');
const missatgeDiv = document.getElementById('missatge');

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

// Barreja el tauler fent moviments aleatoris
function barrejaTauler(iteracions = 100) {
    for (let i = 0; i < iteracions; i++) {
        const buit = trobaBuit();
        const movimentsPossibles = [];

        const direccions = [
            { df: -1, dc: 0 }, // amunt
            { df: 1, dc: 0 },  // avall
            { df: 0, dc: -1 }, // esquerra
            { df: 0, dc: 1 }   // dreta
        ];

        for (const dir of direccions) {
            const novaFila = buit.fila + dir.df;
            const novaCol = buit.columna + dir.dc;
            if (novaFila >= 0 && novaFila < FILES && novaCol >= 0 && novaCol < COLUMNES) {
                movimentsPossibles.push({ fila: novaFila, col: novaCol });
            }
        }

        const mov = movimentsPossibles[Math.floor(Math.random() * movimentsPossibles.length)];
        tauler[buit.fila][buit.columna] = tauler[mov.fila][mov.col];
        tauler[mov.fila][mov.col] = 0;
    }
}

// Dibuixa el tauler al DOM
function renderTauler() {
    gridElement.innerHTML = ''; // Netejar
    gridElement.style.position = 'relative';
    gridElement.style.width = '300px';
    gridElement.style.height = '300px';

    for (let fila = 0; fila < FILES; fila++) {
        for (let col = 0; col < COLUMNES; col++) {
            const valor = tauler[fila][col];
            const casella = document.createElement('div');
            casella.className = 'casella';
            
            // Asignar la posición visual según la posición EN LA MATRIZ (no según el número)
            casella.style.transform = `translate(${col * 100}px, ${fila * 100}px)`;
            
            if (valor === 0) {
                casella.classList.add('buit');
                casella.textContent = ''; // Vacío
            } else {
                // Para depuración, dejamos el número pequeño (luego lo quitamos)
                casella.textContent = valor;
                
                // Asignar el fragmento de imagen según el NÚMERO de la pieza (1-8)
                // Pero OJO: la posición de la imagen depende de dónde DEBERÍA estar esa pieza
                // cuando el puzzle esté resuelto. Es decir, la pieza con número 1 debe mostrar
                // la esquina superior izquierda de la imagen.
                
                // Calculamos la fila y columna que le tocaría a esta pieza en el estado resuelto
                const filaResolt = Math.floor((valor - 1) / COLUMNES);
                const colResolt = (valor - 1) % COLUMNES;
                
                // Ajustamos el background-position para que muestre ese fragmento
                casella.style.backgroundPosition = `-${colResolt * 100}px -${filaResolt * 100}px`;
            }
            
            casella.addEventListener('click', () => clicCasella(fila, col));
            gridElement.appendChild(casella);
        }
    }
}

// Comprova si el tauler està resolt
function comprovaResolt() {
    for (let f = 0; f < FILES; f++) {
        for (let c = 0; c < COLUMNES; c++) {
            if (tauler[f][c] !== taulerResolt[f][c]) {
                return false;
            }
        }
    }
    return true;
}

// Gestiona el clic a una casella
function clicCasella(fila, col) {
    const buit = trobaBuit();
    const df = fila - buit.fila;
    const dc = col - buit.columna;

    if (Math.abs(df) + Math.abs(dc) === 1) {
        // Moviment vàlid: intercanvi
        tauler[buit.fila][buit.columna] = tauler[fila][col];
        tauler[fila][col] = 0;

        moviments++;
        movimentSpan.textContent = moviments;

        renderTauler();

        if (comprovaResolt()) {
            missatgeDiv.textContent = `Has resolt el puzle en ${moviments} moviments.`;
        } else {
            missatgeDiv.textContent = ''; // neteja missatge si no està resolt
        }
    }
    // Si no és adjacent, no fem res
}

// Reinicia el joc: tauler barrejat, moviments a 0, missatge net
function reiniciar() {
    tauler = JSON.parse(JSON.stringify(taulerResolt)); // partim del resolt
    barrejaTauler(100);                                 // el barregem
    moviments = 0;
    movimentSpan.textContent = moviments;
    missatgeDiv.textContent = '';
    renderTauler();
}

// Inicialitzar
reiniciar(); // això ja fa la barreja inicial

// Event listener del botó reset
resetButton.addEventListener('click', reiniciar);