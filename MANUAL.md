# Tablero de Fisioterapia

## Abrir sin servidor

Abre Tablero_docente.html en tu navegador habitual o haz doble clic en Abrir_HTML.cmd. Este modo no usa localhost y no necesita que el chat permanezca activo.

## Conservar las sesiones

El guardado automático conserva cada sesión con sus asignaciones, perfiles, jornadas y demandas administrativas en el almacenamiento del navegador. El indicador de guardado confirma cada revisión. Usa «Guardar como nueva sesión» para conservar alternativas y el selector para recuperarlas. Usa «Guardar escenario JSON» para disponer de un respaldo transportable y «Abrir escenario» para recuperarlo.

Conserva el mismo nombre y ubicación del HTML al actualizar el código. No borres los datos del navegador. Los navegadores pueden tratar de forma diferente el almacenamiento de archivos locales; el JSON es el respaldo independiente del navegador. El tablero avisa si no puede guardar.

## Modo servidor opcional

Abrir_tablero.ps1 inicia el servidor local en el puerto 8766 si el equipo autoriza su ejecución y requiere Node.js instalado. Las sesiones de este modo se guardan además en memoria-tablero, con revisiones anteriores en historial. No elimines esa carpeta al actualizar el código. Los modos archivo y servidor tienen almacenamientos de navegador distintos; usa el JSON para trasladar escenarios entre ellos.

## Contenido

Se retoma la malla original de 162 créditos, con 50 asignaturas visibles en «Malla completa». El tablero de carga incluye las asignaturas del Departamento, 36 docentes y 75 espacios por grupo, con demanda total de 566 horas docentes semanales, manteniendo los ajustes acordados. Las asignaturas de servicio siguen fuera de la asignación del Departamento. Cada asignatura reúne sus grupos en una ficha. Evaluación y Diagnóstico I, II y III y Técnicas de Intervención I, II y III tienen tres grupos de 2 horas cada una. Internación reúne sus seis grupos y rotaciones en una sola ficha.

Se muestran también jefatura de Departamento y coordinación académica (20 horas semanales cada una, por decisión del usuario), liderazgo de calidad (horas pendientes) y administración por identificar (1,44 horas provisionales según el histórico). Por instrucción del usuario se añaden Coordinador de prácticas (2 horas semanales) y Coordinación de prácticas general (8 horas semanales).

No se suman funciones históricas a la carga. Desde la versión 07 se preservan todas las asignaciones existentes al abrir escenarios anteriores; ya no se ejecuta el vaciado de versiones antiguas. Antes de volver a 162 créditos se guarda una copia en fisio-before-plan162-v1. Los registros originales del vaciado antiguo, si existen, se conservan en fisio-before-empty-v1.

La mezcla de profesores de diferentes áreas se considera intencional. Las tres categorías son Neurológica, Cardiopulmonar y Osteomuscular. El tablero propone las tres etiquetas cuando identifica al menos dos profesores con áreas clínicas distintas en sus perfiles. Puedes añadir o retirar la categoría triple desde cada ficha, sin modificar ninguna asignación. El botón «Resumen de lo asignado» muestra la distribución de la sesión cargada. La detección es orientativa; no constituye verificación de la formación profesional.

Al recuperar las materias que estaban fusionadas, no se reparten sus profesores automáticamente entre asignaturas. Se conservan los registros bajo los códigos existentes y se señalan las fusiones para revisión. Las asignaturas recuperadas quedan pendientes de asignar. Para compartir el reparto exacto con el asistente, descarga «Guardar escenario JSON» y adjunta ese archivo al chat.

No se impide asignar sobrecarga ni se resuelven automáticamente las restricciones de afinidad, exclusividad de práctica o simultaneidad horaria. La herramienta muestra alertas para revisar las decisiones.

Consulta Externa (P4) tiene 6 grupos de 13 horas semanales cada uno, 78 horas en total, por instrucción del usuario. Conservar sus IDs P4-G1 a P4-G6 y las asignaciones existentes.

Internación reúne 6 grupos en una ficha: 4 de 6,5 h y 2 de 13 h, total 52 h por semana. Las asignaciones de los cuatro grupos cardiopulmonares anteriores se reúnen por parejas en los dos grupos de 13 h, conservando las horas y los docentes asignados.

## Reuniones, funciones fijas y reparto equitativo

Al abrir la versión 08, cada sesión aplica una sola vez las instrucciones nuevas, guardando antes una copia completa en fisio-before-staffing-v1. Se asignan 2 horas de reunión de Departamento a los 36 profesores; la tarjeta muestra 72 horas sumadas entre asistentes, no 72 horas para cada persona.

Cristina Eugenia Restrepo Puentes recibe 8 horas de coordinación general de prácticas, Diego Fernando Afanador Restrepo 20 horas de coordinación del programa y Luz Ángela Tovar Ruiz 20 horas de jefatura del programa. Cada una de las seis prácticas tiene además un coordinador con 2 horas, escogido entre su equipo o incorporado a su docencia si estaba vacía. La coordinación individual anterior se sustituye por estas seis.

El cálculo completa las 566 horas docentes pendientes según perfiles, histórico y ocupación proporcional de la jornada. Conserva las asignaciones docentes manuales y sus mezclas de áreas. El trabajo automático nuevo respeta jornada total, preparación vigente, administración y topes directos de 20 horas TC y 12 MT. Una sobrecarga manual previa se muestra para revisión; no se borra para ocultarla. Si falta capacidad compatible, se muestran las horas pendientes.

«Resumen de lo asignado» incluye carga directa, preparación, administración/reuniones, ocupación, pendientes y participación en varias prácticas. Se prefiere una sola práctica por profesor, pero no se impone esa exclusividad. El cálculo es una propuesta heurística para revisión, no un óptimo certificado ni un horario con simultaneidades comprobadas. «Completar reparto equitativo» recalcula el trabajo automático; «Deshacer último reparto» recupera la copia previa sin perder los equipos manuales.
