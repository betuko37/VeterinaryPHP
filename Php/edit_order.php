<?php

include('database.php');
header('Content-Type: application/json');


if (isset($_POST['id'])) {
    $id = $_POST['id'];
    $producto = $_POST['producto'];
    $cantidad = $_POST['cantidad'];
    $cliente = $_POST['cliente'];
    $fecha = $_POST['fecha'];
    $total = $_POST['total'];

    $query = "UPDATE pedidos SET
        producto_nombre = '$producto',
        cantidad = $cantidad,
        cliente_nombre = '$cliente',
        fecha = '$fecha',
        total = $total
        WHERE id = $id"; // Cambia 'pedidos' por el nombre de tu tabla

    $result = mysqli_query($connection, $query);

    if (!$result) {
        die('Fallo al actualizar el pedido: ' . mysqli_error($connection));
    }

    echo "Pedido actualizado correctamente";
}

?>
