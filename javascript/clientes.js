async function hacerRegistroCliente() {
    event.preventDefault();
    var nit = document.getElementById("nit").value;
    var RazonSocial = document.getElementById("RazonSocial").value;
    var Direccion = document.getElementById("Direccion").value;
    var telefono = document.getElementById("telefono").value;
    var ciudad = document.getElementById("ciudad").value;
    var barrio = document.getElementById("barrio").value;
    var plazo = document.getElementById("plazo").value;
    var vendedor = document.getElementById("vendedor").value;
    plazo = parseInt(plazo, 10);
    if (nit != "" && RazonSocial != "" && Direccion != "" && plazo != NaN && vendedor != "" && telefono != "" && ciudad != "" && barrio != "") {

        db.collection("clientes").doc(nit).set({
            nit,
            RazonSocial,
            Direccion,
            vendedor,
            telefono,
            ciudad,
            barrio,
            plazo
        })
        Swal.fire('Guardado!', '', 'success');
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Campos en blanco',
            text: 'Al parecer no llenaste los campos obligatorios',

        })
    }

}
async function hacerRegistroMiCliente() {
    event.preventDefault();
    var nit = document.getElementById("nit").value;
    var RazonSocial = document.getElementById("RazonSocial").value;
    var Direccion = document.getElementById("Direccion").value;
    var telefono = document.getElementById("telefono").value;
    var ciudad = document.getElementById("ciudad").value;
    var barrio = document.getElementById("barrio").value;
    var plazo = document.getElementById("plazo").value;
    plazo = parseInt(plazo, 10);
    if (nit != "" && RazonSocial != "" && Direccion != "" && plazo != NaN && telefono != "" && ciudad != "" && barrio != "") {
        vendedor = firebase.auth().currentUser;
        vendedor = vendedor.uid;
        db.collection("clientes").doc(nit).set({
            nit,
            RazonSocial,
            Direccion,
            vendedor,
            telefono,
            ciudad,
            barrio,
            plazo
        })
        Swal.fire('Guardado!', '', 'success');
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Campos en blanco',
            text: 'Al parecer no llenaste los campos obligatorios',

        })
    }
}
async function EditarCliente(element) {
    event.preventDefault();
    var login = document.getElementById("login-page");
    login.innerHTML = "";
    var main = document.getElementById("main");
    main.innerHTML = `<center><div class="col-md-10" >
    <div class="card">
        <div class="card-body" id="contenido3">
            <form>
                <div class="form-gruop">
                    <h3>Registrar Cliente</h3>
                    <br><hr><br>
                </div>
                <div class="form-group">
                    <h5>Nit del cliente*</h5>
                    <input type="text" id="nit" class="form-control" placeholder="Nit*">
                </div>
                <div class="form-group">
                    <h5>Razón Social*</h5>
                    <input type="text" id="RazonSocial" class="form-control" placeholder="Razon Social*">
                </div>
                <div class="form-group">
                    <h5>Direccion*</h5>
                    <input type="text" id="Direccion" class="form-control" placeholder="Direccion*">
                </div>
                <div class="form-group">
                    <h5>Teléfono*</h5>
                    <input type="text" id="telefono" class="form-control" placeholder="teléfono*">
                </div>
                <div class="form-group">
                    <h5>Ciudad*</h5>
                    <input type="text" id="ciudad" class="form-control" placeholder="Ciudad*">
                </div>
                <div class="form-group">
                    <h5>Barrio*</h5>
                    <input type="text" id="barrio" class="form-control" placeholder="Barrio*">
                </div>
                <div class="form-group">
                    <h5>Plazo de pago*</h5>
                    <input type="number" id="plazo" class="form-control" placeholder="Plazo de pago en días*">
                </div>
                    <div class="form-group">
                    <h5>Vendedor*</h5>
                    <input list="vendedores" id="vendedor" class="form-control" placeholder="Vendedor*">
                    <datalist id="vendedores">
                        <option>Seleccione el vendedor</option>
                    </datalist>
                </div>
                
                <br>
                <div id="botonE">
                    <button onclick="GuardarCambiosCliente()" class="btn btn-danger" id="btn-task-form">
                        Guardar cambios
                    </button>
                </div>

            </form>
        </div>
    </div>
</div>
<br><hr><br></center>`;
    var querySnapshot = await obtenerVendedores1();
    var vendedores = document.getElementById("vendedores");
    querySnapshot.forEach(doc => {
        var datos = doc.data();
        var option = document.createElement("option");
        option.value = doc.id;
        option.text = `${datos.nombre}` + ` ` + `${datos.apellido}`
        vendedores.appendChild(option);
    })


    var nit = document.getElementById("nit");
    var RazonSocial = document.getElementById("RazonSocial");
    var Direccion = document.getElementById("Direccion");
    var telefono = document.getElementById("telefono");
    var ciudad = document.getElementById("ciudad");
    var barrio = document.getElementById("barrio");
    var plazo = document.getElementById("plazo");
    var vendedor = document.getElementById("vendedor");
    db.collection("clientes").where("nit", "==", element.id).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            var datos = doc.data();
            nit.value = datos.nit;
            RazonSocial.value = datos.RazonSocial;
            Direccion.value = datos.Direccion;
            telefono.value = datos.telefono;
            ciudad.value = datos.ciudad;
            barrio.value = datos.barrio;
            plazo.value = datos.plazo;
            vendedor.value = datos.vendedor;
        })
    })
}
function GuardarCambiosCliente() {
    event.preventDefault();
    var nit = document.getElementById("nit").value;
    var RazonSocial = document.getElementById("RazonSocial").value;
    var Direccion = document.getElementById("Direccion").value;
    var telefono = document.getElementById("telefono").value;
    var ciudad = document.getElementById("ciudad").value;
    var barrio = document.getElementById("barrio").value;
    var plazo = document.getElementById("plazo").value;
    var vendedor = document.getElementById("vendedor").value;
    plazo = parseInt(plazo, 10);

    if (nit != "" && RazonSocial != "" && Direccion != "" && plazo != NaN && vendedor != "" && telefono != "" && ciudad != "" && barrio != "") {
        db.collection("clientes").where("nit", "==", nit).get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                var datos = doc.data();

            })
            db.collection("clientes").doc(nit).set({
                nit,
                RazonSocial,
                Direccion,
                vendedor,
                telefono,
                ciudad,
                barrio,
                plazo
            })
            Swal.fire('Guardado!', '', 'success');
        })
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Campos en blanco',
            text: 'Al parecer no llenaste los campos obligatorios',

        })
    }
}
function EliminarCliente(element) {
    Swal.fire({
        title: '¿Quieres borrar el cliente?',
        showDenyButton: true,
        confirmButtonText: `borrar`,
        denyButtonText: `No borrar`,
    }).then((result) => {
        if (result.isConfirmed) {
            db.collection("clientes").doc(element.id).delete();
            Swal.fire('Borrado!', '', 'success');
        }
    })
}
const clienteVendedor = (id) => db.collection("clientes").where("vendedor", "==", id).get();
const CambiarVendedor = async () => {
    Swal.fire({
        title: 'Estas segur@?',
        text: "Los clientes del emisor, pasarán a ser del receptor.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, Trasladar!'
    }).then(async (result) => {
        if (result.isConfirmed) {
            let emisores = document.getElementsByName("Emisores");
            let Receptores = document.getElementsByName("Receptores");
            let emisor;
            let Receptor;
            for (let i = 0; i < emisores.length; i++) {
                let e = document.getElementById(emisores[i].id);
           
                if (e.checked) {
                    emisor = e.value;
                }
            }
            for (let i = 0; i < Receptores.length; i++) {
                let r = document.getElementById(Receptores[i].id);
               
                if (r.checked) {
                    Receptor = r.value;
                }
            }
            if (emisor != undefined && Receptor != undefined) {


                let clientes = await clienteVendedor(emisor);
                clientes.forEach(doc => {
                    let datos = doc.data();
                    let nit = datos.nit;
                    let RazonSocial = datos.RazonSocial;
                    let Direccion = datos.Direccion;
                    let vendedor = Receptor;
                    let telefono = datos.telefono;
                    let ciudad = datos.ciudad;
                    let barrio = datos.barrio;
                    let plazo = datos.plazo;
                    db.collection("clientes").doc(nit).set({
                        nit,
                        RazonSocial,
                        Direccion,
                        vendedor,
                        telefono,
                        ciudad,
                        barrio,
                        plazo
                    })
                })
                Swal.fire(
                    'Trasladado!',
                    'Los clientes han sido trasladados de vendedor.',
                    'success'
                )
            } else {
                Swal.fire(
                    'Seleccionar Emisor y Receptor!',
                    'Para poder realizar este proceso debe seleccionar el emisor y el receptor.',
                    'info'
                )
            }
        }
    })

}
