<?php
include('database.php');

if (isset($_POST['id'])) {
    $id = $_POST['id'];

    $query = "SELECT * FROM orders WHERE id = $id";
    $result = mysqli_query($connection, $query);

    if ($result) {
        $order = mysqli_fetch_assoc($result);
        echo json_encode($order);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Pedido no encontrado']);
    }
} else {
    http_response_code(400);
    echo json_encode(['error' => 'ID no proporcionado']);
}
?>
