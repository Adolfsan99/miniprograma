function crearTarea() {
    alert("Ingresa la tarea en el siguiente formato:\n \nValores para Prioridad: 1,2,3\nValores para estado: \np = 🔴\ne = 🟠\nf = 🟢\nDías: l, m, mi, j, v, s, d\n \nEjemplos:\n1,p,Lavar los platos,l = 🔴 Prioridad 1, Lavar los platos, Lunes\n1,e,Almorzar,m = 🟠 Prioridad 1, Almorzar, Martes\n1,f,Repasar y estudiar,v = 🟢 Prioridad 1, Repasar y estudiar, Viernes");
    var tarea = prompt("¿Qué quieres hacer?");
    var partesTarea = tarea.split(',');

    var prioridad = parseInt(partesTarea[0]);
    var estado = partesTarea[1].toLowerCase(); // Convertir el estado a minúsculas para facilitar la comparación
    var descripcion = partesTarea.slice(2, -1).join(','); // Seleccionar solo las partes de la descripción, excluyendo el último elemento (que es el día)
    var dia = partesTarea[partesTarea.length - 1].toLowerCase(); // Obtener el día y convertirlo a minúsculas

    var estadoEmoji; // Variable para almacenar el emoji correspondiente al estado

    // Asignar el emoji correspondiente al estado
    switch (estado) {
        case 'p':
            estadoEmoji = '🔴';
            break;
        case 'e':
            estadoEmoji = '🟠';
            break;
        case 'f':
            estadoEmoji = '🟢';
            break;
        default:
            alert("⚠️ Formato de tarea inválido.");
            return;
    }

    if (isNaN(prioridad) || prioridad < 1 || prioridad > 3) {
        alert("⚠️ Formato de tarea inválido.");
        return;
    }

    var tareas = JSON.parse(localStorage.getItem('tareas')) || [];
    tareas.push({ prioridad: prioridad, estado: estadoEmoji, descripcion: descripcion, dia: dia });
    localStorage.setItem('tareas', JSON.stringify(tareas));

    alert("✅ Tarea creada exitosamente.");
}

function verTareas() {
    var tareas = JSON.parse(localStorage.getItem('tareas')) || [];
    var dias = {
        'l': 'Lunes',
        'm': 'Martes',
        'mi': 'Miércoles',
        'j': 'Jueves',
        'v': 'Viernes',
        's': 'Sábado',
        'd': 'Domingo'
    };

    var mensaje = "Tareas disponibles\n";
    for (var dia in dias) {
        var tareasDia = tareas.filter(tarea => tarea.dia === dia && tarea.prioridad === 1); // Filtrar solo las tareas de prioridad 1
        if (tareasDia.length > 0) {
            mensaje += `\n${dias[dia]}:\n`;
            tareasDia.forEach(tarea => {
                mensaje += `${tarea.estado} Prioridad ${tarea.prioridad}, ${tarea.descripcion}\n`;
            });
        }
    }

    alert("📋 " + mensaje);
}

function editarTarea() {
    var tareas = JSON.parse(localStorage.getItem('tareas')) || [];

    if (tareas.length === 0) {
        alert("📋 No hay tareas para editar.");
        return;
    }

    var mensaje = "Selecciona la tarea que deseas editar:\n";
    tareas.forEach((tarea, index) => {
        mensaje += `${index + 1}. ${tarea.estado} Prioridad ${tarea.prioridad}, ${tarea.descripcion}, ${tarea.dia}\n`;
    });

    var tareaSeleccionada = parseInt(prompt(mensaje)) - 1;

    if (isNaN(tareaSeleccionada) || tareaSeleccionada < 0 || tareaSeleccionada >= tareas.length) {
        alert("⚠️ Selección inválida.");
        return;
    }

    var nuevaPrioridad = parseInt(prompt("Ingresa la nueva prioridad (1, 2, 3):", tareas[tareaSeleccionada].prioridad));
    var nuevoEstado = prompt("Ingresa el nuevo estado (p, e, f):", "p");
    var nuevaDescripcion = prompt("Ingresa la nueva descripción:", tareas[tareaSeleccionada].descripcion);
    var nuevoDia = prompt("Ingresa el nuevo día (l, m, mi, j, v, s, d):", tareas[tareaSeleccionada].dia);

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
            estadoEmoji = '🟠';
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
        case 's':
            diaTexto = 'Sábado';
            break;
        case 'd':
            diaTexto = 'Domingo';
            break;
        default:
            alert("⚠️ Día inválido.");
            return;
    }

    tareas[tareaSeleccionada].prioridad = nuevaPrioridad;
    tareas[tareaSeleccionada].estado = estadoEmoji;
    tareas[tareaSeleccionada].descripcion = nuevaDescripcion;
    tareas[tareaSeleccionada].dia = diaTexto.substring(0, 1).toLowerCase(); // Guardar el día en formato abreviado

    localStorage.setItem('tareas', JSON.stringify(tareas)); // Guardar las tareas actualizadas en el almacenamiento local

    alert("✅ Tarea editada exitosamente.");
}

