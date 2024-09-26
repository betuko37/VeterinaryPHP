<?php
include('database.php'); // Incluye tu archivo de conexión a la base de datos

header('Content-Type: application/json'); // Indica que se devolverá JSON

if (isset($_POST['id'])) {
    $id = $_POST['id'];

    // Escapa el ID para prevenir inyecciones SQL
    $id = mysqli_real_escape_string($connection, $id);

    // Consulta para eliminar el cliente
    $query = "DELETE FROM clientes WHERE id='$id'";
    $result = mysqli_query($connection, $query);

    if (!$result) {
        // En caso de error, devuelve un mensaje de error en formato JSON
        echo json_encode(array("success" => false, "message" => 'Error al eliminar el cliente: ' . mysqli_error($connection)));
    } else {
        // En caso de éxito, devuelve un mensaje de éxito en formato JSON
        echo json_encode(array("success" => true, "message" => 'Cliente eliminado correctamente'));
    }
} else {
    // Si no se proporciona ID, devuelve un mensaje de error en formato JSON
    echo json_encode(array("success" => false, "message" => 'ID no proporcionado'));
}
?>
