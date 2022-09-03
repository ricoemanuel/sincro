function contabilidad() {
    ventaGarray = [];
    var _0x3ab4x2 = document['getElementById']('main');
    var _0x3ab4x3 = document['getElementById']('login-page');
    _0x3ab4x2['innerHTML'] = '';
    _0x3ab4x3['innerHTML'] = '';
    var _0x3ab4x4 = new Date();
    _0x3ab4x2['innerHTML'] = `${'<div class="wrap">\x0D\x0A    <center>\x0D\x0A    <ul class="tabs">\x0D\x0A        <li><a href="#tab1"><span class="fa fa-home"></span><span class="tab-text">Gastos</span></a></li>\x0D\x0A        <li><a href="#tab2"><span class="fa fa-group"></span><span class="tab-text">Deudas</span></a></li>\x0D\x0A        <li><a href="#tab3"><span class="fa fa-group"></span><span class="tab-text">Cartera vendedor</span></a></li>\x0D\x0A  <li><a href="#tab4"><span class="fa fa-home"></span><span class="tab-text">Cartera</span></a></li>\x0D\x0A  </ul>\x0D\x0A    </center>\x0D\x0A    <div class="secciones">\x0D\x0A        <article id="tab1">\x0D\x0A\x0D\x0A            <div id="tabOne">\x0D\x0A              \x0D\x0A            <form>\x0D\x0A                <div class="col-md-8">\x0D\x0A                    <div class="form-group">\x0D\x0A                        <input type="text" class="form-control" placeholder="Valor del gasto" id="valor">\x0D\x0A                    </div>\x0D\x0A                    <div class="form-group">\x0D\x0A                        <input type="text" class="form-control" placeholder="Descripci\xF3n del gasto" id="Descripcion">\x0D\x0A                    </div>\x0D\x0A                    <div class="form-group">\x0D\x0A                        <button class="btn btn-success" onclick="GuardarGasto()">Guardar Gasto</button>\x0D\x0A                    </div>\x0D\x0A                </div>\x0D\x0A            </form>\x0D\x0A            <div id="ListaGastos">\x0D\x0A\x0D\x0A            </div>\x0D\x0A            \x0D\x0A            \x0D\x0A            </div>\x0D\x0A        </article>\x0D\x0A        <article id="tab2">\x0D\x0A            <div id="tabTwo">\x0D\x0A            \x0D\x0A            </div>\x0D\x0A        </article>\x0D\x0A        <article id="tab3">\x0D\x0A            <div id="tabTree">\x0D\x0A            \x0D\x0A            </div>\x0D\x0A        </article>\x0D\x0A\x0D\x0A   <article class="delimitado" id="tab4">\x0D\x0A            <div id="tabFour">\x0D\x0A            \x0D\x0A            </div>\x0D\x0A        </article>\x0D\x0A\x0D\x0A     \x0D\x0A    </div>\x0D\x0A</div>'}`;
    cargarTabs();
    listarGastos();
    deudas();
    carteraGeneral();
    var hoy = new Date();
    carteraVendedor();

}
const getAbonos = () => db.collection("abonos").get();
const getCarteraVendedor = (id) => db.collection("ventas").where("vendedor", "==", id).get();
const getVendedores = () => db.collection("usuarios").where("cuota", ">", 0).get();
async function carteraVendedor() {
    var tabTree = document.getElementById("tabTree");
    var vendedores = await getVendedores();
    tabTree.innerHTML = `
    
    <table class="table table-striped table-bordered" id="vendedoresCartera">
        <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Cuota</th>
            <th>Cartera</th>
        </tr>
    </table>`
    var vendedoresCartera = document.getElementById("vendedoresCartera");
    vendedores.forEach(doc => {
        var datos = doc.data()
        vendedoresCartera.innerHTML += `
        <tr>
            <td>${datos.nombre}</td>
            <td>${datos.apellido}</td>
            <td>${datos.cuota}</td>
            <td><a class="cursor" id="${doc.id}" onclick="VisualizarCartera(this)"><img src="img/cartera.png" width=30></a></td>
        </tr>

        `
    })


}
let carteraVendedorA = [];
function carga() {
    var tabTree = document.getElementById("tabTree");
    tabTree.innerHTML = `<center><img width=50 src="img/carga.gif"></center>`
}
const VisualizarCartera = async (element) => {
    carga();
    carteraVendedorA = [];
    var id = element.id;
    var vendedor = await obtenerVendedor1(id)
    vendedor = vendedor.data();
    var tabTree = document.getElementById("tabTree");
    tabTree.innerHTML = `<img src="img/carga.gif">`
    tabTree.innerHTML = `<a class="cursor" onclick="carteraVendedor()"><img src="img/undo.png" width=30></a>
    <center>Cartera de: ${vendedor.nombre} ${vendedor.apellido}</center>
    `
    var carteraV = await getCarteraVendedor(id);
    tabTree.innerHTML += `<div class="delimitado">
    <center><a class="cursor" id="${id}" onclick="reporteCarteraVendedor(this)"><img src="img/impresora.png" width=30></a></center><br><br>
    <table  class="table table-striped table-bordered" id="cabeceraV">
            <tr>
                <th>Número de factura</th>
                <th>Cliente</th>
                <th>Estado de entrega</th>
                <th>Valor</th>
                <th>debe</th>
                <th>plazo</th>
                <th>fecha</th>
                <th>fecha de vencimiento</th>
                <th colspan=3>Acciones</th>
            </tr>
        </table></div>`;
    carteraV.forEach(async doc => {
        var datos = doc.data();
        if (datos.debe > 0) {
            carteraVendedorA.push(datos);
            var tablaPedidos = document.getElementById("cabeceraV");
            cliente = await obtenerCliente(datos.cliente);
            cliente = cliente.data();
            datos.cliente = cliente.RazonSocial;
            datos.vendedor = vendedor.nombre + vendedor.apellido
            let fila1 = document.createElement("tr");
            let NumeroFacturaTD = document.createElement("td");
            NumeroFacturaTD.innerHTML = `${datos.NumeroFactura}`
            let RazonSocialTD = document.createElement("td");
            RazonSocialTD.innerHTML = `${cliente.RazonSocial}`
            let entregadoTD = document.createElement("td");
            entregadoTD.innerHTML = `${datos.entregado}`
            let sumaTD = document.createElement("td");
            sumaTD.innerHTML = `${datos.suma}`
            let debeTD = document.createElement("td");
            debeTD.innerHTML = `${datos.debe}`
            let plazoTD = document.createElement("td");
            plazoTD.innerHTML = `${datos.plazo}`
            let fechaVTD = document.createElement("td");
            fechaVTD.innerHTML = `${datos.fecha[0]}/${datos.fecha[1]}/${datos.fecha[2]}`
            let fechaFTD = document.createElement("td");
            fechaFTD.innerHTML = `${datos.fechaVencimiento[0]}/${datos.fechaVencimiento[1]}/${datos.fechaVencimiento[2]}`
            let Cacciones = document.createElement("td");
            Cacciones.innerHTML = `<a class="cursor" id="${doc.id}" onclick="AbonarPedido(this)"><img src="img/abono.png" width=30></a><br>
            <a class="cursor" id="${doc.id}" onclick="facturaPdf(this)"><img src="img/factura.png" width=30></a><br>
            <a class="cursor" id="${doc.id}" onclick="contenidoPedido(this)"><img src="img/contenido.png" width=30></a>`
            fila1.appendChild(NumeroFacturaTD)
            fila1.appendChild(RazonSocialTD)
            fila1.appendChild(entregadoTD)
            fila1.appendChild(sumaTD)
            fila1.appendChild(debeTD)
            fila1.appendChild(plazoTD)
            fila1.appendChild(fechaVTD)
            fila1.appendChild(fechaFTD)
            fila1.appendChild(Cacciones)
            tablaPedidos.appendChild(fila1);
            let fila2 = document.createElement("tr");
            let contenido = document.createElement("td");
            contenido.colSpan = 9
            contenido.innerHTML = `<div id="contenido${doc.id}"></div>`
            fila2.appendChild(contenido);
            tablaPedidos.appendChild(fila2);
            /*
                        tablaPedidos.innerHTML += `
                        <tr>
                            <td>${datos.NumeroFactura}</td>
                            <td>${cliente.RazonSocial}</td>
                            <td>${datos.entregado}</td>
                            <td>${datos.pagado}</td>
                            <td>${ingresar(datos.suma)}</td>
                            <td>${ingresar(datos.debe)}</td>
                            <td>${datos.fecha[0]}/${datos.fecha[1]}/${datos.fecha[2]}</td>
                            <td>${datos.plazo} dias</td>
                            <td>${datos.fechaVencimiento[0]}/${datos.fechaVencimiento[1]}/${datos.fechaVencimiento[2]}</td>
                            <td><a class="cursor" id="${doc.id}" onclick="AbonarPedido(this)"><img src="img/abono.png" width=30></a><br>
                            <a class="cursor" id="${doc.id}" onclick="facturaPdf(this)"><img src="img/factura.png" width=30></a><br>
                            <a class="cursor" id="${doc.id}" onclick="contenidoPedido(this)"><img src="img/contenido.png" width=30></a></td>
                            
                        </tr>
                        <tr>
                            <td colspan=9>
                                 <div id="contenido${doc.id}"></div>
                            </td>
                        </tr>
                        
                            `*/
        }
    })
    

}
let carteraGeneralA = [];


