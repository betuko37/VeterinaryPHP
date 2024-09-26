<?php
include('database.php');

$query = "SELECT id, nombre, direccion, telefono FROM clientes";
$result = mysqli_query($connection, $query);

if (!$result) {
    die('Error al cargar la tabla clientes: ' . mysqli_error($connection));
}

$json = array();
while ($row = mysqli_fetch_assoc($result)) {
    $json[] = array(
        'id' => $row['id'],
        'nombre' => $row['nombre'],
        'direccion' => $row['direccion'],
        'telefono' => $row['telefono']
    );
}

echo json_encode($json);
?>
