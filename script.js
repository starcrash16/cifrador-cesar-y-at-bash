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
            // NUEVO: Si es un espacio o salto de línea (\s), lo conservamos
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
            // NUEVO: Conservamos espacios en blanco
            resultado += caracter;
        }
    }
    return resultado;
}

/* =====================================================================
   3. MÓDULO DE CRIPTOANÁLISIS INTELIGENTE (DICCIONARIO)
   ===================================================================== */

// Banco de palabras comunes en español (conectores, pronombres, verbos comunes)
const bancoPalabras = [
    "EL", "LA", "LOS", "LAS", "UN", "UNA", "Y", "O", "PERO", "POR", "PARA",
    "CON", "SIN", "DE", "DEL", "EN", "QUE", "ES", "SON", "SE", "NO", "SI",
    "COMO", "MAS", "SU", "SUS", "AL", "ME", "TE", "LE", "LO", "ESTA", "ESTE",
    "A", "HOLA", "MUNDO", "SEGURIDAD", "SISTEMA"
];

/**
 * Función que evalúa un texto y le asigna puntos según cuántas 
 * palabras del diccionario encuentre.
 */
function evaluarTexto(texto) {
    // Separamos el texto por espacios para obtener un arreglo de palabras
    let palabras = texto.split(/\s+/);
    let puntuacion = 0;

    palabras.forEach(palabra => {
        if (bancoPalabras.includes(palabra)) {
            puntuacion++; // Si la palabra está en el banco, suma 1 punto
        }
    });

    return puntuacion;
}

/* =====================================================================
   4. EVENTOS DE LOS BOTONES
   ===================================================================== */

btnCifrar.addEventListener('click', function () {
    let texto = textoCifrar.value.toUpperCase().normalize("NFD").replace(/([aeiouAEIOU])\u0301/g, "$1");
    let metodo = selectTipoCifrado.value;
    let alfabetoActual = inputAlfabeto.value.toUpperCase();
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
    let textoSecreto = textoDescifrar.value.toUpperCase();
    let alfabetoActual = inputAlfabeto.value.toUpperCase();
    let modulo = alfabetoActual.length;

    if (textoSecreto.trim() === "" || modulo === 0) {
        salidaDescifrado.innerHTML = "<p>Por favor, ingresa un texto cifrado y define el alfabeto.</p>";
        return;
    }

    salidaDescifrado.innerHTML = "";

    // Arreglo para guardar todos los posibles resultados y sus puntuaciones
    let analisisFuerzaBruta = [];

    // 1. Probamos Atbash y lo guardamos
    let pruebaAtbash = algoritmoAtbash(textoSecreto, alfabetoActual);
    analisisFuerzaBruta.push({
        metodo: "Atbash",
        clave: "N/A",
        texto: pruebaAtbash,
        puntos: evaluarTexto(pruebaAtbash)
    });

    // 2. Probamos César iterando el módulo y lo guardamos
    for (let i = 1; i <= modulo; i++) {
        let pruebaCesar = algoritmoCesar(textoSecreto, i, alfabetoActual);
        analisisFuerzaBruta.push({
            metodo: "César",
            clave: modulo - i, // Mostramos la clave original que se usó para cifrar
            texto: pruebaCesar,
            puntos: evaluarTexto(pruebaCesar)
        });
    }

    // 3. ORDENAMIENTO: Ordenamos el arreglo de mayor a menor puntuación
    analisisFuerzaBruta.sort((a, b) => b.puntos - a.puntos);

    // 4. RENDERIZADO: Imprimimos los resultados ordenados
    salidaDescifrado.innerHTML += `<p><strong>Análisis completado. Los resultados con mayor probabilidad de ser correctos están arriba:</strong></p><br>`;

    analisisFuerzaBruta.forEach((resultado, index) => {
        // Si es el mejor resultado y tiene puntos, lo resaltamos visualmente
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