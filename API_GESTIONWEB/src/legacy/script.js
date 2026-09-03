
const loginSection = document.getElementById("login-section");
const appSection = document.getElementById("app");
const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const userInput = document.getElementById("user");
const passInput = document.getElementById("pass");
const loginError = document.getElementById("login-error");
const mainContent = document.getElementById("main-content");
const menuItems = document.querySelectorAll(".menu-item");

loginBtn.addEventListener("click", () => {
  const user = userInput.value.trim();
  const pass = passInput.value.trim();

  if (user === "benjamin" && pass === "1234") {
    loginSection.classList.add("hidden");
    appSection.classList.remove("hidden");
    loginError.textContent = "";
  } else {
    loginError.textContent = "Usuario o contraseña incorrectos.";
  }
});

logoutBtn.addEventListener("click", () => {
  appSection.classList.add("hidden");
  loginSection.classList.remove("hidden");
  userInput.value = "";
  passInput.value = "";
});


menuItems.forEach((item) => {
  item.addEventListener("click", (e) => {
    e.preventDefault();
    const section = item.getAttribute("data-section");
    cargarSeccion(section);
  });
});

function cargarSeccion(seccion) {
  if (seccion === "inicio") {
    mainContent.innerHTML = `<h2 class="titulo-central">Minería Verde</h2>`;
    return;
  }
///////////////////////////////// SECCIÓN EMPLEADOS //////////////////////////////////////////////////////////////////////////////////////////////////

if (seccion === "empleados") {
  mainContent.innerHTML = `
    <section class="empleados-section">
      <h2>Gestión de Empleados</h2>

      <div class="form-container">
        <h3>Alta de Empleado</h3>
        <form id="form-empleado">
          <input type="text" id="nombre" placeholder="Nombre" required>
          <input type="text" id="apellido" placeholder="Apellido" required>
          <input type="number" id="legajo" placeholder="Legajo" required>
          <input type="text" id="puesto" placeholder="Puesto" required>
          <input type="text" id="calle" placeholder="Calle" required>
          <input type="number" id="numero" placeholder="Número" required>
          <button type="submit">Guardar</button>
        </form>
      </div>

      <div class="tabla-container">
        <h3>Listado de Empleados</h3>
        <table id="tabla-empleados">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Legajo</th>
              <th>Puesto</th>
              <th>Calle</th>
              <th>Número</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
    </section>
  `;

  const form = document.getElementById("form-empleado");
  const tablaBody = document.querySelector("#tabla-empleados tbody");
  const API_BASE = "https://localhost:44320/api/empleados"; 

  let empleados = [];
  let editandoId = null; 

  

  async function cargarEmpleados() {
    const res = await fetch(API_BASE);
    empleados = await res.json();
    actualizarTabla(); 
  }

  async function crearEmpleado(emp) {
    await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(emp)
    });
    cargarEmpleados();
  }

  async function actualizarEmpleado(id, emp) {
    await fetch(`${API_BASE}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(emp)
    });
    cargarEmpleados();
  }

  async function eliminarEmpleado(id) {
    await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
    cargarEmpleados();
  }

 

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const emp = {
      Nombre: document.getElementById("nombre").value,  
      Apellido: document.getElementById("apellido").value,
      Legajo: parseInt(document.getElementById("legajo").value),
      Puesto: document.getElementById("puesto").value,
      Calle: document.getElementById("calle").value,
      Numero: parseInt(document.getElementById("numero").value)
    };

    if (editandoId) {
      await actualizarEmpleado(editandoId, emp);
      editandoId = null; 
    } else {
      await crearEmpleado(emp);
    }

    form.reset();
  });

  

  function actualizarTabla() {
    tablaBody.innerHTML = "";
    empleados.forEach((emp) => {
      const fila = `
        <tr>
          <td>${emp.Nombre}</td>
          <td>${emp.Apellido}</td>
          <td>${emp.Legajo}</td>
          <td>${emp.Puesto}</td>
          <td>${emp.Calle}</td>
          <td>${emp.Numero}</td>
          <td>
            <button class="editar-btn" data-id="${emp.Id}">Editar</button>
            <button class="eliminar-btn" data-id="${emp.Id}">Eliminar</button>
          </td>
        </tr>
      `;
      tablaBody.innerHTML += fila;
    });

  

    document.querySelectorAll(".editar-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = e.target.getAttribute("data-id");
        const emp = empleados.find(x => x.Id == id);

        document.getElementById("nombre").value = emp.Nombre;
        document.getElementById("apellido").value = emp.Apellido;
        document.getElementById("legajo").value = emp.Legajo;
        document.getElementById("puesto").value = emp.Puesto;
        document.getElementById("calle").value = emp.Calle;
        document.getElementById("numero").value = emp.Numero;

        editandoId = id; 
      });
    });

    document.querySelectorAll(".eliminar-btn").forEach(btn => {
      btn.addEventListener("click", async (e) => {
        const id = e.target.getAttribute("data-id");
        if (confirm("¿Desea eliminar este empleado?")) { 
          await eliminarEmpleado(id);
        }
      });
    });
  }

  cargarEmpleados();

  return;
}



  /////////////////////////////// SECCIÓN MAQUINARIA ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

if (seccion === "maquinaria") {
  mainContent.innerHTML = `
    <section class="maquinaria-section">
      <h2>Gestión de Maquinaria</h2>

      <div class="form-container">
        <h3>Alta de Maquinaria</h3>
        <form id="form-maquinaria">
          <input type="text" id="nombre-maq" placeholder="Nombre" required>
          <input type="text" id="dominio" placeholder="Dominio" required>
          <input type="number" id="anio" placeholder="Año" required>
          <input type="text" id="modelo" placeholder="Modelo" required>
          <button type="submit">Guardar</button>
        </form>
      </div>

      <div class="tabla-container">
        <h3>Listado de Maquinaria</h3>
        <table id="tabla-maquinaria">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Dominio</th>
              <th>Año</th>
              <th>Modelo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
    </section>
  `;

  const form = document.getElementById("form-maquinaria");
  const tablaBody = document.querySelector("#tabla-maquinaria tbody");
  const API_BASE = "https://localhost:44320/api/maquinas"; 
  let maquinas = [];
  let editandoId = null; 

  async function cargarMaquinas() {
    const res = await fetch(API_BASE);
    maquinas = await res.json();
    actualizarTabla(); 
  }

  async function crearMaquina(maq) {
    await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(maq)
    });
    cargarMaquinas();
  }

  async function actualizarMaquina(id, maq) {
    await fetch(`${API_BASE}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(maq)
    });
    cargarMaquinas();
  }

  async function eliminarMaquina(id) {
    await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
    cargarMaquinas();
  }


  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const maq = {
      Nombre: document.getElementById("nombre-maq").value,
      Dominio: document.getElementById("dominio").value,
      Anio: parseInt(document.getElementById("anio").value),
      Modelo: document.getElementById("modelo").value
    };

    if (editandoId) {
      await actualizarMaquina(editandoId, maq);
      editandoId = null; 
    } else {
      await crearMaquina(maq);
    }

    form.reset();
  });

 
  function actualizarTabla() {
    tablaBody.innerHTML = "";
    maquinas.forEach((maq) => {
      const fila = `
        <tr>
          <td>${maq.Nombre}</td>
          <td>${maq.Dominio}</td>
          <td>${maq.Anio}</td>
          <td>${maq.Modelo}</td>
          <td>
            <button class="editar-btn" data-id="${maq.Id}">Editar</button>
            <button class="eliminar-btn" data-id="${maq.Id}">Eliminar</button>
          </td>
        </tr>
      `;
      tablaBody.innerHTML += fila;
    });

    document.querySelectorAll(".editar-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = e.target.getAttribute("data-id");
        const maq = maquinas.find(x => x.Id == id);

        document.getElementById("nombre-maq").value = maq.Nombre;
        document.getElementById("dominio").value = maq.Dominio;
        document.getElementById("anio").value = maq.Anio;
        document.getElementById("modelo").value = maq.Modelo;

        editandoId = id; 
      });
    });

    
    document.querySelectorAll(".eliminar-btn").forEach(btn => {
      btn.addEventListener("click", async (e) => {
        const id = e.target.getAttribute("data-id");
        if (confirm("¿Desea eliminar esta máquina?")) {
          await eliminarMaquina(id);
        }
      });
    });
  }

  cargarMaquinas();

  return;
}


