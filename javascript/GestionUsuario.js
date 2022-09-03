const firebaseConfig = {
  apiKey: "AIzaSyAlNQgjIv1VbX96GvM1oMg5v2QKhcIB4vw",
  authDomain: "sincro-48d07.firebaseapp.com",
  projectId: "sincro-48d07",
  storageBucket: "sincro-48d07.appspot.com",
  messagingSenderId: "769349018960",
  appId: "1:769349018960:web:cdb36290e54c4adfe73855",
  measurementId: "G-3Z9ZETYRVN"
};
firebase.initializeApp(firebaseConfig);
firebase.analytics();
const db = firebase.firestore();


function ingreso() {
  var email = document.getElementById('correo2').value;
  var password = document.getElementById('contraseña2').value;
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((user) => {
      window.location.href = "main.html";
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      if (errorCode == "auth/wrong-password") {
        aviso = document.getElementById("sugerencias");
        aviso.innerHTML = `<div>
        <p id="sugerencia">la contraseña es incorrecta</p>
        </div>`;
      } if (errorCode == "auth/invalid-email") {
        aviso = document.getElementById("sugerencias");
        aviso.innerHTML = `<div>
        <p id="sugerencia">el correo es incorrecto</p>
        </div>`;
      } if (errorCode == "auth/user-not-found") {
        aviso = document.getElementById("sugerencias");
        aviso.innerHTML = `<div>
        <p id="sugerencia">usted no tiene una cuenta</p>
        </div>`;
      }

    });
}
var uid;

