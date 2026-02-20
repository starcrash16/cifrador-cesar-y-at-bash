/* =====================================================================
   1. VARIABLES Y PREPARACIÓN DE LA INTERFAZ
   ===================================================================== */

// elementos del HTML conectados con su ID para poder manipularlos
const selectTipoCifrado = document.getElementById('tipo-cifrado');
const contenedorDesplazamiento = document.getElementById('contenedor-desplazamiento');

// Elementos de la sección de Cifrar
const inputDesplazamiento = document.getElementById('desplazamiento');
const textoCifrar = document.getElementById('texto-cifrar');
const btnCifrar = document.getElementById('btn-cifrar');
const salidaCifrado = document.getElementById('salida-cifrado');

// Elementos de la sección de Descifrar
const textoDescifrar = document.getElementById('texto-descifrar');
const btnDescifrar = document.getElementById('btn-descifrar');
const salidaDescifrado = document.getElementById('salida-descifrado');

// EVENTO: Ocultar o mostrar el campo de "Clave" si se elige Atbash
// Atbash no usa clave, así que si el usuario lo selecciona, escondemos ese input.
selectTipoCifrado.addEventListener('change', function () {
    if (this.value === 'atbash') {
        contenedorDesplazamiento.style.display = 'none';
    } else {
        contenedorDesplazamiento.style.display = 'block'; // 'block' lo vuelve a mostrar
    }
});

/* =====================================================================
   2. FUNCIONES MATEMÁTICAS DE CIFRADO
   ===================================================================== */

// Definimos nuestros alfabetos base globales
const alfabetoMayus = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ";
const alfabetoMinus = "abcdefghijklmnñopqrstuvwxyz";

/**
 * Función para aplicar el Cifrado César
 * @param {string} texto - El texto original
 * @param {number} desplazamiento - Cuántas posiciones mover la letra
 */
function algoritmoCesar(texto, desplazamiento) {
    let resultado = "";
    desplazamiento = (desplazamiento % 27 + 27) % 27;

    for (let i = 0; i < texto.length; i++) {
        let caracter = texto[i];

        if (alfabetoMayus.includes(caracter)) {
            // Buscamos la posición actual de la letra 0 a 26
            let posicionActual = alfabetoMayus.indexOf(caracter);

            // Calculamos la nueva posición en el módulo 27
            let nuevaPosicion = (posicionActual + desplazamiento) % 27;

            // Añadimos la nueva letra al resultado
            resultado += alfabetoMayus[nuevaPosicion];
            // Verificamos si es una letra Minúscula de nuestro alfabeto
        } else if (alfabetoMinus.includes(caracter)) {
            let posicionActual = alfabetoMinus.indexOf(caracter);
            let nuevaPosicion = (posicionActual + desplazamiento) % 27;
            resultado += alfabetoMinus[nuevaPosicion];
        } else {
            resultado += caracter;
        }
    }
    return resultado;
}

/**
 * Función para aplicar el Cifrado Atbash
 * @param {string} texto - El texto original
 */
function algoritmoAtbash(texto) {
    let resultado = "";

    // Recorremos el texto letra por letra
    for (let i = 0; i < texto.length; i++) {
        let caracter = texto[i];

        // Verificamos si es una letra MAYÚSCULA de nuestro alfabeto español
        if (alfabetoMayus.includes(caracter)) {
            // Buscamos su posición (0 a 26)
            let posicionActual = alfabetoMayus.indexOf(caracter);

            // Fórmula Atbash para 27 letras: Índice máximo (26) menos la posición actual
            let nuevaPosicion = 26 - posicionActual;

            resultado += alfabetoMayus[nuevaPosicion];

            // Verificamos si es una letra MINÚSCULA
        } else if (alfabetoMinus.includes(caracter)) {
            let posicionActual = alfabetoMinus.indexOf(caracter);
            let nuevaPosicion = 26 - posicionActual;
            resultado += alfabetoMinus[nuevaPosicion];

        } else {
            // Si no está en nuestros alfabetos (números, espacios, signos), no lo tocamos
            resultado += caracter;
        }
    }
    return resultado;
}
/* =====================================================================
   3. EVENTOS DE LOS BOTONES (Conectar interfaz con matemáticas)
   ===================================================================== */

// Acción al presionar el botón "Cifrar"
btnCifrar.addEventListener('click', function () {
    let texto = textoCifrar.value;
    let metodo = selectTipoCifrado.value;
    let resultado = "";

    if (texto.trim() === "") {
        salidaCifrado.innerText = "Por favor, escribe un texto para cifrar.";
        return; // Detiene la ejecución si está vacío
    }

    if (metodo === 'cesar') {
        // Obtenemos el número ingresado por el usuario y lo convertimos a entero (parseInt)
        let desp = parseInt(inputDesplazamiento.value) || 0; resultado = algoritmoCesar(texto, desp);
    } else if (metodo === 'atbash') {
        resultado = algoritmoAtbash(texto);
    }
    console.log("Prueba de cifrar:" + resultado);
    // Mostramos el resultado en el HTML
    salidaCifrado.innerText = resultado;
});

// Acción al presionar el botón "Analizar y Descifrar" (Fuerza Bruta)
btnDescifrar.addEventListener('click', function () {
    let textoSecreto = textoDescifrar.value;

    if (textoSecreto.trim() === "") {
        salidaDescifrado.innerHTML = "<p>Por favor, escribe un texto cifrado.</p>";
        return;
    }

    // Limpiamos la caja de resultados antes de imprimir la nueva lista
    salidaDescifrado.innerHTML = "";

    // 1. Probamos con Atbash
    let pruebaAtbash = algoritmoAtbash(textoSecreto);
    salidaDescifrado.innerHTML += `<strong>Atbash:</strong> ${pruebaAtbash} <br><br>`;

    // 2. Probamos todas las combinaciones posibles del Cifrado César (Ahora son 26 claves)
    salidaDescifrado.innerHTML += `<strong>César (Probando todas las claves):</strong><br>`;

    // Un ciclo del 1 al 26 (ya que el módulo es 27)
    for (let i = 1; i <= 26; i++) {
        // Desplazamos hacia adelante para encontrar el texto original
        let pruebaCesar = algoritmoCesar(textoSecreto, i);

        // Ajustamos la etiqueta para que muestre la clave correcta (27 - i)
        salidaDescifrado.innerHTML += `<em>Clave ${27 - i}:</em> ${pruebaCesar} <br>`;
    }

    salidaDescifrado.innerHTML += `<br><small><strong>Instrucción:</strong> Lee la lista de arriba. La oración que esté en español claro te indicará qué método y qué clave se usó.</small>`;
});