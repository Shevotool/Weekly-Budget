"use strict";

// Variables y Selectores
const formulario = document.querySelector("#agregar-gasto");
const gastoListado = document.querySelector("#gastos ul");
const budgetBtn = document.querySelector("#budget");
const clearBtn = document.querySelector("#clear");
document.querySelector("#total").textContent = "0";
document.querySelector("#restante").textContent = "0";

// Eventos
eventListeners();
function eventListeners() {
  formulario.addEventListener("submit", agregarGasto);
  // gastosListado.addEventListener("click", eliminarGasto);
  budgetBtn.addEventListener("click", function (e) {
    e.preventDefault();
    openModal();
  });

  clearBtn.addEventListener("click", function (e) {
    e.preventDefault();
    clearForm();
  });
}

// Classes
class Presupuesto {
  constructor(presupuesto) {
    this.presupuesto = Number(presupuesto);
    this.restante = Number(presupuesto);
    this.gastos = [];
  }

  reiniciarGastos() {
    this.gastos = [];
    this.restante = this.presupuesto;
  }

  nuevoGasto(gasto) {
    this.gastos = [...this.gastos, gasto];
    this.calcularRestante();
  }

  calcularRestante() {
    const gastado = this.gastos.reduce(
      (total, gasto) => total + gasto.cantidad,
      0
    );
    this.restante = this.presupuesto - gastado;
  }

  eliminarGasto(id) {
    this.gastos = this.gastos.filter((gasto) => gasto.id !== id);
    this.calcularRestante();

    localStorage.setItem("presupuesto", JSON.stringify(this));
  }
}

class IU {
  insertarPresupuesto(cantidad) {
    // Extrayendo los valores
    const { presupuesto, restante } = cantidad;

    // Agregamos al HTML
    document.querySelector("#total").textContent = presupuesto;
    document.querySelector("#restante").textContent = restante;
    const list = document.querySelector("ul");
    list.style.fontSize = "2rem";
  }

  imprimirAlerta(mensaje, tipo) {
    // crear el div
    const divMensaje = document.createElement("div");
    divMensaje.classList.add("text-center", "alert");

    if (tipo === "error") {
      divMensaje.classList.add("alert-danger");
    } else {
      divMensaje.classList.add("alert-success");
    }

    // Mensaje de error
    divMensaje.textContent = mensaje;
    divMensaje.style.fontSize = "2.2rem";

    // Insertar en el HTML
    document.querySelector(".primario").insertBefore(divMensaje, formulario);
    //document.querySelector('button[type="submit"]').disabled = true;
    // Quitar del HTML
    setTimeout(() => {
      divMensaje.remove();
    }, 2000);
  }

  mostrarGastos(gastos) {
    this.limpiarHTML(); // Elimina el HTML previo

    // Iterar sobre los gastos
    gastos.forEach((gasto) => {
      const { nombre, cantidad, id } = gasto;

      // Crear LI
      const nuevoGasto = document.createElement("li");
      nuevoGasto.className =
        "list-group-item d-flex justify-content-between align-items-center";
      nuevoGasto.dataset.id = id;

      // Agregar el HTML del gasto
      nuevoGasto.innerHTML = `
      ${nombre} <span class="badge badge-primary badge-pill"> $ ${cantidad} </span>`;

      // Boton para borrar el gasto
      const btnBorrar = document.createElement("button");
      btnBorrar.classList.add("btn", "btn-danger", "borrar-gasto");
      btnBorrar.innerHTML = "Delete &times";

      btnBorrar.onclick = () => {
        presupuesto.eliminarGasto(id);
        this.mostrarGastos(presupuesto.gastos, presupuesto);
        ui.actualizarRestante(presupuesto.restante);
        ui.comprobarPresupuesto(presupuesto);
      };

      nuevoGasto.appendChild(btnBorrar);

      // Agregar al HTML
      gastoListado.appendChild(nuevoGasto);
    });
  }
  limpiarHTML() {
    while (gastoListado.firstChild) {
      gastoListado.removeChild(gastoListado.firstChild);
    }
  }

  actualizarRestante(restante) {
    document.querySelector("#restante").textContent = restante;
  }

  comprobarPresupuesto(presupuestoObj) {
    const { presupuesto, restante } = presupuestoObj;

    const restanteDiv = document.querySelector(".restante");

    // Comprobar 25%
    if (presupuesto / 4 > restante) {
      restanteDiv.classList.remove("alert-success", "alert-warning");
      restanteDiv.classList.add("alert-danger");
    } else if (presupuesto / 2 > restante) {
      restanteDiv.classList.remove("alert-success");
      restanteDiv.classList.add("alert-warning");
    } else {
      restanteDiv.classList.remove("alert-danger", "alert-warning");
      restanteDiv.classList.add("alert-success");
    }

    // Si el total es 0 o menor
    if (restante <= 0) {
      ui.imprimirAlerta("The budget has been finished", "error");

      formulario.querySelector('button[type="submit"]').disabled = true;
    }
  }
}

// Instanciar
const ui = new IU();
let presupuesto = new Presupuesto(0);

// Local storage
const presupuestoGuardado = localStorage.getItem("presupuesto");
if (presupuestoGuardado) {
  const presupuestoParseado = JSON.parse(presupuestoGuardado);
  presupuesto = new Presupuesto(presupuestoParseado.presupuesto);
  presupuesto.restante = presupuestoParseado.restante;
  presupuesto.gastos = presupuestoParseado.gastos;

  ui.insertarPresupuesto(presupuesto);
  ui.mostrarGastos(presupuesto.gastos, presupuesto);
  ui.actualizarRestante(presupuesto.restante);
  ui.comprobarPresupuesto(presupuesto);
} else {
  presupuesto = {};
}

