# Mantenimiento del tablero

- Trabajar en español y leer README.md y MANUAL.md.
- Fuentes en src/, datos de referencia en data/. Ejecutar npm run build y npm test tras cambios.
- Mantener los nombres de las entregas index.html y Tablero_docente.html; el usuario debe conservar el mismo archivo y ubicación para memoria de navegador.
- No borrar ni versionar memoria-tablero/, sesiones exportadas o credenciales. No cambiar claves fisio-tablero-v1 y fisio-sessions-v1 ni identificadores sin migración explícita y respaldo.
- Mantener 162 créditos, 75 espacios y 566 horas docentes salvo nuevas instrucciones del usuario. Evaluación/Diagnóstico I–III e Intervención I–III tienen tres grupos de 2 h por asignatura. Consulta Externa: seis de 13 h. Internación: cuatro de 6,5 h y dos de 13 h, juntos en una ficha.
- Los equipos de áreas Neurológica, Cardiopulmonar y Osteomuscular son intencionales. No mover asignaciones docentes manuales para optimizar.
- Reunión: 2 h para cada profesor. Cristina Eugenia Restrepo Puentes: coordinación general de prácticas 8 h. Diego Fernando Afanador Restrepo: coordinación del programa 20 h. Luz Ángela Tovar Ruiz: jefatura del programa 20 h. Una coordinación de 2 h para cada una de las seis prácticas.
- staffingRevision:1 evita repetir el reparto al recargar. Conservar copias y la función de deshacer. No sumar otras funciones del histórico ni ejecutar vaciados automáticos.
- El índice de vista existe solo mientras se dibuja la interfaz; invalidarlo al terminar. Nunca usar una carga en caché durante modificaciones del optimizador.
- No afirmar verificación visual cuando solo se han ejecutado pruebas de código.
