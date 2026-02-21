# Cifrador Clásico y Criptoanálisis: César y Atbash con Módulo Dinámico 
---
## Realizado por René De Anda Medina ISC B

Una aplicación web Frontend interactiva diseñada para aplicar, evaluar y vulnerar (mediante criptoanálisis de fuerza bruta) los algoritmos clásicos de sustitución: **César** y **Atbash**. 


**Demo en vivo:** [Despliegue en Netlify](https://cifrado-y-descifrado-renemed-isc.netlify.app/)
**Repositorio:** [Código fuente en GitHub](https://github.com/starcrash16/cifrador-cesar-y-at-bash)

---

## 🚀 Características Principales

* **Definición Dinámica del Módulo ($m$):** El sistema calcula automáticamente la longitud del conjunto de caracteres ingresado por el usuario, estableciendo este valor como el módulo para las operaciones aritméticas en anillo ($\mathbb{Z}_{m}$).
* **Sanitización Histórica Estricta:** Implementa una limpieza automática del texto plano. Cualquier carácter (como espacios o signos de puntuación) que no pertenezca al alfabeto definido por el usuario es ignorado y eliminado del criptograma. Esto previene vulnerabilidades de criptoanálisis basadas en la detección de la longitud de las palabras.
* **Criptoanálisis Automatizado:** Módulo de ataque por fuerza bruta iterativo que evalúa el criptograma contra todas las permutaciones posibles del módulo dinámico ($m$), permitiendo identificar visualmente la clave y el mensaje original.
* **Procesamiento Local Seguro:** Todo el procesamiento matemático y la manipulación de cadenas ocurren localmente en el navegador del cliente, garantizando cero exposición de datos sensibles a servidores de terceros.

---

## Arquitectura y Componentes del Proyecto

El proyecto está construido bajo el paradigma de aplicación web estática (*Vanilla Web Stack*), logrando una separación limpia entre estructura, presentación y lógica de negocio.

### 1. Estructura y Captura de Datos (`index.html`)
Actúa como el punto de entrada y la interfaz de usuario (UI). Se divide semánticamente en componentes clave:
* **Panel de Configuración Global:** Captura el vector de caracteres permitidos (el alfabeto base) que dictará las reglas matemáticas del resto del sistema.
* **Módulo de Encriptación:** Formularios de captura para el texto plano, selección del algoritmo (César/Atbash) y la clave de desplazamiento numérico.
* **Módulo de Criptoanálisis:** Interfaz dedicada a la ingesta de criptogramas vulnerados para su análisis exhaustivo.

### 2. Capa de Presentación (`styles.css`)
Garantiza una experiencia de usuario (UX) óptima y un diseño responsivo.
* Utiliza el modelo de caja estándar (`box-sizing: border-box`).
* Implementa jerarquía visual mediante variables de color orientadas a la ciberseguridad (tonos azules y grises).
* Incluye tipografía monoespaciada (`monospace`) específica para el campo del alfabeto, facilitando la validación visual de los caracteres permitidos por parte del usuario.

### 3. Motor Criptográfico y Lógica (`script.js`)
Es el núcleo matemático del sistema. Maneja la manipulación del DOM y la ejecución algorítmica:
* `algoritmoCesar(texto, desplazamiento, alfabetoBase)`: Aplica la fórmula $E(x) = (x + k) \pmod{m}$ iterando sobre el texto. Incorpora la lógica de sanitización automática al evaluar la existencia del carácter usando `indexOf()`.
* `algoritmoAtbash(texto, alfabetoBase)`: Ejecuta la reflexión matemática simétrica calculando $f(x) = (m - 1) - x$ sobre la longitud dinámica del alfabeto.
* **Controladores de Eventos (Event Listeners):** Orquestan el flujo de datos. Normalizan las entradas (removiendo diacríticos no deseados pero conservando caracteres nativos como la 'Ñ'), invocan las funciones criptográficas y renderizan el ataque de fuerza bruta inyectando los resultados directamente en el DOM.

---

## Instalación y Uso Local

Al ser una aplicación libre de dependencias y \`frameworks\`, no requiere configuración de servidores locales ni entornos como Node.js.

1. Clona este repositorio en tu máquina local:
   ```bash
   git clone [https://github.com/starcrash16/cifrador-cesar-y-at-bash.git](https://github.com/starcrash16/cifrador-cesar-y-at-bash.git)```
