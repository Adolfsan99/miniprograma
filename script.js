checkLocalStorageUsage()

function checkLocalStorageUsage() {
    var total = 0;
    for (var i = 0; i < localStorage.length; i++) {
      var key = localStorage.key(i);
      var value = localStorage.getItem(key);
      total += (key.length + value.length) * 2; // Cada carácter en UTF-16 ocupa 2 bytes
    }
    // Tamaño total del Local Storage permitido por el navegador (generalmente alrededor de 5 MB a 10 MB)
    var totalAllowed = (1024 * 1024 * 5); // Por ejemplo, 5 MB
  
    // Convertir bytes a megabytes (MB)
    var totalUsedMB = (total / (1024 * 1024)).toFixed(2);
    var totalAllowedMB = (totalAllowed / (1024 * 1024)).toFixed(2);
  
    // Calcular el espacio disponible
    var availableSpaceMB = (totalAllowedMB - totalUsedMB).toFixed(2);
  
    if (totalUsedMB >= (totalAllowedMB * 0.9)) { // Si se ha utilizado más del 90% del espacio permitido
      alert("¡Atención! Has utilizado " + totalUsedMB + " MB de un total de " + totalAllowedMB + " MB en el Local Storage. Quedan disponibles " + availableSpaceMB + " MB.");
    } else {
      console.log("Espacio utilizado en el LocalStorage: " + totalUsedMB + "/" + totalAllowedMB + "MBs");
      console.log("Espacio disponible en el LocalStorage: " + availableSpaceMB + " MB");
    }
  }
  


  
//////////////////////////////////////////////////////////////////////////////

function verOCrearTarea() {
    var tareas = JSON.parse(localStorage.getItem('tareas')) || [];
    var fechaActual = new Date();
    var diaSemana = fechaActual.getDay();
    var diaActual = "";

    switch (diaSemana) {
        case 0: diaActual = 'd'; break; // Domingo
        case 1: diaActual = 'l'; break; // Lunes
        case 2: diaActual = 'm'; break; // Martes
        case 3: diaActual = 'mi'; break; // Miércoles
        case 4: diaActual = 'j'; break; // Jueves
        case 5: diaActual = 'v'; break; // Viernes
        case 6: diaActual = 's'; break; // Sábado
    }

    var dias = {
        's': '📆-Sábado-',
        'd': '📆-Domingo-',
        'l': '📆-Lunes-',
        'm': '📆-Martes-',
        'mi': '📆-Miércoles-',
        'j': '📆-Jueves-',
        'v': '📆-Viernes-',
        'x': '📆-Sin asignar-'
    };

    var diaActualEmoji = '📆⭐';

    // Calcular el progreso
    var totalTareas = tareas.length;
    var tareasCompletadas = tareas.filter(tarea => tarea.estado === '🟢').length;
    var progreso = totalTareas > 0 ? Math.round((tareasCompletadas / totalTareas) * 100) : 0;

    // Generar la barra de progreso
    var progresoBarra = '';
    for (var i = 0; i < 10; i++) {
        progresoBarra += i < progreso / 10 ? '█' : '░';
    }

    var mensaje = `📝Tareas disponibles - ✅Tu progreso ${progresoBarra} ${progreso}%\n`;
    for (var dia in dias) {
        var diaMensaje = dia === diaActual ? dias[dia].replace('📆', diaActualEmoji) : dias[dia];
        var tareasDia = tareas.filter(tarea => tarea.dia === dia && tarea.prioridad === 1); // Filtrar solo las tareas de prioridad 1
        if (tareasDia.length > 0) {
            mensaje += `${diaMensaje}\n`;
            tareasDia.forEach(tarea => {
                mensaje += `${tarea.estado}${tarea.descripcion}\n`;
            });
        }
    }

    // Mostrar las tareas disponibles y permitir al usuario agregar una nueva tarea
    var nuevaTarea = prompt(`${mensaje}`);
    
    // Verificar si el usuario ingresó una nueva tarea
    if (nuevaTarea === null) {
        return; // El usuario canceló la operación
    } else if (nuevaTarea.trim() === '') {
        alert("⚠️Tarea inválida. Debes ingresar una tarea válida.");
        return; // El usuario no ingresó ninguna tarea válida
    }

    // Verificar la longitud de la nueva tarea
    if (nuevaTarea.length > 70) {
        alert("⚠️Tarea demasiado larga. La tarea debe tener 70 caracteres o menos.");
        return; // El usuario ingresó una tarea demasiado larga
    }

    // Procesar la nueva tarea ingresada por el usuario
    var partesTarea = nuevaTarea.split(',');

    if (partesTarea.length < 4) {
        alert("⚠️Formato de tarea inválido. La tarea no se creará.");
        return;
    }

    var prioridad = parseInt(partesTarea[0]);
    var estado = partesTarea[1].toLowerCase();
    var descripcion = partesTarea.slice(2, -1).join(','); // Seleccionar solo las partes de la descripción, excluyendo el último elemento (que es el día)
    var dia = partesTarea[partesTarea.length - 1].toLowerCase();

    // Verificar si el estado es válido
    var estadoEmoji;
    switch (estado) {
        case 'p':
            estadoEmoji = '🔴';
            break;
        case 'e':
            estadoEmoji = '🟡';
            break;
        case 'f':
            estadoEmoji = '🟢';
            break;
        default:
            alert("⚠️Estado inválido. La tarea no se creará.");
            return;
    }

    // Verificar si la prioridad es válida
    if (isNaN(prioridad) || prioridad < 1 || prioridad > 3) {
        alert("⚠️Prioridad inválida. La tarea no se creará.");
        return;
    }

    // Verificar si el día es válido
    var diasValidos = ['l', 'm', 'mi', 'j', 'v', 's', 'd', 'x'];
    if (!diasValidos.includes(dia)) {
        alert("⚠️Día inválido. La tarea no se creará.");
        return;
    }

    // Crear la nueva tarea
    var nuevaTareaObj = { prioridad: prioridad, estado: estadoEmoji, descripcion: descripcion, dia: dia };
    tareas.push(nuevaTareaObj);
    localStorage.setItem('tareas', JSON.stringify(tareas));
    alert("📝Tarea creada exitosamente.");
}


