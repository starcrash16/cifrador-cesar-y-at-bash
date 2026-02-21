/* =====================================================================
   1. VARIABLES Y PREPARACIÓN DE LA INTERFAZ
   ===================================================================== */

// Elementos de configuración general
const selectTipoCifrado = document.getElementById('tipo-cifrado');
const contenedorDesplazamiento = document.getElementById('contenedor-desplazamiento');
const inputAlfabeto = document.getElementById('alfabeto');

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
selectTipoCifrado.addEventListener('change', function () {
    if (this.value === 'atbash') {
        contenedorDesplazamiento.style.display = 'none';
    } else {
        contenedorDesplazamiento.style.display = 'block';
    }
});

/* =====================================================================
   2. FUNCIONES MATEMÁTICAS (MÓDULO DINÁMICO Y SANITIZACIÓN)
   ===================================================================== */

/**
 * Función para aplicar el Cifrado César
 * @param {string} texto - El texto original
 * @param {number} desplazamiento - La clave de salto
 * @param {string} alfabetoBase - El universo de caracteres permitidos
 */
function algoritmoCesar(texto, desplazamiento, alfabetoBase) {
    let resultado = "";
    let modulo = alfabetoBase.length;

    if (modulo === 0) return texto; // Protección de seguridad

    // Aseguramos un desplazamiento positivo incluso con números negativos
    let desp = (desplazamiento % modulo + modulo) % modulo;

    for (let i = 0; i < texto.length; i++) {
        let caracter = texto[i];
        let pos = alfabetoBase.indexOf(caracter);

        // SANITIZACIÓN: Si el caracter está en el alfabeto, se cifra.
        // Si no está (ej. un espacio o coma), el sistema lo ignora y lo elimina.
        if (pos !== -1) {
            resultado += alfabetoBase[(pos + desp) % modulo];
        }
    }
    return resultado;
}

/**
 * Función para aplicar el Cifrado Atbash
 * @param {string} texto - El texto original
 * @param {string} alfabetoBase - El universo de caracteres permitidos
 */
function algoritmoAtbash(texto, alfabetoBase) {
    let resultado = "";
    let modulo = alfabetoBase.length;

    if (modulo === 0) return texto;

    for (let i = 0; i < texto.length; i++) {
        let caracter = texto[i];
        let pos = alfabetoBase.indexOf(caracter);

        // SANITIZACIÓN: Solo reflejamos los caracteres válidos.
        if (pos !== -1) {
            resultado += alfabetoBase[(modulo - 1) - pos];
        }
    }
    return resultado;
}

/* =====================================================================
   3. EVENTOS DE LOS BOTONES (Conexión Lógica-Interfaz)
   ===================================================================== */

// Acción al presionar el botón "Cifrar"
btnCifrar.addEventListener('click', function () {
    // 1. Limpiamos acentos (á->a) conservando la Ñ, y pasamos todo a mayúsculas
    let texto = textoCifrar.value.toUpperCase().normalize("NFD").replace(/([aeiouAEIOU])\u0301/g, "$1");
    let metodo = selectTipoCifrado.value;
    // 2. Leemos el alfabeto que el usuario definió (también en mayúsculas por seguridad)
    let alfabetoActual = inputAlfabeto.value.toUpperCase();
    let resultado = "";

    if (texto.trim() === "" || alfabetoActual.trim() === "") {
        salidaCifrado.innerText = "Por favor, llena el texto y asegúrate de definir un alfabeto.";
        return;
    }

    // 3. Ejecutamos el cifrado correspondiente
    if (metodo === 'cesar') {
        let desp = parseInt(inputDesplazamiento.value) || 0;
        resultado = algoritmoCesar(texto, desp, alfabetoActual);
    } else if (metodo === 'atbash') {
        resultado = algoritmoAtbash(texto, alfabetoActual);
    }

    // 4. Mostramos el resultado limpio y cifrado
    salidaCifrado.innerText = resultado;
});

// Acción al presionar el botón "Analizar y Descifrar" (Fuerza Bruta)
btnDescifrar.addEventListener('click', function () {
    let textoSecreto = textoDescifrar.value.toUpperCase();
    let alfabetoActual = inputAlfabeto.value.toUpperCase();
    let modulo = alfabetoActual.length;

    if (textoSecreto.trim() === "" || modulo === 0) {
        salidaDescifrado.innerHTML = "<p>Por favor, ingresa un texto cifrado y define el alfabeto.</p>";
        return;
    }

    // Limpiamos la caja de resultados
    salidaDescifrado.innerHTML = "";

    // 1. Probamos con Atbash (Solo genera 1 resultado)
    let pruebaAtbash = algoritmoAtbash(textoSecreto, alfabetoActual);
    salidaDescifrado.innerHTML += `<strong>Posible Atbash:</strong> ${pruebaAtbash} <br><br>`;

    // 2. Probamos con César (Fuerza bruta iterando según el tamaño dinámico del módulo)
    salidaDescifrado.innerHTML += `<strong>Posible César (Probando las ${modulo} combinaciones del módulo):</strong><br>`;

    for (let i = 1; i <= modulo; i++) {
        // Para descifrar, desplazamos hacia adelante probando todas las claves posibles
        let pruebaCesar = algoritmoCesar(textoSecreto, i, alfabetoActual);
        salidaDescifrado.innerHTML += `<em>Clave ${modulo - i}:</em> ${pruebaCesar} <br>`;
    }

    salidaDescifrado.innerHTML += `<br><small><strong>Instrucción:</strong> Analiza la lista. El texto sin espacios que tenga sentido en español te indicará el método y clave correctos.</small>`;
});