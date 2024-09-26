<?php

include('./database.php');

if(isset($_POST['nombre'])){
    $nombre = $_POST['nombre'];
    $precio = $_POST['precio'];
    $cantidad = $_POST['cantidad'];

    $query = "INSERT into productos(nombre, precio, cantidad) VALUES ('$nombre','$precio','$cantidad')" ;
    $result = mysqli_query($connection, $query);

    if(!$result){
        die('Ah fallado la inserccion');
    }

    echo 'Añadido Correctamente';

}

?>