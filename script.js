checkLocalStorageUsage();

//////////////////////////////////////////////////////////////////////////////

function checkLocalStorageUsage() {
  var total = 0;
  for (var i = 0; i < localStorage.length; i++) {
    var key = localStorage.key(i);
    var value = localStorage.getItem(key);
    total += (key.length + value.length) * 2; // Cada carácter en UTF-16 ocupa 2 bytes
  }
  // Tamaño total del Local Storage permitido por el navegador (generalmente alrededor de 5 MB a 10 MB)
  var totalAllowed = 1024 * 1024 * 5; // Por ejemplo, 5 MB

  // Convertir bytes a megabytes (MB)
  var totalUsedMB = (total / (1024 * 1024)).toFixed(2);
  var totalAllowedMB = (totalAllowed / (1024 * 1024)).toFixed(2);

  // Calcular el espacio disponible
  var availableSpaceMB = (totalAllowedMB - totalUsedMB).toFixed(2);

  if (totalUsedMB >= totalAllowedMB * 0.9) {
    // Si se ha utilizado más del 90% del espacio permitido
    alert(
      "¡Atención! Has utilizado " +
        totalUsedMB +
        " MB de un total de " +
        totalAllowedMB +
        " MB en el Local Storage. Quedan disponibles " +
        availableSpaceMB +
        " MB."
    );
  } else {
    console.log(
      "Espacio utilizado en el LocalStorage: " +
        totalUsedMB +
        "/" +
        totalAllowedMB +
        "MBs"
    );
    console.log(
      "Espacio disponible en el LocalStorage: " + availableSpaceMB + " MB"
    );
  }
}

//////////////////////////////////////////////////////////////////////////////

function limpiarMedicionSemanal() {
  // Obtener el valor actual de localStorage para la clave medicionSemanal
  let medicionSemanal = localStorage.getItem("medicionSemanal");

  // Verificar si medicionSemanal existe y no está vacío
  if (medicionSemanal) {
    try {
      // Convertir el valor de localStorage de cadena a un array de objetos JavaScript
      let medicionArray = JSON.parse(medicionSemanal);

      // Iterar sobre cada objeto en el array y poner rendimiento a 0
      medicionArray.forEach((item) => {
        item.rendimiento = 0;
      });

      // Convertir de nuevo el array de objetos a formato de cadena JSON
      let medicionSemanalActualizada = JSON.stringify(medicionArray);

      // Guardar la medicionSemanal actualizada en localStorage
      localStorage.setItem("medicionSemanal", medicionSemanalActualizada);

      // Actualizar la página para reflejar los cambios
      location.reload();
    } catch (error) {
      console.error(
        "Error al procesar medicionSemanal desde localStorage:",
        error
      );
    }
  } else {
    console.log("No se encontró la clave medicionSemanal en localStorage.");
  }
}

//////////////////////////////////////////////////////////////////////////////

// Datos iniciales
const initialData = [
    { dia: "L", rendimiento: 0 },
    { dia: "M", rendimiento: 0 },
    { dia: "Mi", rendimiento: 0 },
    { dia: "J", rendimiento: 0 },
    { dia: "V", rendimiento: 0 },
    { dia: "S", rendimiento: 0 },
    { dia: "D", rendimiento: 0 },
];

// Obtener datos de localStorage o usar datos iniciales
const data = JSON.parse(localStorage.getItem("medicionSemanal")) || initialData;
const container = document.getElementById("chart-container");

// Número máximo de tareas (se puede ajustar según el usuario)
const maxTareas = JSON.parse(localStorage.getItem("maxTareas")) || 3;
localStorage.setItem("maxTareas", JSON.stringify(maxTareas));

// Función para renderizar el gráfico
function renderChart(data) {
    const diasSemana = ["d", "l", "m", "mi", "j", "v", "s"];
    const diaActual = diasSemana[new Date().getDay()];
    container.innerHTML = "";

    // Calcular el promedio de rendimiento para la clasificación
    let sumRendimiento = 0;
    data.forEach((item) => { sumRendimiento += item.rendimiento; });
    const promedioRendimiento = sumRendimiento / data.length;
    const porcentajePromedio = promedioRendimiento.toFixed(0);
    
    let clasificacion;
    if (promedioRendimiento >= 95) {
        clasificacion = { letra: "SS", porcentaje: porcentajePromedio };
    } else if (promedioRendimiento >= 90) {
        clasificacion = { letra: "S", porcentaje: porcentajePromedio };
    } else if (promedioRendimiento >= 80) {
        clasificacion = { letra: "A", porcentaje: porcentajePromedio };
    } else if (promedioRendimiento >= 70) {
        clasificacion = { letra: "B", porcentaje: porcentajePromedio };
    } else if (promedioRendimiento >= 66) {
        clasificacion = { letra: "C", porcentaje: porcentajePromedio };
    } else if (promedioRendimiento >= 33) {
        clasificacion = { letra: "D", porcentaje: porcentajePromedio };
    } else if (promedioRendimiento >= 10) {
        clasificacion = { letra: "E", porcentaje: porcentajePromedio };
    } else {
        clasificacion = { letra: "F", porcentaje: porcentajePromedio };
    }

    // Mostrar clasificación
    /*const classificationContainer = document.createElement("div");
    classificationContainer.style.fontWeight = "bold";
    classificationContainer.style.fontSize = "36px";
    classificationContainer.style.marginRight = "8px";
    classificationContainer.style.height = "9rem";
    classificationContainer.style.alignItems = "baseline";
    classificationContainer.style.display = "flex";
    switch (clasificacion.letra) {
        case "SS": classificationContainer.style.color = "#4CAF50"; break;
        case "S": classificationContainer.style.color = "#8BC34A"; break;
        case "A": classificationContainer.style.color = "#FFEB3B"; break;
        case "B": classificationContainer.style.color = "#FFC107"; break;
        case "C": classificationContainer.style.color = "#FF9800"; break;
        case "D": classificationContainer.style.color = "#FF5722"; break;
        case "E": classificationContainer.style.color = "#f44336"; break;
        case "F": classificationContainer.style.color = "#f44336"; break;
        default: classificationContainer.style.color = "black";
    }
    classificationContainer.textContent = clasificacion.letra;

    const percentageText = document.createElement("div");
    percentageText.style.fontSize = "16px";
    percentageText.style.color = "white";
    //percentageText.textContent = `${clasificacion.porcentaje}%`;

    container.appendChild(classificationContainer);
    container.appendChild(percentageText);
    */
    // Mostrar barras de progreso para cada día
    data.forEach((item) => {
        const barContainer = document.createElement("div");
        barContainer.style.display = "flex";
        barContainer.style.flexDirection = "column";
        barContainer.style.alignItems = "center";

        const bar = document.createElement("div");
        bar.className = "bar";
        // Ajusta la altura de la barra según el porcentaje
        const altura = (item.rendimiento / 100) * 100; // Altura máxima de 100px
        bar.style.height = `${altura}px`;

        // Color de la barra basado en el rendimiento
        if (item.rendimiento <= 34) {
            bar.style.background = "#f8312f";
        } else if (item.rendimiento <= 69) {
            bar.style.background = "linear-gradient(180deg, rgb(255 120 0) 0%, rgb(255 165 0) 80%)";
        } else {
            bar.style.background = "";
        }

        const label = document.createElement("div");
        label.className = "bar-label";
        label.textContent = item.dia;
        if (item.dia.toLowerCase() === diaActual) {
            label.style.color = "yellow";
        }

        barContainer.appendChild(bar);
        barContainer.appendChild(label);
        container.appendChild(barContainer);
    });
}
renderChart(data);

