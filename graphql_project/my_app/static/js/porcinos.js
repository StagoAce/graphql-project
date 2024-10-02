function loadPorcinoInfo(idporcinos) {
    // Realizar la solicitud AJAX para obtener los datos del cliente
    $.ajax({
        url: 'porcino/profile/' + idporcinos + '/',  // La URL que obtiene los datos del cliente según su cédula
        type: 'GET',
        success: function(response) {
            // Llenar los campos del modal con los datos del cliente
            $('#modal-alimentacion').empty();
            
            $('#modal-idporcino').text(response.idporcinos);
            $('#modal-edad').text(response.edad );
            $('#modal-peso').text(response.peso);
            $('#modal-raza').text(response.razas_idrazas);
            $('#modal-idpropietario').text(response.clientes_cedula);

            response.alimentacion.forEach(function(alimento) {
                $('#modal-alimentacion').append(
                    '<li>' + alimento.descripcion + ' - ' + alimento.dosis + ' KG</li>'
                );
            });
        
        $('#infoModal').modal('show');


        },
        error: function(error) {
            console.log('Error al obtener los datos del porcino:', error);
        }
    });
}

const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

async function fetchPorcinos() {
    try {
        const response = await fetch('/graphql/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
            body: JSON.stringify({
                query: `query { porcinos { idporcinos edad peso razas_idrazas { name } clientes_cedula { cedula } } }`
            })
        });
        const result = await response.json();
        console.log(result);  // Asegúrate de que el resultado es el esperado

        const porcinosList = document.querySelector('tbody');
        porcinosList.innerHTML = result.data.porcinos.map(porcino => `
            <tr>
                <td>${porcino.idporcinos}</td>
                <td>${porcino.edad}</td>
                <td>${porcino.peso}</td>
                <td>${porcino.razas_idrazas.name}</td>
                <td>${porcino.clientes_cedula.cedula}</td>
                <td>
                    <button type="button" class="btn btn-primary" data-bs-toggle="modal" 
                        onclick="loadPorcinoInfo('${porcino.idporcinos}')">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                        </svg>
                    </button>
                    <button type="button" class="btn btn-danger" data-bs-toggle="modal" 
                        onclick="setEliminarPorcino('${porcino.idporcinos}')">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                        </svg>
                    </button>
                    <button type="button" class="btn btn-warning" 
                        onclick="setEditarPorcino('${porcino.idporcinos}')">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
                            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325" />
                        </svg>
                    </button>
                </td>
            </tr>
        `).join('');

    } catch (error) {
        console.error('Error fetching porcinos:', error);
    }
}

window.onload = fetchPorcinos;


function setEditarPorcino(idporcinos) {
    // Realizar una solicitud AJAX para obtener los datos del cliente
    $.ajax({
        url: 'porcino/profile/' + idporcinos + '/',  // La URL que obtiene los datos del cliente según la cédula
        type: 'GET',
        success: function(response) {
            // Llenar los campos del modal con los datos del cliente
            $('#modal-idporcino-mod').val(response.idporcinos);
            $('#modal-edad-mod').val(response.edad);
            $('#modal-peso-mod').val(response.peso);
            $('#modal-idpropietario-mod').val(response.clientes_cedula);
            
            console.log(response)
            
            // Cambiar la acción del formulario para que apunte a la vista de actualización
            $('#formEditarPorcino').attr('action', '/actualizar_porcino/' + response.idporcinos + '/');
            
            // Mostrar el modal
            $('#editarPorcinoModal').modal('show');
        },
        error: function(error) {
            console.log('Error al obtener los datos del porcino:', error);
        }
    });
}

// function agregarAlimentacion(idporcinos) {
//     // Realizar una solicitud AJAX para obtener los datos del cliente
//     $.ajax({
//         url: 'porcino/profile/' + idporcinos + '/',  // La URL que obtiene los datos del cliente según la cédula
//         type: 'GET',
//         success: function(response) {
//             // Llenar los campos del modal con los datos del cliente
//             $('#modal-idporcino-mod').val(response.idporcinos);
//             $('#modal-edad-mod').val(response.edad);
//             $('#modal-peso-mod').val(response.peso);
//             $('#modal-idpropietario-mod').val(response.clientes_cedula);
            
//             console.log(response)
            
//             // Cambiar la acción del formulario para que apunte a la vista de actualización
//             $('#formEditarPorcino').attr('action', '/actualizar_porcino/' + response.idporcinos + '/');
            
//             // Mostrar el modal
//             $('#editarPorcinoModal').modal('show');
//         },
//         error: function(error) {
//             console.log('Error al obtener los datos del porcino:', error);
//         }
//     });
// }

function setEliminarPorcino(idporcinos) {
    // Establecer la URL de eliminación en el botón de confirmación del modal
    document.getElementById('confirmarEliminarBtn').href = '/porcino/delete/' + idporcinos + '/';
}