function verOCrearRutina() {
    // Cargar la rutina existente, si la hay
    var rutina = localStorage.getItem('rutina') || '';

    // Definir los mapeos para estados y días
    var estadoMap = {
        'p': '🔴',
        'e': '🟡',
        'f': '🟢'
    };

    var diaMap = {
        'l': 'Lunes',
        'm': 'Martes',
        'mi': 'Miércoles',
        'j': 'Jueves',
        'v': 'Viernes',
        's': 'Sábado',
        'd': 'Domingo',
        'x': 'Sin asignar'
    };

    // Función para convertir el formato abreviado a uno más descriptivo
    function convertirRutinaFormateada(rutina) {
        var partesRutina = rutina.split(';').filter(t => t.trim() !== '');
        var rutinaFormateada = partesRutina.map(tarea => {
            var partesTarea = tarea.split(',');
            if (partesTarea.length < 4) {
                return ''; // Ignorar las tareas con formato incorrecto
            }
            var prioridad = '' + partesTarea[0];
            var estado = estadoMap[partesTarea[1].toLowerCase()] || partesTarea[1];
            var descripcion = partesTarea.slice(2, -1).join(',');
            var dia = diaMap[partesTarea[partesTarea.length - 1].toLowerCase()] || partesTarea[partesTarea.length - 1];
            return `${prioridad},${estado},${descripcion},${dia}`;
        }).join('\n');
        return rutinaFormateada;
    }

    // Convertir la rutina a un formato más descriptivo
    var rutinaFormateada = convertirRutinaFormateada(rutina);
    var nuevaRutina = prompt(
        "🔃Rutina actual:\n" + rutinaFormateada + "\n\n*Ingresa la nueva rutina con el formato: 'Prioridad,Estado,Descripción,Día;Prioridad,Estado,Descripción,Día;...'",
        rutina
    );

    // Verificar si el usuario presionó "Cancelar"
    if (nuevaRutina === null) {
        return; // Salir de la función sin hacer nada
    }

    // Si el usuario ingresó una rutina vacía, solicitar confirmación
    if (nuevaRutina.trim() === "") {
        alert("⚠️Creación rutina inválida");
        return;
    }

    // Procesar las tareas de la rutina y validar
    var partesRutina = nuevaRutina.split(';').filter(t => t.trim() !== ''); // Filtrar para eliminar cualquier tarea vacía

    // Verificar si la palabra clave "crear" está al final
    var ultimaParte = partesRutina[partesRutina.length - 1].trim().toLowerCase();
    var crearAlFinal = (ultimaParte === 'crear');

    // Si "crear" está al final, eliminarlo de las partes de la rutina
    if (crearAlFinal) {
        partesRutina.pop();
    }

    // Validar las tareas
    for (var tarea of partesRutina) {
        var partesTarea = tarea.split(',');

        if (partesTarea.length < 4) {
            alert("⚠️Formato de tarea inválido. La tarea no se creará.");
            return;
        }

        var prioridad = parseInt(partesTarea[0]);
        var estado = partesTarea[1].toLowerCase();
        var descripcion = partesTarea.slice(2, -1).join(','); // Seleccionar solo las partes de la descripción, excluyendo el último elemento (que es el día)
        var dia = partesTarea[partesTarea.length - 1].toLowerCase();

        // Verificar la longitud de la descripción
        if (descripcion.length > 64) {
            alert("⚠️Descripción demasiado larga. La descripción debe tener 64 caracteres o menos.");
            return; // Descripción demasiado larga
        }

        // Verificar si el estado es válido
        var estadoEmoji;
        switch (estado) {
            case 'p':
                estadoEmoji = '🔴';
                break;
            case 'e':
                estadoEmoji = '🟡';
                break;
            case 'f':
                estadoEmoji = '🟢';
                break;
            default:
                alert("⚠️Estado inválido. La tarea no se creará.");
                return;
        }

        // Verificar si la prioridad es válida
        if (isNaN(prioridad) || prioridad < 1 || prioridad > 3) {
            alert("⚠️Prioridad inválida. La tarea no se creará.");
            return;
        }

        // Verificar si el día es válido
        var diasValidos = ['l', 'm', 'mi', 'j', 'v', 's', 'd', 'x'];
        if (!diasValidos.includes(dia)) {
            alert("⚠️Día inválido. La tarea no se creará.");
            return;
        }
    }

    // Guardar la rutina actualizada solo si ha cambiado y es válida
    if (nuevaRutina !== rutina) {
        localStorage.setItem('rutina', partesRutina.join(';'));
        alert("✅Rutina guardada exitosamente.");

        // Si "crear" estaba al final, confirmar la creación de las tareas a partir de la rutina
        if (crearAlFinal) {
            // Confirmar la creación de las tareas a partir de la rutina
            var confirmacion = confirm("⚠️¿Estás seguro de que deseas crear las tareas a partir de la rutina?");
            if (!confirmacion) {
                return; // Salir de la función sin hacer nada si el usuario cancela
            }

            // Generar tres números aleatorios para la suma
            var num1 = Math.floor(Math.random() * 10);
            var num2 = Math.floor(Math.random() * 10);
            var num3 = Math.floor(Math.random() * 10);
            var sumaCorrecta = num1 + num2 + num3;
            var sumaUsuario = parseInt(prompt(`Para confirmar, resuelve la siguiente suma: ${num1} + ${num2} + ${num3}`));

            if (sumaUsuario === sumaCorrecta) {
                // Procesar y agregar las tareas a las tareas existentes
                var tareas = JSON.parse(localStorage.getItem('tareas')) || [];
                for (var tarea of partesRutina) {
                    var partesTarea = tarea.split(',');

                    var prioridad = parseInt(partesTarea[0]);
                    var estado = partesTarea[1].toLowerCase();
                    var descripcion = partesTarea.slice(2, -1).join(',');
                    var dia = partesTarea[partesTarea.length - 1].toLowerCase();

                    var estadoEmoji;
                    switch (estado) {
                        case 'p':
                            estadoEmoji = '🔴';
                            break;
                        case 'e':
                            estadoEmoji = '🟡';
                            break;
                        case 'f':
                            estadoEmoji = '🟢';
                            break;
                    }

                    var nuevaTareaObj = { prioridad: prioridad, estado: estadoEmoji, descripcion: descripcion, dia: dia };
                    tareas.push(nuevaTareaObj);
                }

                // Guardar las tareas actualizadas en localStorage
                localStorage.setItem('tareas', JSON.stringify(tareas));
                alert("✅Tareas creadas exitosamente a partir de la rutina.");
            } else {
                alert("⚠️Respuesta incorrecta. Las tareas no se crearán.");
            }
        }
    }
}