//////////////////////////////////////////////////////////////////////////////

// Función para ver o crear tareas
function verOCrearTarea() {
    var tareas = JSON.parse(localStorage.getItem("tareas")) || [];
    var maxTareas = JSON.parse(localStorage.getItem("maxTareas")) || 3;  // Valor por defecto

    function obtenerNombreMes(numeroMes) {
        var meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
        return meses[numeroMes - 1];
    }

    function extraerFecha(descripcion) {
        var match = descripcion.match(/^M(\d+) (\w+) (\d+)/);
        if (match) {
            var numeroMes = parseInt(match[1]);
            var nombreMes = obtenerNombreMes(numeroMes);
            var dia = parseInt(match[3]);
            var fecha = new Date(new Date().getFullYear(), numeroMes - 1, dia);
            return fecha;
        }
        return null;
    }

    tareas.sort((a, b) => {
        var fechaA = extraerFecha(a.descripcion);
        var fechaB = extraerFecha(b.descripcion);
        if (fechaA && fechaB) {
            return fechaA - fechaB;
        } else {
            return a.descripcion.localeCompare(b.descripcion);
        }
    });

    var fechaActual = new Date();
    var diaSemana = fechaActual.getDay();
    var diaActual = "";
    switch (diaSemana) {
        case 0: diaActual = "d"; break;
        case 1: diaActual = "l"; break;
        case 2: diaActual = "m"; break;
        case 3: diaActual = "mi"; break;
        case 4: diaActual = "j"; break;
        case 5: diaActual = "v"; break;
        case 6: diaActual = "s"; break;
    }

    var dias = { s: "📆-Sábado-", d: "📆-Domingo-", l: "📆-Lunes-", m: "📆-Martes-", mi: "📆-Miércoles-", j: "📆-Jueves-", v: "📆-Viernes-", x: "📆-Sin asignar-" };
    var diaActualEmoji = "📆⭐";
    var mensaje = `📝Tareas disponibles - Tu progreso `;
    var tareasDiaActual = tareas.filter((tarea) => tarea.dia === diaActual);
    var totalTareasDiaActual = tareasDiaActual.length;
    var tareasCompletadasDiaActual = tareasDiaActual.filter((tarea) => tarea.estado === "🟢").length;
    var progresoDiaActual = totalTareasDiaActual > 0 ? Math.round((tareasCompletadasDiaActual / maxTareas) * 100) : 0;
    var progresoBarra = "";
    for (var i = 0; i < 10; i++) {
        progresoBarra += i < progresoDiaActual / 10 ? "█" : "░";
    }
    mensaje += `${progresoBarra} ${progresoDiaActual}%\n`;

    var diasOrdenados = Object.keys(dias).sort((a, b) => {
        if (a === "x") return 1;
        if (b === "x") return -1;
        return parseInt(a) - parseInt(b);
    });

    diasOrdenados.forEach((diaKey) => {
        var diaMensaje = diaKey === diaActual ? dias[diaKey].replace("📆", diaActualEmoji) : dias[diaKey];
        var tareasDia = tareas.filter((tarea) => tarea.dia === diaKey && tarea.prioridad === 1);
        if (tareasDia.length > 0) {
            mensaje += `${diaMensaje}\n`;
            tareasDia.forEach((tarea) => {
                mensaje += `${tarea.estado}${tarea.descripcion}\n`;
            });
        }
    });

    var nuevaTarea = prompt(`${mensaje}`);
    if (!nuevaTarea) return;
    if (nuevaTarea.trim() === "") {
        alert("⚠️Tarea inválida. Debes ingresar una tarea válida.");
        return;
    }
    if (nuevaTarea === "actualizar") {
        moverTareasAlDiaActual(tareas);
        localStorage.setItem("tareas", JSON.stringify(tareas));
        alert("📝Tareas movidas al día actual exitosamente.");
        return;
    }
    if (nuevaTarea === "mover") {
        moverTareasAlDiaSiguiente(tareas, diaActual);
        return;
    }
    if (nuevaTarea === "crear") {
        crearNuevaTareaConAsistenciaGuiada(tareas, diaActual);
        return;
    }

    if (nuevaTarea.length > 70) {
        alert("⚠️Tarea demasiado larga. La tarea debe tener 70 caracteres o menos.");
        return;
    }
    var partesTarea = nuevaTarea.split(",");
    if (partesTarea.length < 4) {
        alert("⚠️Formato de tarea inválido. La tarea no se creará.");
        return;
    }
    var prioridad = parseInt(partesTarea[0]);
    var estado = partesTarea[1].toLowerCase();
    var descripcion = partesTarea.slice(2, -1).join(",");
    var dia = partesTarea[partesTarea.length - 1].toLowerCase();
    var estadoEmoji;
    switch (estado) {
        case "p": estadoEmoji = "🔴"; break;
        case "e": estadoEmoji = "🟡"; break;
        case "f": estadoEmoji = "🟢"; break;
        default:
            alert("⚠️Estado inválido. La tarea no se creará.");
            return;
    }
    if (isNaN(prioridad) || prioridad < 1 || prioridad > 3) {
        alert("⚠️Prioridad inválida. La tarea no se creará.");
        return;
    }
    var diasValidos = ["l", "m", "mi", "j", "v", "s", "d", "x"];
    if (!diasValidos.includes(dia)) {
        alert("⚠️Día inválido. La tarea no se creará.");
        return;
    }
    var nuevaTareaObj = { prioridad: prioridad, estado: estadoEmoji, descripcion: descripcion, dia: dia };
    tareas.push(nuevaTareaObj);
    localStorage.setItem("tareas", JSON.stringify(tareas));

    var tareasActualizadas = JSON.parse(localStorage.getItem("tareas")) || [];
    var tareasDiaActualizadas = tareasActualizadas.filter((tarea) => tarea.dia === diaActual);
    var totalTareasDiaActualizadas = tareasDiaActualizadas.length;
    var tareasCompletadasDiaActualizadas = tareasDiaActualizadas.filter((tarea) => tarea.estado === "🟢").length;
    var progresoDiaActualizado = totalTareasDiaActualizadas > 0 ? Math.round((tareasCompletadasDiaActualizadas / maxTareas) * 100) : 0;
    var medicionSemanalActualizada = JSON.parse(localStorage.getItem("medicionSemanal")) || initialData;
    var diaDataActualizada = medicionSemanalActualizada.find((item) => item.dia.toLowerCase() === diaActual);
    if (diaDataActualizada) {
        diaDataActualizada.rendimiento = progresoDiaActualizado;
    }
    localStorage.setItem("medicionSemanal", JSON.stringify(medicionSemanalActualizada));
    alert("📝Tarea creada exitosamente.");
    renderChart(medicionSemanalActualizada);
}

