document.addEventListener("DOMContentLoaded", () => {
    // Elementos y botones del DOM
    const medicationCreateForm = document.getElementById("medication-create-form");
    const searchMedicationBtn = document.getElementById("search-medication-btn");
    const updateMedicationBtn = document.getElementById("update-medication-btn");
    const medicationsTable = document.getElementById("medications-table").getElementsByTagName('tbody')[0];
    const medicationSearchOutput = document.getElementById("medication-search-output");
    const updateMedicationIDSelect = document.getElementById("update-medication-id");
    const medicationsSection = document.getElementById("medications"); // Sección de Medicamentos
    const medicationsBtn = document.getElementById("med-btn"); // Botón de Medicamentos

          // Función para ocultar todas las secciones
  function hideAllSections() {
    const sections = [
      "diagnosticos",
    "groups",
    "headquarters",
    "incomes",
    "medications",
    "permissions-groups",
    "permissions",
    "specialities",
    "staff",
    "tipdocs",
    "users",
    "logs",
    "score",
    "patients",
    "patient-records",
    "signs",
    "supplies-patients",
    "folios",
    "nurse-note-section"
    ];
    sections.forEach((id) => {
      const section = document.getElementById(id);
      if (section) section.style.display = "none";
    });
  }

  // Evento para mostrar solo la sección de notas de enfermería
  medicationsBtn.addEventListener("click", () => {
    hideAllSections();
    medicationsSection.style.display = "block";
    loadMedications();
  });

    // Función para cargar Medicamentos
    function loadMedications() {
        fetch('https://nursenotes.somee.com/apiMedications')
            .then(response => response.json())
            .then(data => {
                medicationsTable.innerHTML = ""; // Limpiar tabla
                updateMedicationIDSelect.innerHTML = ""; // Limpiar select para actualización
                data.forEach(medication => {
                    const row = medicationsTable.insertRow();
                    row.innerHTML = `
                        <td>${medication.meD_ID}</td>
                        <td>${medication.meddsc}</td>
                        <td>${medication.stock}</td>
                        <td>
                            <button onclick="confirmRemoveMedicationRow(this)">Eliminar</button>
                        </td>
                    `;
                    
                    // Agregar opción al select de actualización
                    const option = document.createElement("option");
                    option.value = medication.meD_ID;
                    option.textContent = `${medication.meD_ID} - ${medication.meddsc}`;
                    updateMedicationIDSelect.appendChild(option);
                });
            });
    }

    // Función para confirmar y eliminar una fila visualmente
    window.confirmRemoveMedicationRow = function(button) {
        if (confirm("¿Estás seguro de que deseas eliminar este medicamento?")) {
            const row = button.closest("tr");
            row.remove();
        }
    };

    // Crear Medicamento
    medicationCreateForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const medicationData = {
            meddsc: document.getElementById("medication-desc").value,
            stock: parseInt(document.getElementById("medication-stock").value),
        };

        fetch('https://nursenotes.somee.com/apiMedications', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(medicationData),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al crear el medicamento');
            }
            return response.json();
        })
        .then(() => {
            loadMedications();
            medicationCreateForm.reset();
        })
        .catch(error => console.error('Error en la creación del medicamento:', error));
    });

    // Buscar Medicamento por ID
    searchMedicationBtn.addEventListener("click", () => {
        const meD_ID = document.getElementById("search-medication-id").value;

        fetch(`https://nursenotes.somee.com/apiMedications/${meD_ID}`)
            .then(response => response.json())
            .then(data => {
                medicationSearchOutput.innerHTML = data
                    ? `<p>ID: ${data.meD_ID}, Descripción: ${data.meddsc}, Stock: ${data.stock}</p>`
                    : `<p>No se encontró el medicamento con ID: ${meD_ID}</p>`;
            })
            .catch(error => console.error('Error al buscar medicamento:', error));
    });

     // Actualizar Medicamento
     updateMedicationBtn.addEventListener("click", () => {
        const meD_ID = updateMedicationIDSelect.value; // Obtener el ID seleccionado para actualizar
        const medicationData = {
            meD_ID: parseInt(meD_ID), // Incluir el ID del medicamento en el body
            meddsc: document.getElementById("update-medication-desc").value,
            stock: parseInt(document.getElementById("update-medication-stock").value),
        };

        fetch(`https://nursenotes.somee.com/apiMedications/${meD_ID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(medicationData),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al actualizar el medicamento');
            }
            return response.json();
        })
        .then(() => {
            loadMedications();
            updateMedicationIDSelect.selectedIndex = 0;
            document.getElementById("update-medication-desc").value = "";
            document.getElementById("update-medication-stock").value = "";
        })
        .catch(error => console.error('Error en la actualización del medicamento:', error));
    });
});