function registrar() {

  aviso = document.getElementById("sugerencias");
  aviso.innerHTML = `<div>
          <p id="segerencia">Registrando...</p>
          </div>`;
  var correoAdmin = document.getElementById("correoAdmin").value;
  var contraAdmin = document.getElementById("contraseñaAdmin").value;

  firebase.auth().signInWithEmailAndPassword(correoAdmin, contraAdmin)
    .then((user) => {
      var entrada = false;
      var idPrincipal;

      idPrincipal = user.user.uid;

      db.collection("usuarios").where("uid", "==", idPrincipal)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            datos = doc.data();
            db.collection("tiposUsuario").where("usuario", "==", datos.tipoDeUsuario)
              .get()
              .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                  datos2 = doc.data();
                  permisos = datos2.permisos;
                  if (permisos[1]) {
                    var email = document.getElementById('correo').value;
                    var contraseña = document.getElementById('contraseña').value;
                    var confirmarContraseña = document.getElementById('confirmarContra').value;
                    if (contraseña != confirmarContraseña) {
                      aviso = document.getElementById("sugerencias");
                      aviso.innerHTML = `<div>
          <p id="segerencia">las contraseñas no coinciden</p>
          </div>`;
                    } else {
                      firebase.auth().createUserWithEmailAndPassword(email, contraseña)
                        .then((user) => {
                          uid = user.user.uid
                          aviso = document.getElementById("sugerencias");
                          aviso.innerHTML = `<div>
          <p id="aviso">registrado exitosamente</p>
          </div>`;

                          firebase.auth().signInWithEmailAndPassword(correoAdmin, contraAdmin)
                            .then((user) => {

                              LlenarDatos(email);
                            })

                        })
                        .catch((error) => {
                          var errorCode = error.code;
                          var errorMessage = error.message;

                          if (errorCode == "auth/email-already-in-use") {
                            aviso = document.getElementById("sugerencias");
                            aviso.innerHTML = `<div>
              <p id="sugerencia">el correo ya está en uso</p>
              </div>`;
                          }
                          if (errorCode == "auth/weak-password") {
                            aviso = document.getElementById("sugerencias");
                            aviso.innerHTML = `<div>
              <p id="sugerencia">la contraseña es demasiado débil</p>
              </div>`;
                          } if (errorCode == "auth/invalid-email") {
                            aviso = document.getElementById("sugerencias");
                            aviso.innerHTML = `<div>
              <p id="sugerencia">el correo no es válido</p>
              </div>`;
                          }
                        });
                    }


                  } else {
                    aviso = document.getElementById("sugerencias");
                    aviso.innerHTML = `<div>
              <p id="sugerencia">este usuario no tiene permitido hacer este tipo de operaciones</p>
              </div>`;
                  }
                })
              })


          });
        })
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;

      if (errorCode == "auth/wrong-password") {
        aviso = document.getElementById("sugerencias");
        aviso.innerHTML = `<div>
        <p id="sugerencia">la contraseña es incorrecta</p>
        </div>`;
      } if (errorCode == "auth/invalid-email") {
        aviso = document.getElementById("sugerencias");
        aviso.innerHTML = `<div>
        <p id="sugerencia">correo del gerente inválido</p>
        </div>`;
      } if (errorCode == "auth/user-not-found") {
        aviso = document.getElementById("sugerencias");
        aviso.innerHTML = `<div>
        <p id="sugerencia">correo del gerente inválido</p>
        </div>`;
      }

    });







}
function cerrarS() {

  firebase.auth().signOut()
    .then(function () {

      window.location.href = "index.html";
    })
    .catch(function (error) {

    })
}
function LlenarDatos(email) {

  event.preventDefault();
  var LlenarDatos = document.getElementById("registroPermiso");
  LlenarDatos.innerHTML = `
  <div class="cabecera">
      <h1>Llenar datos </h1>
  </div>
  <form class="login-form">
      <input class="input" id="Nombre" type="text" placeholder="Nombre" />
      <input class="input" id="Apellido" type="text" placeholder="Apellido"/>
      <input class="input" id="cuota" type="number" placeholder="cuota"/>
      <select id="tipoDeUsuario" class="form-control">
          <option value="">Elegir tipo de usuario</option>
      </select>
      <div id="sugerencias" class="form-gruop">
      </div>
      <br>
      <input onclick="GuardarDatos()" type="button" class="boton" value="Guardar">


  </form>`
  var tipoDeUsuario = document.getElementById("tipoDeUsuario");
  db.collection("tiposUsuario")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        var datos = doc.data();
        var option = document.createElement("option");
        option.value = doc.id;
        option.text = doc.id;
        tipoDeUsuario.appendChild(option);
      })
    })
  db.collection("usuarios").doc(uid).set({
    email,

    uid
  })



}
function GuardarDatos() {
  var nombre = document.getElementById("Nombre").value;
  var apellido = document.getElementById("Apellido").value;
  var tipoDeUsuario = document.getElementById("tipoDeUsuario").value;
  var cuota = document.getElementById("cuota").value;
  cuota = parseInt(cuota, 10);
  if (nombre != "" && apellido != "" && tipoDeUsuario != "" && (uid != "" || uid != undefined)) {

    db.collection("usuarios").where("uid", "==", uid)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          datos = doc.data();
          email = datos.email;

          db.collection("usuarios").doc(uid).set({
            nombre,
            apellido,
            tipoDeUsuario,
            uid,
            email,
            cuota
          })
        })
      });

    Swal.fire('Guardado!', '', 'success');
    var LlenarDatos = document.getElementById("registroPermiso");
    LlenarDatos.innerHTML = `<div class="cabecera">
  <h1>Registrar</h1>
</div>
<form class="login-form">
  <input class="input" id="correo" type="text" placeholder="correo electrónico" />
  <input class="input" id="contraseña" type="password" placeholder="contraseña" />
  <input class="input" id="confirmarContra" type="password" placeholder="confirmar contraseña" />
  <h1>Datos del gerente</h1>
  <input class="input" id="correoAdmin" type="text" placeholder="correo electrónico del gerente" />
  <input class="input" id="contraseñaAdmin" type="password" placeholder="contraseña del gerente" />
  <div id="sugerencias" class="form-gruop">

  </div>
  <input onclick="registrar()" href="#datosPersonales" type="button" class="boton" value="registrar">
  <div id="formularioRegistro">

  </div>

</form>`;
  } else {
    var aviso = document.getElementById("sugerencias");
    aviso.innerHTML = `<br><p>debes llenar todos los campos</p>`;
  }
}



