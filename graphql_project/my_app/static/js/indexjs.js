// Funcion cargar información detallada del cliente
// Función para cargar la información detallada del cliente utilizando GraphQL
// Función para cargar la información detallada del cliente utilizando GraphQL
async function loadClienteInfo(cedula) {
    // Primero, obtenemos la información del cliente
    const clienteResponse = await fetch('graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify({
            query: `
                query {
                    cliente(cedula: "${cedula}") {
                        cedula
                        nombre
                        apellidos
                        direccion
                        telefono
                    }
                }
            `
        })
    });

    const clienteResult = await clienteResponse.json();
    
    // Manejo de errores al obtener información del cliente
    if (clienteResult.errors) {
        console.error(clienteResult.errors);
        alert('Error al obtener la información del cliente: ' + clienteResult.errors[0].message);
        return;
    }

    const cliente = clienteResult.data.cliente;

    // Verificar si se obtuvo información del cliente
    if (!cliente) {
        alert('Cliente no encontrado.');
        return;
    }

    // Llenar los campos del modal con los datos del cliente
    document.getElementById('modal-cedula').textContent = cliente.cedula;
    document.getElementById('modal-nombre').textContent = cliente.nombre;
    document.getElementById('modal-apellidos').textContent = cliente.apellidos;
    document.getElementById('modal-direccion').textContent = cliente.direccion;
    document.getElementById('modal-telefono').textContent = cliente.telefono;

    // Ahora, obtenemos la información de los porcinos asociados a este cliente
    const porcinosResponse = await fetch('graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify({
            query: `
                query {
                    porcinoCliente(cedula: "${cedula}") {
                        idporcinos
                        edad
                        peso
                        razasIdrazas {
                            name
                        }
                        clientesCedula {
                            cedula
                        }
                    }
                }
            `
        })
    });

    const porcinosResult = await porcinosResponse.json();

    // Manejo de errores al obtener información de los porcinos
    if (porcinosResult.errors) {
        console.error(porcinosResult.errors);
        alert('Error al obtener la información de los porcinos: ' + porcinosResult.errors[0].message);
        return;
    }

    const porcinos = porcinosResult.data.porcinoCliente;

    // Verificar si se obtuvo información de los porcinos
    if (!porcinos || porcinos.length === 0) {
        alert('No se encontraron porcinos registrados para este cliente.');
    }

    // Llenar la lista de porcinos
    const cerdosList = document.getElementById('cerdosList'); // Asegúrate de que este elemento exista
    cerdosList.innerHTML = ''; // Limpiar la lista existente

    porcinos.forEach(function(porcino) {
        cerdosList.innerHTML += `
            <li class="list-group-item">
                <strong>ID:</strong> ${porcino.idporcinos}<br>
                <strong>Edad:</strong> ${porcino.edad} años<br>
                <strong>Peso:</strong> ${porcino.peso} kg<br>
                <strong>Raza:</strong> ${porcino.razasIdrazas ? porcino.razasIdrazas.name : 'No disponible'}<br>
            </li>
        `;
    });

    // Mostrar el modal con la información
    $('#infoModal').modal('show');
}


const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

async function fetchClientes() {
    const response = await fetch('graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken, 
        },
        body: JSON.stringify({
            query: `query { clientes { cedula nombre apellidos direccion } }`
        })
    });

    const result = await response.json();
    const clientesList = document.querySelector('tbody');

    // Rellenar la tabla con los datos obtenidos de GraphQL
    clientesList.innerHTML = result.data.clientes.map(cliente => `
        <tr>
            <td>${cliente.cedula}</td>
            <td>${cliente.nombre}</td>
            <td>${cliente.apellidos}</td>
            <td>${cliente.direccion}</td>
            <td>
                <button type="button" class="btn btn-primary" data-bs-toggle="modal" 
                    onclick="loadClienteInfo('${cliente.cedula}')">
                    Ver
                </button>
                <button type="button" class="btn btn-danger" 
                    onclick="setEliminarCliente('${cliente.cedula}')">
                    Eliminar
                </button>
                <button type="button" class="btn btn-warning" 
                    onclick="setEditarCliente('${cliente.cedula}')">
                    Editar
                </button>
            </td>
        </tr>
    `).join('');
}

window.onload = fetchClientes;


