/* =====================================================================
   1. VARIABLES Y PREPARACIÓN DE LA INTERFAZ
   ===================================================================== */

// Primero, "atrapamos" los elementos del HTML usando su ID para poder manipularlos.
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
   2. FUNCIONES MATEMÁTICAS DE CIFRADO (El corazón del programa)
   ===================================================================== */

/**
 * Función para aplicar el Cifrado César
 * @param {string} texto - El texto original
 * @param {number} desplazamiento - Cuántas posiciones mover la letra
 */
function algoritmoCesar(texto, desplazamiento) {
    let resultado = "";
    // Aseguramos que el desplazamiento sea un número positivo entre 0 y 25 (módulo 26)
    desplazamiento = (desplazamiento % 26 + 26) % 26;

    // Recorremos el texto letra por letra
    for (let i = 0; i < texto.length; i++) {
        let caracter = texto[i];

        // Verificamos si es una letra del alfabeto inglés (ignora números y símbolos)
        if (caracter.match(/[a-z]/i)) {
            // Obtenemos el código ASCII de la letra
            let codigoAscii = texto.charCodeAt(i);

            // Determinamos si es mayúscula (65 es 'A') o minúscula (97 es 'a')
            let base = (codigoAscii >= 65 && codigoAscii <= 90) ? 65 : 97;

            // Fórmula matemática del César: (Letra - Base + Desplazamiento) mod 26 + Base
            let nuevaLetra = String.fromCharCode(((codigoAscii - base + desplazamiento) % 26) + base);
            console.log("Prueba: " + nuevaLetra);
            resultado += nuevaLetra;
        } else {
            // Si es un espacio, coma o número, lo dejamos igual
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

    for (let i = 0; i < texto.length; i++) {
        let caracter = texto[i];

        if (caracter.match(/[a-z]/i)) {
            let codigoAscii = texto.charCodeAt(i);
            let base = (codigoAscii >= 65 && codigoAscii <= 90) ? 65 : 97;

            // Fórmula de Atbash: Invertir la posición en el alfabeto
            // Ejemplo: 'A' (posición 0) se convierte en la posición 25 ('Z')
            let nuevaLetra = String.fromCharCode(base + (25 - (codigoAscii - base)));
            resultado += nuevaLetra;
        } else {
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
        let desp = parseInt(inputDesplazamiento.value);
        resultado = algoritmoCesar(texto, desp);
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

    // 1. Probamos con Atbash (solo hay 1 resultado posible)
    let pruebaAtbash = algoritmoAtbash(textoSecreto);
    salidaDescifrado.innerHTML += `<strong>Atbash:</strong> ${pruebaAtbash} <br><br>`;

    // 2. Probamos todas las 25 combinaciones posibles del Cifrado César
    salidaDescifrado.innerHTML += `<strong>César (Probando todas las claves):</strong><br>`;

    // Un ciclo del 1 al 25
    for (let i = 1; i <= 25; i++) {
        // Para descifrar César, simplemente desplazamos hacia adelante el resto del alfabeto
        let pruebaCesar = algoritmoCesar(textoSecreto, i);

        // Creamos un párrafo para cada intento y lo agregamos al HTML
        salidaDescifrado.innerHTML += `<em>Clave ${26 - i}:</em> ${pruebaCesar} <br>`;
    }

    salidaDescifrado.innerHTML += `<br><small><strong>Instrucción:</strong> Lee la lista de arriba. La oración que esté en español claro te indicará qué método y qué clave se usó.</small>`;
});