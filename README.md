   # ✅Todo.html -❓Guía de usuario

A continuación, encontrarás una descripción completa de cada botón y cómo puedes utilizarlo para mejorar tu experiencia con nuestra aplicación. **¡Sigue leyendo para descubrir cómo sacar el máximo provecho de todas las características que ofrecemos!**

## 📝Ver/crear tarea

Para crear una tarea o ver la lista de tareas, sigue estos simples pasos:

## Uso

1. **Presiona el botón "Ver/Crear Tarea"**: Este botón te llevará a la página donde podrás ver las tareas existentes o crear una nueva.

**Formato para Crear Tareas**

Sigue el siguiente formato para crear una tarea:

2. **Prompt para Nueva Rutina**: Se presenta un `prompt` al usuario para ingresar la nueva rutina. El formato de entrada es:
      ```
      Prioridad,Estado,Descripción,Día
      ```

      - **Prioridad**: Un número del 1 al 3.
      - **Estado**: `p` (🔴), `e` (🟡), `f` (🟢).
      - **Descripción**: La descripción de la tarea.
      - **Día**: `l` (Lunes), `m` (Martes), `mi` (Miércoles), `j` (Jueves), `v` (Viernes), `s` (Sábado), `d` (Domingo), `x` (Sin asignar).

**Ejemplos**:

1. **Ejemplo 1**: 1,p,Lavar los platos,mi
   - Prioridad: 1
   - Estado: Pendiente (🔴)
   - Descripción: Lavar los platos
   - Día: Miércoles
   
2. **Ejemplo 2**: 1,p,26/05/2024, Ir a comprar en el supermercado,x
   - Prioridad: 1
   - Estado: Pendiente (🔴)
   - Descripción: 26/05/2024, Ir a comprar en el supermercado
   - Día: Sin asignar

**Nota**: Solo se mostrarán las tareas con Prioridad 1. Realiza los ejemplos para entender mejor esta funcionalidad.


Por supuesto, aquí tienes la explicación detallada para editar tarea y ver/escribir nota, siguiendo un formato similar al anterior:

---

¡Claro! Aquí tienes el texto en formato Markdown explicando el uso de la funcionalidad `verOCrearRutina`:

---

## 🔃Ver/crear rutina

## Descripción
La funcionalidad `verOCrearRutina` permite a los usuarios crear, visualizar y actualizar una lista de tareas rutinarias. Las tareas se ingresan en un formato específico y se guardan en el `localStorage` para su uso posterior. Además, se añade una capa de confirmación mediante la resolución de una suma para garantizar que las tareas se creen correctamente.

## Uso

### Visualización y Edición de la Rutina
1. **Cargar Rutina Existente**: Al invocar la función, se carga la rutina existente desde el `localStorage` (si existe).
2. **Formato Visual**: La rutina se muestra en un formato legible, convirtiendo los códigos abreviados en descripciones completas. Por ejemplo:
      ```
      Prioridad 1,🔴,Lavar los platos,Lunes
      Prioridad 1,🔴,Lavar los platos,Martes
      ```
3. **Prompt para Nueva Rutina**: Se presenta un `prompt` al usuario para ingresar la nueva rutina. El formato de entrada es:
      ```
      Prioridad,Estado,Descripción,Día;Prioridad,Estado,Descripción,Día;...
      ```
      - **Prioridad**: Un número del 1 al 3.
      - **Estado**: `p` (🔴), `e` (🟡), `f` (🟢).
      - **Descripción**: La descripción de la tarea.
      - **Día**: `l` (Lunes), `m` (Martes), `mi` (Miércoles), `j` (Jueves), `v` (Viernes), `s` (Sábado), `d` (Domingo), `x` (Sin asignar).

### Validación y Guardado
1. **Verificación de Entrada**: Si la entrada está vacía, se muestra una alerta de creación inválida.
2. **Comparación y Guardado**: La rutina nueva se compara con la existente. Si hay cambios, se guarda la nueva rutina en el `localStorage` y se muestra una alerta de confirmación.

### Creación de Tareas desde la Rutina
1. **Procesamiento de Rutina**: Las tareas de la rutina se procesan y validan:
      - Verificación de formato.
      - Conversión de estado y día a descripciones completas.
2. **Confirmación de Creación**: Antes de crear las tareas, se muestra una alerta de confirmación.
3. **Verificación Adicional**: Se presenta una suma de tres números aleatorios. El usuario debe resolver la suma correctamente para confirmar la creación de tareas.
4. **Guardado de Tareas**: Si la suma es correcta, las tareas se guardan en el `localStorage` y se muestra una alerta de éxito.