//////////////////////////////////////////////////////////////////////////////

function editarTarea() {
    var tareas = JSON.parse(localStorage.getItem('tareas')) || [];

    if (tareas.length === 0) {
        alert("⚠️Actualmente, no tienes tareas para gestionar.");
        return;
    }

    var mensaje = "Selecciona la tarea que deseas gestionar:\n";
    tareas.forEach((tarea, index) => {
        mensaje += `${index + 1}: ${tarea.prioridad}${tarea.estado}${tarea.descripcion},${obtenerNombreDia(tarea.dia)}.\n`;
    });

    var tareaSeleccionada = prompt(mensaje);
    if (tareaSeleccionada === null) return; // Usuario canceló
    tareaSeleccionada = parseInt(tareaSeleccionada) - 1;

    if (isNaN(tareaSeleccionada) || tareaSeleccionada < 0 || tareaSeleccionada >= tareas.length) {
        alert("⚠️Tarea inválida.");
        return;
    }

    var nuevaPrioridad = prompt("Ingresa la nueva prioridad (1, 2, 3):", tareas[tareaSeleccionada].prioridad);
    if (nuevaPrioridad === null) return; // Usuario canceló
    nuevaPrioridad = parseInt(nuevaPrioridad);

    var nuevoEstado = prompt("Ingresa el nuevo estado (p: 🔴, e: 🟡, f: 🟢):", "p");
    if (nuevoEstado === null) return; // Usuario canceló

    var nuevaDescripcion = prompt("Ingresa la nueva descripción:", tareas[tareaSeleccionada].descripcion);
    if (nuevaDescripcion === null) return; // Usuario canceló

    // Verificar la longitud de la nueva descripción
    if (nuevaDescripcion.length > 64) {
        alert("⚠️Descripción demasiado larga. La descripción debe tener 64 caracteres o menos.");
        return; // Descripción demasiado larga
    }

    var nuevoDia = prompt("Ingresa el nuevo día (l: Lunes, m: Martes, mi: Miércoles, j: Jueves, v: Viernes, s: Sábado, d: Domingo, x: Sin asignar)\n*Escribe 'borrar' para eliminar la tarea:", tareas[tareaSeleccionada].dia);
    if (nuevoDia === null) return; // Usuario canceló

    if (isNaN(nuevaPrioridad) || nuevaPrioridad < 1 || nuevaPrioridad > 3) {
        alert("⚠️Prioridad inválida.");
        return;
    }

    var estadoEmoji;
    switch (nuevoEstado.toLowerCase()) {
        case 'p':
            estadoEmoji = '🔴';
            break;
        case 'e':
            estadoEmoji = '🟡';
            break;
        case 'f':
            estadoEmoji = '🟢';
            break;
        default:
            alert("⚠️Estado inválido.");
            return;
    }

    if (nuevoDia.toLowerCase() === 'borrar') {
        tareas.splice(tareaSeleccionada, 1);
        alert("🗑️Tarea borrada exitosamente.");
    } else {
        var diaTexto;
        switch (nuevoDia.toLowerCase()) {
            case 's':
                diaTexto = 's';
                break;
            case 'd':
                diaTexto = 'd';
                break;
            case 'l':
                diaTexto = 'l';
                break;
            case 'm':
                diaTexto = 'm';
                break;
            case 'mi':
                diaTexto = 'mi';
                break;
            case 'j':
                diaTexto = 'j';
                break;
            case 'v':
                diaTexto = 'v';
                break;
            case 'x':
                diaTexto = 'x';
                break;
            default:
                alert("⚠️Día inválido.");
                return;
        }

        tareas[tareaSeleccionada].prioridad = nuevaPrioridad;
        tareas[tareaSeleccionada].estado = estadoEmoji;
        tareas[tareaSeleccionada].descripcion = nuevaDescripcion;
        tareas[tareaSeleccionada].dia = diaTexto;

        alert("✏️Tarea editada exitosamente.");
    }

    localStorage.setItem('tareas', JSON.stringify(tareas));
}


// Función para obtener el nombre completo del día a partir de su abreviatura
function obtenerNombreDia(abreviaturaDia) {
    switch (abreviaturaDia.toLowerCase()) {
        case 's':
            return 's';
        case 'd':
            return 'd';
        case 'l':
            return 'l';
        case 'm':
            return 'm';
        case 'mi':
            return 'mi';
        case 'j':
            return 'j';
        case 'v':
            return 'v';
        case 'x':
            return 'x';
        default:
            return 'Desconocido';
    }
}

//////////////////////////////////////////////////////////////////////////////

