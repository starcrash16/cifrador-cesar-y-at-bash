/* =====================================================================
   1. VARIABLES Y PREPARACIÓN DE LA INTERFAZ
   ===================================================================== */

const selectTipoCifrado = document.getElementById('tipo-cifrado');
const contenedorDesplazamiento = document.getElementById('contenedor-desplazamiento');
const inputAlfabeto = document.getElementById('alfabeto');

const inputDesplazamiento = document.getElementById('desplazamiento');
const textoCifrar = document.getElementById('texto-cifrar');
const btnCifrar = document.getElementById('btn-cifrar');
const salidaCifrado = document.getElementById('salida-cifrado');

const textoDescifrar = document.getElementById('texto-descifrar');
const btnDescifrar = document.getElementById('btn-descifrar');
const salidaDescifrado = document.getElementById('salida-descifrado');

selectTipoCifrado.addEventListener('change', function () {
    if (this.value === 'atbash') {
        contenedorDesplazamiento.style.display = 'none';
    } else {
        contenedorDesplazamiento.style.display = 'block';
    }
});

/* =====================================================================
   2. FUNCIONES MATEMÁTICAS (CON CONSERVACIÓN DE ESPACIOS)
   ===================================================================== */

function algoritmoCesar(texto, desplazamiento, alfabetoBase) {
    let resultado = "";
    let modulo = alfabetoBase.length;

    if (modulo === 0) return texto;

    let desp = (desplazamiento % modulo + modulo) % modulo;

    for (let i = 0; i < texto.length; i++) {
        let caracter = texto[i];
        let pos = alfabetoBase.indexOf(caracter);

        if (pos !== -1) {
            resultado += alfabetoBase[(pos + desp) % modulo];
        } else if (caracter.match(/\s/)) {
            // Conservamos espacios y saltos de línea para la legibilidad
            resultado += caracter;
        }
    }
    return resultado;
}

function algoritmoAtbash(texto, alfabetoBase) {
    let resultado = "";
    let modulo = alfabetoBase.length;

    if (modulo === 0) return texto;

    for (let i = 0; i < texto.length; i++) {
        let caracter = texto[i];
        let pos = alfabetoBase.indexOf(caracter);

        if (pos !== -1) {
            resultado += alfabetoBase[(modulo - 1) - pos];
        } else if (caracter.match(/\s/)) {
            resultado += caracter;
        }
    }
    return resultado;
}

/* =====================================================================
   3. MÓDULO DE CRIPTOANÁLISIS INTELIGENTE (DICCIONARIO)
   ===================================================================== */

// Banco de palabras comunes en español (en mayúsculas y sin acentos para la comparación)
const bancoPalabras = [
    "EL", "LA", "LOS", "LAS", "UN", "UNA", "Y", "O", "PERO", "POR", "PARA",
    "CON", "SIN", "DE", "DEL", "EN", "QUE", "ES", "SON", "SE", "NO", "SI",
    "COMO", "MAS", "SU", "SUS", "AL", "ME", "TE", "LE", "LO", "ESTA", "ESTE",
    "A", "HOLA", "MUNDO", "SEGURIDAD", "SISTEMA"
];

function evaluarTexto(texto) {
    // Para calificar, convertimos temporalmente el texto a mayúsculas y le quitamos los acentos.
    // Así, si el texto dice "Está", el sistema lo lee como "ESTA" y lo encuentra en el diccionario.
    let textoLimpio = texto.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    let palabras = textoLimpio.split(/\s+/);
    let puntuacion = 0;

    palabras.forEach(palabra => {
        if (bancoPalabras.includes(palabra)) {
            puntuacion++;
        }
    });

    return puntuacion;
}

/* =====================================================================
   4. EVENTOS DE LOS BOTONES
   ===================================================================== */

btnCifrar.addEventListener('click', function () {
    // Ya no convertimos a mayúsculas ni quitamos acentos para respetar el texto exacto del usuario
    let texto = textoCifrar.value;
    let metodo = selectTipoCifrado.value;
    let alfabetoActual = inputAlfabeto.value;
    let resultado = "";

    if (texto.trim() === "" || alfabetoActual.trim() === "") {
        salidaCifrado.innerText = "Por favor, llena el texto y asegúrate de definir un alfabeto.";
        return;
    }

    if (metodo === 'cesar') {
        let desp = parseInt(inputDesplazamiento.value) || 0;
        resultado = algoritmoCesar(texto, desp, alfabetoActual);
    } else if (metodo === 'atbash') {
        resultado = algoritmoAtbash(texto, alfabetoActual);
    }

    salidaCifrado.innerText = resultado;
});

btnDescifrar.addEventListener('click', function () {
    let textoSecreto = textoDescifrar.value;
    let alfabetoActual = inputAlfabeto.value;
    let modulo = alfabetoActual.length;

    if (textoSecreto.trim() === "" || modulo === 0) {
        salidaDescifrado.innerHTML = "<p>Por favor, ingresa un texto cifrado y define el alfabeto.</p>";
        return;
    }

    salidaDescifrado.innerHTML = "";

    let analisisFuerzaBruta = [];

    // 1. Probamos Atbash
    let pruebaAtbash = algoritmoAtbash(textoSecreto, alfabetoActual);
    analisisFuerzaBruta.push({
        metodo: "Atbash",
        clave: "N/A",
        texto: pruebaAtbash,
        puntos: evaluarTexto(pruebaAtbash)
    });

    // 2. Probamos César
    for (let i = 1; i <= modulo; i++) {
        let pruebaCesar = algoritmoCesar(textoSecreto, i, alfabetoActual);
        analisisFuerzaBruta.push({
            metodo: "César",
            clave: modulo - i,
            texto: pruebaCesar,
            puntos: evaluarTexto(pruebaCesar)
        });
    }

    // 3. Ordenamos de mayor a menor puntuación
    analisisFuerzaBruta.sort((a, b) => b.puntos - a.puntos);

    // 4. Imprimimos resultados
    salidaDescifrado.innerHTML += `<p><strong>Análisis completado. Los resultados con mayor probabilidad de ser correctos están arriba:</strong></p><br>`;

    analisisFuerzaBruta.forEach((resultado, index) => {
        let estiloResaltado = (index === 0 && resultado.puntos > 0)
            ? "background-color: #d4edda; border-left: 5px solid #28a745; padding: 10px; border-radius: 4px;"
            : "padding: 5px 0;";

        salidaDescifrado.innerHTML += `
            <div style="${estiloResaltado}">
                <strong>${resultado.metodo} (Clave: ${resultado.clave})</strong> - Puntos: ${resultado.puntos} <br>
                <em>${resultado.texto}</em>
            </div>
            <hr style="margin: 10px 0; border: 0; border-top: 1px solid #eee;">
        `;
    });
});