<?php
include('database.php');

if(isset($_POST['id']) && isset($_POST['nombre']) && isset($_POST['direccion']) && isset($_POST['telefono'])){
    $id = $_POST['id'];
    $nombre = $_POST['nombre'];
    $direccion = $_POST['direccion'];
    $telefono = $_POST['telefono'];

    $query = "UPDATE clientes SET nombre='$nombre', direccion='$direccion', telefono='$telefono' WHERE id=$id";
    $result = mysqli_query($connection, $query);

    if(!$result){
        die('Error al actualizar el cliente: ' . mysqli_error($connection));
    }

    echo 'Cliente actualizado correctamente';
} else {
    echo 'Datos incompletos';
}
?>
