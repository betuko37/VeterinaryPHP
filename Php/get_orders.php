<?php

include('database.php');

// Verifica si la conexión a la base de datos es exitosa
if (!$connection) {
    die('Conexión fallida: ' . mysqli_connect_error());
}

// Consulta SQL para obtener datos de la tabla compras, productos y clientes
$query = "
    SELECT 
        c.id AS compra_id, 
        c.product_id, 
        c.cantidad, 
        c.client_id, 
        c.fecha, 
        c.total, 
        p.nombre AS producto_nombre, 
        cl.nombre AS cliente_nombre 
    FROM compras c
    LEFT JOIN productos p ON c.product_id = p.id
    LEFT JOIN clientes cl ON c.client_id = cl.id
";
$result = mysqli_query($connection, $query);

if (!$result) {
    die('Fallo al cargar la tabla compras: ' . mysqli_error($connection));
}

$json = array();
while ($row = mysqli_fetch_assoc($result)) {
    $json[] = array(
        'id' => $row['compra_id'],
        'product_id' => $row['product_id'],
        'cantidad' => $row['cantidad'],
        'client_id' => $row['client_id'],
        'fecha' => $row['fecha'],
        'total' => $row['total'],
        'producto_nombre' => $row['producto_nombre'],
        'cliente_nombre' => $row['cliente_nombre']
    );
}

// Configura la cabecera para JSON
header('Content-Type: application/json');
echo json_encode($json);

?>
