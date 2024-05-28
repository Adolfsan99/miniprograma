//////////////////////////////////////////////////////////////////////////////

function crearTarea() {
    var tarea = prompt("Ingresa la tarea siguiendo el siguiente formato.\n'Prioridad,Estado,Descripción,Día'\n\nPrioridad (1,2,3), Estado (p: 🔴, e: 🟡, f: 🟢)\nDescripción, Días (l: Lunes, m: Martes, mi: Miércoles, j: Jueves, v: Viernes, s: Sábado, d: Domingo, x: Sin asignar)\n\nEjemplo 1: 1,p,Lavar los platos,mi\nEjemplo 2: 1,p,26/05/2024 - Ir a comprar en el supermercado,x\n\n*Realice los ejemplos y despues dirigaje a (Ver tareas) para entender mejor esta funcionalidad.");

    if (tarea === null) {
        // El usuario ha cancelado el prompt
        return;
    }

    var partesTarea = tarea.split(',');

    if (partesTarea.length < 4) {
        alert("⚠️ Formato de tarea inválido.");
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
            alert("⚠️ Formato de tarea inválido.");
            return;
    }

    // Verificar si la prioridad es válida
    if (isNaN(prioridad) || prioridad < 1 || prioridad > 3) {
        alert("⚠️ Formato de tarea inválido.");
        return;
    }

    // Verificar si el día es válido
    var diasValidos = ['l', 'm', 'mi', 'j', 'v', 's', 'd', 'x'];
    if (!diasValidos.includes(dia)) {
        alert("⚠️ Formato de tarea inválido.");
        return;
    }

    var tareas = JSON.parse(localStorage.getItem('tareas')) || [];
    tareas.push({ prioridad: prioridad, estado: estadoEmoji, descripcion: descripcion, dia: dia });
    localStorage.setItem('tareas', JSON.stringify(tareas));

    alert("✅ Tarea creada exitosamente.");
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
            mensaje += `\n${dias[dia]}:\n`;
            tareasDia.forEach(tarea => {
                mensaje += `${tarea.estado} ${tarea.descripcion}\n`;
                //mensaje += `${tarea.estado} Prioridad ${tarea.prioridad}, ${tarea.descripcion}\n`;
            });
        }
    }

    alert(mensaje);
}

//////////////////////////////////////////////////////////////////////////////

function editarTarea() {
    var tareas = JSON.parse(localStorage.getItem('tareas')) || [];

    if (tareas.length === 0) {
        alert("Actualmente, no tienes tareas para editar.");
        return;
    }

    var mensaje = "Selecciona la tarea que deseas editar:\n\n";
    tareas.forEach((tarea, index) => {
        mensaje += `${index + 1}. Prioridad ${tarea.prioridad}, ${tarea.estado}, ${tarea.descripcion}, ${obtenerNombreDia(tarea.dia)}.\n`;
    });

    var tareaSeleccionada = prompt(mensaje);
    if (tareaSeleccionada === null) return; // Usuario canceló
    tareaSeleccionada = parseInt(tareaSeleccionada) - 1;

    if (isNaN(tareaSeleccionada) || tareaSeleccionada < 0 || tareaSeleccionada >= tareas.length) {
        alert("⚠️ Selección inválida.");
        return;
    }

    var nuevaPrioridad = prompt("Ingresa la nueva prioridad (1, 2, 3):", tareas[tareaSeleccionada].prioridad);
    if (nuevaPrioridad === null) return; // Usuario canceló
    nuevaPrioridad = parseInt(nuevaPrioridad);

    var nuevoEstado = prompt("Ingresa el nuevo estado (p: 🔴, e: 🟡, f: 🟢):", "p");
    if (nuevoEstado === null) return; // Usuario canceló

    var nuevaDescripcion = prompt("Ingresa la nueva descripción:", tareas[tareaSeleccionada].descripcion);
    if (nuevaDescripcion === null) return; // Usuario canceló

    var nuevoDia = prompt("Ingresa el nuevo día (l: Lunes, m: Martes, mi: Miércoles, j: Jueves, v: Viernes, s: Sábado, d: Domingo, x: Sin asignar):", tareas[tareaSeleccionada].dia);
    if (nuevoDia === null) return; // Usuario canceló

    if (isNaN(nuevaPrioridad) || nuevaPrioridad < 1 || nuevaPrioridad > 3) {
        alert("⚠️ Prioridad inválida.");
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
            alert("⚠️ Estado inválido.");
            return;
    }

    var diaTexto;
    switch (nuevoDia.toLowerCase()) {
        case 's':
            diaTexto = 'Sábado';
            break;
        case 'd':
            diaTexto = 'Domingo';
            break;
        case 'l':
            diaTexto = 'Lunes';
            break;
        case 'm':
            diaTexto = 'Martes';
            break;
        case 'mi':
            diaTexto = 'Miércoles';
            break;
        case 'j':
            diaTexto = 'Jueves';
            break;
        case 'v':
            diaTexto = 'Viernes';
            break;
        case 'x':
            diaTexto = 'Sin asignar';
            break;
        default:
            alert("⚠️ Día inválido.");
            return;
    }

    tareas[tareaSeleccionada].prioridad = nuevaPrioridad;
    tareas[tareaSeleccionada].estado = estadoEmoji;
    tareas[tareaSeleccionada].descripcion = nuevaDescripcion;
    tareas[tareaSeleccionada].dia = nuevoDia.toLowerCase();

    localStorage.setItem('tareas', JSON.stringify(tareas));

    alert("✅ Tarea editada exitosamente.");
}