//////////////////////////////////////////////////////////////////////////////

// Función para establecer el máximo de tareas
function establecerMaximoTareas() {
    var nuevoMaximo = prompt("Introduce el número máximo de tareas para calcular el 100%.");
    var nuevoMaximoNum = parseInt(nuevoMaximo);

    if (isNaN(nuevoMaximoNum) || nuevoMaximoNum <= 0) {
        alert("⚠️Número máximo de tareas inválido.\n*Debe ser un número mayor que 0.");
        return;
    }

    localStorage.setItem("maxTareas", JSON.stringify(nuevoMaximoNum));
    
    // Actualizar el rendimiento de todos los días
    var tareasActualizadas = JSON.parse(localStorage.getItem("tareas")) || [];
    var medicionSemanalActualizada = JSON.parse(localStorage.getItem("medicionSemanal")) || initialData;
    
    medicionSemanalActualizada.forEach((item) => {
        var tareasDelDia = tareasActualizadas.filter((tarea) => tarea.dia === item.dia.toLowerCase());
        var totalTareasDelDia = tareasDelDia.length;
        var tareasCompletadasDelDia = tareasDelDia.filter((tarea) => tarea.estado === "🟢").length;
        item.rendimiento = nuevoMaximoNum > 0 ? Math.round((tareasCompletadasDelDia / nuevoMaximoNum) * 100) : 0;
    });

    localStorage.setItem("medicionSemanal", JSON.stringify(medicionSemanalActualizada));
    alert("📝Número máximo de tareas actualizado exitosamente.");
    renderChart(medicionSemanalActualizada);
}

//////////////////////////////////////////////////////////////////////////////


function moverTareasDelDiaAnterior(tareas, diaActual) {
  var diaAnterior = anteriorDia(diaActual);

  tareas.forEach((tarea) => {
    if (
      tarea.dia === diaAnterior &&
      (tarea.estado === "🔴" || tarea.estado === "🟡")
    ) {
      tarea.dia = diaActual;
    }
  });
}

function moverTareasAlDiaActual(tareas) {
  var fechaActual = new Date();
  var diaSemana = fechaActual.getDay();
  var diaActual = "";

  // Generación de números aleatorios para la suma de verificación
  var num1 = Math.floor(Math.random() * 10 + 1);
  var num2 = Math.floor(Math.random() * 10 + 1);
  var num3 = Math.floor(Math.random() * 10 + 1);
  var resultado = num1 + num2 + num3;

  // Solicitar al usuario que realice la suma de verificación
  var respuesta = prompt(
    `Realiza la siguiente suma para confirmar el mover tareas\n${num1} + ${num2} + ${num3}`
  );

  // Validar la respuesta ingresada por el usuario
  if (respuesta === resultado.toString()) {
    // Asignar el día actual según el día de la semana
    switch (diaSemana) {
      case 0:
        diaActual = "d";
        break;
      case 1:
        diaActual = "l";
        break;
      case 2:
        diaActual = "m";
        break;
      case 3:
        diaActual = "mi";
        break;
      case 4:
        diaActual = "j";
        break;
      case 5:
        diaActual = "v";
        break;
      case 6:
        diaActual = "s";
        break;
    }

    // Filtrar y mover tareas con estado 🟡 o 🔴 al día actual, ignorando las que tienen día "x"
    tareas.forEach((tarea) => {
      if (
        (tarea.estado === "🟡" || tarea.estado === "🔴") &&
        tarea.dia !== "x"
      ) {
        tarea.dia = diaActual;
      }
    });

    // Guardar las tareas actualizadas en localStorage u otro método de persistencia
    localStorage.setItem("tareas", JSON.stringify(tareas));

    // Mensaje de confirmación de que las tareas se han movido correctamente
    alert("📝Tareas movidas al día actual exitosamente.");
  } else {
    // Mensaje de error si la suma no es correcta
    alert("Tareas no movidas. No has completado la suma correctamente.");
  }
}