const obtenerTodasVentasDebe = () => db.collection("ventas").where("debe", ">", 1).get()
async function carteraGeneral() {
    var tabFour = document.getElementById("tab4");
    tabFour.innerHTML = `<h3 id="titulo">No hay facturas pendientes.</h3>
    `
    tabFour.innerHTML += `
    <center><a class="cursor"  onclick="reporteCarteraGeneral()"><img src="img/impresora.png" width=30></a></center><br><br>
    <div class="overflow-auto"><table  class="table table-striped table-bordered" id="cabecera">
            <tr>
                <th>Número de factura</th>
                <th>Cliente</th>
                <th>Estado de entrega</th>
                <th>Estado de pago</th>
                <th>Valor</th>
                <th>debe</th>
                <th>fecha</th>
                <th>plazo</th>
                <th>fecha de vencimiento</th>
                <th colspan=3>Acciones</th>
            </tr>
        </table></div>`;
    CarteraCliente = document.getElementById("CarteraCliente");
    querySnapshot = await obtenerTodasVentasDebe();
    querySnapshot.forEach(async doc => {
        var datos = doc.data();


        try {
            var titulo = document.getElementById("titulo")
            titulo.innerHTML = "";

            var tablaPedidos = document.getElementById("cabecera");

            cliente = await obtenerCliente(datos.cliente);
            cliente = cliente.data();
            datos.cliente = cliente.RazonSocial;
            carteraGeneralA.push(datos);
            tablaPedidos.innerHTML += `
            <tr>
                <td>${datos.NumeroFactura}</td>
                <td>${cliente.RazonSocial}</td>
                <td>${datos.entregado}</td>
                <td>${datos.pagado}</td>
                <td>${ingresar(datos.suma)}</td>
                <td>${ingresar(datos.debe)}</td>
                <td>${datos.fecha[0]}/${datos.fecha[1]}/${datos.fecha[2]}</td>
                <td>${datos.plazo} dias</td>
                <td>${datos.fechaVencimiento[0]}/${datos.fechaVencimiento[1]}/${datos.fechaVencimiento[2]}</td>
                <td><a class="cursor" id="${doc.id}" onclick="AbonarPedido(this)"><img src="img/abono.png" width=30></a><br>
                <a class="cursor" id="${doc.id}" onclick="facturaPdf(this)"><img src="img/factura.png" width=30></a><br>
                <a class="cursor" id="${doc.id}" onclick="contenidoPedido(this)"><img src="img/contenido.png" width=30></a></td>
                
            </tr>
            <tr>
                <td colspan=9>
                     <div id="contenido${doc.id}"></div>
                </td>
            </tr>
            
                `
        } catch {
          
        }






    })
}
function deudas() {
    var tabTwo = document.getElementById("tabTwo");
    tabTwo.innerHTML = `
        <div class="form-group col-md-8">
            <input type="text" class="form-control" id="NombreD" placeholder="Descripción de la dedua"><br>
            <input type="number" class="form-control" id="ValorD" placeholder="Valor de la deuda"><br>
            <input type="text" class="form-control" id="entidadD" placeholder="Entidad"><br>
            <button class="btn btn-success" onclick="GuardarDeuda()">Guardar Deuda</button>  
        </div>
        <div id="listaDeudas">
           
        </div>
    `
    listarDeudas();
}
function listarDeudas() {
    var listaDeudas = document.getElementById("listaDeudas");
    listaDeudas.innerHTML = `
                <table class="table table-striped table-bordered" id="deudasTable">
                    <tr>
                        <th>Entidad</th>
                        <th>Descripción</th>
                        <th>Valor</th>
                        <th>pendiente</th>
                        <th>fecha</th>
                        <th>estado de pago</th>
                    </tr>
                </table>
                <div id="aviso"></div>
            
            `;
    var entrada = false;
    var deudasTable = document.getElementById("deudasTable");
    db.collection("deudas").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            var datos = doc.data();
            entrada = true;
            deudasTable.innerHTML += `
                <td>${datos.entidad}</td>
                <td>${datos.descripcion}</td>
                <td>${ingresar(datos.valor)}</td>
                <td>${ingresar(datos.pendiente)}</td>
                <td>${datos.fecha[0]}/${datos.fecha[1]}/${datos.fecha[2]}</td>
                <td>${datos.estado}</td>
                <td><a id="${doc.id}" onclick="abonarPago(this)" class="cursor"><img src="img/abono.png" width=30></a></td>
            `
        })
        if (!entrada) {
            var aviso = document.getElementById("aviso");
            aviso.innerHTML = `<center><h6>No hay deudas disponibles.</h6></ceneter>`
        }
    })
}
function abonarPago(element) {
    Swal.fire({
        title: 'Ingrese el valor pago',
        input: 'number',
        inputAttributes: {
            autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Ingresar',
        showLoaderOnConfirm: true,
        CancelButtonText: 'Cancelar'

    }).then((result) => {
        if (result.isConfirmed) {
            entrada = false;
            var codigo;
            db.collection("deudas").doc(element.id).get().then((doc) => {
                var datos = doc.data();
                var valor = datos.valor;
                var pendiente = datos.pendiente;
                var entidad = datos.entidad;
                var descripcion = datos.descripcion;
                var fecha = datos.fecha;
                var estado = datos.estado;
                var abono = result.value;
                abono = parseInt(abono, 10);
                if (abono <= pendiente) {

                    if (abono == pendiente) {
                        estado = true;
                    }
                    pendiente -= abono
                    db.collection("deudas").doc(element.id).set({
                        entidad,
                        descripcion,
                        valor,
                        fecha,
                        pendiente,
                        estado
                    })
                    Swal['fire']('Guardado!', '', 'success');
                    listarDeudas();

                }

            })




        }
    })
}
function GuardarDeuda() {
    var entidad = document.getElementById("entidadD").value;
    var descripcion = document.getElementById("NombreD").value;
    var valor = document.getElementById("ValorD").value;
    if (valor != "" && descripcion != "" && entidad != "") {
        var hoy = new Date();
        fecha = [hoy.getDate(), hoy.getMonth() + 1, hoy.getFullYear()];
        var estado = false;
        valor = parseInt(valor, 10);
        var pendiente = valor;
        db.collection("deudas").doc().set({
            entidad,
            descripcion,
            valor,
            fecha,
            pendiente,
            estado
        })
        Swal['fire']('Guardado!', '', 'success');
        listarDeudas();
    }
}
function GuardarGasto() {
    event['preventDefault']();
    var _0x3ab4x6 = document['getElementById']('Descripcion')['value'];
    var _0x3ab4x7 = document['getElementById']('valor')['value'];
    _0x3ab4x7 = parseInt(_0x3ab4x7, 10);
    var _0x3ab4x4 = new Date;
    var _0x3ab4x8 = [];
    _0x3ab4x8['push'](_0x3ab4x4['getDate']());
    _0x3ab4x8['push'](_0x3ab4x4['getMonth']() + 1);
    _0x3ab4x8['push'](_0x3ab4x4['getFullYear']());
    if (_0x3ab4x6 != '' && !isNaN(_0x3ab4x7)) {
        var _0x3ab4x9 = firebase['auth']()['currentUser'];
        _0x3ab4x9 = _0x3ab4x9['uid'];
        db['collection']('gastos')['doc']()['set']({
            user,
            descripcion,
            valor,
            fecha
        });
        Swal['fire']('Guardado!', '', 'success');
        listarGastos()
    }
}

function listarGastos() {
    var _0x3ab4xb = document['getElementById']('ListaGastos');
    _0x3ab4xb['innerHTML'] = `${'\x0D\x0A        <table class="table table-striped table-bordered" id="tabla1">\x0D\x0A            <thead>\x0D\x0A                <tr>\x0D\x0A                    <th colspan=3><center>Lista de gastos</center></th>\x0D\x0A                </tr>\x0D\x0A                <tr>\x0D\x0A                    <th>Descripci\xF3n</th>\x0D\x0A                    <th>Valor</th>\x0D\x0A                    <th>Fecha</th>\x0D\x0A                </tr>\x0D\x0A            </thead>\x0D\x0A        </table>\x0D\x0A    '}`;
    var _0x3ab4xc = document['getElementById']('tabla1');
    db['collection']('gastos')['get']()['then']((_0x3ab4xd) => {
        _0x3ab4xd['forEach']((_0x3ab4xe) => {
            var _0x3ab4xf = _0x3ab4xe['data']();
            _0x3ab4xc['innerHTML'] += `${'\x0D\x0A                <tr>\x0D\x0A                    <td>'}${_0x3ab4xf['descripcion']}${'</td>\x0D\x0A                    <td>'}${ingresar(_0x3ab4xf['valor'])}${'</td>\x0D\x0A                    <td>'}${_0x3ab4xf['fecha'][0]}${'/'}${_0x3ab4xf['fecha'][1]}${'/'}${_0x3ab4xf['fecha'][2]}${'</td>\x0D\x0A                </tr>\x0D\x0A\x0D\x0A            '}`
        })
    })
}

function RegistrarProveedor() {
    event.preventDefault();
    var nombre = document.getElementById("NombreP").value;
    var codigo = document.getElementById("codigoP").value;
    var deuda = 0;
    db.collection("proveedores").doc(codigo).set({
        nombre,
        codigo,
        deuda
    })
    Swal.fire('Guardado!', '', 'success');
    ListarProveedores();
}
function RegistrarCompra() {

    event.preventDefault();
    var NumeroFactura = document.getElementById("Nfactura").value;
    var Proveedor = document.getElementById("proveedor").value;
    var valorFactura = document.getElementById("valorFactura").value;
    var pagado = document.getElementById("si").checked;
    var estado = false;
    valorFactura = parseInt(valorFactura, 10);
    if (pagado) {
        estado = true;
    }
    var productos = [];
    var cantidades = [];
    var costos = [];
    var fecha1 = [];
    var existe = false;
    if (NumeroFactura != "" && Proveedor != "" && valorFactura != "") {
        db.collection("compras").where("NumeroFactura", "==", NumeroFactura).get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                existe = true;

            })

            if (!existe) {
                if (!estado) {
                    var deuda = valorFactura

                } else {
                    var deuda = 0;
                }

                db.collection("compras").doc(NumeroFactura).set({
                    NumeroFactura,
                    Proveedor,
                    valorFactura,
                    productos,
                    cantidades,
                    costos,
                    fecha1,
                    estado,
                    deuda
                })

                if (!estado) {
                    db.collection("proveedores").where("codigo", "==", Proveedor).get()
                        .then((querySnapshot) => {
                            querySnapshot.forEach((doc) => {
                                var datos = doc.data();
                                var codigo = datos.codigo;
                                var deuda = datos.deuda;
                                var nombre = datos.nombre;
                                deuda += valorFactura;
                                db.collection("proveedores").doc(codigo).set({
                                    codigo,
                                    deuda,
                                    nombre
                                })
                            })
                        })
                    Swal.fire('Guardado!', '', 'success');
                }
            } else {
                Swal.fire({

                    icon: 'info',
                    title: 'Ya hay una compra con este código',
                    showConfirmButton: false,
                    timer: 1500
                })
            }

        })

    }
}
const OBproveedor = (id) => db.collection("proveedores").doc(id).get();
const OBcompras = (id) => db.collection("compras").where("Proveedor", "==", id).get();
const OBProducto = (id) => db.collection("productos").doc(id).get();
async function verProveedor(element) {
    var id = element.id;
    var feed = document.getElementById("tabTwo");
    var proveedor = await OBproveedor(id);
    datosProveedor = proveedor.data();
    var compras = await OBcompras(proveedor.id);
    sumaDeuda = 0;
    compras.forEach(doc => {
        var datos = doc.data();
        sumaDeuda += datos.deuda;
    })
    feed.innerHTML = `
    <a onclick="ListarProveedores()" class="cursor"><img src="img/undo.png" width="30"></a><br><br>
    <table class="table table-striped table-bordered">
        <tr>
            <td>Código</td>
            <td>Nombre</td>
            <td>Deuda</td>
        </tr>
        <tr>
            <td>${proveedor.id}</td>
            <td>${datosProveedor.nombre}</td>
            <td>$${ingresar(sumaDeuda)}</td>
        </tr>
    </table>
    <br><h3>Lista de compras:</h3><br><div class="overflow-auto" id="tabla6"></div>
    `

    var tabla6 = document.getElementById("tabla6");
    compras.forEach(async (doc) => {
        datos = doc.data();
        tabla6.innerHTML += `<div class="overflow-auto"><table  class="table table-striped table-bordered" id="Cabecera${doc.id}">
                    <tr>
                        <th>Número de factura</th>
                        <th>total compra</th>
                        <th>saldo pendiente</th>
                        <th>sumaCompra</th>
                    </tr>
                </table></div>`;

        var tablaPedidos = document.getElementById("Cabecera" + doc.id);
        suma = 0;
        for (let i = 0; i < datos.costos.length; i++) {
            suma += datos.costos[i] * datos.cantidades[i]
        }

        tablaPedidos.innerHTML += `
                    <tr>
                        <td>${datos.NumeroFactura}</td>
                        <td>${datos.valorFactura}</td>
                        <td>${datos.deuda}</td>
                        <td>${suma}</td>
                        <td><a id="${doc.id}" onclick="eliminarCompra(this)"><img src="img/delete.png" width=30 class="cursor"></a>
                        <a id="${doc.id}" onclick="abonarDeuda(this)" class="cursor"><img src="img/abono.png" width=40></a>
                        <a class="cursor" id="${doc.id}" onclick="contenidoCompra(this)"><img src="img/contenido.png" width=30></a>
                        </td>
                    </tr>
                    
                    <tr>
                        <td colspan=8   >
                             <div id="contenido${doc.id}"></div>
                        </td>
                    </tr>
                    
                        `;

    })
}
async function contenidoCompra(element) {
    var container = document.getElementById(`contenido${element.id}`);
    
    db.collection("compras").where("NumeroFactura", "==", element.id).get().then((querySnapshot) => {
        querySnapshot.forEach(async (doc) => {
            var datos = doc.data();
            console.log("entró")
            container.innerHTML =
                `<center><button class="btn btn-success btn-block" id="${element.id}" onclick="ocultarPedido(this)">Ocultar contenido</button></td></center>
                    <td colspan=10>
                    <table  class="table table-striped table-bordered" id="tabla${element.id}">
                        <tr>
                            <th>Código del producto</th>
                            <th>Nombre del producto</th>
                            <th>Cantidad</th>
                            <th>costo</th>
                            <th>fecha</th>
                            <th>acciones</th>
                        </tr>
                    </table>
                    </td>
                
            `
            var contenido = document.getElementById("tabla" + element.id);
            for (let i = 0; i < datos.productos.length; i++) {
                var producto = await OBProducto(datos.productos[i]);
                producto = producto.data();
                contenido.innerHTML += `
                        <tr>
                            <th>${datos.productos[i]}</th>
                            <th>${producto.DESCRIPCION}</th>
                            <th>${datos.cantidades[i]}</th>
                            <th>${datos.costos[i]}</th>
                            <th>${datos.fecha1[i]}</th>
                            <th><a id="${doc.id}/${i}" onclick="eliminarPCompra(this)"><img src="img/delete.png" width=30 class="cursor"></a></th>
                        </tr>

                `;

            }

        })
    })
    db.collection("compras").doc(element.id).get().then(async(doc) => {
        
            var datos = doc.data();
            console.log("entró")
            container.innerHTML =
                `<center><button class="btn btn-success btn-block" id="${element.id}" onclick="ocultarPedido(this)">Ocultar contenido</button></td></center>
                    <td colspan=10>
                    <table  class="table table-striped table-bordered" id="tabla${element.id}">
                        <tr>
                            <th>Código del producto</th>
                            <th>Nombre del producto</th>
                            <th>Cantidad</th>
                            <th>costo</th>
                            <th>fecha</th>
                            <th>acciones</th>
                        </tr>
                    </table>
                    </td>
                
            `
            var contenido = document.getElementById("tabla" + element.id);
            for (let i = 0; i < datos.productos.length; i++) {
                var producto = await OBProducto(datos.productos[i]);
                producto = producto.data();
                if(producto!=undefined){

                
                contenido.innerHTML += `
                        <tr>
                            <th>${datos.productos[i]}</th>
                            <th>${producto.DESCRIPCION}</th>
                            <th>${datos.cantidades[i]}</th>
                            <th>${datos.costos[i]}</th>
                            <th>${datos.fecha1[i]}</th>
                            <th><a id="${doc.id}/${i}" onclick="eliminarPCompra(this)"><img src="img/delete.png" width=30 class="cursor"></a></th>
                        </tr>

                `;
                }

            }

        
    })

}
function verProveedor2(id) {

    var feed = document.getElementById("tabTwo");
    db.collection("proveedores").where("codigo", "==", id).get().then((querySnapshot) => {
        querySnapshot.forEach((doc2) => {
            var datos = doc2.data();
            feed.innerHTML = `
    <a onclick="ListarProveedores()" class="cursor"><img src="img/undo.png" width="30"></a><br><br>
    <table class="table table-striped table-bordered">
        <tr>
            <td>Código</td>
            <td>Nombre</td>
            <td>Deuda</td>
        </tr>
        <tr>
            <td>${doc2.id}</td>
            <td>${datos.nombre}</td>
            <td>$${ingresar(datos.deuda)}</td>
        </tr>
    </table>
    <br><h3>Lista de compras:</h3><br><div class="overflow-auto" id="tabla6"></div>`;
            var tabla6 = document.getElementById("tabla6");
            db.collection("compras").where("Proveedor", "==", id)
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        datos = doc.data();

                        tabla6.innerHTML +=
                            `<table  class="table table-striped table-bordered" id="${doc.id}"><tr>
            <td colspan=3>Número de factura:${doc.id}</td>
            <td colspan=2><a id="${doc.id}" onclick="eliminarCompra(this)"><img src="img/delete.png" width=30 class="cursor"></a></td
            </tr>
            <tr>
            <th>Codigo producto</th>
            <th>cantidad</th>
            <th>costo</th>
            <th>fecha</th>
            <th>Acciones</th>
          </tr></table>`;
                        costos = datos.costos;
                        var suma = 0;

                        for (let i = 0; i < costos.length; i++) {
                            suma += costos[i] * datos.cantidades[i];
                        }
                        var tabla7 = document.getElementById(doc.id);
                        for (let i = 0; i < costos.length; i++) {
                            tabla7.innerHTML += `
                    <tr>
                    <td>${datos.productos[i]}</td>
                    <td>${datos.cantidades[i]}</td>
                    <td>${datos.costos[i]}</td>
                    <td>${datos.fecha1[i]}</td>
                    <td><a id="${doc.id}/${i}" onclick="eliminarPCompra(this)"><img src="img/delete.png" width=30 class="cursor"></a>
                    </td>
                    </tr>`;
                        }
                        tabla7.innerHTML += `
                    <tr>
                        <td colspan=5 id="tablaSuma">
                            suma de la compra:${suma}<br>
                            valor total de la compra: ${datos.valorFactura}<br>
                            valor restante de la compra: ${datos.deuda}<br>
                            <a id="${doc.id}" onclick="abonarDeuda(this)" class="cursor"><img src="img/abono.png" width=40></a>
                        </td>
                    </tr>`

                    })
                });
        })
    })

}
async function eliminarProveedor(element) {
    await db.collection("proveedores").doc(element.id).delete();
    Swal.fire('Borrado!', '', 'success');
    ListarProveedores();

}
async function eliminarCompra(element) {
    var id = element.id
    var doc = await obtenerCompra(id);
    var datos = doc.data();
    var deuda = datos.deuda;

    var doc2 = await obtenerProveedor(datos.Proveedor);
    var datos2 = doc2.data();
    var deuda2 = datos2.deuda;
    var codigo = datos2.codigo;
    var nombre = datos2.nombre;
 
    deuda2 -= deuda;

    db.collection("compras").doc(doc.id).delete();
    actualizarProveedor(codigo, deuda2, nombre);
}
function abonarDeuda(element) {

    Swal.fire({
        title: 'Ingrese el valor pago',
        input: 'number',
        inputAttributes: {
            autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Ingresar',
        showLoaderOnConfirm: true,
        CancelButtonText: 'Cancelar'

    }).then((result) => {
        if (result.isConfirmed) {
            entrada = false;
            var codigo;

            db.collection("compras").where("NumeroFactura", "==", element.id).get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    var datos = doc.data();

                    if (datos.deuda >= result.value) {

                        entrada = true;
                        codigo = datos.Proveedor
                        NumeroFactura = datos.NumeroFactura;
                        Proveedor = datos.Proveedor;
                        valorFactura = datos.valorFactura;
                        productos = datos.productos;
                        cantidades = datos.cantidades;
                        costos = datos.costos;
                        fecha1 = datos.fecha1;
                        estado = datos.estado;
                        deuda = datos.deuda;
                        deuda -= result.value;

                        db.collection("compras").doc(NumeroFactura).set({
                            NumeroFactura,
                            Proveedor,
                            valorFactura,
                            productos,
                            cantidades,
                            costos,
                            fecha1,
                            estado,
                            deuda
                        })
                    }
                })
                if (entrada) {
                    db.collection("proveedores").where("codigo", "==", codigo).get().then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {

                            var datos = doc.data();
                            var deuda = datos.deuda;
                            var nombre = datos.nombre;
                            var codigo = datos.codigo;
                            deuda -= result.value;
                            db.collection("proveedores").doc(codigo).set({
                                deuda,
                                nombre,
                                codigo
                            })
                            valor = result.value;
                            tipo = "pago de factura"
                            db.collection("pagos").doc().set({
                                valor,
                                tipo,

                            })

                            Swal.fire('Guardado!', '', 'success');
                        })
                    })
                }
            })


        }
    })
}
const obtenerVendedores = () => db.collection("usuarios").get();
const obtenerTodasVentas = () => db.collection("ventas").where("debe", ">", 0).get();
const obtenerVentas = (id) => db.collection("ventas").where("vendedor", "==", id).get();
const obtenerVentasCliente = (id) => db.collection("ventas").where("cliente", "==", id).get();
const obtenerCliente = (id) => db.collection("clientes").doc(id).get();
async function historialCompra(element) {
    var login = document.getElementById("login-page");
    login.innerHTML = "";
    var main = document.getElementById("main");
    cliente = await obtenerCliente(element.id);
    cliente = cliente.data();
    main.innerHTML = `
    `
    CarteraCliente = document.getElementById("CarteraCliente");
    querySnapshot = await obtenerVentasCliente(element.id);
    querySnapshot.forEach(doc => {
        var datos = doc.data();


        main.innerHTML += `<div class="overflow-auto"><table  class="table table-striped table-bordered" id="Cabecera${doc.id}">
            <tr>
                <th>Número de factura</th>
                <th>Cliente</th>
                <th>Estado de entrega</th>
                <th>Estado de pago</th>
                <th>Valor</th>
                <th>debe</th>
                <th>fecha</th>
                <th>plazo</th>
                <th>fecha de vencimiento</th>
                <th colspan=3>Acciones</th>
            </tr>
        </table></div>`;

        var tablaPedidos = document.getElementById("Cabecera" + doc.id);


        tablaPedidos.innerHTML += `
            <tr>
                <td>${datos.NumeroFactura}</td>
                <td>${cliente.RazonSocial}</td>
                <td>${datos.entregado}</td>
                <td>${datos.pagado}</td>
                <td>${datos.suma}</td>
                <td>${datos.debe}</td>
                <td>${datos.fecha[0]}/${datos.fecha[1]}/${datos.fecha[2]}</td>
                <td>${datos.plazo} dias</td>
                <td>${datos.fechaVencimiento[0]}/${datos.fechaVencimiento[1]}/${datos.fechaVencimiento[2]}</td>
                <td><a class="cursor" id="${doc.id}" onclick="AbonarPedido(this)"><img src="img/abono.png" width=30></a><br>
                <a class="cursor" id="${doc.id}" onclick="facturaPdf(this)"><img src="img/factura.png" width=30></a><br>
                <a class="cursor" id="${doc.id}" onclick="contenidoPedido(this)"><img src="img/contenido.png" width=30></a></td>
                
            </tr>
            <tr>
                <td colspan=9>
                     <div id="contenido${doc.id}"></div>
                </td>
            </tr>
            
                `





    })
}

