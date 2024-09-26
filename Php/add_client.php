<?php
include('database.php'); // Incluye tu archivo de conexión a la base de datos

header('Content-Type: application/json'); // Indica que se devolverá JSON

// Obtener los datos del formulario
$nombre = isset($_POST['nombre']) ? $_POST['nombre'] : '';
$direccion = isset($_POST['direccion']) ? $_POST['direccion'] : '';
$telefono = isset($_POST['telefono']) ? $_POST['telefono'] : '';

if ($nombre && $direccion && $telefono) {
    // Escapar datos para prevenir inyecciones SQL
    $nombre = mysqli_real_escape_string($connection, $nombre);
    $direccion = mysqli_real_escape_string($connection, $direccion);
    $telefono = mysqli_real_escape_string($connection, $telefono);

    // Consulta para agregar el cliente
    $query = "INSERT INTO clientes (nombre, direccion, telefono) VALUES ('$nombre', '$direccion', '$telefono')";
    $result = mysqli_query($connection, $query);

    if ($result) {
        echo json_encode(array("success" => true, "message" => 'Cliente añadido correctamente'));
    } else {
        echo json_encode(array("success" => false, "message" => 'Error al añadir cliente: ' . mysqli_error($connection)));
    }
} else {
    echo json_encode(array("success" => false, "message" => 'Datos incompletos'));
}
?>