/////////////////////////////// SECCIÓN PROVEEDORES ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


if (seccion === "proveedores") {
  mainContent.innerHTML = `
    <section class="proveedores-section">
      <h2>Gestión de Proveedores</h2>

      <div class="form-container">
        <h3>Alta de Proveedor</h3>
        <form id="form-proveedor">
          <input type="text" id="cuit" placeholder="CUIT" required>
          <input type="text" id="razon-social" placeholder="Razón Social" required>
          <input type="text" id="condicion-iva" placeholder="Condición IVA" required>
          <input type="email" id="email" placeholder="Email" required>
          <input type="text" id="telefono" placeholder="Teléfono" required>
          <button type="submit">Guardar</button>
        </form>
      </div>

      <div class="tabla-container">
        <h3>Listado de Proveedores</h3>
        <table id="tabla-proveedores">
          <thead>
            <tr>
              <th>CUIT</th>
              <th>Razón Social</th>
              <th>Condición IVA</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
    </section>
  `;

  const form = document.getElementById("form-proveedor");
  const tablaBody = document.querySelector("#tabla-proveedores tbody");
  const API_BASE = "https://localhost:44320/api/proveedores"; 
  let proveedores = [];
  let editandoId = null; 

  async function cargarProveedores() {
    const res = await fetch(API_BASE);
    proveedores = await res.json();
    actualizarTabla();
  }

  async function crearProveedor(prov) {
    await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(prov)
    });
    cargarProveedores();
  }

  async function actualizarProveedor(id, prov) {
    await fetch(`${API_BASE}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(prov)
    });
    cargarProveedores();
  }

  async function eliminarProveedor(id) {
    if (confirm("¿Desea eliminar este proveedor?")) {
      await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
      cargarProveedores();
    }
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const prov = {
      Cuit: document.getElementById("cuit").value,
      Razon_Social: document.getElementById("razon-social").value,
      Condicion_Iva: document.getElementById("condicion-iva").value,
      Email: document.getElementById("email").value,
      Telefono: document.getElementById("telefono").value
    };

    if (editandoId) {
      actualizarProveedor(editandoId, prov);
      editandoId = null;
    } else {
      crearProveedor(prov);
    }

    form.reset();
  });

  function actualizarTabla() {
    tablaBody.innerHTML = "";
    proveedores.forEach((prov) => {
      const fila = `
        <tr>
          <td>${prov.Cuit}</td>
          <td>${prov.Razon_Social}</td>
          <td>${prov.Condicion_Iva}</td>
          <td>${prov.Email}</td>
          <td>${prov.Telefono}</td>
          <td>
            <button class="editar-btn" data-id="${prov.Id}">Editar</button>
            <button class="eliminar-btn" data-id="${prov.Id}">Eliminar</button>
          </td>
        </tr>
      `;
      tablaBody.innerHTML += fila;
    });

    document.querySelectorAll(".editar-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = e.target.getAttribute("data-id");
        const prov = proveedores.find(p => p.Id == id);

        document.getElementById("cuit").value = prov.Cuit;
        document.getElementById("razon-social").value = prov.Razon_Social;
        document.getElementById("condicion-iva").value = prov.Condicion_Iva;
        document.getElementById("email").value = prov.Email;
        document.getElementById("telefono").value = prov.Telefono;

        editandoId = id;
      });
    });

    document.querySelectorAll(".eliminar-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = e.target.getAttribute("data-id");
        eliminarProveedor(id);
      });
    });
  }

  cargarProveedores();
  return;
}




/////////////////////////////// SECCIÓN MOVIMIENTOS //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

if (seccion === "movimientos") {
  mainContent.innerHTML = `
    <section class="movimientos-section">
      <h2>Gestión de Movimientos</h2>

      <div class="form-container">
        <h3>Alta de Movimiento</h3>
        <form id="form-movimientos">
          <input type="number" id="id-empleado" placeholder="ID Empleado" required>
          <input type="text" id="tipo-movimiento" placeholder="Tipo de Movimiento" required>
          <input type="date" id="fecha" required>
          <input type="number" id="cantidad" placeholder="Cantidad" required>
          <input type="text" id="prestamo" placeholder="Préstamo">
          <input type="text" id="ajuste" placeholder="Ajuste">
          <input type="number" id="id-repuesto" placeholder="ID Repuesto" required>
          <input type="number" id="id-maquina" placeholder="ID Máquina" required>
          <input type="number" id="id-stock" placeholder="ID Stock" required>
          <button type="submit">Guardar</button>
        </form>
      </div>

      <div class="tabla-container">
        <h3>Listado de Movimientos</h3>
        <table id="tabla-movimientos">
          <thead>
            <tr>
              <th>ID Empleado</th>
              <th>Tipo</th>
              <th>Fecha</th>
              <th>Cantidad</th>
              <th>Préstamo</th>
              <th>Ajuste</th>
              <th>ID Repuesto</th>
              <th>ID Máquina</th>
              <th>ID Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
    </section>
  `;

  const form = document.getElementById("form-movimientos");
  const tablaBody = document.querySelector("#tabla-movimientos tbody");
  const API_BASE = "https://localhost:44320/api/movimientos";
  let movimientos = [];
  let editandoId = null; 

  async function cargarMovimientos() {
    const res = await fetch(API_BASE);
    movimientos = await res.json();
    actualizarTabla();
  }

  async function crearMovimiento(mov) {
    await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mov)
    });
    cargarMovimientos();
  }

  async function actualizarMovimiento(id, mov) {
    await fetch(`${API_BASE}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mov)
    });
    cargarMovimientos();
  }

  async function eliminarMovimiento(id) {
    if (confirm("¿Desea eliminar este movimiento?")) {
      await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
      cargarMovimientos();
    }
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const mov = {
      IdEmpleado: parseInt(document.getElementById("id-empleado").value),
      Tipo_de_Movimiento: document.getElementById("tipo-movimiento").value,
      Fecha: document.getElementById("fecha").value,
      Cantidad: parseInt(document.getElementById("cantidad").value),
      Prestamo: document.getElementById("prestamo").value,
      Ajuste: document.getElementById("ajuste").value,
      IdRepuesto: parseInt(document.getElementById("id-repuesto").value),
      IdMaquina: parseInt(document.getElementById("id-maquina").value),
      IdStock: parseInt(document.getElementById("id-stock").value)
    };

    if (editandoId) {
      actualizarMovimiento(editandoId, mov);
      editandoId = null;
    } else {
      crearMovimiento(mov);
    }

    form.reset();
  });

  function actualizarTabla() {
    tablaBody.innerHTML = "";
    movimientos.forEach((mov) => {
      const fila = `
        <tr>
          <td>${mov.IdEmpleado}</td>
          <td>${mov.Tipo_de_Movimiento}</td>
          <td>${mov.Fecha}</td>
          <td>${mov.Cantidad}</td>
          <td>${mov.Prestamo}</td>
          <td>${mov.Ajuste}</td>
          <td>${mov.IdRepuesto}</td>
          <td>${mov.IdMaquina}</td>
          <td>${mov.IdStock}</td>
          <td>
            <button class="editar-btn" data-id="${mov.Id}">Editar</button>
            <button class="eliminar-btn" data-id="${mov.Id}">Eliminar</button>
          </td>
        </tr>
      `;
      tablaBody.innerHTML += fila;
    });

    document.querySelectorAll(".editar-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = e.target.getAttribute("data-id");
        const mov = movimientos.find(m => m.Id == id);

        document.getElementById("id-empleado").value = mov.IdEmpleado;
        document.getElementById("tipo-movimiento").value = mov.Tipo_de_Movimiento;
        document.getElementById("fecha").value = mov.Fecha;
        document.getElementById("cantidad").value = mov.Cantidad;
        document.getElementById("prestamo").value = mov.Prestamo;
        document.getElementById("ajuste").value = mov.Ajuste;
        document.getElementById("id-repuesto").value = mov.IdRepuesto;
        document.getElementById("id-maquina").value = mov.IdMaquina;
        document.getElementById("id-stock").value = mov.IdStock;

        editandoId = id;
      });
    });

    document.querySelectorAll(".eliminar-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = e.target.getAttribute("data-id");
        eliminarMovimiento(id);
      });
    });
  }

  cargarMovimientos();
  return;
}