async function ListaPosicionVentas(mes, año1) {
    var login = document.getElementById("login-page");
    login.innerHTML = "";
    var main = document.getElementById("main");
    main.innerHTML = `<img src="img/carga.gif" width=100>`
    querySnapshot1 = await obtenerVendedores();
    var posiciones = [];
    var lista = [];
    var nombres = [];
    var cuota = [];
    querySnapshot1.forEach(async (doc) => {
        var suma = 0;
        var datos2 = doc.data()

        querySnapshot2 = await obtenerVentas(doc.id);
        querySnapshot2.forEach((doc2) => {

            var datos = doc2.data();
            if (datos.fecha[1] == mes && datos.fecha[2] == año1) {
                suma += datos.suma;
            }
        })
        if (suma > 0) {
            lista.push(suma);
            posiciones.push(doc.id);
            nombres.push(`${datos2.nombre}` + " " + `${datos2.apellido}`)
            cuota.push(datos2.cuota)
            var n, i, k, aux;
            n = lista.length;

            for (k = 1; k < n; k++) {
                for (i = 0; i < (n - k); i++) {
                    if (lista[i] < lista[i + 1]) {
                        aux = lista[i];
                        aux2 = posiciones[i];
                        aux3 = nombres[i]
                        aux4 = cuota[i]
                        lista[i] = lista[i + 1];
                        posiciones[i] = posiciones[i + 1]
                        nombres[i] = nombres[i + 1]
                        cuota[i] = cuota[i + 1]
                        lista[i + 1] = aux;
                        posiciones[i + 1] = aux2;
                        nombres[i + 1] = aux3;
                        cuota[i + 1] = aux4
                    }
                }
            }

            var login = document.getElementById("login-page");
            login.innerHTML = "";
            var main = document.getElementById("main");
            main.innerHTML = `
            <center> <h1>Lista de posiciones de ventas</h1></center> 
            <br>
            <table>
                <tr>
                    <td>
                    <select id="meses4" class="form-control">
                    <option value="" >Seleccione el mes</option>
                </select>
                    </td>
                
                
                    <td>
                    <select id="años4" class="form-control">
                    <option value="" >Seleccione el año</option>
                </select>
                    </td>
                </tr>
                <tr>
                    <td colspan=2>
                       <center> 
                       <br>
                        <button onclick="LlamarMesAÑo()" class="btn btn-primary">Buscar</button>
                        </center>
                    </td>
                </tr>
            </table>
            <br>
            
            <table class="table table-striped table-bordered" id="tablaPosiciones">
                <tr>
                    <th>Puesto</th>
                    <th>Nombre</th>
                    <th>Cantidad de ventas</th>
                    <th>cuota</th>
                    <th>cumplimieto al dia</th>
                </tr>
            </table>
            `
            var meses = document.getElementById("meses4");
            let cumplio = [];
            for (let i = 0; i < cuota.length; i++) {
                if (lista[i] >= cuota[i]) {
                    cumplio.push(true)
                } else {
                    cumplio.push(false)
                }
            }
            for (let i = 1; i < 13; i++) {
                var option = document.createElement("option");
                option.value = i;
                option.text = i;
                meses.appendChild(option);

            }
            var años = document.getElementById("años4");
            var hoy = new Date();
            año = hoy.getFullYear();
            for (let i = año; i > 2000 - 1; i--) {
                var option = document.createElement("option");
                option.value = i;
                option.text = i;
                años.appendChild(option);

            }
            tablaPosiciones = document.getElementById("tablaPosiciones");
            for (let i = 0; i < lista.length; i++) {
                tablaPosiciones.innerHTML += `
                    <tr>
                        <td>${i + 1}</td>
                        <td>${nombres[i]}</td>
                        <td>${ingresar(lista[i])}</td>
                        <td>${ingresar(cuota[i])}</td>
                        <td>${cumplio[i]}</td>
                    </tr>
                `
            }

        }


    })
}
function LlamarMesAÑo() {
    var mes = document.getElementById("meses4").value;
    var año = document.getElementById("años4").value;
    if (mes != "" && año != "") {
        ListaPosicionVentas(mes, año);
    } else {

    }

}
async function cartera(element) {
    var login = document.getElementById("login-page");
    login.innerHTML = "";
    var main = document.getElementById("main");
    cliente = await obtenerCliente(element.id);
    cliente = cliente.data();
    main.innerHTML = `
    ${cliente.RazonSocial} No tiene facturas pendientes.
    `
    CarteraCliente = document.getElementById("CarteraCliente");
    querySnapshot = await obtenerVentasCliente(element.id);
    querySnapshot.forEach(doc => {
        var datos = doc.data();
        if (datos.debe > 0) {
            main.innerHTML = `<h4>Lista Facturas pendientes: </h4><br>
            <a class="cursor" id="${element.id}" onclick="reporteCarteraPDF(this)"><img src="img/impresora.png" width=30></a><br><br>
            `

        }
    })
    querySnapshot.forEach(doc => {
        var datos = doc.data();
        if (datos.debe > 0) {

            main.innerHTML += `<div class="overflow-auto"><table  class="table table-striped table-bordered" id="Cabecera${doc.id}">
            <tr>
                <th>Número de factura</th>
                <th>Cliente</th>
                <th>Estado de entrega</th>
                <th>Estado de pago</th>
                <th>Valor</th>
                <th>debe</th>
                <th>fecha</th>
                <th>plazo</th>
                <th>fecha de vencimiento</th>
                <th colspan=3>Acciones</th>
            </tr>
        </table></div>`;

            var tablaPedidos = document.getElementById("Cabecera" + doc.id);


            tablaPedidos.innerHTML += `
            <tr>
                <td>${datos.NumeroFactura}</td>
                <td>${cliente.RazonSocial}</td>
                <td>${datos.entregado}</td>
                <td>${datos.pagado}</td>
                <td>${datos.suma}</td>
                <td>${datos.debe}</td>
                <td>${datos.fecha[0]}/${datos.fecha[1]}/${datos.fecha[2]}</td>
                <td>${datos.plazo} dias</td>
                <td>${datos.fechaVencimiento[0]}/${datos.fechaVencimiento[1]}/${datos.fechaVencimiento[2]}</td>
                <td><a class="cursor" id="${doc.id}" onclick="AbonarPedido(this)"><img src="img/abono.png" width=30></a><br>
                <a class="cursor" id="${doc.id}" onclick="facturaPdf(this)"><img src="img/factura.png" width=30></a><br>
                <a class="cursor" id="${doc.id}" onclick="contenidoPedido(this)"><img src="img/contenido.png" width=30></a></td>
                
            </tr>
            <tr>
                <td colspan=9>
                     <div id="contenido${doc.id}"></div>
                </td>
            </tr>
            
                `
        }




    })
}
async function CalcularNomina() {
    ventaGarray = [];
    var login = document.getElementById("login-page");
    login.innerHTML = "";
    var main = document.getElementById("main");
    main.innerHTML = `
    <div class="wrap">
        <center>
        <ul class="tabs">
            <li><a href="#tab1"><span class="fa fa-home"></span><span class="tab-text">Calcular Nómina</span></a></li>
            <li><a href="#tab2"><span class="fa fa-group"></span><span class="tab-text">Salarios</span></a></li>
            <li><a href="#tab3"><span class="fa fa-group"></span><span class="tab-text">Agregar salario</span></a></li>
        </ul>
        </center>
        <div class="secciones">
            <article id="tab1">
    
                <div id="tabOne">
                <div class="form-group col-md-6" >
                    <div class="form-group"><select class="form-control" id="salarios"><option value="">seleccione el tipo de salario</option></select></div>
                    <div class="form-group"><input type="number" id="cantidadNominas" placeholder="ingrese la cantidad de nóminas" class="form-control"> </div>
                    <div class="form-group"><input type="number" id="diasTrabajados" placeholder="ingrese la cantidad de días trabajados" class="form-control"> </div>
                    <div class="form-group"><input type="number" id="cantidadSalarios" placeholder="ingrese la cantidad de salarios" class="form-control"> </div>
                    <div class="form-group"><button class="btn btn-success" onclick="SacarNomina()">Calcular nómina</button></div>
                </div>
                <hr>
                <div class="form-group" id="tablaNomina1">
                    
                </div>
                  </div>
            </article>
            <article id="tab2">
                <div id="tabTwo">
                
                
                    <table class="table table-striped table-bordered" id="TablaSalarios">
                        <tr>
                            <th>Nombre del salario</th>
                            <th>Valor del salario mensualmente</th>
                            <th>Deducciones</th>
                            <th>Auxilios</th>
                        </tr>
                        <div id="aviso">No hay salarios registrados</div>
                    </table>
                </div>
            </article>
            <div class="secciones">
            <article id="tab3">
    
                <div id="tabTree">
                <center>
                <div class="form-group col-md-6">
                <div class="form-group"> <input type="text" class="form-control" placeholder="Nombre del salario*" id="NombreSalario"></div>
                <div class="form-group"> <input type="number" class="form-control" placeholder="Valor del salario mensualmente*" id="valorSalario"></div>
                 <h4>Deducciones</h4>
                 <div id="ListaDeducciones"></div>
                 <div class="form-group"> <input type="text" class="form-control" placeholder="Nombre de la deducción*" id="NombreDeduccion"> </div>
                 <div class="form-group">  <input type="number" class="form-control" placeholder="Porcentaje de la deducción sobre el salario*" id="PorcentajeDeduccion"></div>
                 <a class="cursor" onclick="AgregarDeduccion()"><img src="img/add.png" width=30></a>
                 <hr>
                 <h4>Auxilios</h4>
                 <div id="ListaAuxilios"></div>
                 <div class="form-group"><input type="text" class="form-control" placeholder="Nombre del auxilio*" id="NombreAuxilio"> </div>
                 <div class="form-group"> <input type="number" class="form-control" placeholder="Valor del auxilio mensualmente*" id="ValorAuxilio"></div>
                 <div class="form-group"><a class="cursor" onclick="AgregarAuxilio()"><img src="img/add.png" width=30></a></div>
                 <div class="form-group"><button class="btn btn-danger" onclick="AgregarSalario()">Agregar</button></div>
             </div>
             </center>
                  </div>
            </article>
            
    
            
        </div>
    </div>`;
    cargarTabs();
    var TablaSalarios = document.getElementById("TablaSalarios");
    busquedaSalarios = await obtenerSalarios();
    selectsalarios = document.getElementById("salarios");

    aviso = document.getElementById("aviso")
    busquedaSalarios.forEach(doc => {
        aviso.innerHTML = "";
        var datos = doc.data();
        option = document.createElement("option");
        option.value = doc.id;
        option.text = datos.NombreSalario;
        selectsalarios.appendChild(option);
        TablaSalarios.innerHTML += `
            <td>${datos.NombreSalario}</td>
            <td>${ingresar(datos.valorSalario)}</td>
            <td id="deducciones${doc.id}"></td>
            <td id="auxilios${doc.id}"></td>
        `
        deducciones1 = document.getElementById("deducciones" + doc.id);
        for (let i = 0; i < datos.deducciones.length; i++) {
            deducciones1.innerHTML += `${datos.deducciones[i]} ${datos.deduccionesValor[i]}%<br>`
        }
        auxilios1 = document.getElementById("auxilios" + doc.id);
        for (let i = 0; i < datos.auxilios.length; i++) {
            auxilios1.innerHTML += `${datos.auxilios[i]} $${ingresar(datos.auxiliosValor[i])}<br>`
        }
    })

}
var deducciones = [];
var auxilios = [];
var deduccionesValor = [];
var auxiliosValor = [];

