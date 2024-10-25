// diagnosticos.js

document.addEventListener("DOMContentLoaded", () => {
    const diagnosisCreateForm = document.getElementById("diagnosis-create-form");
    const readBtn = document.getElementById("read-btn");
    const updateBtn = document.getElementById("update-btn");
    const diagnosisTable = document.getElementById("diagnosis-table").getElementsByTagName('tbody')[0];
    const readOutput = document.getElementById("read-output");
    const updatediaG_IDSelect = document.getElementById("update-diag-id");
    const diagnosSection = document.getElementById("diagnosticos");
    const diagBtn = document.getElementById("diag-btn"); // Selecciona el botón de diagnósticos

    // Función para cargar Diagnósticos
    function loadDiagnoses() {
        fetch('https://localhost:7299/apiDiagnosis') // Cambia esta URL a tu API
            .then(response => response.json())
            .then(data => {
                diagnosisTable.innerHTML = ""; // Limpiar tabla
                updatediaG_IDSelect.innerHTML = ""; // Limpiar select para actualización
                data.forEach(diagnosis => {
                    const row = diagnosisTable.insertRow();
                    row.innerHTML = `
                        <td>${diagnosis.diaG_ID}</td>
                        <td>${diagnosis.diagdsc}</td>
                        <td>
                            <button onclick="visualizeDiagnosis(${diagnosis.diaG_ID}, '${diagnosis.diagdsc}')">Visualizar</button>
                        </td>
                    `;
                    
                    // Agregar opción al select de actualización
                    const option = document.createElement("option");
                    option.value = diagnosis.diaG_ID;
                    option.textContent = `${diagnosis.diaG_ID} - ${diagnosis.diagdsc}`;
                    updatediaG_IDSelect.appendChild(option);
                });
            });
    }

    // Crear Diagnóstico
    diagnosisCreateForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const diagdsc = document.getElementById("diag-dsc").value;

        fetch('https://localhost:7299/apiDiagnosis', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ diagdsc: diagdsc }),
        })
        .then(() => {
            loadDiagnoses(); // Recargar la lista después de guardar
            diagnosisCreateForm.reset(); // Limpiar el formulario
        });
    });

    // Leer Diagnóstico
    readBtn.addEventListener("click", () => {
        const diaG_ID = document.getElementById("read-diag-id").value;

        fetch(`https://localhost:7299/apiDiagnosis/${diaG_ID}`) // Cambia esta URL a tu API
            .then(response => response.json())
            .then(data => {
                if (data) {
                    readOutput.innerHTML = `<p>ID: ${data.diaG_ID}, Descripción: ${data.diagdsc}</p>`;
                } else {
                    readOutput.innerHTML = `<p>No se encontró el diagnóstico con ID: ${diaG_ID}</p>`;
                }
            });
    });

    // Actualizar Diagnóstico
    updateBtn.addEventListener("click", () => {
        const diaG_ID = updatediaG_IDSelect.value; // Obtener el ID del diagnóstico seleccionado
        const diagdsc = document.getElementById("update-diag-dsc").value; // Obtener la nueva descripción
    
        fetch(`https://localhost:7299/apiDiagnosis/${diaG_ID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            // Enviar el objeto con ambos campos
            body: JSON.stringify({ 
                DIAG_ID: diaG_ID,  // Asegurarse de enviar el ID en el cuerpo
                DIAGDSC: diagdsc   // Enviar la nueva descripción correctamente
            }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al actualizar el diagnóstico');
            }
            return response.json();
        })
        .then(() => {
            loadDiagnoses(); // Recargar la lista después de guardar
            updatediaG_IDSelect.selectedIndex = 0; // Reiniciar selección
            document.getElementById("update-diag-dsc").value = ""; // Limpiar campo
        })
        .catch(error => {
            console.error('Hubo un problema con la actualización:', error);
        });
    });
    

    // Evento para mostrar la sección diagnósticos
    diagBtn.addEventListener("click", () => {
        diagnosSection.style.display = "block"; // Hacer visible la sección diagnósticos
        loadDiagnoses(); // Cargar diagnósticos al mostrar la sección
    });

    // Cargar diagnósticos al inicio (si es necesario)
    // loadDiagnoses();
});
