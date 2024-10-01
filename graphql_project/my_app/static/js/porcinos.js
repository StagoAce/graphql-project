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