## Ejemplo de Uso

```javascript
// Invocar la función para ver o crear una rutina
verOCrearRutina();
```

### Entrada en el Prompt

```
🔃Rutina actual:
Prioridad 1,🔴,Lavar los platos,Lunes
Prioridad 1,🔴,Lavar los platos,Martes

*Ingresa la nueva rutina con el formato: 'Prioridad,Estado,Descripción,Día;Prioridad,Estado,Descripción,Día;...'
```

### Confirmación de Creación de Tareas

```
⚠️¿Estás seguro de que deseas crear las tareas a partir de la rutina?
```

### Verificación de Suma

```
Para confirmar, resuelve la siguiente suma: 34 + 58 + 12
```

Si la suma es correcta, las tareas se crearán y se guardarán exitosamente.

---

Este documento proporciona una guía completa para utilizar la funcionalidad `verOCrearRutina`, asegurando que los usuarios puedan gestionar sus rutinas de manera efectiva y con la validación necesaria.

---

## ✏️Editar tareas

Para editar una tarea, sigue estos simples pasos:

1. **Presiona el botón "Editar tarea"**: Este botón te permitirá acceder a la función de edición de tareas. Sigue las indicaciones en la alerta para realizar los cambios necesarios. No se requiere una explicación adicional para esta funcionalidad.

---

## 📋Ver/escribir nota

Para ver o escribir una nota, sigue estos pasos:

1. **Presiona el botón "Ver/Escribir Nota"**: Este botón te llevará a la página donde podrás ver o escribir notas.

**Formato para Crear Notas**

Sigue el siguiente formato para crear una nota:

- **Nota 1;Nota 2;Nota 3**

   - **; (Espacio hacia abajo)**: Indica un salto de línea entre las notas.

**Ejemplos**:

1. **Ejemplo 1**: *Cocinar;*Barrer;*Limpiar
   - Nota 1: Cocinar
   - Nota 2: Barrer
   - Nota 3: Limpiar

2. **Ejemplo 2**: 📌Recordatorios;-Beber agua;-Limpiar el polvo;;📜Diario;-Mayo 26, Sigo programando una aplicación de productividad;-Mayo 27, Realicé de forma efectiva mi trabajo gracias a esta app.
   - Nota 1: 📌Recordatorios
      - Subnota 1: Beber agua
      - Subnota 2: Limpiar el polvo
   - Nota 2: 📜Diario
      - Subnota 1: Mayo 26, Sigo programando una aplicación de productividad
      - Subnota 2: Mayo 27, Realicé de forma efectiva mi trabajo gracias a esta app.

**Nota**: Realiza los ejemplos para entender mejor esta funcionalidad.

---

x Aquí tienes la explicación detallada para la funcionalidad de actualizar, adaptada a tu solicitud:

---

## 🪄Actualizar tareas

Para mantener tu lista de tareas organizada y actualizada, sigue estos pasos:

1. **Presiona el botón "Actualizar"**: Este botón te permitirá actualizar tu lista de tareas.

**¿Qué hace la función de Actualizar?**

- **Limpiar tareas completadas**: La función de actualizar eliminará las tareas completadas o finalizadas de prioridad 1 de tu lista de tareas.
   
- **Incrementar prioridad de tareas**: Además, aumentará la prioridad de las tareas de prioridad 2 y 3. Las tareas de prioridad 2 pasarán a ser de prioridad 1, y las de prioridad 3 pasarán a ser de prioridad 2.

**Confirmación de actualización**

Al finalizar el proceso de actualización, se te solicitará ingresar una suma de 3 dígitos. Esto es para confirmar la actualización y evitar actualizaciones accidentales.

**Nota importante**

- Se recomienda que la mayoría o todas las tareas de prioridad 1 estén completadas antes de realizar la actualización.
   
- Esta acción también limpiará el **registro**, lo que implica **eliminar las tareas completadas, así como las orbes y el nivel asociados**.

---

Aquí tienes la explicación detallada para la funcionalidad de registro, siguiendo el formato que solicitaste:

---

## ✅Registro

Para acceder al registro de tus tareas completadas y seguir tu progreso, sigue estos pasos:

1. **Presiona el texto "✅Todo.html"**: Esto te llevará al registro donde podrás visualizar todas tus tareas completadas y tu nivel actual.

**¿Qué encontrarás en el Registro?**