function AgregarDeduccion() {
    var NombreDeduccion = document.getElementById("NombreDeduccion").value;
    var PorcentajeDeduccion = document.getElementById("PorcentajeDeduccion").value;
    PorcentajeDeduccion = parseInt(PorcentajeDeduccion, 10);
    if (PorcentajeDeduccion != NaN && NombreDeduccion != "") {
        deducciones.push(NombreDeduccion);
        deduccionesValor.push(PorcentajeDeduccion);
        var ListaDeducciones = document.getElementById("ListaDeducciones");
        ListaDeducciones.innerHTML = "";
        for (let i = 0; i < deducciones.length; i++) {
            ListaDeducciones.innerHTML += `
                <div class="form-group border" style="padding=3%">
                ${i + 1}. ${deducciones[i]}
                  ${deduccionesValor[i]}%
                </div>
            `
        }
    } else {

    }
}
function AgregarAuxilio() {
    var NombreAuxilio = document.getElementById("NombreAuxilio").value;
    var PorcentajeAuxilio = document.getElementById("ValorAuxilio").value;
    PorcentajeAuxilio = parseInt(PorcentajeAuxilio, 10);

    if (PorcentajeAuxilio != NaN && NombreAuxilio != "") {

        auxilios.push(NombreAuxilio);
        auxiliosValor.push(PorcentajeAuxilio);

        var ListaAuxilios = document.getElementById("ListaAuxilios");
        ListaAuxilios.innerHTML = "";
        for (let i = 0; i < auxilios.length; i++) {
            ListaAuxilios.innerHTML += `
                <div class="form-group border" style="padding=3%">
                    ${i + 1}. ${auxilios[i]}
                     $${auxiliosValor[i]}
                </div>
            `
        }
    } else {

    }
}
const obtenerSalarios = () => db.collection("salarios").get();
function AgregarSalario() {
    var NombreSalario = document.getElementById("NombreSalario").value;
    var valorSalario = document.getElementById("valorSalario").value;
    valorSalario = parseInt(valorSalario, 10);
    if (NombreSalario != "" && valorSalario != NaN) {
        db.collection("salarios").doc().set({ NombreSalario, valorSalario, deducciones, deduccionesValor, auxilios, auxiliosValor })
    }
}
const obtenerSalariosIndividual = (id) => db.collection("salarios").doc(id).get();
async function SacarNomina() {
    cantidadNominas = document.getElementById("cantidadNominas").value;
    salarios = document.getElementById("salarios").value;
    diasTrabajados = document.getElementById("diasTrabajados").value;
    cantidadSalarios = document.getElementById("cantidadSalarios").value;
    tablaNomina1 = document.getElementById("tablaNomina1");
    tablaNomina1.innerHTML = ``;
    if (cantidadNominas != "" && salarios != "" && diasTrabajados != "" && cantidadSalarios != "") {
        doc = await obtenerSalariosIndividual(salarios);
        salario = doc.data();
        cantidadNominas = parseInt(cantidadNominas, 10);
        diasTrabajados = parseInt(diasTrabajados, 10);

        var listaA = []
        var sumaA = 0;
        for (let i = 0; i < salario.auxilios.length; i++) {
            listaA[i] = salario.auxiliosValor[i] / 30
            sumaA += listaA[i] * diasTrabajados;
        }
        var listaD = []
        var sumaD = 0;
        for (let i = 0; i < salario.deducciones.length; i++) {
            listaD[i] = salario.deduccionesValor[i] / 100 * (salario.valorSalario / 30) * diasTrabajados
            sumaD += listaD[i]
        }

        tablaNomina1.innerHTML = `
            <table class="table table-striped table-bordered">
                <tr>
                    <th>Cantidad de salarios</th>
                    <th>Valor mensual del salario</th>
                    <th>Días trabajados</th>
                    <th>Valor Día</th>
                    <th>Devengado</th>
                    <th>Auxilios</th>
                    <th>Deducciones</th>
                    <th>Total a pagar</th>
                    <th>Nómina completa</th>
                </tr>
                <tr>
                    <td>${cantidadNominas}</td>
                    <td>${salario.valorSalario}</td>
                    <td>${diasTrabajados}</td>
                    <td>${salario.valorSalario / 30}</td>
                    <td>${(salario.valorSalario / 30) * diasTrabajados}</td>
                    <td id="Auxilios4"></td>
                    <td id="deducciones4"></td>
                    <td>${(((salario.valorSalario / 30) * diasTrabajados) - sumaD + sumaA).toFixed(2)}</td>
                    <td>${((((salario.valorSalario / 30) * diasTrabajados) - sumaD + sumaA) * cantidadNominas).toFixed(2)}</td>
                </tr>
            </table>
        `
        var auxilios4 = document.getElementById("Auxilios4");
        for (let i = 0; i < listaA.length; i++) {
            auxilios4.innerHTML += `${salario.auxilios[i]}: ${listaA[i] * diasTrabajados}`
        }
        var deducciones4 = document.getElementById("deducciones4");
        for (let i = 0; i < listaD.length; i++) {

            deducciones4.innerHTML += `${salario.deducciones[i]}: ${listaD[i].toFixed(2)}<br>`
        }
    }
}
const obtenerAbonoEditar = (id) => db.collection("abonos").doc(id).get();
async function EditarAbono(element) {
    var cantidad = document.getElementById(`cantidad${element.id}`);
    var recibo = document.getElementById(`recibo${element.id}`);
    cantidad.innerHTML = `<input class="form-control" id="cantidad1${element.id}">`
    recibo.innerHTML = `<input class="form-control" id="recibo1${element.id}">`
    var cantidad1 = document.getElementById(`cantidad1${element.id}`);
    var recibo1 = document.getElementById(`recibo1${element.id}`);
    var doc = await obtenerAbonoEditar(element.id);
    var datos = doc.data();
    cantidad1.value = datos.cantidad_abono;
    recibo1.value = datos.recibo;
    var container = document.getElementById(`container1${doc.id}`)
    container.innerHTML = `
        <div class="btn-toolbar">
            <a class="cursor btn" id="${doc.id}" onclick="guardarCambiosAbono(this)"><img src="img/checked.png" width=20 title="guardar"></a>
            <a class="cursor btn" id="${doc.id}" onclick="cancelarCambios(this)"><img src="img/remove.png" width=20 title="cancelar"></a>
        </div>
    `
}
async function cancelarCambios(element) {
    var cantidad = document.getElementById(`cantidad${element.id}`);
    var recibo = document.getElementById(`recibo${element.id}`);
    var container = document.getElementById(`container1${element.id}`)
    var doc = await obtenerAbonoEditar(element.id);
    var datos = doc.data();
    cantidad.innerHTML = ingresar(datos.cantidad_abono);
    recibo.innerHTML = datos.recibo;
    container.innerHTML = `<a class="cursor" id="${doc.id}" onclick="EditarAbono(this)"><img src="img/editar.png" width=20 title="Editar"></a>`
}
const obtenerVentaAbono = (id) => db.collection("ventas").where("NumeroFactura", "==", id).get();
async function guardarCambiosAbono(element) {
    var cantidad_abono = document.getElementById(`cantidad1${element.id}`).value;
    var recibo = document.getElementById(`recibo1${element.id}`).value;
    var container = document.getElementById(`container1${element.id}`)
    container.innerHTML = `<a class="cursor" id="${element.id}" onclick="EditarAbono(this)"><img src="img/editar.png" width=20 title="Editar"></a>`
    var doc = await obtenerAbonoEditar(element.id);
    var datosAbono = doc.data();
    var NumeroFactura = datosAbono.NumeroFactura;
    var fecha = datosAbono.fecha;
    var rentabilidad = datosAbono.rentabilidad;
    var cantidadA = datosAbono.cantidad_abono;
    cantidad_abono = parseInt(cantidad_abono, 10);
    var venta = await obtenerVentaAbono(NumeroFactura);
    var debe;
    var doc;

    venta.forEach((doc2) => {
        var datos = doc2.data();
        debe = datos.debe;
        var cantidades = datos.cantidades;
        var descuentos = datos.descuentos;
        var NumeroFactura = datos.NumeroFactura
        var idProducto = datos.idProducto;
        var entregado = datos.entregado;
        var vendedor = datos.vendedor;
        var fecha = datos.fecha
        var pagado = datos.pagado
        var suma = datos.suma
        var cliente = datos.cliente;
        var plazo = datos.plazo;
        var rentabilidad = datos.rentabilidad
        var fechaVencimiento = datos.fechaVencimiento
        document = doc2.id
    })
    debe += cantidadA;
    if (debe < cantidad_abono) {
        Swal.fire({
            icon: 'info',
            title: 'el abono no puede superar la suma',
            showConfirmButton: false,
            timer: 1500
        })
    } else {
        db.collection("abonos").doc(element.id).set({
            rentabilidad,
            NumeroFactura,
            cantidad_abono,
            fecha,
            recibo
        })
        debe -= cantidad_abono;
        venta.forEach((doc2) => {
            var datos = doc2.data();
            var cantidades = datos.cantidades;
            var descuentos = datos.descuentos;
            var NumeroFactura = datos.NumeroFactura
            var idProducto = datos.idProducto;
            var entregado = datos.entregado;
            var vendedor = datos.vendedor;
            var fecha = datos.fecha
            var pagado = datos.pagado
            var suma = datos.suma
            var cliente = datos.cliente;
            var plazo = datos.plazo;
            var rentabilidad = datos.rentabilidad
            var fechaVencimiento = datos.fechaVencimiento
            db.collection("ventas").doc(doc2.id).set({
                cantidades,
                idProducto,
                entregado,
                vendedor,
                fecha,
                pagado,
                suma,
                debe,
                cliente,
                NumeroFactura,
                descuentos,
                rentabilidad,
                plazo,
                fechaVencimiento
            })

        })

        Swal.fire('Editado!', '', 'success');
    }
    /*
    */
}
const obtenerVentaReporte = (id) => db.collection("ventas").where("cliente", "==", id).where("debe", ">", 0).get();
const reporteCarteraPDF = async (element) => {

    var id = element.id;
  
    var cliente = await obtenerCliente(id);
    var query = await obtenerVentaReporte(id);
    cliente = cliente.data();
    var doc = jsPDF('p', 'mm', [279.4, 216]);

    var x = 5;
    var y = 30;
    doc.setFontType("bold");
    doc.text(x, y, `Reporte de cartera de: ${cliente.RazonSocial}`)
    y += 15;
    doc.setFontSize(7);
    doc.text(x, y, "Numero factura");
    x += 25;
    doc.text(x, y, "Debe");
    x += 25;
    doc.text(x, y, "estado de entrega");
    x += 25;
    doc.text(x, y, "estado de pago");
    x += 25;
    doc.text(x, y, "plazo");
    x += 15;
    doc.text(x, y, "Suma de la venta");
    x += 25;
    doc.text(x, y, `Fecha de venta`);
    x += 25;
    doc.text(x, y, `Fecha de vencimiento`);
    x = 5
    y += 5
    doc.setFontType("normal");
    var cont = 0;
    query.forEach(element1 => {

        var datos = element1.data();


        doc.text(x, y, datos.NumeroFactura.toString());
        x += 25;
        doc.text(x, y, ingresar(datos.debe));
        x += 25;
        doc.text(x, y, datos.entregado.toString());
        x += 25;
        doc.text(x, y, datos.pagado.toString());
        x += 25;
        doc.text(x, y, datos.plazo.toString());
        x += 15;
        doc.text(x, y, ingresar(datos.suma));
        x += 25;
        doc.text(x, y, `${datos.fecha[0]}/${datos.fecha[1]}/${datos.fecha[2]}`);
        x += 25;
        doc.text(x, y, `${datos.fechaVencimiento[0]}/${datos.fechaVencimiento[1]}/${datos.fechaVencimiento[2]}`);
        x += 25;
        y += 5;
        x = 5
        cont += 1
        if (cont % 46 == 0) {
            doc.addPage();
            y = 30
        }
    })
    doc.save(`Reporte${cliente.RazonSocial}`);
}