function buscarTU() {

  var feeder1 = document.getElementById("nombre");
  var permisos = document.getElementById("permisos");
  var select = document.getElementById("selectT1");
  var encontrado = false;
  var permisos1 = []
  var ListaPermisos = ["Gestión de proveedores",
    "Gestión de usuarios",
    "Registrar nuevos usuarios",
    "Gestión de productos",
    "Gestionar las ventas",
    "Hacer ventas",
    "Registro de clientes globales",
    "Realizar devoluciones",
    "Gestión contable",
    "Ver el inventario global",
    "Registrar clientes propios",
    "Calcular nómina",
    "Registrar factura de compra"
  ];

  db.collection("tiposUsuario")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        if (!encontrado) {
          encontrado = true;
          feeder1.innerHTML = "";
        }

        var datos = doc.data();
        feeder1.innerHTML += `
        <table class="table table-striped table-bordered" id="${doc.id}">
        <tr><th><h4>${datos.usuario}</h4></th><td><button id="${doc.id}" onclick="eliminarTipoDeUsuario(this)" class="btn btn-danger">Eliminar</button></td></tr>
        <tr><th>Tarea</th><th>Permiso</th></tr>
        </table>`;

        var cont = 0;
        var tabla = document.getElementById(doc.id);
        var imgs = [];
        for (let i = 0; i < datos.permisos.length; i++) {
          if (datos.permisos[i]) {
            imgs[i] = "img/checked.png";
          } else {
            imgs[i] = "img/remove.png";
          }
        }
        for (let i = 0; i < datos.permisos.length; i++) {
          cont += 1;
          tabla.innerHTML += `<tr>
                                <td>
                                ${ListaPermisos[i]}
                                </td>
                                <td>
                                <img width="30" src="${imgs[i]}">
                              </tr>`;
        }
        feeder1.innerHTML += `<br><br>`;
      })
    })
  if (!encontrado) {
    feeder1.innerHTML = `<h4>No se encontró ningún tipo de usuario</h4>`;
  }

}
observador();
function observador() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {

    } else {
      try {
        var main = document.getElementById("wrapper");
        main.innerHTML = `<h1>Usted no ha iniciado sesión</h1>
        <br>
        <a href="index.html"><button class="btn btn-danger">Iniciar sesión</button></a>`
          ;
      } catch (E) {

      }

    }
  })
}
function guardarTipoDeUsuario() {
  Swal.fire({
    title: '¿Quiere guardar o actualizar el usuario? \nSi el usuario ya existe se actualizarán los permisos.',
    showDenyButton: true,
    showCancelButton: true,
    confirmButtonText: `Guardar`,
    denyButtonText: `No guardar`,
  }).then((result) => {

    if (result.isConfirmed) {
      var permisos = [];
      permisos[0] = document.getElementById("permiso1").checked;
      permisos[1] = document.getElementById("permiso2").checked;
      permisos[2] = document.getElementById("permiso3").checked;
      permisos[3] = document.getElementById("permiso4").checked;
      permisos[4] = document.getElementById("permiso5").checked;
      permisos[5] = document.getElementById("permiso6").checked;
      permisos[6] = document.getElementById("permiso7").checked;
      permisos[7] = document.getElementById("permiso8").checked;
      permisos[8] = document.getElementById("permiso9").checked;
      permisos[9] = document.getElementById("permiso10").checked;
      permisos[10] = document.getElementById("permiso11").checked;
      permisos[11] = document.getElementById("permiso12").checked;
      permisos[12] = document.getElementById("permiso13").checked;


      var usuario = document.getElementById("NombreUsuario").value;
      var sugerencia = document.getElementById("sugerencia");
      var aviso = document.getElementById("aviso");

      if (usuario != "") {


        db.collection("tiposUsuario").doc(usuario).set({
          permisos,
          usuario

        })
        Swal.fire('Guardado!', '', 'success');
        var tabTwo = document.getElementById("tabTwo");
        tabTwo.innerHTML = `<input class="form-control" type="text" id="NombreUsuario" placeholder="ingrese el tipo de usuario*">
        <br>
        <input  type="checkbox" id="permiso1">
        <label  for="permiso1">Gestión de proveedores</label>
        <br>
        <input  type="checkbox" id="permiso2">
        <label  for="permiso2">Gestión de usuarios</label>
        <br>
        <input  type="checkbox" id="permiso3">
        <label  for="permiso3">Registrar nuevos usuarios</label>
        <br>
        <input  type="checkbox" id="permiso4">
        <label  for="permiso4">Gestión de productos</label>
        <br>
        <input  type="checkbox" id="permiso5">
        <label  for="permiso5">Gestionar las ventas</label>
        <br>
        <input  type="checkbox" id="permiso6">
        <label  for="permiso6">Hacer ventas</label>
        <br>
        <input  type="checkbox" id="permiso7">
        <label  for="permiso7">Registro de clientes globales</label>
        <br>
        <input  type="checkbox" id="permiso8">
        <label  for="permiso8">Realizar devoluciones</label>
        <br>
        <input  type="checkbox" id="permiso9">
        <label  for="permiso9">Gestión contable</label>
        <br>
        <input  type="checkbox" id="permiso10">
        <label  for="permiso10">Ver el inventario global</label>
        <br>
        <input  type="checkbox" id="permiso11">
        <label  for="permiso11">Registrar clientes propios</label>
        <br>
        <input  type="checkbox" id="permiso12">
        <label  for="permiso12">Calcular nómina</label>
        <br>
        <input  type="checkbox" id="permiso13">
        <label  for="permiso13">Registrar factura de compra</label>
        <br>
        
        <button class="btn btn-success" onclick="guardarTipoDeUsuario()">Guardar</button>
        <br><br>
        <div id="sugerencia">
       </div>
       <div id="aviso">
       </div>`;

        buscarTU();



      } else {

        sugerencia.innerHTML = "Debe elegir un nombre para el tipo del usuario.";
      }
    } else if (result.isDenied) {
      Swal.fire('No se guardó la información.', '', 'info')
      var tabTwo = document.getElementById("tabTwo");
      tabTwo.innerHTML = `<input class="form-control" type="text" id="NombreUsuario" placeholder="ingrese el tipo de usuario*">
       <br>
       <input  type="checkbox" id="permiso1">
       <label  for="permiso1">especificar tipos de usuarios</label>
       <br>
       <input  type="checkbox" id="permiso2">
       <label  for="permiso2">registro de nuevos usuarios</label>
       <br>
       <input  type="checkbox" id="permiso3">
       <label  for="permiso3">Montaje de pedidos</label>
       <br>
       <input  type="checkbox" id="permiso4">
       <label  for="permiso4">Registro de pagos</label>
       <br>
       <input  type="checkbox" id="permiso5">
       <label  for="permiso5">generación de facturas</label>
       <br>
       <input  type="checkbox" id="permiso6">
       <label  for="permiso6">ingreso de productos</label>
       <br>
       <input  type="checkbox" id="permiso7">
       <label  for="permiso7">Gestión de bodega e inventarios</label>
       <br>
       <input  type="checkbox" id="permiso8">
       <label  for="permiso8">Ingresar compras</label>
       <br>
       <input  type="checkbox" id="permiso9">
       <label  for="permiso9">vender</label>
       <br>
       <input  type="checkbox" id="permiso10">
       <label  for="permiso10">Registro de clientes</label>
       <br>
       <input  type="checkbox" id="permiso11">
       <label  for="permiso11">Administración de clientes</label>
       <br>
      
       <button class="btn btn-success" onclick="guardarTipoDeUsuario()">Guardar</button>
       <br><br>
       <div id="sugerencia">
      </div>
      <div id="aviso">
      </div>`;
    }
  })



}
function eliminarTipoDeUsuario(Tusuario) {
  Swal.fire({
    title: '¡Estás seguro?',
    text: "No podrás revertir esto!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, borrar!'
  }).then((result) => {
    if (result.isConfirmed) {
      var idTS = Tusuario.id;

      db.collection("tiposUsuario").doc(idTS).delete();

      Swal.fire(
        'Borrado!',
        'el tipo de usuario ha sido borrado.',
        'success'
      )
    }
  })

}
function listaDeUsuarios() {
  ventaGarray=[];
  var feed = document.getElementById("main");
  var login = document.getElementById("login-page");
  login.innerHTML = "";
  feed.innerHTML = ``;
  feed.innerHTML = `<br><h3>Lista de usuarios:</h3><br><div class="delimitado"><table id="tabla2" class="table table-striped table-bordered">
    <thead>
      <tr>
        <th>Nombre</th>
        <th>Apellido</th>
        <th>Tipo de usuario</th>
        <th>Correo electrónico</th>
        <th colspan=3>Acciones</th>
      </tr>
    </thead>
  </table></div>`;
  var tabla2 = document.getElementById("tabla2");
  db.collection("usuarios")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        datos = doc.data();
        if (datos.nombre == undefined) {
          nombreP = "no tiene nombre";
        } else {
          nombreP = datos.nombre;
        }
        if (datos.apellido == undefined) {
          apellidoP = "no tiene apellido";
        } else {
          apellidoP = datos.apellido;
        }
        if (datos.tipoDeUsuario == undefined) {
          tipoDeUsuarioP = "no tiene tipo de usuario";
        } else {
          tipoDeUsuarioP = datos.tipoDeUsuario;
        }
        tabla2.innerHTML +=
          `<tr>
            <td>${nombreP}</td>
            <td>${apellidoP}</td>
            <td>${tipoDeUsuarioP}</td>
            <td>${datos.email}</td>
            <th><a class="cursor" id="${doc.id}" onclick="recuperarContraseña(this)"><img src="img/contraseña.png" width=30></a></th>
            <th><a class="cursor" id="${doc.id}" onclick="Editar(this)"><img src="img/editar.png" width=30></a></th>
            <th><a class="cursor" id="${doc.id}" onclick="EliminarUsuario(this)"><img src="img/delete.png" width=30></a></th>
            
          </tr>`;
      })
    });
}
function EliminarUsuario(element) {
  var userUid = element.id;
  db.collection("usuarios").doc(userUid).delete();
  
  listaDeUsuarios();
}
function Editar(element) {
  var feed = document.getElementById("main");


  db.collection("usuarios").where("uid", "==", element.id)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        datos = doc.data();
        feed.innerHTML = `<br><h3>Datos del usuario: ${datos.email}</h3>`;
        if (datos.nombre == undefined) {
          nombreP = "";
        } else {
          nombreP = datos.nombre;
        }
        if (datos.apellido == undefined) {
          apellidoP = "";
        } else {
          apellidoP = datos.apellido;
        }
        if (datos.tipoDeUsuario == undefined) {
          tipoDeUsuarioP = "";
        } else {
          tipoDeUsuarioP = datos.tipoDeUsuario;
        }
        if (datos.cuota == undefined) {
          cuota = 0;
        } else {
          cuota = datos.cuota;
        }
        feed.innerHTML += `<div class="col-md-8"><form class="form-gruop">
        <br>
        <input class="form-control " type="text" id="nombreP" placeholder="Nombre" value="${nombreP}">
        <br>
        <input class="form-control " type="text" id="apellidoP" placeholder="apellido" value="${apellidoP}">
        <br>
        <input class="form-control " type="number" id="cuota0" placeholder="cuota" value="${cuota}">
        <br>
        <select class="form-control" id="tipoDeUsuario">
          <option value="">seleccione el tipo de usuario</option>
        </select>
        <br>
        <button class="btn btn-success" id=${doc.id} onclick="GuardarCambios(this)">Guardar</button>
        </form></div>
        `;
        var tipoDeUsuario = document.getElementById("tipoDeUsuario");

        db.collection("tiposUsuario")
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              var option = document.createElement("option");
              option.value = doc.id;
              option.text = doc.id;
              tipoDeUsuario.appendChild(option);
              tipoDeUsuario.value = tipoDeUsuarioP;
            })
          })

      })
    })

}
function GuardarCambios(element) {
  event.preventDefault();
  Swal.fire({
    title: '¿Quiere guardar o actualizar el usuario?',
    showDenyButton: true,
    showCancelButton: true,
    confirmButtonText: `Guardar`,
    denyButtonText: `No guardar`,
  }).then((result) => {
    if (result.isConfirmed) {


      var idP = element.id;
      db.collection("usuarios").where("uid", "==", idP).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          datos = doc.data();
          apellido = document.getElementById("apellidoP").value;
          email = datos.email;
          nombre = document.getElementById("nombreP").value;
          tipoDeUsuario = document.getElementById("tipoDeUsuario").value;
          uid = datos.uid;
          cuota = document.getElementById("cuota0").value;
          cuota = parseInt(cuota, 10);

          if (apellido != "" && nombre != "" && tipoDeUsuario != "") {
            db.collection("usuarios").doc(uid).set({
              apellido,
              email,
              nombre,
              tipoDeUsuario,
              uid,
              cuota
            })
            Swal.fire('Guardado!', '', 'success');
            listaDeUsuarios();
          } else {
            Swal.fire({
              icon: 'error',
              title: 'datos en blanco',
              text: 'debes llenar todos los campos',

            })
          }

        })
      })
    }
  })




}

