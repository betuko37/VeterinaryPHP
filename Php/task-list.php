<?php

    include('database.php');

    $query = "SELECT * FROM productos";
    $result = mysqli_query($connection, $query);

    if(!$result){
        die('Fallo al cargar la tabla productos'. mysqli_error($connection));
    }

    $json = array();
    while($row = mysqli_fetch_array($result)){
        $json[] = array(
            'nombre' => $row['nombre'],
            'precio' => $row['precio'],
            'cantidad' => $row['cantidad'],
            'id' => $row['id'],
        );
    }

    $jsonString = json_encode($json);
    echo $jsonString;

?>