- **Tareas completadas**: Verás una lista de todas las tareas que has completado hasta el momento. Cada tarea completada se mostrará como "🟢Orbes verdes".

- **Nivel actual**: También podrás ver tu nivel actual. A medida que completes más tareas, aumentarán las orbes y te permitirán subir de nivel.

- **Mensaje de progreso**: Encontrarás un mensaje que te indica cuántas tareas necesitas completar para subir a un nuevo nivel.

**Confirmación de limpieza del registro**

Al finalizar la visualización del registro, se te solicitará ingresar una suma de 4 dígitos. Esto es para confirmar la limpieza del registro y evitar acciones accidentales.

**Nota importante**

- Al limpiar el registro, se eliminarán tanto las tareas completadas como las orbes asociadas. Esto significa que tu nivel también se reiniciará.

---

x Entendido, aquí tienes la explicación para la generación de números aleatorios:

---

## 🎲Generar n° aleatorio

Para generar un número aleatorio, sigue estos sencillos pasos:

1. **Presiona el botón "Generar n° aleatorio"**: Este botón te permitirá generar un número aleatorio. Sigue las instrucciones que aparecerán en la alerta para obtener el número deseado. No se requiere de una explicación adicional para esta funcionalidad.

---

## 📊Calcular Porcentaje

Para calcular un porcentaje, sigue estos sencillos pasos:

1. **Presiona el botón "Calcular porcentaje"**: Este botón te permitirá realizar cálculos de porcentaje. Sigue las instrucciones que aparecerán en la alerta para calcular el porcentaje deseado. No se requiere de una explicación adicional para esta funcionalidad.

---

## ✒️TextTo.html

1. **Presiona el botón "TextTo.html"**: Este botón te llevará a nuestra página principal, donde podrás comenzar a convertir tus textos en formato HTML.

2. **Convierte tu texto a HTML**: Una vez en la página principal, tendrás la opción de ingresar tu propio texto o pegar texto desde el portapapeles. Después de hacerlo, simplemente haz clic en el botón "OK". Esto convertirá tu texto en formato HTML.

3. **Realiza operaciones con tu texto**: Una vez que tu texto esté en formato HTML, podrás realizar diversas operaciones con él dentro de tu navegador web. Por ejemplo, si estás utilizando Microsoft Edge, podrás traducir el texto a otros idiomas o incluso hacer que el navegador lo lea en voz alta.

4. **Explora las funcionalidades**: Las posibilidades son amplias y dependen del navegador y las extensiones que estés utilizando. Experimenta con las diferentes opciones disponibles para descubrir cómo puedes interactuar con tu texto de forma más dinámica y útil.

5. **Exporta tu texto**: Si necesitas guardar el texto actual en tu dispositivo, simplemente haz clic en el botón "Exportar".

6. **Regresa a la página principal**: Puedes regresar a la página principal en cualquier momento haciendo clic en "Regresar a ✅Todo.html".

---

## 📥Importar datos

Para importar tus datos en formato JSON para la aplicación, sigue estos pasos:

1. **Presiona el botón "Importar datos"**: Este botón te permitirá seleccionar y cargar tus datos en formato JSON en la aplicación. De esta manera, podrás importar tus datos previamente guardados.

## 💾Exportar datos

Para exportar tus datos en formato JSON desde la aplicación, sigue estos pasos:

1. **Presiona el botón "Exportar datos"**: Este botón te permitirá generar un archivo en formato JSON que contiene tus datos de la aplicación. El nombre del archivo exportado incluirá la fecha y hora de la exportación para facilitar el proceso de importación posterior.

## 🔃Formatear datos

Para borrar todos los datos de la aplicación, sigue estos pasos:

1. **Presiona el botón "Formatear datos"**: Este botón te permitirá eliminar todos los datos almacenados en la aplicación, restableciéndola a su estado inicial.

---
Por supuesto, aquí tienes un texto para indicar la finalización de la guía y dar algunas recomendaciones adicionales:

---

## 🎉¡Has Completado la Guía!

¡Felicidades! Has llegado al final de esta guía. Esperamos que hayas encontrado útiles las instrucciones proporcionadas y que te sientas más cómodo utilizando nuestra aplicación.

**Recomendaciones Finales:**

**Explora y Experimenta**: Tómate el tiempo para explorar todas las funciones de la aplicación y experimentar con ellas. La mejor manera de aprender es haciendo.

**Mantén tus Datos Seguros**: No olvides exportar tus datos de forma regular, la exportación de datos es util para tener una experiencia en multiples dispositivos, importa tus datos solo cuando sientas que sea necesario.