<?php
include('./database.php');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $client_id = $_POST['client_id'];
    $delivery_cost = $_POST['delivery'];
    $cart = json_decode($_POST['cart'], true);

    if (!$client_id || !$cart || !is_array($cart)) {
        echo json_encode(['success' => false, 'message' => 'Datos incompletos.']);
        exit;
    }

    // Insertar la compra en la tabla compras
    $total = 0;
    $query = "INSERT INTO compras (product_id, cantidad, client_id, fecha, total) VALUES ";
    $values = [];

    foreach ($cart as $item) {
        $product_id = $item['productId'];
        $quantity = $item['quantity'];
        $total_price = $item['totalPrice'];
        $total += $total_price;

        $values[] = "($product_id, $quantity, $client_id, NOW(), $total_price)";
    }

    $query .= implode(', ', $values);

    if (mysqli_query($connection, $query)) {
        // Actualizar el total en la tabla compras
        $update_query = "UPDATE compras SET total = $total WHERE client_id = $client_id AND fecha = (SELECT MAX(fecha) FROM compras WHERE client_id = $client_id)";
        mysqli_query($connection, $update_query);

        echo json_encode(['success' => true, 'message' => 'Compra realizada con éxito.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error al realizar la compra: ' . mysqli_error($connection)]);
    }
}
?>