function actualizarTareas() {
    // Generar dos números aleatorios entre 1 y 10
    var numero1 = Math.floor(Math.random() * 10) + 1;
    var numero2 = Math.floor(Math.random() * 10) + 1;
    var numero3 = Math.floor(Math.random() * 10) + 1;

    // Pedir al usuario que resuelva la suma
    var respuestaUsuario = prompt(`¿Está seguro de actualizar las tareas?\n*Para confirmar la actualización de las tareas\nresuelve la siguiente suma: ${numero1} + ${numero2} + ${numero3}`);

    // Verificar si el usuario presionó "Cancelar"
    if (respuestaUsuario === null) {
        return; // Salir de la función sin hacer nada
    }

    // Verificar si la respuesta es correcta
    var sumaCorrecta = numero1 + numero2 + numero3;

    if (parseInt(respuestaUsuario) === sumaCorrecta) {
        var tareas = JSON.parse(localStorage.getItem('tareas')) || [];
        var tareasCompletadas = JSON.parse(localStorage.getItem('tareasCompletadas')) || [];

        // Filtrar las tareas completadas y añadirlas a tareasCompletadas
        var nuevasTareas = tareas.filter(tarea => {
            if (tarea.prioridad === 1 && tarea.estado === '🟢') {
                tareasCompletadas.push(tarea); // Añadir la tarea a tareasCompletadas
                return false; // No añadir la tarea a nuevasTareas
            }
            // Verificar si la tarea tiene prioridad 2
            if (tarea.prioridad === 2) {
                tarea.prioridad = 1; // Cambiar la prioridad a 1
            }
            // Verificar si la tarea tiene prioridad 3
            if (tarea.prioridad === 3) {
                tarea.prioridad = 2; // Cambiar la prioridad a 2
            }
            return true; // Mantener la tarea en nuevasTareas
        });

        // Actualizar el LocalStorage con las tareas filtradas
        localStorage.setItem('tareas', JSON.stringify(nuevasTareas));

        // Actualizar el registro de tareas completadas en el LocalStorage
        localStorage.setItem('tareasCompletadas', JSON.stringify(tareasCompletadas));

        alert("🪄Tareas actualizadas exitosamente.");
    } else {
        alert("⚠️Las tareas no han sido actualizadas.");
    }
}

//////////////////////////////////////////////////////////////////////////////

function calcularNivel(numTareasCompletadas) {
    if (numTareasCompletadas >= 1000) {
        return "14🌌";
    } else if (numTareasCompletadas >= 500) {
        return "13💫";
    } else if (numTareasCompletadas >= 200) {
        return "12🔥";
    } else if (numTareasCompletadas >= 150) {
        return "11👑";
    } else {
        return obtenerEmojiNivel(Math.floor(numTareasCompletadas / 10) + 1);
    }
}

function obtenerEmojiNivel(nivel) {
    var emojis = ["1🐭", "2🐸", "3🐵", "4🦊", "5🐺", "6🐯", "7🦁", "8🐻", "9🐼", "10🐉"];
    return emojis[Math.min(nivel - 1, emojis.length - 1)];
}

function calcularTareasRestantes(numTareasCompletadas) {
    return 10 - (numTareasCompletadas % 10);
}

function verTareasCompletadas() {
    var tareasCompletadas = JSON.parse(localStorage.getItem('tareasCompletadas')) || [];

    // Verificar si no hay tareas completadas
    if (tareasCompletadas.length === 0) {
        alert("⚠️Actualmente, no hay ninguna tarea completada para mostrar.");
        return;
    }

    // Invertir el orden de las tareas completadas
    tareasCompletadas.reverse();

    var numTareasCompletadas = tareasCompletadas.length;
    var nivel = calcularNivel(numTareasCompletadas);
    var numTareasRestantes = calcularTareasRestantes(numTareasCompletadas);

    var mensaje = `🟢Tareas completadas - Tu nivel: ${nivel}\n*Tienes (${numTareasCompletadas}🟢), requieres (${numTareasRestantes}🟢) más para subir de nivel.\n`;
    tareasCompletadas.forEach(tarea => {
        mensaje += `${tarea.estado} ${tarea.descripcion}, ${obtenerNombreDia(tarea.dia)}\n`;
    });

    // Pedir al usuario que resuelva la suma para confirmar la eliminación de las tareas completadas
    var respuestaUsuario = prompt(`${mensaje}*Para la eliminación de las tareas completadas, escribe "borrar"`);

    // Verificar si el usuario ha ingresado una respuesta
    if (respuestaUsuario !== null) {
        // Verificar si la respuesta es correcta
        if (respuestaUsuario.trim().toLowerCase() === "borrar") {
            var confirmacion = confirm("⚠️¿Estás seguro de que deseas eliminar el registro de tareas completadas?");
            if (confirmacion) {
                // Generar tres números aleatorios entre 1 y 10
                var numero1 = Math.floor(Math.random() * 10) + 1;
                var numero2 = Math.floor(Math.random() * 10) + 1;
                var numero3 = Math.floor(Math.random() * 10) + 1;
                var sumaCorrecta = numero1 + numero2 + numero3;
                
                // Pedir al usuario que resuelva la suma
                var respuestaSuma = prompt(`Para confirmar, resuelve la siguiente suma: ${numero1} + ${numero2} + ${numero3}`);
                
                // Verificar si el usuario ha ingresado una respuesta
                if (respuestaSuma !== null) {
                    // Verificar si la respuesta es correcta
                    if (!isNaN(parseInt(respuestaSuma)) && parseInt(respuestaSuma) === sumaCorrecta) {
                        localStorage.removeItem('tareasCompletadas'); // Eliminar el registro de tareas completadas
                        alert("🗑️Registro de tareas completadas eliminado exitosamente.");
                    } else {
                        alert("⚠️Respuesta incorrecta. El registro de tareas completadas no ha sido eliminado.");
                    }
                }
            }
        } else {
            //alert("⚠️El registro de tareas completadas no ha sido eliminado.");
        }
    }
}



//////////////////////////////////////////////////////////////////////////////


