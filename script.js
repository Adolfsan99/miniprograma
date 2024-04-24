

while (operacion=!0) { 
var operacion = prompt("Ingresa la operacion a realizar\n0: Para cerrar el programa\n1: Generar numero aleatorio\n2: Generar porcentaje");

if (operacion==1) {
    aleatorio();
} else if (operacion==2) {
    porcentaje();
} else if (operacion>2 || operacion<0) {
    alert("Operación invalida.");
} else if (operacion==0) {
    alert("Cerrando el programa.");
}

function aleatorio() {
    var numero_aleatorio_rango_inicial = prompt("Ingresa el rango inicial de tu numero aleatorio\nNormalmente suele ser 1");
    var numero_aleatorio_rango_final = prompt("Ingresa el rango final de tu numero aleatorio\nSi escogiste 1 en el rango inicial, puedes utilizar 100 en el rango final para generar un numero aleatorio entre 1 y 100");
    var numero_aleatorio = Math.floor(Math.random() * (numero_aleatorio_rango_final - numero_aleatorio_rango_inicial + 1)) + numero_aleatorio_rango_inicial;
    console.log("El número aleatorio es: ", numero_aleatorio);
    alert("El número aleatorio es: " + numero_aleatorio);
}

function porcentaje() {
    var numero_porcentaje_partes = prompt("Ingresa cuantas partes tienes");
    var numero_porcentaje_total = prompt("Ingresa el total");
    var porcentaje_operacion = numero_porcentaje_partes/numero_porcentaje_total*100;
    alert("El porcentaje de "+numero_porcentaje_partes+"/"+numero_porcentaje_total+" es: "+Math.floor(porcentaje_operacion)+"%");
}
}