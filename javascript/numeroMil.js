const agregarCaracter = (cadena, caracter, pasos) => {
    let cadenaConCaracteres = "";
    const longitudCadena = cadena.length;
    cadena=invertir(cadena);

    for (let i = 0; i < longitudCadena; i += pasos) {
        if (i + pasos < longitudCadena) {
            cadenaConCaracteres += cadena.substring(i, i + pasos) + caracter;
        } else {
            cadenaConCaracteres += cadena.substring(i, longitudCadena);
        }
    }
    return invertir(cadenaConCaracteres)
}
const invertir=(cadena)=>{
    cadenaAux=cadena;
    cadena="";
    for (let i=cadenaAux.length-1;i>=0;i--){
        cadena+=cadenaAux.charAt(i)
        
    }
    return cadena;
}
const ingresar=(num)=>{
    num=parseInt(num,10);
    num=num.toString();
    return agregarCaracter(num,",",3);
}
ingresar(1000000000000000);
