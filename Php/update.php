<?php
// Conectar a la base de datos
include('database.php');

// Verificar si se envió el ID y los nuevos datos
if (isset($_POST['id']) && isset($_POST['nombre']) && isset($_POST['precio']) && isset($_POST['cantidad'])) {
    $id = $_POST['id'];
    $nombre = $_POST['nombre'];
    $precio = $_POST['precio'];
    $cantidad = $_POST['cantidad'];

    // Consulta de actualización
    $query = "UPDATE productos SET nombre = '$nombre', precio = '$precio', cantidad = '$cantidad' WHERE id = $id";
    $result = mysqli_query($connection, $query);

    if(!$result){
        die('Fallo al Editar');
    }

    echo "Producto Editado correctamente";
} 


?>