function moverTareasAlDiaSiguiente(tareas, diaActual) {
  limpiarMedicionSemanal();
  var num1 = Math.floor(Math.random() * 10 + 1);
  var num2 = Math.floor(Math.random() * 10 + 1);
  var num3 = Math.floor(Math.random() * 10 + 1);
  var respuesta;
  var respultado = num1 + num2 + num3;

  respuesta = prompt(
    `Realiza la siguiente suma para confirmar el mover tareas\n${num1} + ${num2} + ${num3}`
  );

  if (respuesta == respultado) {
    var diaSiguiente = siguienteDia(diaActual);

    tareas.forEach((tarea) => {
      if (
        tarea.dia === diaActual &&
        (tarea.estado === "🔴" || tarea.estado === "🟡")
      ) {
        tarea.dia = diaSiguiente;
      }
    });

    // Guardar las tareas actualizadas en localStorage
    localStorage.setItem("tareas", JSON.stringify(tareas));
    alert("📝Tareas movidas exitosamente.");
  } else {
    alert("Taraas no movidas\nNo has completado la suma");
  }
}

function crearNuevaTareaConAsistenciaGuiada(tareas, diaActual) {
  // Prompt para descripción
  var descripcion = prompt("Escribe la tarea a realizar:");
  if (!descripcion) {
    alert("⚠️ Tarea inválida. Debes ingresar una descripción válida.");
    return;
  }

  // Preguntar si es urgente
  var esUrgente = confirm("¿Es urgente?");
  var prioridad = esUrgente ? 1 : 2;

  // Preguntar si es importante
  var esImportante = confirm("¿Es importante?");
  if (esImportante) {
    descripcion = `📌${descripcion}`;
  }

  // Establecer la fecha
  var dias = {
    l: "Lunes",
    m: "Martes",
    mi: "Miércoles",
    j: "Jueves",
    v: "Viernes",
    s: "Sábado",
    d: "Domingo",
    x: "Fecha específica",
  };

  var opcionDia = prompt(
    `Establece una fecha (l, m, mi, j, v, s, d, x)\nDeja vacío para hoy:`
  );
  var diaSeleccionado = diaActual;
  var mes = "";
  var diaMes = "";

  if (opcionDia && dias[opcionDia]) {
    if (opcionDia === "x") {
      // Elije el mes
      mes = prompt("Elije el mes (1-12):");
      if (!mes || mes < 1 || mes > 12) {
        alert("⚠️ Mes inválido. La tarea no se creará.");
        return;
      }

      var meses = [
        "Ene",
        "Feb",
        "Mar",
        "Abr",
        "May",
        "Jun",
        "Jul",
        "Ago",
        "Sep",
        "Oct",
        "Nov",
        "Dic",
      ];
      mes = `M${mes} ${meses[mes - 1]}`;

      // Elije el día
      diaMes = prompt("Elije el día (1-31):");
      if (!diaMes || diaMes < 1 || diaMes > 31) {
        alert("⚠️ Día inválido. La tarea no se creará.");
        return;
      }

      diaSeleccionado = `${mes} ${diaMes}`;
    } else {
      diaSeleccionado = opcionDia;
    }
  } else if (opcionDia !== "") {
    alert("⚠️ Opción inválida. La tarea no se creará.");
    return;
  }

  // Crear nueva tarea
  var nuevaTareaObj = {
    prioridad: prioridad,
    descripcion: descripcion,
    dia: diaSeleccionado,
  };

  tareas.push(nuevaTareaObj);
  localStorage.setItem("tareas", JSON.stringify(tareas));
  alert("📝 Tarea creada exitosamente.");
}

//////////////////////////////////////////////////////////////////////////

// Función auxiliar para obtener el nombre del mes
function obtenerNombreMes(numeroMes) {
  var meses = [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ];
  return meses[numeroMes - 1];
}

function anteriorDia(diaActual) {
  var ordenDias = ["d", "l", "m", "mi", "j", "v", "s"];
  var indice = ordenDias.indexOf(diaActual);
  return indice === -1 || indice === 0 ? "s" : ordenDias[indice - 1];
}

function siguienteDia(diaActual) {
  var ordenDias = ["d", "l", "m", "mi", "j", "v", "s"];
  var indice = ordenDias.indexOf(diaActual);
  return indice === -1 || indice === ordenDias.length - 1
    ? "d"
    : ordenDias[indice + 1];
}

///////////////////////////////////////////////////////////////////////