function actualizarTareas() {
    var confirmacion = confirm("¿Está seguro de actualizar las tareas?\n\nSe recomienda que la mayoría o todas las tareas de prioridad 1 de su lista estén completas, de lo contrario, se añadirán más tareas de prioridad 1 a la lista de tareas.");

    if (!confirmacion) {
        alert("⚠️ Las tareas no han sido actualizadas.");
        return;
    }

    // Generar dos números aleatorios entre 1 y 10
    var numero1 = Math.floor(Math.random() * 10) + 1;
    var numero2 = Math.floor(Math.random() * 10) + 1;
    
    // Pedir al usuario que resuelva la suma
    var respuestaUsuario = prompt(`Para confirmar la actualización de las tareas, resuelve la siguiente suma: ${numero1} + ${numero2}`);

    // Verificar si la respuesta es correcta
    var sumaCorrecta = numero1 + numero2;

    if (parseInt(respuestaUsuario) === sumaCorrecta) {
        var tareas = JSON.parse(localStorage.getItem('tareas')) || [];
        var nuevasTareas = [];

        // Recorrer todas las tareas
        for (var i = 0; i < tareas.length; i++) {
            var tarea = tareas[i];

            // Verificar si la tarea tiene prioridad 2
            if (tarea.prioridad === 2) {
                tarea.prioridad = 1; // Cambiar la prioridad a 1
            }
            // Verificar si la tarea tiene prioridad 3
            else if (tarea.prioridad === 3) {
                tarea.prioridad = 2; // Cambiar la prioridad a 2
            }
            // Verificar si la tarea tiene prioridad 1 y estado 🟢, no añadirla a nuevasTareas
            else if (tarea.prioridad === 1 && tarea.estado === '🟢') {
                continue; // No añadir la tarea a nuevasTareas
            }

            nuevasTareas.push(tarea); // Agregar la tarea al arreglo de nuevas tareas
        }

        // Actualizar el LocalStorage con las nuevas tareas
        localStorage.setItem('tareas', JSON.stringify(nuevasTareas));

        alert("🪄 Tareas actualizadas exitosamente.");
    } else {
        alert("⚠️ Las tareas no han sido actualizadas.");
    }
}

function exportarDatos() {
    var datos = {
        tareas: JSON.parse(localStorage.getItem('tareas')) || [],
        nota: localStorage.getItem('nota') || ''
    };

    var jsonContent = JSON.stringify(datos);

    var encodedUri = "data:text/json;charset=utf-8," + encodeURIComponent(jsonContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "tareas_y_notas.json");
    document.body.appendChild(link);
    link.click();

    alert("💾 Datos exportados exitosamente.");
}

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

function crearOEditarNota() {
    var nota = prompt("Escribe tu nota:");
    if (nota) {
        localStorage.setItem('nota', nota);
        alert("✅ Nota guardada exitosamente.");
    } else {
        alert("⚠️ No se ha ingresado ninguna nota.");
    }
}

function verNota() {
    var nota = localStorage.getItem('nota');
    if (nota) {
        alert("📋 Nota:\n" + nota);
    } else {
        alert("📋 No hay nota disponible.");
    }
}

function aleatorio() {
    var numero_aleatorio_rango_inicial = parseInt(prompt("Ingresa el rango inicial de tu numero aleatorio\nNormalmente suele ser 1"));
    var numero_aleatorio_rango_final = parseInt(prompt("Ingresa el rango final de tu numero aleatorio\nSi escogiste 1 en el rango inicial, puedes utilizar 100 en el rango final para generar un numero aleatorio entre 1 y 100"));

    if (isNaN(numero_aleatorio_rango_inicial) || isNaN(numero_aleatorio_rango_final)) {
        alert("⚠️ Ingresa valores numéricos válidos.");
        return;
    }

    var numero_aleatorio = Math.floor(Math.random() * (numero_aleatorio_rango_final - numero_aleatorio_rango_inicial + 1)) + numero_aleatorio_rango_inicial;
    console.log("El número aleatorio es: ", numero_aleatorio);
    alert("🎲 El número aleatorio es: " + numero_aleatorio);
}

function porcentaje() {
    var numero_porcentaje_partes = parseInt(prompt("Ingresa cuantas partes tienes"));
    var numero_porcentaje_total = parseInt(prompt("Ingresa el total"));

    if (isNaN(numero_porcentaje_partes) || isNaN(numero_porcentaje_total)) {
        alert("⚠️ Ingresa valores numéricos válidos.");
        return;
    }

    var porcentaje_operacion = (numero_porcentaje_partes / numero_porcentaje_total) * 100;
    alert("📊 El porcentaje de " + numero_porcentaje_partes + "/" + numero_porcentaje_total + " es: " + Math.floor(porcentaje_operacion) + "%");
}