const reporteCarteraGeneral = async (element) => {

    try{
        for (let i = 0; i < carteraGeneralA.length; i++) {
            cliente = carteraGeneralA[i].cliente
            if (cliente.length > 30) {
                carteraGeneralA[i].cliente = ""
                for (let j = 0; j < 30; j++) {
                    carteraGeneralA[i].cliente += cliente[j]
                }
            }
    
        }
    
        var fecha = new Date();
    
        var doc = jsPDF('p', 'mm', [279.4, 216]);
        var x = 5;
        var y = 30;
        doc.setFontType("bold");
        doc.text(x, y, `Reporte de cartera general ${fecha.getDate()}/${fecha.getMonth() + 1}/${fecha.getFullYear()}`)
        y += 15;
        doc.setFontSize(7);
        doc.text(x, y, "Numero factura");
        x += 20;
        doc.text(x, y, "Cliente");
        x += 50;
        doc.text(x, y, "Debe");
        x += 20;
        doc.text(x, y, "entregado");
        x += 20;
        doc.text(x, y, "plazo");
        x += 15;
        doc.text(x, y, "Suma");
        x += 20;
        doc.text(x, y, `Fecha de venta`);
        x += 20;
        doc.text(x, y, `Fecha de vencimiento`);
        x = 5
        y += 5
        doc.setFontType("normal");
        var cont = 0;
        let suma = 0;
        for (let i = 0; i < carteraGeneralA.length; i++) {
    
            doc.text(x, y, carteraGeneralA[i].NumeroFactura.toString());
            x += 20;
            doc.text(x, y, carteraGeneralA[i].cliente);
            x += 50;
            doc.text(x, y, ingresar(carteraGeneralA[i].debe));
            x += 20;
            doc.text(x, y, carteraGeneralA[i].entregado.toString());
            x += 20;
            doc.text(x, y, carteraGeneralA[i].plazo.toString());
            x += 15;
            doc.text(x, y, ingresar(carteraGeneralA[i].suma));
            x += 20;
            doc.text(x, y, `${carteraGeneralA[i].fecha[0]}/${carteraGeneralA[i].fecha[1]}/${carteraGeneralA[i].fecha[2]}`);
            x += 20;
            doc.text(x, y, `${carteraGeneralA[i].fechaVencimiento[0]}/${carteraGeneralA[i].fechaVencimiento[1]}/${carteraGeneralA[i].fechaVencimiento[2]}`);
            x += 20;
            y += 5;
            x = 5
            cont += 1
            suma += carteraGeneralA[i].debe;
            if (cont % 40 == 0) {
                
                doc.addPage();
                y = 30
            }
        }
    
    
        doc.setFontSize(15);
        doc.text(120, 250, `Total de cartera: ${ingresar(suma)}`);
        doc.save(`ReporteGeneralCartera${fecha.getDate()}/${fecha.getMonth() + 1}/${fecha.getFullYear()}`);
    }catch(E){
     
    }
    
}
const obtenerVendedor1 = (id) => db.collection("usuarios").doc(id).get();
const reporteCarteraVendedor = async () => {
    for (let i = 0; i < carteraVendedorA.length; i++) {
        cliente = carteraVendedorA[i].cliente

        if (cliente.length > 30) {
            carteraVendedorA[i].cliente = ""
            for (let j = 0; j < 30; j++) {
                carteraVendedorA[i].cliente += cliente[j]
            }
        }

    }
    var doc = jsPDF('p', 'mm', [279.4, 216]);
    var x = 5;
    var y = 30;
    doc.setFontType("bold");
    doc.text(x, y, `Reporte de cartera de: ${carteraVendedorA[0].vendedor}`)
    y += 15;
    doc.setFontSize(7);
    doc.text(x, y, "Numero factura");
    x += 20;
    doc.text(x, y, "Cliente");
    x += 50;
    doc.text(x, y, "Debe");
    x += 20;
    doc.text(x, y, "entregado");
    x += 20;
    doc.text(x, y, "plazo");
    x += 15;
    doc.text(x, y, "Suma");
    x += 20;
    doc.text(x, y, `Fecha de venta`);
    x += 20;
    doc.text(x, y, `Fecha de vencimiento`);
    x = 5
    y += 5
    doc.setFontType("normal");
    var cont = 0;
    var suma = 0

    for (let i = 0; i < carteraVendedorA.length; i++) {
        suma += carteraVendedorA[i].debe;

        if (carteraVendedorA[i].debe > 0) {

            doc.text(x, y, carteraVendedorA[i].NumeroFactura.toString());
            x += 20;
            doc.text(x, y, carteraVendedorA[i].cliente);
            x += 50;
            doc.text(x, y, ingresar(carteraVendedorA[i].debe));
            x += 20;
            doc.text(x, y, carteraVendedorA[i].entregado.toString());
            x += 20;
            doc.text(x, y, carteraVendedorA[i].plazo.toString());
            x += 15;
            doc.text(x, y, ingresar(carteraVendedorA[i].suma));
            x += 20;
            doc.text(x, y, `${carteraVendedorA[i].fecha[0]}/${carteraVendedorA[i].fecha[1]}/${carteraVendedorA[i].fecha[2]}`);
            x += 20;
            doc.text(x, y, `${carteraVendedorA[i].fechaVencimiento[0]}/${carteraVendedorA[i].fechaVencimiento[1]}/${carteraVendedorA[i].fechaVencimiento[2]}`);
            x += 20;
            y += 5;
            x = 5
            cont += 1
            if (cont % 40 == 0) {
               
                doc.addPage();
                y = 30
            }

        }
    }
    doc.setFontSize(15);
    doc.text(120, 250, `Total de cartera: ${ingresar(suma)}`);
    doc.save(`Reporte${carteraVendedorA[0].vendedor}`);

}
const ReciboCaja = (element) => {

}