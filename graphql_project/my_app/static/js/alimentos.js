const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

async function fetchAlimentos() {
    const response = await fetch('graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,  // Asegúrate de tener el token CSRF configurado
        },
        body: JSON.stringify({
            query: `query { alimentos { idalimentacion descripcion dosis } }`
        })
    });

    const result = await response.json();
    const alimentosList = document.querySelector('tbody');

    // Rellenar la tabla con los datos obtenidos de GraphQL
    alimentosList.innerHTML = result.data.alimentos.map(alimento => `
        <tr>
            <td>${alimento.idalimentacion}</td>
            <td>${alimento.descripcion}</td>
            <td>${alimento.dosis} KG</td>
            <td>
                <button type="button" class="btn btn-danger" data-bs-toggle="modal"
                    data-bs-target="#eliminarAlimentoModal"
                    onclick="setEliminarAlimento('${alimento.idalimentacion}')">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                        class="bi bi-trash" viewBox="0 0 16 16">
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                    </svg>
                </button>

                <button type="button" class="btn btn-warning" data-bs-toggle="modal"
                    onclick="setEditarAlimento('${alimento.idalimentacion}')">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                        class="bi bi-pencil" viewBox="0 0 16 16">
                        <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325" />
                    </svg>
                </button>
            </td>
        </tr>
    `).join('');
}

// Llamar a la función cuando se cargue la página
window.onload = fetchAlimentos;

let idAlimentoAEliminar; 
function setEliminarAlimento(idalimentacion) {
    idAlimentoAEliminar = idalimentacion;
    $('#eliminarAlimentoModal').modal('show');
}

async function confirmarEliminarAlimento() {
    const response = await fetch('graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
        },
        body: JSON.stringify({
            query: `
                mutation {
                    deleteAlimento(idalimentacion: "${idAlimentoAEliminar}") {
                        success
                        message
                    }
                }
            `
        })
    });

    const result = await response.json();
    const success = result.data.deleteAlimento.success;

    if (success) {
        alert('Alimento eliminado con éxito.');
        fetchAlimentos();  // Recargar la lista de alimentos
        $('#eliminarAlimentoModal').modal('hide'); // Cerrar el modal
    } else {
        alert('Error al eliminar el alimento: ' + result.data.deleteAlimento.message);
    }
}

async function setEditarAlimento(idalimentacion) {
    const response = await fetch('graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
        },
        body: JSON.stringify({
            query: `
                query {
                    alimento(idalimentacion: "${idalimentacion}") {
                        idalimentacion
                        descripcion
                        dosis
                    }
                }
            `
        })
    });

    const result = await response.json();
    const alimento = result.data.alimento;

    // Llenar los campos del modal con los datos del alimento
    document.getElementById('modal-idalimentacion-mod').value = alimento.idalimentacion;
    document.getElementById('modal-descripcion-mod').value = alimento.descripcion;
    document.getElementById('modal-dosis-mod').value = alimento.dosis;

    // Mostrar el modal de edición
    $('#editarAlimentoModal').modal('show');
}

async function actualizarAlimento() {
    const alimentoData = {
        idalimentacion: document.getElementById('modal-idalimentacion-mod').value,
        descripcion: document.getElementById('modal-descripcion-mod').value,
        dosis: document.getElementById('modal-dosis-mod').value,
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
                    updateAlimento(
                        idalimentacion: "${alimentoData.idalimentacion}",
                        descripcion: "${alimentoData.descripcion}",
                        dosis: "${alimentoData.dosis}"
                    ) {
                        success
                        message
                    }
                }
            `
        })
    });

    const result = await response.json();

    if (result.errors) {
        console.error(result.errors);
        alert('Error al actualizar el alimento: ' + result.errors[0].message);
        return;
    }

    const success = result.data.updateAlimento.success;

    if (success) {
        alert('Alimento actualizado con éxito.');
        fetchAlimentos();  // Recargar la lista de alimentos
        $('#editarAlimentoModal').modal('hide'); // Cerrar el modal
    } else {
        alert('Error al actualizar el alimento: ' + result.data.updateAlimento.message);
    }
}



async function agregarAlimento() {
    const alimentoData = {
        descripcion: document.getElementById('descripcion').value,
        dosis: document.getElementById('number').value,
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
                    createAlimento(
                        descripcion: "${alimentoData.descripcion}", 
                        dosis: ${alimentoData.dosis}
                    ) {
                        success
                    }
                }
            `
        })
    });

    const result = await response.json();

    const success = result.data.createAlimento.success;

    if (success) {
        alert('Alimento agregado con éxito.');
        fetchAlimentos();  // Recargar la lista de alimentos
        $('#exampleModal').modal('hide'); // Cerrar el modal
        //location.reload(); // Descomenta si deseas recargar la página
    } else {
        alert('Error al agregar el alimento: ' + result.data.createAlimento.message);
    }
}

// Agregar el evento al formulario
document.getElementById('exampleModal').addEventListener('submit', function (event) {
    event.preventDefault();
    agregarAlimento();
});

