(function() {
    // Captura del evento submit del formulario
    document.querySelector('.login-form').addEventListener('submit', function(event) {
        event.preventDefault(); // Evitar que el formulario se envíe de forma predeterminada

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Crear el objeto con las credenciales de login
        const credentials = {
            USR: username,       // Campo para el nombre de usuario
            USRPSW: password,    // Campo para la contraseña
        };

        // Realizar la solicitud POST a la API
        fetch('https://localhost:7299/apiUsers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Si el login es exitoso, ocultar el formulario y mostrar los botones
                document.getElementById('login-section').style.display = 'none';
                document.getElementById('action-buttons').style.display = 'block';
            } else {
                // Si hay un error, mostrar un mensaje
                alert('Login fallido: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error en la solicitud:', error);
        });
    });
})();

