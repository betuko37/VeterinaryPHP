<?php
include('database.php');

$query = "SELECT id, nombre FROM productos";
$result = mysqli_query($connection, $query);

if (!$result) {
    die('Error al cargar la tabla productos: ' . mysqli_error($connection));
}

$json = array();
while ($row = mysqli_fetch_assoc($result)) {
    $json[] = array(
        'id' => $row['id'],
        'nombre' => $row['nombre']
    );
}

echo json_encode($json);
?>
