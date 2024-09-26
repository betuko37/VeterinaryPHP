document.addEventListener("DOMContentLoaded", function () {
    const cart = []; // Array para almacenar los artículos del carrito
    const products = {}; // Objeto para almacenar productos
    const modal = new bootstrap.Modal(document.getElementById('confirmModal'));

    // Cargar datos de productos
    fetch('../php/task-list.php')
        .then(response => response.json())
        .then(data => {
            if (Array.isArray(data) && data.length > 0) {
                const productSelect = document.getElementById('product-select');
                data.forEach(product => {
                    products[product.id] = product; // Almacenar producto en el objeto
                    const option = document.createElement('option');
                    option.value = product.id;
                    option.textContent = product.nombre;
                    productSelect.appendChild(option);
                });
            }
        })
        .catch(error => console.error('Error al cargar productos:', error));

    // Cargar datos de clientes
    fetch('../php/get_clients.php')
        .then(response => response.json())
        .then(data => {
            if (Array.isArray(data) && data.length > 0) {
                const clientSelect = document.getElementById('client-select');
                data.forEach(client => {
                    const option = document.createElement('option');
                    option.value = client.id;
                    option.textContent = client.nombre;
                    clientSelect.appendChild(option);
                });
            }
        })
        .catch(error => console.error('Error al cargar clientes:', error));

    // Añadir al carrito
    document.getElementById('add-to-cart').addEventListener('click', function () {
        const productId = document.getElementById('product-select').value;
        const quantity = document.getElementById('purchase-cantidad').value;
        const deliveryOption = document.getElementById('delivery-select').value;

        if (productId && quantity && products[productId]) {
            const product = products[productId];
            const totalPrice = (product.precio * quantity);
            const deliveryCost = parseFloat(deliveryOption);

            cart.push({
                productId: productId,
                productName: product.nombre,
                quantity: quantity,
                unitPrice: product.precio,
                totalPrice: totalPrice
            });

            // Mostrar en el carrito
            const cartItems = document.getElementById('cart-items');
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item';
            listItem.textContent = `Producto: ${product.nombre} - Precio: $${product.precio} x ${quantity} = $${totalPrice.toFixed(2)}`;
            cartItems.appendChild(listItem);
        } else {
            alert('Por favor completa todos los campos.');
        }
    });

    // Mostrar el modal de confirmación al hacer clic en "Realizar Compra"
    document.getElementById('checkout-button').addEventListener('click', function () {
        const clientId = document.getElementById('client-select').value;
        const deliveryOption = document.getElementById('delivery-select').value;
        const deliveryCost = parseFloat(deliveryOption);

        if (cart.length > 0 && clientId) {
            // Mostrar detalles en el modal
            const modalCartItems = document.getElementById('modal-cart-items');
            modalCartItems.innerHTML = '';
            let total = 0;

            cart.forEach(item => {
                const itemTotal = item.totalPrice;
                total += itemTotal;

                const listItem = document.createElement('li');
                listItem.className = 'list-group-item';
                listItem.textContent = `Producto: ${item.productName} - Precio: $${item.unitPrice} x ${item.quantity} = $${itemTotal.toFixed(2)}`;
                modalCartItems.appendChild(listItem);
            });

            const totalWithDelivery = total + deliveryCost;

            document.getElementById('modal-total-info').textContent = `Total: $${total.toFixed(2)}`;
            document.getElementById('modal-delivery-info').textContent = `Costo de Entrega: $${deliveryCost}`;
            document.getElementById('modal-total-info').textContent += `\nTotal con Entrega: $${totalWithDelivery.toFixed(2)}`;

            // Mostrar el modal
            const confirmPurchaseButton = document.getElementById('confirm-purchase');
            confirmPurchaseButton.dataset.clientId = clientId;
            confirmPurchaseButton.dataset.deliveryCost = deliveryCost;
            confirmPurchaseButton.dataset.total = totalWithDelivery;

            const confirmModal = new bootstrap.Modal(document.getElementById('confirmModal'));
            confirmModal.show();
        } else {
            alert('Por favor completa todos los campos y añade productos al carrito.');
        }
    });

    // Confirmar compra
    document.getElementById('confirm-purchase').addEventListener('click', function () {
        const clientId = this.dataset.clientId;
        const deliveryCost = this.dataset.deliveryCost;
        const total = this.dataset.total;

        fetch('../php/add_purchase.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                client_id: clientId,
                delivery: deliveryCost,
                cart: JSON.stringify(cart)
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Compra realizada con éxito.');
                // Limpiar el carrito y los campos del formulario
                document.getElementById('purchase-form').reset();
                document.getElementById('cart-items').innerHTML = '';
                cart.length = 0;
                const confirmModal = bootstrap.Modal.getInstance(document.getElementById('confirmModal'));
                confirmModal.hide();
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => console.error('Error al realizar la compra:', error));
    });
});
