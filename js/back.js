document.addEventListener('DOMContentLoaded', function() {
    const backButton2 = document.getElementById('back-button-2');
    const backButton3 = document.getElementById('back-button-3');
    const actionButtons = document.getElementById('action-buttons');
    
    // Lista de todas las secciones a ocultar
    const sections = [
        "diagnosticos", "groups", "folios", "headquarters", "incomes", "medications",
        "permissions-groups", "permissions", "staff", "tipdocs", "logs", "score", "users", 
        "patients", "supplies-patients", "signs", "nurse-note-section", "patient-records"
    ];

    // Función para ocultar todas las secciones
    function hideAllSections() {
        sections.forEach(id => {
            const section = document.getElementById(id);
            if (section) section.style.display = 'none';
        });
    }

    // Mostrar la sección de botones de acción después de ocultar todas las secciones
    function showActionButtons() {
        hideAllSections();
        actionButtons.style.display = 'block';
    }

    // Agregar evento al botón 2
    if (backButton2) {
        backButton2.addEventListener('click', function() {
            showActionButtons();
        });
    }

    // Agregar evento al botón 3
    if (backButton3) {
        backButton3.addEventListener('click', function() {
            showActionButtons();
        });
    }
});
