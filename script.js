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

function crearTarea() {
    alert("Ingresa la tarea en el siguiente formato:\n \nValores para Prioridad: 1,2,3\nValores para estado: \np = 🔴\ne = 🟠\nf = 🟢\n \nEjemplos:\n1,p,Lavar los platos = 🔴 Prioridad 1, Lavar los platos\n1,e,Almorzar = 🟠 Prioridad 1, Almorzar\n1,f,Repasar y estudiar = 🟢 Prioridad 1, Repasar y estudiar");
    var tarea = prompt("¿Qué quieres hacer?");
    var partesTarea = tarea.split(',');

    var prioridad = parseInt(partesTarea[0]);
    var estado = partesTarea[1].toLowerCase(); // Convertir el estado a minúsculas para facilitar la comparación
    var descripcion = partesTarea.slice(2).join(',');

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
    tareas.push({ prioridad: prioridad, estado: estadoEmoji, descripcion: descripcion });
    localStorage.setItem('tareas', JSON.stringify(tareas));

    alert("✅ Tarea creada exitosamente.");
}

function verTareas() {
    var tareas = JSON.parse(localStorage.getItem('tareas')) || [];
    var tareasPrioridad1 = tareas.filter(tarea => tarea.prioridad === 1);
    var tareasOrganizadas = tareasPrioridad1.sort((a, b) => a.estado.localeCompare(b.estado));

    var mensaje = "Tareas disponibles\n \nSolo se mostrarán las tareas prioritarias de orden 1, actualiza tus tareas para que desaparezcan las tareas prioritarias de orden 1 completadas y aparezcan nuevas tareas.\n \n";
    tareasOrganizadas.forEach(tarea => {
        mensaje += "" + tarea.estado + " Prioridad " + tarea.prioridad + ", " + tarea.descripcion + "\n";
    });

    alert("📋 " + mensaje);
}

function actualizarTareas() {
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
}


function exportarDatos() {
    var tareas = JSON.parse(localStorage.getItem('tareas')) || [];
    var jsonContent = JSON.stringify(tareas);

    var encodedUri = "data:text/json;charset=utf-8," + encodeURIComponent(jsonContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "tareas.json");
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
                var tareas = JSON.parse(content);
                if (!Array.isArray(tareas)) {
                    throw new Error("El formato del archivo no es válido.");
                }

                localStorage.setItem('tareas', JSON.stringify(tareas));
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