// Función para obtener el nombre completo del día a partir de su abreviatura
function obtenerNombreDia(abreviaturaDia) {
    switch (abreviaturaDia.toLowerCase()) {
        case 's':
            return 'Sábado';
        case 'd':
            return 'Domingo';
        case 'l':
            return 'Lunes';
        case 'm':
            return 'Martes';
        case 'mi':
            return 'Miércoles';
        case 'j':
            return 'Jueves';
        case 'v':
            return 'Viernes';
        case 'x':
            return 'Sin asignar';
        default:
            return 'Desconocido';
    }
}

//////////////////////////////////////////////////////////////////////////////

function actualizarTareas() {
    // Generar dos números aleatorios entre 1 y 10
    var numero1 = Math.floor(Math.random() * 10) + 1;
    var numero2 = Math.floor(Math.random() * 10) + 1;
    
    // Pedir al usuario que resuelva la suma
    var respuestaUsuario = prompt(`¿Está seguro de actualizar las tareas?\n\n*Se recomienda que la mayoría o todas las tareas de prioridad 1 de su lista estén completas, de lo contrario, se cambiará la prioridad de las tareas de prioridad 2 a 1, y de prioridad 3 a 2, añadiendo así más tareas de prioridad 1 a la lista de tareas, esta acción tambien actualizará el registro.\n\nPara confirmar la actualización de las tareas, resuelve la siguiente suma: ${numero1} + ${numero2}`);

    // Verificar si el usuario presionó "Cancelar"
    if (respuestaUsuario === null) {
        return; // Salir de la función sin hacer nada
    }

    // Verificar si la respuesta es correcta
    var sumaCorrecta = numero1 + numero2;

    if (parseInt(respuestaUsuario) === sumaCorrecta) {
        var tareas = JSON.parse(localStorage.getItem('tareas')) || [];
        var tareasCompletadas = JSON.parse(localStorage.getItem('tareasCompletadas')) || [];

        // Filtrar las tareas completadas y añadirlas a tareasCompletadas
        var nuevasTareas = tareas.filter(tarea => {
            if (tarea.prioridad === 1 && tarea.estado === '🟢') {
                tareasCompletadas.push(tarea); // Añadir la tarea a tareasCompletadas
                return false; // No añadir la tarea a nuevasTareas
            }
            return true; // Mantener la tarea en nuevasTareas
        });

        // Actualizar el LocalStorage con las tareas filtradas
        localStorage.setItem('tareas', JSON.stringify(nuevasTareas));

        // Actualizar el registro de tareas completadas en el LocalStorage
        localStorage.setItem('tareasCompletadas', JSON.stringify(tareasCompletadas));

        alert("🪄 Tareas actualizadas exitosamente.");
    } else {
        alert("⚠️ Las tareas no han sido actualizadas.");
    }
}


//////////////////////////////////////////////////////////////////////////////

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
        alert("Actualmente, no hay ninguna tarea completada para mostrar.");
        return;
    }

    var numTareasCompletadas = tareasCompletadas.length;
    var nivel = calcularNivel(numTareasCompletadas);
    var emojiNivel = obtenerEmojiNivel(nivel);
    var numTareasRestantes = calcularTareasRestantes(numTareasCompletadas);

    var mensaje = `✅Tareas completadas - Tu nivel: ${nivel}${emojiNivel}\n*Tienes (${numTareasCompletadas}🟢), requieres (${numTareasRestantes}🟢) más para subir de nivel.\n\n`;
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
            alert("🗑️ Registro de tareas completadas eliminado exitosamente.");
        } else {
            alert("⚠️ El registro de tareas completadas no ha sido eliminado.");
        }
    }
}

//////////////////////////////////////////////////////////////////////////////