async function verOEscribirNota() {
    // Cargar la nota existente, si la hay
    var nota = localStorage.getItem('nota') || '';

    // Reemplazar todas las comas por saltos de línea para mostrar la nota formateada
    var notaFormateada = nota.replace(/;/g, '\n');
    var nuevaNota = prompt("📋Nota:\n" + notaFormateada + "", nota);

    // Verificar si el usuario presionó "Cancelar"
    if (nuevaNota === null) {
        return; // Salir de la función sin hacer nada
    }

    // Verificar si la entrada contiene la palabra "exportar"
    if (nuevaNota.endsWith(";exportar")) {
        // Remover ";exportar" de la entrada
        nuevaNota = nuevaNota.replace(";exportar", "");

        // Generar el nombre del archivo basado en la fecha y hora actuales
        var fecha = new Date();
        var dia = String(fecha.getDate()).padStart(2, '0');
        var mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Los meses van de 0 a 11
        var año = fecha.getFullYear();
        var horas = String(fecha.getHours()).padStart(2, '0');
        var minutos = String(fecha.getMinutes()).padStart(2, '0');
        var nombreArchivo = `Todo.html Notes - ${dia}-${mes}-${año} ${horas}.${minutos}.txt`;

        // Crear un blob con las notas
        var blob = new Blob([nuevaNota.replace(/;/g, '\n')], { type: 'text/plain' });

        // Configurar las opciones del diálogo de guardado
        const options = {
            suggestedName: nombreArchivo,
            types: [{
                description: 'Text Files',
                accept: {
                    'text/plain': ['.txt'],
                },
            }],
        };

        try {
            // Mostrar el diálogo de guardado de archivos
            const handle = await window.showSaveFilePicker(options);
            const writable = await handle.createWritable();
            await writable.write(blob);
            await writable.close();

            alert("✅Notas exportadas exitosamente.");
        } catch (err) {
            console.error('Error al guardar el archivo:', err);
            alert("❌Error al exportar las notas.");
        }

        return; // Salir de la función después de exportar
    }

    // Si el usuario ingresó una nota vacía, solicitar confirmación
    if (nuevaNota.trim() === "") {
        var confirmacion = confirm("⚠️¿Estás seguro de que deseas guardar la nota en blanco?");
        if (!confirmacion) {
            return; // Salir de la función sin hacer nada si el usuario cancela
        }
    }

    // Guardar la nota actualizada o nueva
    localStorage.setItem('nota', nuevaNota);
    alert("✅Nota guardada exitosamente.");
}




/*
function verOEscribirNota() {
    // Cargar la nota existente, si la hay
    var nota = localStorage.getItem('nota') || '';

    // Reemplazar todas las comas por saltos de línea para mostrar la nota formateada
    var notaFormateada = nota.replace(/;/g, '\n');
    var nuevaNota = prompt("📋Nota:\n" + notaFormateada + "", nota);

    // Verificar si el usuario presionó "Cancelar"
    if (nuevaNota === null) {
        return; // Salir de la función sin hacer nada
    }

    // Si el usuario ingresó una nota vacía, solicitar confirmación
    if (nuevaNota.trim() === "") {
        var confirmacion = confirm("⚠️¿Estás seguro de que deseas guardar la nota en blanco?");
        if (!confirmacion) {
            return; // Salir de la función sin hacer nada si el usuario cancela
        }
    }

    // Guardar la nota actualizada o nueva
    localStorage.setItem('nota', nuevaNota);
    alert("✅Nota guardada exitosamente.");
}
*/


///

function aleatorio() {
    var numero_aleatorio_rango_inicial = parseInt(prompt("Ingresa el rango inicial de tu numero aleatorio\n*Normalmente suele ser 1", "1"));

    // Verificar si el usuario presionó "Cancelar" o ingresó un valor no válido
    if (numero_aleatorio_rango_inicial === null || isNaN(numero_aleatorio_rango_inicial)) {
    alert("⚠️Ingresa un valor numérico válido para el rango inicial.");
    return;
    }

    var numero_aleatorio_rango_final = parseInt(prompt("Ingresa el rango final de tu numero aleatorio\n*Si escogiste 1 en el rango inicial, puedes utilizar 100 en el rango final para generar un numero aleatorio entre 1 y 100"));

    if (isNaN(numero_aleatorio_rango_inicial) || isNaN(numero_aleatorio_rango_final)) {
        alert("⚠️Ingresa valores numéricos válidos.");
        return;
    }

    var numero_aleatorio = Math.floor(Math.random() * (numero_aleatorio_rango_final - numero_aleatorio_rango_inicial + 1)) + numero_aleatorio_rango_inicial;
    console.log("El número aleatorio es: ", numero_aleatorio);
    alert("🎲El número aleatorio es: " + numero_aleatorio);
}

//////////////////////////////////////////////////////////////////////////////

function porcentaje() {
    // Solicitar el número de partes
    var numero_porcentaje_partes = parseInt(prompt("Ingresa el número de partes\n*Si tienes 3 partes de algo, ingresa 3."));
    
    // Verificar si el usuario presionó "Cancelar" o ingresó un valor no válido
    if (numero_porcentaje_partes === null || isNaN(numero_porcentaje_partes)) {
        alert("⚠️Ingresa un valor numérico válido para las partes.");
        return;
    }

    // Solicitar el número total
    var numero_porcentaje_total = parseInt(prompt("Ingresa el número total\n*Si el total es 10, ingresa 10."));
    
    // Verificar si el usuario presionó "Cancelar" o ingresó un valor no válido
    if (numero_porcentaje_total === null || isNaN(numero_porcentaje_total)) {
        alert("⚠️Ingresa un valor numérico válido para el total.");
        return;
    }

    // Calcular el porcentaje
    var porcentaje_operacion = (numero_porcentaje_partes / numero_porcentaje_total) * 100;
    
    // Mostrar el resultado
    alert("📊El porcentaje de " + numero_porcentaje_partes + "/" + numero_porcentaje_total + " es: " + Math.floor(porcentaje_operacion) + "%");
}

//////////////////////////////////////////////////////////////////////////////