function recuperarContraseña(element) {
  var id = element.id;
  db.collection("usuarios").where("uid", "==", id).get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      datos = doc.data();
      correoUsuario = datos.email;
      firebase.auth().sendPasswordResetEmail(correoUsuario).then(function () {
        Swal.fire('correo enviado correctamente!', '', 'success');
      }).catch(function (error) {
        Swal.fire({
          icon: 'error',
          title: 'datos en blanco',
          text: 'ha ocurrido algún error.',

        })
      });
    })
  })

}
cargarFunciones();
function cargarFunciones() {
  try {
    var user = firebase.auth().currentUser;

    firebase.auth().onAuthStateChanged((user) => {

      db.collection("usuarios").where("uid", "==", user.uid).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          datos = doc.data();
          tipoDeUsuario = datos.tipoDeUsuario;
          db.collection("tiposUsuario").where("usuario", "==", tipoDeUsuario).get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              datos2 = doc.data();
              permisos = datos2.permisos;
              menuInicio(permisos);
            })
          });

        })
      })
    })
  } catch (error) {

  }




}/*
db.collection("productos").get()
  .then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      var datos = doc.data();
      var CODIGO = datos.CODIGO;
      var DESCRIPCION = datos.DESCRIPCION;
      var PRECIO_COMPRA = datos.PRECIO_COMPRA;
      var PRECIO_VENTA = datos.PRECIO_VENTA;
      var STOCK = datos.STOCK;
      var CATEGORIA = datos.CATEGORIA;
      var LIMITE_INFERIOR = datos.LIMITE_INFERIOR;
      var registradoPor = datos.registradoPor;
      var VOLUMEN_GANANCIA = datos.VOLUMEN_GANANCIA;
      var PORCENTAJE = datos.PORCENTAJE
      var urlProfile = datos.urlProfile;
      var reservado = 0;
      db.collection("productos").doc(doc.id).set({
        CODIGO,
        DESCRIPCION,
        PRECIO_COMPRA,
        PRECIO_VENTA,
        STOCK,
        CATEGORIA,
        LIMITE_INFERIOR,
        registradoPor,
        VOLUMEN_GANANCIA,
        PORCENTAJE,
        urlProfile,
        reservado
      })
    })
  })
  const productoVenta = (id) => db.collection("productos").doc(id).get();
db.collection("ventas").where("entregado", "==", false).get().then((querySnapshot) => {
  querySnapshot.forEach(async (doc) => {

    var datos = doc.data();
    var idProducto = datos.idProducto;
    var cantidades = datos.cantidades;
    for (let i = 0; i < idProducto.length; i++) {
      var producto = await productoVenta(idProducto[i]);
      var datos2 = producto.data();
      var CODIGO = datos2.CODIGO;
      var DESCRIPCION = datos2.DESCRIPCION;
      var PRECIO_COMPRA = datos2.PRECIO_COMPRA;
      var PRECIO_VENTA = datos2.PRECIO_VENTA;
      var STOCK = datos2.STOCK;
      var CATEGORIA = datos2.CATEGORIA;
      var LIMITE_INFERIOR = datos2.LIMITE_INFERIOR;
      var registradoPor = datos2.registradoPor;
      var VOLUMEN_GANANCIA = datos2.VOLUMEN_GANANCIA;
      var PORCENTAJE = datos2.PORCENTAJE
      var urlProfile = datos2.urlProfile;
      var reservado = datos2.reservado;
      reservado+=cantidades[i]
      db.collection("productos").doc(idProducto[i]).set({
        CODIGO,
        DESCRIPCION,
        PRECIO_COMPRA,
        PRECIO_VENTA,
        STOCK,
        CATEGORIA,
        LIMITE_INFERIOR,
        registradoPor,
        VOLUMEN_GANANCIA,
        PORCENTAJE,
        urlProfile,
        reservado
      })
    }
  })
})

db.collection("productos").where("reservado",">",0).get().then((querySnapshot)=>{
  querySnapshot.forEach((doc)=>{
   
    var datos2 = doc.data();
    console.log(datos2)
    
    
    
      var CODIGO = datos2.CODIGO;
      var DESCRIPCION = datos2.DESCRIPCION;
      var PRECIO_COMPRA = datos2.PRECIO_COMPRA;
      var PRECIO_VENTA = datos2.PRECIO_VENTA;
      var STOCK = datos2.STOCK;
      var CATEGORIA = datos2.CATEGORIA;
      var LIMITE_INFERIOR = datos2.LIMITE_INFERIOR;
      var registradoPor = datos2.registradoPor;
      var VOLUMEN_GANANCIA = datos2.VOLUMEN_GANANCIA;
      var PORCENTAJE = datos2.PORCENTAJE
      var urlProfile = datos2.urlProfile;
      var reservado = 0
      db.collection("productos").doc(doc.id).set({
        CODIGO,
        DESCRIPCION,
        PRECIO_COMPRA,
        PRECIO_VENTA,
        STOCK,
        CATEGORIA,
        LIMITE_INFERIOR,
        registradoPor,
        VOLUMEN_GANANCIA,
        PORCENTAJE,
        urlProfile,
        reservado
      })
  })
})

db.collection("productos").get().then((querySnapshot) => {
  querySnapshot.forEach(doc => {
      var datos = doc.data();
      console.log(datos)
      var CODIGO = datos.CODIGO;
      var DESCRIPCION = datos.DESCRIPCION;
      var STOCK = datos.STOCK;
      var LIMITE_INFERIOR = datos.LIMITE_INFERIOR;
      var PRECIO_VENTA = datos.PRECIO_VENTA;
      var VOLUMEN_GANANCIA = datos.VOLUMEN_GANANCIA;
      var PRECIO_COMPRA = datos.PRECIO_COMPRA;
      var registradoPor = datos.registradoPor;
      var PORCENTAJE = datos.PORCENTAJE;
      var CATEGORIA = datos.CATEGORIA;
      var urlProfile = datos.urlProfile;
      var reservado=datos.reservado;
      reservado=0;
      db.collection("productos").doc(doc.id).set({
              CODIGO,
              DESCRIPCION,
              PRECIO_COMPRA,
              PRECIO_VENTA,
              STOCK,
              CATEGORIA,
              LIMITE_INFERIOR,
              registradoPor,
              VOLUMEN_GANANCIA,
              PORCENTAJE,
              urlProfile,
              reservado
          })
  });
})*/
/*
db.collection("abonos").get().then((querySnapshot) => {
  querySnapshot.forEach((doc) => {
    var datos = doc.data();
    var fecha = datos.fecha;
    var NumeroFactura = datos.NumeroFactura;
    var cantidad_abono = datos.cantidad_abono;
    var rentabilidad = datos.rentabilidad;
    var recibo = "null";
    db.collection("abonos").doc(doc.id).set({
      rentabilidad,
      NumeroFactura,
      cantidad_abono,
      fecha,
      recibo
    })
  })
})
db.collection("productos").get().then(querySnapshot => {
  querySnapshot.forEach(async doc => {
    var datos2 = doc.data();
    var CODIGO = datos2.CODIGO;
    var DESCRIPCION = datos2.DESCRIPCION;
    var STOCK = datos2.STOCK;
    var LIMITE_INFERIOR = datos2.LIMITE_INFERIOR;
    var PRECIO_VENTA = datos2.PRECIO_VENTA;
    var VOLUMEN_GANANCIA = datos2.VOLUMEN_GANANCIA;
    var PRECIO_COMPRA = datos2.PRECIO_COMPRA;
    var registradoPor = datos2.registradoPor;
    var PORCENTAJE = datos2.PORCENTAJE;
    var CATEGORIA = datos2.CATEGORIA;
    var urlProfile = datos2.urlProfile;
    var reservado = 0;
    await db.collection("ventas").where("entregado", "==", false).where("idProducto", "array-contains", doc.id).get().then(querySnapshot => {
      querySnapshot.forEach(element => {
        var datos = element.data();
        if (!datos.entregado) {
          console.log(datos2);
          var indice;
          for (let i = 0; i < datos.idProducto.length; i++) {
            if(datos.idProducto[i]==doc.id){
              indice=i
              break
            }
          }
          reservado=reservado+datos.cantidades[indice]
        }

      });
    })
    await db.collection("productos").doc(doc.id).set({
      CODIGO,
      DESCRIPCION,
      PRECIO_COMPRA,
      PRECIO_VENTA,
      STOCK,
      CATEGORIA,
      LIMITE_INFERIOR,
      registradoPor,
      VOLUMEN_GANANCIA,
      PORCENTAJE,
      urlProfile,
      reservado
    })
  })
})


*/
/*
db.collection("productos").where("STOCK", "==", NaN).get().then(query => {
    query.forEach(doc => {
        var datos2 = doc.data();
        var CODIGO = datos2.CODIGO;
        var DESCRIPCION = datos2.DESCRIPCION;
        var STOCK = 0;
        var LIMITE_INFERIOR = datos2.LIMITE_INFERIOR;
        var PRECIO_VENTA = datos2.PRECIO_VENTA;
        var VOLUMEN_GANANCIA = datos2.VOLUMEN_GANANCIA;
        var PRECIO_COMPRA = datos2.PRECIO_COMPRA;
        var registradoPor = datos2.registradoPor;
        var PORCENTAJE = datos2.PORCENTAJE;
        var CATEGORIA = datos2.CATEGORIA;
        var urlProfile = datos2.urlProfile;
        var reservado=datos2.reservado;
        db.collection("productos").doc(doc.id).set({
            CODIGO,
            DESCRIPCION,
            PRECIO_COMPRA,
            PRECIO_VENTA,
            STOCK,
            CATEGORIA,
            LIMITE_INFERIOR,
            registradoPor,
            VOLUMEN_GANANCIA,
            PORCENTAJE,
            urlProfile,
            reservado
          })
        console.log(datos2);
    })
})*/

