document.addEventListener("DOMContentLoaded", () => {
    // Elementos y botones del DOM
    const userCreateForm = document.getElementById("user-create-form");
    const searchUserBtn = document.getElementById("search-user-btn");
    const updateUserBtn = document.getElementById("update-user-btn");

    const usersTable = document.getElementById("users-table").getElementsByTagName("tbody")[0];
    const userSearchOutput = document.getElementById("user-search-output");
    const updateUserIDSelect = document.getElementById("update-user-id");
    const usersSection = document.getElementById("users");
    const usersBtn = document.getElementById("usr-btn");

    // Otras secciones que deben ocultarse al ver la sección Usuarios
    const diagnosSection = document.getElementById("diagnosticos");
    const groupsSection = document.getElementById("groups");
    const foliosSection = document.getElementById("folios");
    const headquartersSection = document.getElementById("headquarters");
    const incomesSection = document.getElementById("incomes");
    const medicationsSection = document.getElementById("medications");
    const permissionsGroupsSection = document.getElementById("permissions-groups");
    const permissionsSection = document.getElementById("permissions");
    const staffSection = document.getElementById("staff");
    const tipdocsSection = document.getElementById("tipdocs");
    const logsSection = document.getElementById("logs");
    const scoreSection = document.getElementById("score");


    // Función para ocultar todas las secciones
    function hideAllSections() {
        if (diagnosSection) diagnosSection.style.display = "none";
        if (groupsSection) groupsSection.style.display = "none";
        if (foliosSection) foliosSection.style.display = "none";
        if (headquartersSection) headquartersSection.style.display = "none";
        if (incomesSection) incomesSection.style.display = "none";
        if (medicationsSection) medicationsSection.style.display = "none";
        if (permissionsGroupsSection) permissionsGroupsSection.style.display = "none";
        if (permissionsSection) permissionsSection.style.display = "none";
        if (staffSection) staffSection.style.display = "none";
        if (tipdocsSection) tipdocsSection.style.display = "none";
        if (logsSection) logsSection.style.display = "none";
        if (scoreSection) scoreSection.style.display = "none";




        usersSection.style.display = "none";
    }

    // Evento para mostrar solo la sección de usuarios
    usersBtn.addEventListener("click", () => {
        hideAllSections();
        usersSection.style.display = "block";
        loadUsers();
    });

    // Función para cargar Usuarios
    function loadUsers() {
        fetch("https://nursenotes.somee.com/apiUsers")
            .then((response) => response.json())
            .then((data) => {
                usersTable.innerHTML = ""; 
                updateUserIDSelect.innerHTML = ""; 
                data.forEach((user) => {
                    const row = usersTable.insertRow();
                    row.innerHTML = `
                        <td>${user.usR_ID}</td>
                        <td>${user.name}</td>
                        <td>${user.lastname}</td>
                        <td>${user.tipdoc}</td>
                        <td>${user.numdoc}</td>
                        <td>${user.usr}</td>
                        <td>${user.grP_ID}</td>
                        <td><button onclick="confirmRemoveUserRow(this)">Eliminar</button></td>
                    `;

                    const option = document.createElement("option");
                    option.value = user.usR_ID;
                    option.textContent = `${user.usR_ID} - ${user.name} ${user.lastname}`;
                    updateUserIDSelect.appendChild(option);
                });
            });
    }

    // Función para confirmar y eliminar una fila visualmente
    window.confirmRemoveUserRow = function (button) {
        if (confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
            const row = button.closest("tr");
            row.remove();
        }
    };

    // Crear Usuario
    userCreateForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const userData = {
            name: document.getElementById("user-name").value,
            lastname: document.getElementById("user-lastname").value,
            tipdoc: document.getElementById("user-tipdoc").value,
            numdoc: parseInt(document.getElementById("user-numdoc").value),
            usr: document.getElementById("user-usr").value,
            usrpsw: document.getElementById("user-usrpsw").value,
            grP_ID: parseInt(document.getElementById("user-grp-id").value),
        };

        console.log("Datos enviados al backend:", userData); // Log de los datos enviados

        fetch("https://nursenotes.somee.com/apiUsers", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
        })
            .then((response) => {
                if (!response.ok) {
                    return response.json().then((errorData) => {
                        console.error("Error en la respuesta del servidor:", errorData);
                        throw new Error("Error al crear el usuario");
                    });
                }
                return response.json();
            })
            .then((data) => {
                console.log("Usuario creado con éxito:", data); // Log de éxito
                loadUsers();
                userCreateForm.reset();
            })
            .catch((error) => console.error("Error en la creación del usuario:", error));
    });
    // Buscar Usuario por ID
    searchUserBtn.addEventListener("click", () => {
        const usR_ID = document.getElementById("search-user-id").value;

        fetch(`https://nursenotes.somee.com/apiUsers/${usR_ID}`)
            .then((response) => response.json())
            .then((data) => {
                userSearchOutput.innerHTML = data
                    ? `<p>ID: ${data.usR_ID}, Nombre: ${data.name}, Apellido: ${data.lastname}</p>`
                    : `<p>No se encontró el usuario con ID: ${usR_ID}</p>`;
            })
            .catch((error) => console.error("Error al buscar usuario:", error));
    });

    // Actualizar Usuario
    updateUserBtn.addEventListener("click", () => {
        const usR_ID = updateUserIDSelect.value;
        const userData = {
            usR_ID: parseInt(usR_ID),
            name: document.getElementById("update-user-name").value,
            lastname: document.getElementById("update-user-lastname").value,
            tipdoc: document.getElementById("update-user-tipdoc").value,
            numdoc: parseInt(document.getElementById("update-user-numdoc").value),
            usr: document.getElementById("update-user-usr").value,
            usrpsw: document.getElementById("update-user-usrpsw").value,
            grP_ID: parseInt(document.getElementById("update-user-grp-id").value),
        };

        fetch(`https://nursenotes.somee.com/apiUsers/${usR_ID}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error al actualizar el usuario");
                }
                return response.json();
            })
            .then(() => {
                loadUsers();
                updateUserIDSelect.selectedIndex = 0;
                document.getElementById("update-user-name").value = "";
                document.getElementById("update-user-lastname").value = "";
                document.getElementById("update-user-tipdoc").value = "";
                document.getElementById("update-user-numdoc").value = "";
                document.getElementById("update-user-usr").value = "";
                document.getElementById("update-user-usrpsw").value = "";
                document.getElementById("update-user-grp-id").value = "";
            })
            .catch((error) => console.error("Error en la actualización del usuario:", error));
    });
});
