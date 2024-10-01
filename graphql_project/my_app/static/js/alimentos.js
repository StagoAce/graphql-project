function setEliminarAlimento(idalimentacion) {
    // Establecer la URL de eliminación en el botón de confirmación del modal
    document.getElementById('confirmarEliminarBtn').href = '/eliminarAlimento/' + idalimentacion + '/';
}

function setEditarAlimento(idalimentacion) {
    // Realizar una solicitud AJAX para obtener los datos del cliente
    $.ajax({
        url: 'alimento/' + idalimentacion + '/',  // La URL que obtiene los datos del cliente según la cédula
        type: 'GET',
        success: function(response) {
          
            $('#modal-dosis-mod').val(response.dosis);
            
            console.log(response)
            
   
            $('#formEditarDosis').attr('action', '/editarDosis/' + response.idalimentacion + '/');
            
       
            $('#editarDosisModal').modal('show');
        },
        error: function(error) {
            console.log('Error al obtener los datos del porcino:', error);
        }
    });
}
