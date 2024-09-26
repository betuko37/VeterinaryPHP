// Función para actualizar la lista de pedidos
function fetchOrders() {
    fetch('../php/get_orders.php', {
        method: 'GET'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la solicitud: ' + response.statusText);
        }
        return response.json();
    })
    .then(orders => {
        console.log(orders); // Verifica los datos recibidos
        let template = '';
        orders.forEach(order => {
            template += `
                <tr orderId="${order.id}">
                    <td>${order.id}</td>
                    <td>${order.producto_nombre || 'No disponible'}</td>
                    <td>${order.cantidad}</td>
                    <td>${order.cliente_nombre || 'No disponible'}</td>
                    <td>${order.fecha}</td>
                    <td>${order.total}</td>
                    <td>
                        <button class="btn order-delete btn-delete">Eliminar</button>
                    </td>
                </tr>
            `;
        });

        document.getElementById('orders').innerHTML = template;
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Función para manejar la eliminación de un pedido
function deleteOrder(orderId) {
    // Muestra la modal de confirmación
    const confirmDeleteModal = new bootstrap.Modal(document.getElementById('confirmDeleteModal'));
    confirmDeleteModal.show();

    // Maneja la confirmación de eliminación
    document.getElementById('confirmDeleteButton').onclick = function() {
        fetch('../php/delete_order.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                'id': orderId
            })
        })
        .then(response => response.text())
        .then(message => {
            fetchOrders(); // Volver a cargar la lista de pedidos
            confirmDeleteModal.hide(); // Oculta la modal
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };
}

// Llamar a la función cuando el documento esté listo
document.addEventListener('DOMContentLoaded', function() {
    fetchOrders();

    // Delegar el evento de click para el botón de eliminar
    document.getElementById('orders').addEventListener('click', function(event) {
        if (event.target.classList.contains('order-delete')) {
            const row = event.target.closest('tr');
            const orderId = row.getAttribute('orderId');
            deleteOrder(orderId);
        }
    });
});