function verOCrearRutina() {
    // Cargar la rutina existente, si la hay
    var rutina = localStorage.getItem("rutina") || "";

    // Definir los mapeos para estados y días
    var estadoMap = {
        p: "🔴",
        e: "🟡",
        f: "🟢",
    };

    var diaMap = {
        l: "Lunes.",
        m: "Martes.",
        mi: "Miércoles.",
        j: "Jueves.",
        v: "Viernes.",
        s: "Sábado.",
        d: "Domingo.",
        x: "",
    };

    // Definir el mapeo para prioridades
    var prioridadMap = {
        1: 1,
        2: 2,
        3: 3,
    };

    // Función para convertir el formato abreviado a uno más descriptivo
    function convertirRutinaFormateada(rutina) {
        var partesRutina = rutina.split(";").filter((t) => t.trim() !== "");
        var rutinaFormateada = partesRutina
            .map((tarea) => {
                var partesTarea = tarea.split(",");
                if (partesTarea.length < 4) {
                    return ""; // Ignorar las tareas con formato incorrecto
                }
                var prioridad = prioridadMap[partesTarea[0]] || partesTarea[0];
                var estado = estadoMap[partesTarea[1].toLowerCase()] || partesTarea[1];
                var descripcion = partesTarea.slice(2, -1).join(",");
                var dia =
                    diaMap[partesTarea[partesTarea.length - 1].toLowerCase()] ||
                    partesTarea[partesTarea.length - 1];
                return `${prioridad}${estado}${descripcion},${dia}`;
            })
            .join("\n");
        return rutinaFormateada;
    }

    // Convertir la rutina a un formato más descriptivo
    var rutinaFormateada = convertirRutinaFormateada(rutina);
    var nuevaRutina = prompt(
        "🔃Rutina actual:\n" +
            rutinaFormateada +
            "\n\n*Ingresa la nueva rutina con el formato: 'Prioridad,Estado,Descripción,Día;Prioridad,Estado,Descripción,Día;...'; utiliza 'crear' al final para crear las tareas de la rutina",
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
    var partesRutina = nuevaRutina.split(";").filter((t) => t.trim() !== ""); // Filtrar para eliminar cualquier tarea vacía

    // Verificar si la palabra clave "crear" está al final
    var ultimaParte = partesRutina[partesRutina.length - 1].trim().toLowerCase();
    var crearAlFinal = ultimaParte === "crear";

    // Si "crear" está al final, eliminarlo de las partes de la rutina
    if (crearAlFinal) {
        partesRutina.pop();
    }

    // Convertir las partes de la rutina en el formato de objeto para la comparación
    var tareasNuevas = partesRutina.map(tarea => {
        var partesTarea = tarea.split(",");
        return {
            prioridad: prioridadMap[partesTarea[0]] || partesTarea[0],
            estado: estadoMap[partesTarea[1].toLowerCase()] || partesTarea[1],
            descripcion: partesTarea.slice(2, -1).join(","),
            dia: diaMap[partesTarea[partesTarea.length - 1].toLowerCase()] || partesTarea[partesTarea.length - 1]
        };
    });

    // Obtener las tareas actuales del localStorage
    var tareas = JSON.parse(localStorage.getItem("tareas")) || [];
    var tareasExistentes = tareas.map(tarea => JSON.stringify(tarea));

    // Verificar si alguna de las nuevas tareas ya existe en las tareas existentes
    var tareasYaExisten = tareasNuevas.some(tareaNueva => {
        var tareaNuevaString = JSON.stringify(tareaNueva);
        return tareasExistentes.includes(tareaNuevaString);
    });

    if (tareasYaExisten) {
        alert("⚠️Las tareas no se han creado porque ya existen en la lista de tareas.");
        return;
    }

    // Guardar la rutina actualizada solo si ha cambiado y es válida
    if (nuevaRutina !== rutina) {
        localStorage.setItem("rutina", partesRutina.join(";"));
        alert("✅Rutina guardada exitosamente.");

        // Si "crear" estaba al final, confirmar la creación de las tareas a partir de la rutina
        if (crearAlFinal) {
            // Confirmar la creación de las tareas a partir de la rutina
            var confirmacion = confirm(
                "⚠️¿Estás seguro de que deseas crear las tareas a partir de la rutina?"
            );
            if (!confirmacion) {
                return; // Salir de la función sin hacer nada si el usuario cancela
            }

            // Generar tres números aleatorios para la suma
            var num1 = Math.floor(Math.random() * 10);
            var num2 = Math.floor(Math.random() * 10);
            var num3 = Math.floor(Math.random() * 10);
            var sumaCorrecta = num1 + num2 + num3;
            var sumaUsuario = parseInt(
                prompt(
                    `Para confirmar, resuelve la siguiente suma: ${num1} + ${num2} + ${num3}`
                )
            );
            if (sumaUsuario === sumaCorrecta) {
                // Procesar y agregar las tareas a las tareas existentes
                for (var tarea of partesRutina) {
                    var partesTarea = tarea.split(",");
                    var prioridad = parseInt(partesTarea[0]);
                    var estado = partesTarea[1].toLowerCase();
                    var descripcion = partesTarea.slice(2, -1).join(",");
                    var dia = partesTarea[partesTarea.length - 1].toLowerCase();
                    var estadoEmoji;
                    switch (estado) {
                        case "p":
                            estadoEmoji = "🔴";
                            break;
                        case "e":
                            estadoEmoji = "🟡";
                            break;
                        case "f":
                            estadoEmoji = "🟢";
                            break;
                    }
                    var prioridadEmoji = prioridadMap[prioridad.toString()] || prioridad;
                    var nuevaTareaObj = {
                        prioridad: prioridadEmoji,
                        estado: estadoEmoji,
                        descripcion: descripcion,
                        dia: dia,
                    };

                    // Verificar si la tarea nueva ya existe en las tareas actuales
                    if (!tareasExistentes.includes(JSON.stringify(nuevaTareaObj))) {
                        tareas.push(nuevaTareaObj);
                    } else {
                        alert(`⚠️La tarea '${descripcion}' ya existe y no se creará.`);
                    }
                }
                // Guardar las tareas actualizadas en localStorage
                localStorage.setItem("tareas", JSON.stringify(tareas));
                alert("✅Tareas creadas exitosamente a partir de la rutina.");
            } else {
                alert("⚠️Respuesta incorrecta. Las tareas no se crearán.");
            }
        }
    }
}



//////////////////////////////////////////////////////////////////////////////

function editarTarea() {
  var tareas = JSON.parse(localStorage.getItem("tareas")) || [];

  if (tareas.length === 0) {
    alert("⚠️Actualmente, no tienes tareas para gestionar.");
    return;
  }

  var mensaje =
    "Selecciona la tarea a gestionar. Escribe 'aplazar' para aplazar tareas\n";
  for (var index = tareas.length - 1; index >= 0; index--) {
    var tarea = tareas[index];
    mensaje += `${index + 1}.${convertirPrioridad(
      tarea.prioridad
    )}${obtenerNombreDia(tarea.dia)}${tarea.estado}${tarea.descripcion}.\n`;
  }

  var tareaSeleccionada = prompt(mensaje);

  // Nueva característica
  if (tareaSeleccionada === "aplazar") {
    for (var i = 0; i < tareas.length; i++) {
      if (tareas[i].prioridad === 2) {
        tareas[i].prioridad = 3; // Cambiar la prioridad a 3
      }
    }
    console.log("Estás intentando aplazar las tareas");
    alert(
      "🕒Todas las tareas con prioridad 2 han sido aplazadas a prioridad 3."
    );
    localStorage.setItem("tareas", JSON.stringify(tareas));
    renderChart(medicionSemanalActualizada);
    return;
  }

  if (tareaSeleccionada === null) return; // Usuario canceló
  tareaSeleccionada = parseInt(tareaSeleccionada) - 1;

  if (
    isNaN(tareaSeleccionada) ||
    tareaSeleccionada < 0 ||
    tareaSeleccionada >= tareas.length
  ) {
    alert("⚠️Tarea inválida.");
    return;
  }

  function editarDetalleTarea() {
    var nuevaDescripcion = prompt(
      "Ingresa la nueva descripción:",
      tareas[tareaSeleccionada].descripcion
    );
    if (nuevaDescripcion === null) {
      editarTarea(); // Vuelve a llamar a editarTarea si el usuario cancela
      return;
    }

    var nuevaPrioridad = prompt(
      "Ingresa la nueva prioridad (1: 🔥, 2: 🔔, 3: 📆):",
      tareas[tareaSeleccionada].prioridad
    );
    if (nuevaPrioridad === null) {
      editarTarea(); // Vuelve a llamar a editarTarea si el usuario cancela
      return;
    }
    nuevaPrioridad = parseInt(nuevaPrioridad);

    var nuevoEstado = prompt(
      "Ingresa el nuevo estado (p: 🔴, e: 🟡, f: 🟢):",
      tareas[tareaSeleccionada].estado === "🔴"
        ? "p"
        : tareas[tareaSeleccionada].estado === "🟡"
        ? "e"
        : "f"
    );
    if (nuevoEstado === null) {
      editarTarea(); // Vuelve a llamar a editarTarea si el usuario cancela
      return;
    }

    // Verificar la longitud de la nueva descripción
    if (nuevaDescripcion.length > 64) {
      alert(
        "⚠️Descripción demasiado larga. La descripción debe tener 64 caracteres o menos."
      );
      return; // Descripción demasiado larga
    }

    var nuevoDia = prompt(
      "Ingresa el nuevo día (l: Lunes, m: Martes, mi: Miércoles, j: Jueves, v: Viernes, s: Sábado, d: Domingo, x: Sin asignar)\n*Escribe 'borrar' para eliminar la tarea:",
      tareas[tareaSeleccionada].dia
    );
    if (nuevoDia === null) {
      editarTarea(); // Vuelve a llamar a editarTarea si el usuario cancela
      return;
    }

    if (isNaN(nuevaPrioridad) || nuevaPrioridad < 1 || nuevaPrioridad > 3) {
      alert("⚠️Prioridad inválida.");
      return;
    }

    var estadoEmoji;
    switch (nuevoEstado.toLowerCase()) {
      case "p":
        estadoEmoji = "🔴";
        break;
      case "e":
        estadoEmoji = "🟡";
        break;
      case "f":
        estadoEmoji = "🟢";
        break;
      default:
        alert("⚠️Estado inválido.");
        return;
    }

    if (nuevoDia.toLowerCase() === "borrar") {
      tareas.splice(tareaSeleccionada, 1); // Elimina la tarea seleccionada
      alert("🗑️Tarea borrada exitosamente.");
      localStorage.setItem("tareas", JSON.stringify(tareas)); // Actualiza el almacenamiento local
      renderChart(medicionSemanalActualizada); // Renderiza la gráfica actualizada si es necesario
      return; // Termina la función después de borrar la tarea
    } else {
      var diaTexto;
      switch (nuevoDia.toLowerCase()) {
        case "l":
          diaTexto = "l";
          break;
        case "m":
          diaTexto = "m";
          break;
        case "mi":
          diaTexto = "mi";
          break;
        case "j":
          diaTexto = "j";
          break;
        case "v":
          diaTexto = "v";
          break;
        case "s":
          diaTexto = "s";
          break;
        case "d":
          diaTexto = "d";
          break;
        case "x":
          diaTexto = "x";
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
      localStorage.setItem("tareas", JSON.stringify(tareas));

      // Actualizar el progreso y la gráfica después de editar la tarea
      var tareasDiaActualizadas = tareas.filter(
        (tarea) => tarea.dia === diaTexto
      );
      var totalTareasDiaActualizadas = tareasDiaActualizadas.length;
      var tareasCompletadasDiaActualizadas = tareasDiaActualizadas.filter(
        (tarea) => tarea.estado === "🟢"
      ).length;
      var progresoDiaActualizado =
        totalTareasDiaActualizadas > 0
          ? Math.round(
              (tareasCompletadasDiaActualizadas / totalTareasDiaActualizadas) *
                100
            )
          : 0;

      const medicionSemanalActualizada =
        JSON.parse(localStorage.getItem("medicionSemanal")) || initialData;
      const diaDataActualizada = medicionSemanalActualizada.find(
        (item) => item.dia.toLowerCase() === diaTexto
      );
      if (diaDataActualizada) {
        diaDataActualizada.rendimiento = progresoDiaActualizado;
      }
      localStorage.setItem(
        "medicionSemanal",
        JSON.stringify(medicionSemanalActualizada)
      );

      renderChart(medicionSemanalActualizada);
    }
  }

  editarDetalleTarea(); // Llama a la función que maneja la edición de detalles de la tarea
}

function obtenerNombreDia(abreviaturaDia) {
  switch (abreviaturaDia.toLowerCase()) {
    case "s":
      return "S";
    case "d":
      return "D";
    case "l":
      return "L";
    case "m":
      return "M";
    case "mi":
      return "Mi";
    case "j":
      return "J";
    case "v":
      return "V";
    case "x":
      return "X";
    default:
      return "?";
  }
}

function convertirPrioridad(prioridad) {
  var prioridadMap = {
    1: "🔥",
    2: "🔔",
    3: "📆",
  };
  return prioridadMap[prioridad] || prioridad;
}


//////////////////////////////////////////////////////////////////////////////

function actualizarTareas() {
  // Generar dos números aleatorios entre 1 y 10
  var numero1 = Math.floor(Math.random() * 10) + 1;
  var numero2 = Math.floor(Math.random() * 10) + 1;
  var numero3 = Math.floor(Math.random() * 10) + 1;

  // Pedir al usuario que resuelva la suma
  var respuestaUsuario = prompt(
    `¿Está seguro de actualizar las tareas?\n*Para confirmar la actualización de las tareas\nresuelve la siguiente suma: ${numero1} + ${numero2} + ${numero3}`
  );

  // Verificar si el usuario presionó "Cancelar"
  if (respuestaUsuario === null) {
    return; // Salir de la función sin hacer nada
  }

  // Verificar si la respuesta es correcta
  var sumaCorrecta = numero1 + numero2 + numero3;

  if (parseInt(respuestaUsuario) === sumaCorrecta) {
    var tareas = JSON.parse(localStorage.getItem("tareas")) || [];
    var tareasCompletadas =
      JSON.parse(localStorage.getItem("tareasCompletadas")) || [];

    // Filtrar las tareas completadas y añadirlas a tareasCompletadas
    var nuevasTareas = tareas.filter((tarea) => {
      if (tarea.prioridad === 1 && tarea.estado === "🟢") {
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
    localStorage.setItem("tareas", JSON.stringify(nuevasTareas));
    limpiarMedicionSemanal();

    // Actualizar el registro de tareas completadas en el LocalStorage
    localStorage.setItem(
      "tareasCompletadas",
      JSON.stringify(tareasCompletadas)
    );

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
  var emojis = [
    "1🐭",
    "2🐸",
    "3🐵",
    "4🦊",
    "5🐺",
    "6🐯",
    "7🦁",
    "8🐻",
    "9🐼",
    "10🐉",
  ];
  return emojis[Math.min(nivel - 1, emojis.length - 1)];
}

function calcularTareasRestantes(numTareasCompletadas) {
  return 10 - (numTareasCompletadas % 10);
}

function exportarTareas(tareasCompletadas) {
    // Obtener la fecha y hora actuales en formato DD-MM-YYYY HH-MM-SS
    const ahora = new Date();
    const dia = String(ahora.getDate()).padStart(2, '0');
    const mes = String(ahora.getMonth() + 1).padStart(2, '0'); // Los meses en JavaScript empiezan desde 0
    const anio = ahora.getFullYear();
    const horas = String(ahora.getHours()).padStart(2, '0');
    const minutos = String(ahora.getMinutes()).padStart(2, '0');
    const segundos = String(ahora.getSeconds()).padStart(2, '0');
    const fechaFormateada = `${dia}-${mes}-${anio} ${horas}-${minutos}-${segundos}`;

    // Crear el contenido del archivo de texto
    let contenido = "Tareas Completadas:\n\n";
    tareasCompletadas.forEach((tarea) => {
        contenido += `${tarea.estado} ${tarea.descripcion}, ${convertirDiaCompletadas(tarea.dia)}.\n`;
    });

    // Crear un blob con el contenido del archivo
    const blob = new Blob([contenido], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    // Crear un enlace de descarga con nombre dinámico basado en la fecha y hora actuales
    const a = document.createElement('a');
    a.href = url;
    a.download = `Todo.html - Completed Tasks ${fechaFormateada}.txt`;
    document.body.appendChild(a);
    a.click();

    // Limpiar y eliminar el enlace
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}


function verTareasCompletadas() {
    var tareasCompletadas = JSON.parse(localStorage.getItem("tareasCompletadas")) || [];

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
    tareasCompletadas.forEach((tarea) => {
        mensaje += `${tarea.estado} ${tarea.descripcion}, ${convertirDiaCompletadas(tarea.dia)}.\n`;
    });

    // Pedir al usuario que resuelva la suma para confirmar la eliminación de las tareas completadas
    /*var respuestaUsuario = prompt(`${mensaje}*Para la eliminación de las tareas completadas, escribe "borrar" o "exportar" para exportar las tareas.`);*/

        var respuestaUsuario = prompt(`${mensaje}*Para la eliminación de las tareas completadas, escribe "borrar" o "exportar" para exportar las tareas.`);

    // Verificar si el usuario ha ingresado una respuesta
    if (respuestaUsuario !== null) {
        // Verificar si la respuesta es "exportar"
        if (respuestaUsuario.trim().toLowerCase() === "exportar") {
            exportarTareas(tareasCompletadas);
            return; // Salir de la función después de exportar
        }

        // Verificar si la respuesta es "borrar"
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
                        localStorage.removeItem("tareasCompletadas"); // Eliminar el registro de tareas completadas
                        alert("🗑️Registro de tareas completadas eliminado exitosamente.");
                    } else {
                        alert("⚠️Respuesta incorrecta. El registro de tareas completadas no ha sido eliminado.");
                    }
                }
            }
        }
    }
}


function convertirDiaCompletadas(dia) {
  var diaMap = {
    l: "Lunes",
    m: "Martes",
    mi: "Miércoles",
    j: "Jueves",
    v: "Viernes",
    s: "Sábado",
    d: "Domingo",
    x: "",
  };
  return diaMap[dia.toLowerCase()] || dia;
}

//////////////////////////////////////////////////////////////////////////////

function aleatorio() {
  numero = prompt(
    "Ingresa un numero\n*El numero aleatorio se calculará entre 1 y el numero ingresado."
  );

  // Verificar si el usuario presionó "Cancelar" o ingresó un valor no válido
  if (numero === null || isNaN(numero)) {
    alert("⚠️Ingresa un valor numérico válido para el rango inicial.");
    return;
  }

  alert(`🎲El número aleatorio es ${Math.floor(Math.random() * numero + 1)}`);
}

//////////////////////////////////////////////////////////////////////////////

function porcentaje() {
  // Solicitar el número de partes
  var numero_porcentaje_partes = parseInt(
    prompt(
      "Ingresa el número de partes\n*Si tienes 3 partes de algo, ingresa 3."
    )
  );

  // Verificar si el usuario presionó "Cancelar" o ingresó un valor no válido
  if (numero_porcentaje_partes === null || isNaN(numero_porcentaje_partes)) {
    alert("⚠️Ingresa un valor numérico válido para las partes.");
    return;
  }

  // Solicitar el número total
  var numero_porcentaje_total = parseInt(
    prompt("Ingresa el número total\n*Si el total es 10, ingresa 10.")
  );

  // Verificar si el usuario presionó "Cancelar" o ingresó un valor no válido
  if (numero_porcentaje_total === null || isNaN(numero_porcentaje_total)) {
    alert("⚠️Ingresa un valor numérico válido para el total.");
    return;
  }

  // Calcular el porcentaje
  var porcentaje_operacion =
    (numero_porcentaje_partes / numero_porcentaje_total) * 100;

  // Mostrar el resultado
  alert(
    "📊El porcentaje de " +
      numero_porcentaje_partes +
      "/" +
      numero_porcentaje_total +
      " es: " +
      Math.floor(porcentaje_operacion) +
      "%"
  );
}

//////////////////////////////////////////////////////////////////////////////

function importarDatos() {
  var input = document.createElement("input");
  input.type = "file";
  input.accept = ".json"; // Aceptar solo archivos de texto (.json)

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

        localStorage.setItem("tareas", JSON.stringify(datos.tareas));
        localStorage.setItem(
          "tareasCompletadas",
          JSON.stringify(datos.tareasCompletadas || [])
        ); // Incluir tareasCompletadas

        localStorage.setItem("nota", datos.nota || "");
        localStorage.setItem("rutina", datos.rutina || ""); // Incluir la rutina
        localStorage.setItem(
          "medicionSemanal",
          datos.medicionSemanal || initialData
        ); // Incluir la rutina
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
    tareas: JSON.parse(localStorage.getItem("tareas")) || [],
    tareasCompletadas:
      JSON.parse(localStorage.getItem("tareasCompletadas")) || [], // Incluir tareasCompletadas
    nota: localStorage.getItem("nota") || "",
    rutina: localStorage.getItem("rutina") || "", // Incluir la rutina
    medicionSemanal: localStorage.getItem("medicionSemanal") || initialData,
  };

  var jsonContent = JSON.stringify(datos);

  // Obtener la fecha y hora actual
  var fecha = new Date();
  var dia = String(fecha.getDate()).padStart(2, "0");
  var mes = String(fecha.getMonth() + 1).padStart(2, "0"); // Enero es 0
  var anio = fecha.getFullYear();
  var horas = String(fecha.getHours()).padStart(2, "0");
  var minutos = String(fecha.getMinutes()).padStart(2, "0");
  var segundos = String(fecha.getSeconds()).padStart(2, "0");

  // Formatear la fecha y hora como DD-MM-YYYY HH-MM-SS
  var fechaFormateada = `${dia}-${mes}-${anio} ${horas}.${minutos}`;

  // Crear el nombre del archivo con la fecha y hora
  var nombreArchivo = `Todo.html - ${fechaFormateada}.json`;

  var encodedUri =
    "data:text/json;charset=utf-8," + encodeURIComponent(jsonContent);
  var link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", nombreArchivo);
  document.body.appendChild(link);
  link.click();

  //alert("💾Datos exportados exitosamente.");
}

//////////////////////////////////////////////////////////////////////////////

function borrarDatos() {
  // Generar dos números aleatorios entre 1 y 10
  var numero1 = Math.floor(Math.random() * 10) + 1;
  var numero2 = Math.floor(Math.random() * 10) + 1;
  var numero3 = Math.floor(Math.random() * 10) + 1;
  var numero4 = Math.floor(Math.random() * 10) + 1;
  // Pedir al usuario que resuelva la suma
  var respuestaUsuario = prompt(
    `Para confirmar el formateo de datos\nresuelve la siguiente suma: ${numero1} + ${numero2} + ${numero3} + ${numero4}`
  );

  // Verificar si la respuesta es correcta
  var sumaCorrecta = numero1 + numero2 + numero3 + numero4;

  if (parseInt(respuestaUsuario) === sumaCorrecta) {
    localStorage.clear();
    alert("🗑️Datos formateados exitosamente.");
    location.reload();
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

//////////////////////////////////////////////////////////////////////////////

function walllist() {
  var ubicacionActual = window.location.origin;
  // Agregar la ruta o el nombre del archivo que deseas
  var nuevaUbicacion = ubicacionActual + "/walllist/walllist";
  // Redirigir a la nueva ubicación
  window.location.href = nuevaUbicacion;
}

//////////////////////////////////////////////////////////////////////////////

function comoUsar() {
  window.open("https://adolfsan99.github.io/miniprograma/", "_blank");
}

//////////////////////////////////////////////////////////////////////////////