// Funciones
let popupAparecido = false;

// Modal nuevo presupuesto
function alertaPopup() {
  if (popupAparecido) {
    return;
  }

  // crear el div
  const divMensaje = document.createElement("div");
  divMensaje.classList.add("text-center", "alert");

  // Mensaje de error
  const mensajePopup = "Invalid amount";
  divMensaje.textContent = mensajePopup;
  divMensaje.style.fontSize = "1.6rem";
  divMensaje.classList.add("alert-danger");
  divMensaje.style.width = "50%";
  divMensaje.style.margin = "0 auto";
  divMensaje.style.marginBottom = "2rem";

  // Insertar en el HTML
  document.querySelector("#mensaje-container").appendChild(divMensaje);
  popupAparecido = true;
  // Quitar del HTML
  setTimeout(() => {
    divMensaje.remove();
    popupAparecido = false;
  }, 2000);
}

function eliminarGastosAnteriores() {
  // Eliminar gastos del local storage
  localStorage.removeItem("presupuesto");

  // Eliminar gastos del HTML
  ui.limpiarHTML();
}

// Modal Preguntar presupuesto
function openModal() {
  const modal = document.querySelector("#myModal");
  modal.style.display = "block";

  const closeBtn = document.querySelector(".modal-close");
  closeBtn.onclick = function () {
    modal.style.display = "none";
  };

  const budgetInput = document.querySelector("#budget-input");
  const submitBtn = document.querySelector("#submit-btn");

  if (submitBtn) {
    budgetInput.value = "";
  }

  submitBtn.onclick = function () {
    const presupuestoUsuario = budgetInput.value;

    if (budgetInput.value === "" || budgetInput.value <= 0) {
      alertaPopup();
    } else {
      // Eliminar los gastos al recargar
      eliminarGastosAnteriores();

      presupuesto = new Presupuesto(presupuestoUsuario);
      ui.insertarPresupuesto(presupuesto);
      modal.style.display = "none";
      eliminarGastosAnteriores();
    }
  };

  budgetInput.onkeyup = function () {
    if (budgetInput.value === "") {
      submitBtn.disabled = true;
    } else {
      submitBtn.disabled = false;
    }
  };
}

// Agrega gastos
function agregarGasto(e) {
  e.preventDefault();

  // Leer los datos del formulario
  const nombre = document.querySelector("#gasto").value;
  const cantidad = Number(document.querySelector("#cantidad").value);

  // Validar
  if (nombre === "" || cantidad === "") {
    ui.imprimirAlerta("Both fields are required.", "error");
    return;
  } else if (cantidad <= 0 || isNaN(cantidad)) {
    ui.imprimirAlerta("Invalid amount.", "error");
    return formulario.reset();
  }

  if (!presupuesto || !(presupuesto instanceof Presupuesto)) {
    ui.imprimirAlerta("Please create a budget first.", "error");
    return formulario.reset();
  }

  // Verificar si el gasto excede el presupuesto restante
  if (cantidad > presupuesto.restante) {
    ui.imprimirAlerta("Invalid amount.", "error");
    return formulario.reset();
  }

  // Generar un objeto con el gasto...
  const gasto = { nombre, cantidad, id: Date.now() };

  // Agrega un nuevo gasto
  presupuesto.nuevoGasto(gasto);

  // Agregar el presupuesto a local storage
  localStorage.setItem("presupuesto", JSON.stringify(presupuesto));

  // Mensaje de todo bien!
  ui.imprimirAlerta("Expense added successfully.");

  // Imprimir los gastos
  const { gastos, restante } = presupuesto;
  ui.mostrarGastos(gastos);

  ui.actualizarRestante(restante);

  ui.comprobarPresupuesto(presupuesto);

  // Reinicia el formulario
  formulario.reset();
}

function eliminarGasto(id) {
  // Elimina del objeto
  presupuesto.eliminarGasto(id);

  // Elimina el presupuesto a local storage
  localStorage.setItem("presupuesto", JSON.stringify(presupuesto));

  // Elimina los gastos del HTML
  const { gastos, restante } = presupuesto;
  ui.mostrarGastos(gastos);
  ui.actualizarRestante(restante);
  ui.comprobarPresupuesto(presupuesto);
  formulario.querySelector('button[type="submit"]').disabled = false; // Para volver a habilitar el boton
}

function clearForm() {
  presupuesto.gastos = []; // Vaciar el array de gastos
  presupuesto.restante = presupuesto.presupuesto; // Reiniciar el restante al valor original
  ui.actualizarRestante(presupuesto.restante);
  ui.mostrarGastos(presupuesto.gastos); // Mostrar los gastos vacíos en el UI
  ui.comprobarPresupuesto(presupuesto);
  formulario.reset();
  document.querySelector("#total").textContent = "0";
  document.querySelector("#restante").textContent = "0";

  // Restablecer el presupuesto a cero
  presupuesto.restante = 0;

  // Eliminar el presupuesto del localStorage
  localStorage.removeItem("presupuesto");

  const cantidad = Number(document.querySelector("#cantidad").value);
  if (cantidad <= 0 || isNaN(cantidad)) {
    return;
  }
}
