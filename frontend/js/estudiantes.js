const ESTUDIANTE_ENDPOINT = "http://127.0.0.1:8000/api/appEstudiante";
const NOTA_ENDPOINT = "http://127.0.0.1:8000/api/appNota";
const table = document.getElementById("estudiantes");
const est = document.getElementById("estadisticas");
const estTitulo = document.getElementById("estTitulo");

let aprobados = 0;
let noAprobados = 0;
let sinNotas = 0;

// ------ funciones para la tabla -----------
const getNotaDef = async (cod) => {
  try {
    const response = await fetch(`${NOTA_ENDPOINT}/notas/estudiante/${cod}`);
    const body = await response.json();
    const notas = body.data;

    const acumulado = notas.reduce((acc, nota) => acc + parseFloat(nota.nota), 0);
    const divisor = notas.length;

    if (divisor > 0) {
      const resultado = acumulado / divisor;
      return resultado.toString();
    } else {
      return "Sin notas";
    }
  } catch (error) {
    console.error("Error al obtener las notas:", error);
    return "Error";
  }
};

const getEstado = (notaDef) => {
  if (notaDef >= 3 && notaDef <= 5) {
    return "Aprobado";
  } else if (notaDef >= 0 && notaDef < 3) {
    return "No aprobado";
  } else {
    return "Sin notas";
  }
};

const mostrarEst = () => {
  const stats = {
    aprobados: aprobados,
    noAprobados: noAprobados,
    sinNotas: sinNotas
  };

  Object.entries(stats).forEach(([key, value]) => {
    const p = document.createElement("p");
    p.id = key;
    p.textContent = `${key}: ${value}`;
    est.appendChild(p);
  });
};

const leerEstudiantes = async () => {
  try {
    const response = await fetch(`${ESTUDIANTE_ENDPOINT}/estudiantes`);
    const body = await response.json();
    const estudiantes = body.data;
    const tbody = table.getElementsByTagName("tbody")[0];
    tbody.innerHTML = "";
    estTitulo.textContent = "Cargando listado de estudiantes...";

    estudiantes.forEach(async (estudiante) => {
      const tr = document.createElement("tr");

      const codTd = document.createElement("td");
      codTd.textContent = estudiante.cod;
      const nombreTd = document.createElement("td");
      nombreTd.textContent = estudiante.nombres;
      const emailTd = document.createElement("td");
      emailTd.textContent = estudiante.email;

      const defTd = document.createElement("td");
      const definitiva = await getNotaDef(estudiante.cod);
      defTd.textContent = definitiva;

      const estadoTd = document.createElement("td");
      estadoTd.textContent = getEstado(parseFloat(defTd.textContent));

      const verNotasTd = document.createElement("td");
      const btnVerNotas = document.createElement("button");
      btnVerNotas.textContent = "Ver Notas";
      btnVerNotas.className = "btn btn-ver-notas";
      btnVerNotas.addEventListener("click", () => {
        window.location.href = `notas.html?codigo=${estudiante.cod}&nombre=${estudiante.nombres}&email=${estudiante.email}`;
      });

      verNotasTd.appendChild(btnVerNotas);

      tr.appendChild(codTd);
      tr.appendChild(nombreTd);
      tr.appendChild(emailTd);
      tr.appendChild(defTd);
      tr.appendChild(estadoTd);
      tr.appendChild(verNotasTd);
      tbody.appendChild(tr);
    });

    mostrarEst();
  } catch (error) {
    console.error("Error al leer los estudiantes:", error);
  }
};

leerEstudiantes();