// Función para editar cliente utilizando GraphQL
async function setEditarCliente(cedula) {
    const response = await fetch('graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
        },
        body: JSON.stringify({
            query: `
                query {
                    cliente(cedula: "${cedula}") {
                        cedula
                        nombre
                        apellidos
                        direccion
                        telefono
                    }
                }
            `
        })
    });

    const result = await response.json();
    const cliente = result.data.cliente;

    // Llenar los campos del modal con los datos del cliente
    document.getElementById('modal-cedula-mod').value = cliente.cedula;
    document.getElementById('modal-nombre-mod').value = cliente.nombre;
    document.getElementById('modal-apellidos-mod').value = cliente.apellidos;
    document.getElementById('modal-direccion-mod').value = cliente.direccion;
    document.getElementById('modal-telefono-mod').value = cliente.telefono;

    // Mostrar el modal de edición
    $('#editarClienteModal').modal('show');
}

async function actualizarCliente() {
    // Obtener los datos del formulario
    const clienteData = {
        cedula: document.getElementById('modal-cedula-mod').value,
        nombre: document.getElementById('modal-nombre-mod').value,
        apellidos: document.getElementById('modal-apellidos-mod').value,
        direccion: document.getElementById('modal-direccion-mod').value,
        telefono: document.getElementById('modal-telefono-mod').value,
    };

    const response = await fetch('graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
        },
        body: JSON.stringify({
            query: `
                mutation {
                    updateCliente(
                        cedula: ${clienteData.cedula}, 
                        nombre: "${clienteData.nombre}", 
                        apellidos: "${clienteData.apellidos}", 
                        direccion: "${clienteData.direccion}", 
                        telefono: ${clienteData.telefono}
                    ) {
                        message,
                        success
                    }
                }
            `
        })
    });

    const result = await response.json();

    if (result.errors) {
        console.error(result.errors);
        alert('Error al actualizar el cliente: ' + result.errors[0].message);
        return;
    }

    const success = result.data.updateCliente.success;

    if (success) {
        alert('Cliente actualizado con éxito.');
        fetchClientes();  // Recargar la lista de clientes
        $('#editarClienteModal').modal('hide'); // Cerrar el modal
        //location.reload();
    } else {
        alert('Error al actualizar el cliente: ' + result.data.updateCliente.message);
    }
}

document.getElementById('formEditarCliente').addEventListener('submit', function(event) {
    event.preventDefault();  
    actualizarCliente();    
});



// Función para eliminar cliente utilizando GraphQL
async function setEliminarCliente(cedula) {
    const confirmar = confirm("¿Estás seguro de que deseas eliminar este cliente?");
    if (confirmar) {
        const response = await fetch('graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,  
            },
            body: JSON.stringify({
                query: `
                    mutation {
                        deleteCliente(cedula: "${cedula}") {
                            success
                            message
                        }
                    }
                `
            })
        });

        const result = await response.json();
        const success = result.data.deleteCliente.success;

        if (success) {
            alert('Cliente eliminado con éxito.');
            fetchClientes();  
        } else {
            alert('Error al eliminar el cliente.');
        }
    }
}

// Función para registrar cliente utilizando GraphQL
async function registrarCliente(clienteData) {
    const response = await fetch('graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
        },
        body: JSON.stringify({
            query: `
                mutation {
                    createCliente(
                        cedula: ${clienteData.cedula}, 
                        nombre: "${clienteData.nombre}", 
                        apellidos: "${clienteData.apellidos}", 
                        direccion: "${clienteData.direccion}", 
                        telefono: ${clienteData.telefono}
                    ) {
                        success
                    }
                }
            `
        })
    });

    const result = await response.json();

    // Verificar si hay errores en la respuesta
    if (result.errors) {
        console.error(result.errors);
        alert('Error al registrar el cliente: ' + result.errors[0].message);
        return;
    }

    const success = result.data.createCliente.success;

    if (success) {
        alert('Cliente registrado con éxito.');
        fetchClientes();  // Recargar la lista de clientes
    } else {
        alert('Error al registrar el cliente: ' + result.data.createCliente.message);
    }
}

document.getElementById('agregarClienteForm').addEventListener('submit', async function(event) {
    event.preventDefault(); 

    // Obtener los datos del formulario
    const clienteData = {
        cedula: parseInt(document.getElementById('cedula').value, 10),
        nombre: document.getElementById('nombre').value,
        apellidos: document.getElementById('apellidos').value,
        direccion: document.getElementById('direccion').value,
        telefono: document.getElementById('telefono').value
    };
    
    await registrarCliente(clienteData);

   
    $('#exampleModal').modal('hide');
});


function setClienteCedula(cedula){
    document.getElementById('cliente_cedula').value = cedula;
    console.log(cedula)
}


