<?php
    include('./database.php'); // Conexión a la base de datos

    if (isset($_POST['search'])) {
        $search = mysqli_real_escape_string($connection, $_POST['search']); // Sanitiza la entrada

        if (!empty($search)) {
            $query = "SELECT * FROM productos WHERE nombre LIKE '$search%'";
            $result = mysqli_query($connection, $query);

            if (!$result) {
                die('Query Error: ' . mysqli_error($connection)); // Manejo de errores en la consulta
            }

            $json = array();
            while ($row = mysqli_fetch_array($result)) {
                $json[] = array(
                    'nombre' => $row['nombre'],
                    'precio' => $row['precio'],
                    'cantidad' => $row['cantidad'],
                    'id' => $row['id']
                );
            }

            $jsonString = json_encode($json);
            echo $jsonString; // Envía la respuesta como JSON
        }
    } else {
        echo json_encode([]); // Si no hay búsqueda, devuelve un JSON vacío
    }
?>
