# Tablero docente de Fisioterapia

Herramienta interactiva para repartir asignaturas, prácticas y funciones administrativas entre 36 profesores. Retoma la propuesta de 162 créditos y mantiene los ajustes de grupos acordados: 75 espacios y 566 horas docentes semanales.

## Abrir y usar

Abre `Tablero_docente.html` directamente en el navegador. El archivo ya está compilado; no requiere instalar dependencias ni mantener un servidor activo. También puedes abrir `index.html`.

Mantén el mismo archivo, ubicación y navegador para conservar la memoria local. Antes de cambiar de archivo, servidor, equipo o sitio web, descarga **Guardar escenario JSON**. En el nuevo lugar usa **Abrir escenario**. El repositorio contiene código y datos de referencia; no contiene lo que se ha llenado en el navegador ni sincroniza esas sesiones con GitHub.

## Qué permite

- Listado fijo de docentes, búsqueda por nombre, vinculación y perfil.
- Panel de 4 × 4 fichas, búsqueda de labores y filtros de cobertura.
- Una ficha por asignatura con sus grupos internos y asignaciones independientes.
- Categorías Neurológica, Cardiopulmonar y Osteomuscular para equipos interdisciplinares.
- Sesiones, copias anteriores, exportación/importación JSON y recuperación de reparto.
- Reparto automático según afinidad y ocupación de jornada, preservando asignaciones manuales.
- Reunión de Departamento de 2 h por profesor, seis coordinaciones de práctica de 2 h, coordinación general de prácticas de 8 h y cargos de programa de 20 h.
- Resumen de carga directa, preparación, administración, reuniones y pendientes.

## Desarrollo

Con Node.js 20 o posterior:

```sh
npm run build
npm test
npm start
```

No hace falta `npm install`: se utilizan los módulos incluidos en Node.js. El servidor opcional escucha en `http://127.0.0.1:8766/` y guarda sesiones e historial en `memoria-tablero/`, excluida de Git. Mantén abierto el proceso del servidor mientras lo uses.

| Ruta | Contenido |
|---|---|
| `src/template.html` | Estructura de la interfaz |
| `src/styles.css` | Estilos, paneles y disposición adaptable |
| `src/app.js` | Interacciones, sesiones, migraciones y cálculos de vista |
| `src/staffing.js` | Reglas administrativas y distribución de carga |
| `data/` | Docentes y mallas de referencia; sin sesiones personales |
| `scripts/` | Compilación y ejecución de pruebas |
| `tests/` | Recuperación de sesiones, migraciones, reparto y API local |
| `MANUAL.md` | Decisiones y funcionamiento detallado |

Edita las fuentes y ejecuta `npm run build` para regenerar los dos HTML. La compilación comprueba la sintaxis del programa y no modifica las sesiones. Se conservaron las claves de memoria y los identificadores de asignaturas y grupos.

La optimización calcula cargas y cobertura una sola vez por actualización de pantalla, usa índices por asignatura y grupo y conserva la posición de desplazamiento al actualizar el panel.

## Subir a GitHub

1. Crea un repositorio, preferiblemente privado: los datos de referencia contienen nombres y perfiles docentes.
2. Extrae el ZIP y sube el contenido de esta carpeta, incluidos `.github/`, `.gitignore` y `.gitattributes`.
3. El flujo de validación ejecutará la compilación y las pruebas en cada cambio. No publica una página web automáticamente.

También puedes inicializar Git y subirlo con las herramientas habituales. El ZIP no contiene credenciales ni el directorio interno `.git`.

## Límites del cálculo

La distribución es una propuesta heurística, no un óptimo matemático certificado ni un horario que compruebe simultaneidades. Cuenta la preparación según el factor de la sesión; las nuevas asignaciones respetan la jornada simulada y topes directos de 20 h TC y 12 h MT. Las sobrecargas manuales se conservan y señalan. Se prefiere una práctica por docente, pero no se garantiza exclusividad.

La apertura automática de una sesión antigua puede aplicar las funciones y el reparto autorizados una sola vez, conservando una copia previa. El JSON de respaldo es la forma de transportar el trabajo a otro origen o navegador.