/////////////////////////////// SECCIÓN REPUESTOS /////////////////////////////////////////////////////////////////////

if (seccion === "repuestos") {
  mainContent.innerHTML = `
    <section class="repuestos-section">
      <h2>Gestión de Repuestos</h2>

      <div class="form-container">
        <h3>Alta de Repuesto</h3>
        <form id="form-repuesto">                    
          <input type="text" id="nombre" placeholder="Nombre" required>
          <input type="number" id="precio" placeholder="Precio" required>
          <input type="text" id="oem" placeholder="OEM" required>
          <input type="text" id="unidad_medida" placeholder="Unidad de medida" required>
          <input type="number" id="cantidad" placeholder="Cantidad" required>
          <input type="number" id="id_proveedor" placeholder="ID Proveedor" required>
          <button type="submit">Guardar</button>
        </form>
      </div>

      <div class="tabla-container">
        <h3>Listado de Repuestos</h3>
        <table id="tabla-repuestos">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Precio</th>
              <th>OEM</th>
              <th>Unidad de medida</th>
              <th>Cantidad</th>
              <th>ID Proveedor</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
    </section>
  `;

  const form = document.getElementById("form-repuesto");
  const tablaBody = document.querySelector("#tabla-repuestos tbody");
  const API_BASE = "https://localhost:44320/api/repuestos";
  let repuestos = [];
  let editandoId = null;

 
  async function cargarRepuestos() {
    try {
      const res = await fetch(API_BASE);
      repuestos = await res.json();
      actualizarTabla();
    } catch (error) {
      console.error("Error cargando repuestos:", error);
    }
  }


  async function crearRepuesto(rep) {
    try {
      await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rep)
      });
      cargarRepuestos();
    } catch (error) {
      console.error("Error creando repuesto:", error);
    }
  }

  async function actualizarRepuesto(id, rep) {
    try {
      await fetch(`${API_BASE}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rep)
      });
      cargarRepuestos();
    } catch (error) {
      console.error("Error actualizando repuesto:", error);
    }
  }

  
  async function eliminarRepuesto(id) {
    if (confirm("¿Desea eliminar este repuesto?")) {
      try {
        await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
        cargarRepuestos();
      } catch (error) {
        console.error("Error eliminando repuesto:", error);
      }
    }
  }

  
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const rep = {
      Nombre: document.getElementById("nombre")?.value || "",
      Precio: parseFloat(document.getElementById("precio")?.value) || 0,
      OEM: document.getElementById("oem")?.value || "",
      Unidad_de_Medida: document.getElementById("unidad_medida")?.value || "",
      Cantidad: parseInt(document.getElementById("cantidad")?.value) || 0,
      Id_Proveedor: parseInt(document.getElementById("id_proveedor")?.value) || 0
    };

    if (editandoId) {
      actualizarRepuesto(editandoId, rep);
      editandoId = null;
    } else {
      crearRepuesto(rep);
    }

    form.reset();
  });

  function actualizarTabla() {
    tablaBody.innerHTML = "";
    repuestos.forEach((rep) => {
      const fila = `
        <tr>
          <td>${rep.Nombre}</td>
          <td>${rep.Precio}</td>
          <td>${rep.OEM}</td>
          <td>${rep.Unidad_de_Medida}</td>
          <td>${rep.Cantidad}</td>
          <td>${rep.Id_Proveedor}</td>
          <td>
            <button class="editar-btn" data-id="${rep.Id}">Editar</button>
            <button class="eliminar-btn" data-id="${rep.Id}">Eliminar</button>
          </td>
        </tr>
      `;
      tablaBody.innerHTML += fila;
    });

    document.querySelectorAll(".editar-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = e.target.getAttribute("data-id");
        const rep = repuestos.find(r => r.Id == id);

       
        const nombreEl = document.getElementById("nombre");
        const precioEl = document.getElementById("precio");
        const oemEl = document.getElementById("oem");
        const unidadEl = document.getElementById("unidad_medida");
        const cantidadEl = document.getElementById("cantidad");
        const proveedorEl = document.getElementById("id_proveedor");

        if (nombreEl) nombreEl.value = rep.Nombre;
        if (precioEl) precioEl.value = rep.Precio;
        if (oemEl) oemEl.value = rep.OEM;
        if (unidadEl) unidadEl.value = rep.Unidad_de_Medida;
        if (cantidadEl) cantidadEl.value = rep.Cantidad;
        if (proveedorEl) proveedorEl.value = rep.Id_Proveedor;

        editandoId = id;
      });
    });

    document.querySelectorAll(".eliminar-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = e.target.getAttribute("data-id");
        eliminarRepuesto(id);
      });
    });
  }

  // Carga inicial
  cargarRepuestos();
  return;
}


/////////////////////////////// SECCIÓN STOCK /////////////////////////////////////////////////////////////////////

if (seccion === "stock") {
  mainContent.innerHTML = `
    <section class="stock-section">
      <h2>Gestión de Stock</h2>

      <div class="form-container">
        <h3>Alta de Stock</h3>
        <form id="form-stock">
          <input type="text" id="nombre" placeholder="Nombre" required> 
          <input type="number" id="cantidad" placeholder="Cantidad" required>
          <input type="number" id="id-repuesto" placeholder="ID Repuesto" required>
          <input type="number" id="id-maquina" placeholder="ID Máquina" required>
          <button type="submit">Guardar</button>
        </form>
      </div>

      <div class="tabla-container">
        <h3>Listado de Stock</h3>
        <table id="tabla-stock">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Cantidad</th>
              <th>ID Repuesto</th>
              <th>ID Máquina</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
    </section>
  `;

  const form = document.getElementById("form-stock");
  const tablaBody = document.querySelector("#tabla-stock tbody");
  const API_BASE = "https://localhost:44320/api/Stock";
  let stocks = [];
  let editandoId = null;

  async function cargarStock() {
    const res = await fetch(API_BASE);
    stocks = await res.json();
    actualizarTabla();
  }

  async function crearStock(st) {
    await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(st)
    });
    cargarStock();
  }

  async function actualizarStock(id, st) {
    await fetch(`${API_BASE}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(st)
    });
    cargarStock();
  }

  async function eliminarStock(id) {
    if (confirm("¿Desea eliminar este stock?")) {
      await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
      cargarStock();
    }
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const st = {
      Nombre: document.getElementById("nombre").value,
      Cantidad: parseInt(document.getElementById("cantidad").value),
      Id_Repuesto: parseInt(document.getElementById("id-repuesto").value),
      Id_Maquina: parseInt(document.getElementById("id-maquina").value)
    };

    if (editandoId) {
      actualizarStock(editandoId, st);
      editandoId = null;
    } else {
      crearStock(st);
    }

    form.reset();
  });

  function actualizarTabla() {
    tablaBody.innerHTML = "";
    stocks.forEach((st) => {
      const fila = `
        <tr>
          <td>${st.Nombre}</td>
          <td>${st.Cantidad}</td>
          <td>${st.Id_Repuesto}</td>
          <td>${st.Id_Maquina}</td>
          <td>
            <button class="editar-btn" data-id="${st.Id}">Editar</button>
            <button class="eliminar-btn" data-id="${st.Id}">Eliminar</button>
          </td>
        </tr>
      `;
      tablaBody.innerHTML += fila;
    });

    document.querySelectorAll(".editar-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = e.target.getAttribute("data-id");
        const st = stocks.find(s => s.Id == id);

        document.getElementById("nombre").value = st.Nombre;
        document.getElementById("cantidad").value = st.Cantidad;
        document.getElementById("id-repuesto").value = st.Id_Repuesto;
        document.getElementById("id-maquina").value = st.Id_Maquina;

        editandoId = id;
      });
    });

    document.querySelectorAll(".eliminar-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = e.target.getAttribute("data-id");
        eliminarStock(id);
      });
    });
  }

  cargarStock();
  return;
}}