function crearOEditarNota() {
    // Cargar la nota existente, si la hay
    var notaExistente = localStorage.getItem('nota') || '';
    
    // Pedir al usuario que ingrese o edite la nota, mostrando la nota existente
    var nota = prompt("Escribe o edita tu nota:\n\n*Se recomienda crear las notas siguiendo los siguientes ejemplos:\n\nEjemplo 1: *Cocinar;*Barrer;*Limpiar\nEjemplo 2: 📌Recordatorios;*Beber agua;*Limpiar el polvo;;📜Diario;Mayo 26 - Sigo programando una aplicacion de productividad;Mayo 27 - Realice de forma efectiva mi trabajo gracias a esta app\n\n*Realice los ejemplos y despues dirigaje a (Ver nota) para entender mejor esta funcionalidad, el punto y coma ( ; ) sirve para separar las notas.", notaExistente);

    // Verificar si el usuario presionó "Cancelar"
    if (nota === null) {
        return; // Salir de la función sin hacer nada
    }

    // Verificar si el usuario ingresó una nota vacía
    if (nota.trim() === "") {
        alert("⚠️ No se ha ingresado ninguna nota.");
    } else {
        localStorage.setItem('nota', nota);
        alert("✅ Nota guardada exitosamente.");
    }
}

//////////////////////////////////////////////////////////////////////////////

function verNota() {
    var nota = localStorage.getItem('nota');
    if (nota) {
        // Reemplazar todas las comas por saltos de línea
        var notaFormateada = nota.replace(/;/g, '\n');
        alert("Notas:\n\n" + notaFormateada);
    } else {
        alert("Actualmente, no hay ninguna nota para mostrar.");
    }
}

//////////////////////////////////////////////////////////////////////////////

function aleatorio() {
    var numero_aleatorio_rango_inicial = parseInt(prompt("Ingresa el rango inicial de tu numero aleatorio\n\n*Normalmente suele ser 1", "1"));

    // Verificar si el usuario presionó "Cancelar" o ingresó un valor no válido
    if (numero_aleatorio_rango_inicial === null || isNaN(numero_aleatorio_rango_inicial)) {
    alert("⚠️ Ingresa un valor numérico válido para el rango inicial.");
    return;
    }

    var numero_aleatorio_rango_final = parseInt(prompt("Ingresa el rango final de tu numero aleatorio\n\n*Si escogiste 1 en el rango inicial, puedes utilizar 100 en el rango final para generar un numero aleatorio entre 1 y 100"));

    if (isNaN(numero_aleatorio_rango_inicial) || isNaN(numero_aleatorio_rango_final)) {
        alert("⚠️ Ingresa valores numéricos válidos.");
        return;
    }

    var numero_aleatorio = Math.floor(Math.random() * (numero_aleatorio_rango_final - numero_aleatorio_rango_inicial + 1)) + numero_aleatorio_rango_inicial;
    console.log("El número aleatorio es: ", numero_aleatorio);
    alert("🎲 El número aleatorio es: " + numero_aleatorio);
}

//////////////////////////////////////////////////////////////////////////////

function porcentaje() {
    // Solicitar el número de partes
    var numero_porcentaje_partes = parseInt(prompt("Ingresa el número de partes\n\n*Si tienes 3 partes de algo, ingresa 3."));
    
    // Verificar si el usuario presionó "Cancelar" o ingresó un valor no válido
    if (numero_porcentaje_partes === null || isNaN(numero_porcentaje_partes)) {
        alert("⚠️ Ingresa un valor numérico válido para las partes.");
        return;
    }

    // Solicitar el número total
    var numero_porcentaje_total = parseInt(prompt("Ingresa el número total\n\n*Si el total es 10, ingresa 10."));
    
    // Verificar si el usuario presionó "Cancelar" o ingresó un valor no válido
    if (numero_porcentaje_total === null || isNaN(numero_porcentaje_total)) {
        alert("⚠️ Ingresa un valor numérico válido para el total.");
        return;
    }

    // Calcular el porcentaje
    var porcentaje_operacion = (numero_porcentaje_partes / numero_porcentaje_total) * 100;
    
    // Mostrar el resultado
    alert("📊 El porcentaje de " + numero_porcentaje_partes + "/" + numero_porcentaje_total + " es: " + Math.floor(porcentaje_operacion) + "%");
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
                alert("⚠️ El archivo seleccionado está vacío.");
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
                
                alert("📥 Datos importados exitosamente.");
                location.reload(); // Recargar la página para reflejar los cambios en el LocalStorage
            } catch (error) {
                alert("⚠️ Error al importar el archivo: " + error.message);
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
        nota: localStorage.getItem('nota') || ''
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

    alert("💾 Datos exportados exitosamente.");
}

//////////////////////////////////////////////////////////////////////////////

function borrarDatos() {
    // Generar dos números aleatorios entre 1 y 10
    var numero1 = Math.floor(Math.random() * 10) + 1;
    var numero2 = Math.floor(Math.random() * 10) + 1;

    // Pedir al usuario que resuelva la suma
    var respuestaUsuario = prompt(`Para confirmar el borrado de datos\nresuelve la siguiente suma: ${numero1} + ${numero2}`);

    // Verificar si la respuesta es correcta
    var sumaCorrecta = numero1 + numero2;

    if (parseInt(respuestaUsuario) === sumaCorrecta) {
        localStorage.clear();
        alert("🔃 Datos reiniciados exitosamente.");
    } else {
        alert("⚠️ Los datos no han sido borrados.");
    }
}

//////////////////////////////////////////////////////////////////////////////