function importarDatos() {
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json'; // Aceptar solo archivos de texto (.json)

    input.onchange = function (e) {
        var file = e.target.files[0];
        if (!file) return;

        var reader = new FileReader();
        reader.onload = function (readerEvent) {
            var content = readerEvent.target.result;
            if (!content) {
                alert("⚠️El archivo seleccionado está vacío.");
                return;
            }

            try {
                var datos = JSON.parse(content);
                if (!datos || !Array.isArray(datos.tareas)) {
                    throw new Error("El formato del archivo no es válido.");
                }

                localStorage.setItem('tareas', JSON.stringify(datos.tareas));
                localStorage.setItem('tareasCompletadas', JSON.stringify(datos.tareasCompletadas || [])); // Incluir tareasCompletadas

                localStorage.setItem('nota', datos.nota || '');
                localStorage.setItem('rutina', datos.rutina || ''); // Incluir la rutina

                alert("📥Datos importados exitosamente.");
                location.reload(); // Recargar la página para reflejar los cambios en el LocalStorage
            } catch (error) {
                alert("⚠️Error al importar el archivo: " + error.message);
            }
        };

        reader.readAsText(file);
    };

    input.click();
}

//////////////////////////////////////////////////////////////////////////////

function exportarDatos() {
    var datos = {
        tareas: JSON.parse(localStorage.getItem('tareas')) || [],
        tareasCompletadas: JSON.parse(localStorage.getItem('tareasCompletadas')) || [], // Incluir tareasCompletadas
        nota: localStorage.getItem('nota') || '',
        rutina: localStorage.getItem('rutina') || '' // Incluir la rutina
    };

    var jsonContent = JSON.stringify(datos);

    // Obtener la fecha y hora actual
    var fecha = new Date();
    var dia = String(fecha.getDate()).padStart(2, '0');
    var mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Enero es 0
    var anio = fecha.getFullYear();
    var horas = String(fecha.getHours()).padStart(2, '0');
    var minutos = String(fecha.getMinutes()).padStart(2, '0');
    var segundos = String(fecha.getSeconds()).padStart(2, '0');

    // Formatear la fecha y hora como DD-MM-YYYY HH-MM-SS
    var fechaFormateada = `${dia}-${mes}-${anio} ${horas}.${minutos}`;

    // Crear el nombre del archivo con la fecha y hora
    var nombreArchivo = `Todo.html - ${fechaFormateada}.json`;

    var encodedUri = "data:text/json;charset=utf-8," + encodeURIComponent(jsonContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", nombreArchivo);
    document.body.appendChild(link);
    link.click();

    alert("💾Datos exportados exitosamente.");
}

//////////////////////////////////////////////////////////////////////////////

function borrarDatos() {
    // Generar dos números aleatorios entre 1 y 10
    var numero1 = Math.floor(Math.random() * 10) + 1;
    var numero2 = Math.floor(Math.random() * 10) + 1;

    // Pedir al usuario que resuelva la suma
    var respuestaUsuario = prompt(`Para confirmar el formateo de datos\nresuelve la siguiente suma: ${numero1} + ${numero2}`);

    // Verificar si la respuesta es correcta
    var sumaCorrecta = numero1 + numero2;

    if (parseInt(respuestaUsuario) === sumaCorrecta) {
        localStorage.clear();
        alert("🗑️Datos formateados exitosamente.");
    } else {
        alert("⚠️Los datos no han sido borrados.");
    }
}

//////////////////////////////////////////////////////////////////////////////

function textToHtml() {
    var ubicacionActual = window.location.origin;
    // Agregar la ruta o el nombre del archivo que deseas
    var nuevaUbicacion = ubicacionActual + "/miniprograma/textto.html";
    // Redirigir a la nueva ubicación
    window.location.href = nuevaUbicacion;
}

function walllist() {
    var ubicacionActual = window.location.origin;
    // Agregar la ruta o el nombre del archivo que deseas
    var nuevaUbicacion = ubicacionActual + "/walllist/walllist";
    // Redirigir a la nueva ubicación
    window.location.href = nuevaUbicacion;
}

function comoUsar() {
    window.open("https://github.com/Adolfsan99/miniprograma/blob/main/README.md", "_blank");
}


/* OLD FUNCTIONS */
/*
function crearTarea() {
    var tarea = prompt("Ingresa la tarea siguiendo el siguiente formato.\n'Prioridad,Estado,Descripción,Día'\n*Prioridad (1,2,3), Estado (p: 🔴, e: 🟡, f: 🟢)\nDescripción, Días (l: Lunes, m: Martes, mi: Miércoles, j: Jueves, v: Viernes, s: Sábado, d: Domingo, x: Sin asignar)\n*Ejemplo 1: 1,p,Lavar los platos,mi\nEjemplo 2: 1,p,26/05/2024 - Ir a comprar en el supermercado,x\n*Realice los ejemplos y despues dirigaje a (Ver tareas) para entender mejor esta funcionalidad.");

    if (tarea === null) {
        // El usuario ha cancelado el prompt
        return;
    }

    var partesTarea = tarea.split(',');

    if (partesTarea.length < 4) {
        document.title = "⚠️No se pudo crear la tarea";
        alert("*Formato de tarea inválido.");
        return;
    }

    var prioridad = parseInt(partesTarea[0]);
    var estado = partesTarea[1].toLowerCase();
    var descripcion = partesTarea.slice(2, -1).join(','); // Seleccionar solo las partes de la descripción, excluyendo el último elemento (que es el día)
    var dia = partesTarea[partesTarea.length - 1].toLowerCase();

    // Verificar si el estado es válido
    var estadoEmoji;
    switch (estado) {
        case 'p':
            estadoEmoji = '🔴';
            break;
        case 'e':
            estadoEmoji = '🟡';
            break;
        case 'f':
            estadoEmoji = '🟢';
            break;
        default:
            document.title = "⚠️No se pudo crear la tarea";
            alert("*Estado inválido.");
            return;
    }

    // Verificar si la prioridad es válida
    if (isNaN(prioridad) || prioridad < 1 || prioridad > 3) {
        document.title = "⚠️No se pudo crear la tarea";
        alert("*Prioridad inválida.");
        return;
    }

    // Verificar si el día es válido
    var diasValidos = ['l', 'm', 'mi', 'j', 'v', 's', 'd', 'x'];
    if (!diasValidos.includes(dia)) {
        document.title = "⚠️No se pudo crear la tarea";
        alert("*Día inválido.");
        return;
    }

    var tareas = JSON.parse(localStorage.getItem('tareas')) || [];
    tareas.push({ prioridad: prioridad, estado: estadoEmoji, descripcion: descripcion, dia: dia });
    localStorage.setItem('tareas', JSON.stringify(tareas));
    document.title = "📝Tarea creada ";
    alert("Tarea creada exitosamente.");
}


//////////////////////////////////////////////////////////////////////////////

function verTareas() {
    var tareas = JSON.parse(localStorage.getItem('tareas')) || [];
    var dias = {
        's': '📆Sábado',
        'd': '📆Domingo',
        'l': '📆Lunes',
        'm': '📆Martes',
        'mi': '📆Miércoles',
        'j': '📆Jueves',
        'v': '📆Viernes',
        'x': '📆Sin asignar'
    };

    // Calcular el progreso
    var totalTareas = tareas.length;
    var tareasCompletadas = tareas.filter(tarea => tarea.estado === '🟢').length;
    var progreso = totalTareas > 0 ? Math.round((tareasCompletadas / totalTareas) * 100) : 0;

    // Generar la barra de progreso
    var progresoBarra = '';
    for (var i = 0; i < 10; i++) {
        progresoBarra += i < progreso / 10 ? '█' : '░';
    }

    var mensaje = `Tareas disponibles - ✅Tu progreso ${progresoBarra} ${progreso}%\n*Solo aparecerán las tareas de Prioridad 1\n`;
    for (var dia in dias) {
        var tareasDia = tareas.filter(tarea => tarea.dia === dia && tarea.prioridad === 1); // Filtrar solo las tareas de prioridad 1
        if (tareasDia.length > 0) {
            mensaje += `${dias[dia]}:\n`;
            tareasDia.forEach(tarea => {
                mensaje += `${tarea.estado} ${tarea.descripcion}\n`;
                //mensaje += `${tarea.estado} Prioridad ${tarea.prioridad}, ${tarea.descripcion}\n`;
            });
        }
    }

    alert(mensaje);
}
*/

///
/*
function verOCrearRutina() {
    // Cargar la rutina existente, si la hay
    var rutina = localStorage.getItem('rutina') || '';

    // Reemplazar todas las comas por saltos de línea para mostrar la rutina formateada
    var rutinaFormateada = rutina.replace(/;/g, '\n');
    var nuevaRutina = prompt(
        "🔃Rutina actual:\n" + rutinaFormateada + "\n*Ingresa la nueva rutina con el formato: 'Prioridad,Estado,Descripción,Día;Prioridad,Estado,Descripción,Día;...'",
        rutina
    );

    // Verificar si el usuario presionó "Cancelar"
    if (nuevaRutina === null) {
        return; // Salir de la función sin hacer nada
    }

    // Si el usuario ingresó una rutina vacía, solicitar confirmación
    if (nuevaRutina.trim() === "") {
        alert("⚠️Creación rutina inválida");
        return;
    }

    // Guardar la rutina actualizada solo si ha cambiado
    if (nuevaRutina !== rutina) {
        localStorage.setItem('rutina', nuevaRutina);
        alert("✅Rutina guardada exitosamente.");
    }

    // Procesar las tareas de la rutina y añadirlas a las tareas
    var tareas = JSON.parse(localStorage.getItem('tareas')) || [];
    var partesRutina = nuevaRutina.split(';').filter(t => t.trim() !== ''); // Filtrar para eliminar cualquier tarea vacía

    // Validar y agregar las tareas
    for (var tarea of partesRutina) {
        var partesTarea = tarea.split(',');

        if (partesTarea.length < 4) {
            alert("⚠️Formato de tarea inválido. La tarea no se creará.");
            return;
        }

        var prioridad = parseInt(partesTarea[0]);
        var estado = partesTarea[1].toLowerCase();
        var descripcion = partesTarea.slice(2, -1).join(','); // Seleccionar solo las partes de la descripción, excluyendo el último elemento (que es el día)
        var dia = partesTarea[partesTarea.length - 1].toLowerCase();

        // Verificar si el estado es válido
        var estadoEmoji;
        switch (estado) {
            case 'p':
                estadoEmoji = '🔴';
                break;
            case 'e':
                estadoEmoji = '🟡';
                break;
            case 'f':
                estadoEmoji = '🟢';
                break;
            default:
                alert("⚠️Estado inválido. La tarea no se creará.");
                return;
        }

        // Verificar si la prioridad es válida
        if (isNaN(prioridad) || prioridad < 1 || prioridad > 3) {
            alert("⚠️Prioridad inválida. La tarea no se creará.");
            return;
        }

        // Verificar si el día es válido
        var diasValidos = ['l', 'm', 'mi', 'j', 'v', 's', 'd', 'x'];
        if (!diasValidos.includes(dia)) {
            alert("⚠️Día inválido. La tarea no se creará.");
            return;
        }

        // Crear la nueva tarea
        var nuevaTareaObj = { prioridad: prioridad, estado: estadoEmoji, descripcion: descripcion, dia: dia };
        tareas.push(nuevaTareaObj);
    }

    // Confirmar la creación de las tareas a partir de la rutina
    var confirmacion = confirm("⚠️¿Estás seguro de que deseas crear las tareas a partir de la rutina?");
    if (!confirmacion) {
        return; // Salir de la función sin hacer nada si el usuario cancela
    } else {
        // Guardar las tareas actualizadas en localStorage
        localStorage.setItem('tareas', JSON.stringify(tareas));
        alert("✅Tareas creadas exitosamente a partir de la rutina.");
    }
}
*/

/* NIVELES OLD
function calcularNivel(numTareasCompletadas) {
    return Math.floor(numTareasCompletadas / 10) + 1;
}

function obtenerEmojiNivel(nivel) {
    var emojis = ["🐭", "🐸", "🐶", "🦊", "🐺", "🐯", "🦁", "🐻", "🐘", "🐉"];
    return emojis[Math.min(nivel - 1, emojis.length - 1)];
}

function calcularTareasRestantes(numTareasCompletadas) {
    return 10 - (numTareasCompletadas % 10);
}

function verTareasCompletadas() {
    var tareasCompletadas = JSON.parse(localStorage.getItem('tareasCompletadas')) || [];

    // Verificar si no hay tareas completadas
    if (tareasCompletadas.length === 0) {
        alert("⚠️Actualmente, no hay ninguna tarea completada para mostrar.");
        return;
    }

    var numTareasCompletadas = tareasCompletadas.length;
    var nivel = calcularNivel(numTareasCompletadas);
    var emojiNivel = obtenerEmojiNivel(nivel);
    var numTareasRestantes = calcularTareasRestantes(numTareasCompletadas);

    var mensaje = `Tareas completadas - Tu nivel: ${nivel}${emojiNivel}\n*Tienes (${numTareasCompletadas}🟢), requieres (${numTareasRestantes}🟢) más para subir de nivel.\n*`;
    tareasCompletadas.forEach(tarea => {
        mensaje += `${tarea.estado} ${tarea.descripcion}, ${obtenerNombreDia(tarea.dia)}\n`;
    });

    // Generar tres números aleatorios entre 1 y 10
    var numero1 = Math.floor(Math.random() * 10) + 1;
    var numero2 = Math.floor(Math.random() * 10) + 1;
    var numero3 = Math.floor(Math.random() * 10) + 1;

    // Pedir al usuario que resuelva la suma para confirmar la eliminación de las tareas completadas
    var respuestaUsuario = prompt(`${mensaje}\nPara confirmar la eliminación de las tareas completadas, resuelve la siguiente suma: ${numero1} + ${numero2} + ${numero3}`);

    // Verificar si el usuario ha ingresado una respuesta
    if (respuestaUsuario !== null) {
        // Verificar si la respuesta es correcta
        var sumaCorrecta = numero1 + numero2 + numero3;

        if (parseInt(respuestaUsuario) === sumaCorrecta) {
            localStorage.removeItem('tareasCompletadas'); // Eliminar el registro de tareas completadas
            alert("🗑️Registro de tareas completadas eliminado exitosamente.");
        } else {
            alert("⚠️El registro de tareas completadas no ha sido eliminado.");
        }
    }
}
*/
//////////////////////////////////////////////////////////////////////////////
/*
function crearOEditarNota() {
    // Cargar la nota existente, si la hay
    var notaExistente = localStorage.getItem('nota') || '';
    
    // Pedir al usuario que ingrese o edite la nota, mostrando la nota existente
    var nota = prompt("Escribe o edita tu nota:\n*Se recomienda crear las notas siguiendo los siguientes ejemplos:\n*Ejemplo 1: *Cocinar;*Barrer;*Limpiar\nEjemplo 2: 📌Recordatorios;*Beber agua;*Limpiar el polvo;;📜Diario;Mayo 26 - Sigo programando una aplicacion de productividad;Mayo 27 - Realice de forma efectiva mi trabajo gracias a esta app\n*Realice los ejemplos y despues dirigaje a (Ver nota) para entender mejor esta funcionalidad, el punto y coma ( ; ) sirve para separar las notas.", notaExistente);

    // Verificar si el usuario presionó "Cancelar"
    if (nota === null) {
        return; // Salir de la función sin hacer nada
    }

    // Verificar si el usuario ingresó una nota vacía
    if (nota.trim() === "") {
        alert("⚠️No se ha ingresado ninguna nota.");
    } else {
        localStorage.setItem('nota', nota);
        alert("✅Nota guardada exitosamente.");
    }
}

//////////////////////////////////////////////////////////////////////////////

function verNota() {
    var nota = localStorage.getItem('nota');
    if (nota) {
        // Reemplazar todas las comas por saltos de línea
        var notaFormateada = nota.replace(/;/g, '\n');
        alert("Notas:\n*" + notaFormateada);
    } else {
        alert("⚠️Actualmente, no hay ninguna nota para mostrar.");
    }
}
*/

/*
function verTareasCompletadas() {
    var tareasCompletadas = JSON.parse(localStorage.getItem('tareasCompletadas')) || [];

    // Verificar si no hay tareas completadas
    if (tareasCompletadas.length === 0) {
        alert("⚠️Actualmente, no hay ninguna tarea completada para mostrar.");
        return;
    }

    var numTareasCompletadas = tareasCompletadas.length;
    var nivel = calcularNivel(numTareasCompletadas);
    var numTareasRestantes = calcularTareasRestantes(numTareasCompletadas);

    var mensaje = `🟢Tareas completadas - Tu nivel: ${nivel}\n*Tienes (${numTareasCompletadas}🟢), requieres (${numTareasRestantes}🟢) más para subir de nivel.\n`;
    tareasCompletadas.forEach(tarea => {
        mensaje += `${tarea.estado} ${tarea.descripcion}, ${obtenerNombreDia(tarea.dia)}\n`;
    });

    // Generar tres números aleatorios entre 1 y 10
    var numero1 = Math.floor(Math.random() * 10) + 1;
    var numero2 = Math.floor(Math.random() * 10) + 1;
    var numero3 = Math.floor(Math.random() * 10) + 1;
    var numero4 = Math.floor(Math.random() * 10) + 1;

    // Pedir al usuario que resuelva la suma para confirmar la eliminación de las tareas completadas
    var respuestaUsuario = prompt(`${mensaje}*Para confirmar la eliminación de las tareas completadas, resuelve la siguiente suma: ${numero1} + ${numero2} + ${numero3} + ${numero4}`);

    // Verificar si el usuario ha ingresado una respuesta
    if (respuestaUsuario !== null) {
        // Verificar si la respuesta es correcta
        var sumaCorrecta = numero1 + numero2 + numero3 + numero4;

        if (parseInt(respuestaUsuario) === sumaCorrecta) {
            localStorage.removeItem('tareasCompletadas'); // Eliminar el registro de tareas completadas
            alert("🗑️Registro de tareas completadas eliminado exitosamente.");
        } else {
            alert("⚠️El registro de tareas completadas no ha sido eliminado.");
        }
    }
}
*/