/*
db.collection("productos").get().then(querySnapshot => {
  querySnapshot.forEach(async doc => {
    var datos2 = doc.data();
    var CODIGO = datos2.CODIGO;
    var DESCRIPCION = datos2.DESCRIPCION;
    var STOCK = datos2.STOCK;
    var LIMITE_INFERIOR = datos2.LIMITE_INFERIOR;
    var PRECIO_VENTA = datos2.PRECIO_VENTA;
    var VOLUMEN_GANANCIA = datos2.VOLUMEN_GANANCIA;
    var PRECIO_COMPRA = datos2.PRECIO_COMPRA;
    var registradoPor = datos2.registradoPor;
    var PORCENTAJE = datos2.PORCENTAJE;
    var CATEGORIA = datos2.CATEGORIA;
    var urlProfile = datos2.urlProfile;
    var reservado = 0;
    if(STOCK<0){
      STOCK=0;
    }
    await db.collection("ventas").where("entregado", "==", false).where("idProducto", "array-contains", doc.id).get().then(querySnapshot => {
      querySnapshot.forEach(element => {
        var datos = element.data();
        if (!datos.entregado) {
          console.log(datos2);
          var indice;
          for (let i = 0; i < datos.idProducto.length; i++) {
            if(datos.idProducto[i]==doc.id){
              indice=i
              break
            }
          }
          reservado=reservado+datos.cantidades[indice]
        }

      });
    })
    await db.collection("productos").doc(doc.id).set({
      CODIGO,
      DESCRIPCION,
      PRECIO_COMPRA,
      PRECIO_VENTA,
      STOCK,
      CATEGORIA,
      LIMITE_INFERIOR,
      registradoPor,
      VOLUMEN_GANANCIA,
      PORCENTAJE,
      urlProfile,
      reservado
    })
  })
})*/
