const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

async function fetchPorcinos() {
    console.log("Inicio de la función fetchPorcinos"); // Asegúrate de que esto esté aquí
    try {
        const response = await fetch('graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
            body: JSON.stringify({
                query: `
                    query {
                        porcinos {
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

        const result = await response.json();
        console.log(result);  // Verifica el resultado

        if (result.errors) {
            console.error('GraphQL errors:', result.errors);
            return;
        }

        const porcinosList = document.querySelector('#tabla-porcinos tbody'); // Cambia aquí
        porcinosList.innerHTML = result.data.porcinos.map(porcino => `
            <tr>
                <td>${porcino.idporcinos}</td>
                <td>${porcino.edad}</td>
                <td>${porcino.peso}</td>
                <td>${porcino.razasIdrazas ? porcino.razasIdrazas.name : 'Sin raza'}</td>
                <td>${porcino.clientesCedula ? porcino.clientesCedula.cedula : 'Sin cliente'}</td>
                <td>
                    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#infoModal"
                        onclick="loadPorcinoInfo('${porcino.idporcinos}')">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                            class="bi bi-search" viewBox="0 0 16 16">
                            <path
                                d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                        </svg>
                    </button>

                    <button type="button" class="btn btn-danger" data-bs-toggle="modal"
                        data-bs-target="#eliminarPorcinoModal"
                        onclick="setEliminarPorcino('${porcino.idporcinos}')">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                            class="bi bi-trash" viewBox="0 0 16 16">
                            <path
                                d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                            <path
                                d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                        </svg>
                    </button>

                    <button type="button" class="btn btn-warning" data-bs-toggle="modal"
                        onclick="setEditarPorcino('${porcino.idporcinos}')">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                            class="bi bi-pencil" viewBox="0 0 16 16">
                            <path
                                d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325" />
                        </svg>
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error fetching porcinos:', error);
    }
}

document.addEventListener('DOMContentLoaded', fetchPorcinos);

async function confirmarEliminarPorcino() {
    const response = await fetch('graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify({
            query: `
                mutation {
                    deletePorcino(idporcino: "${idPorcinoAEliminar}") {
                        success
                        message
                    }
                }
            `
        })
    });

    const result = await response.json();
    const success = result.data.deletePorcino.success;

    if (success) {
        alert('Porcino eliminado con éxito.');
        fetchPorcinos();  // Recargar la lista de porcinos
        $('#eliminarPorcinoModal').modal('hide'); // Cerrar el modal
    } else {
        alert('Error al eliminar el porcino: ' + result.data.deletePorcino.message);
    }
}

let idPorcinoAEliminar = null;

function setEliminarPorcino(id) {
    idPorcinoAEliminar = id; // Asignar el ID del porcino a eliminar
    $('#eliminarPorcinoModal').modal('show'); // Mostrar el modal de confirmación
}

async function setEditarPorcino(idporcinos) {
    if (!csrfToken) {
        console.error('CSRF Token no está definido.');
        return;
    }

    const response = await fetch('graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify({
            query: `
                query {
                    porcinoUno(idporcinos: "${idporcinos}") {
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

    const result = await response.json();
    console.log(result); // Verifica la respuesta completa

    if (result.errors) {
        console.error(result.errors);
        alert('Error al obtener el porcino: ' + result.errors[0].message);
        return;
    }

    const porcino = result.data.porcinoUno;

    if (!porcino) {
        console.error('Porcino no encontrado.');
        alert('No se pudo encontrar el porcino.');
        return;
    }

    // Llenar los campos del modal con los datos del porcino
    document.getElementById('modal-idporcino-mod').value = porcino.idporcinos;
    document.getElementById('modal-edad-mod').value = porcino.edad;
    document.getElementById('modal-peso-mod').value = porcino.peso;
    document.getElementById('modal-razas-mod').value = porcino.razasIdrazas ? porcino.razasIdrazas.name : '';
    document.getElementById('modal-idpropietario-mod').value = porcino.clientesCedula ? porcino.clientesCedula.cedula : '';

    // Mostrar el modal de edición
    $('#editarPorcinoModal').modal('show');
}

async function actualizarPorcino() {
    const porcinoData = {
        idporcinos: document.getElementById('modal-idporcino-mod').value,
        edad: document.getElementById('modal-edad-mod').value,
        peso: document.getElementById('modal-peso-mod').value,
        razasIdrazas: document.getElementById('modal-razas-mod').value,
        clientesCedula: document.getElementById('modal-idpropietario-mod').value,
    };

    const response = await fetch('graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify({
            query: `
                mutation {
                    updatePorcino(
                        idporcinos: "${porcinoData.idporcinos}",
                        edad: "${porcinoData.edad}",
                        peso: "${porcinoData.peso}",
                        razasIdrazas: "${porcinoData.razasIdrazas}",
                        clientesCedula: "${porcinoData.clientesCedula}"
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
        alert('Error al actualizar el porcino: ' + result.errors[0].message);
        return;
    }

    const success = result.data.updatePorcino.success;

    if (success) {
        alert('Porcino actualizado con éxito.');
        fetchPorcinos();  // Recargar la lista de porcinos
        $('#editarPorcinoModal').modal('hide'); // Cerrar el modal
    } else {
        alert('Error al actualizar el porcino: ' + result.data.updatePorcino.message);
    }
}

