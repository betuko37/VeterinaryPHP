<?php
    include('./database.php'); // Asegúrate de que la conexión a la base de datos esté correcta

    if (isset($_POST['search'])) {
        $search = mysqli_real_escape_string($connection, $_POST['search']); // Sanitiza la entrada

        if (!empty($search)) {
            $query = "SELECT * FROM clientes WHERE nombre LIKE '$search%'";
            $result = mysqli_query($connection, $query);

            if (!$result) {
                echo json_encode(["success" => false, "message" => 'Error en la consulta: ' . mysqli_error($connection)]);
                exit;
            }

            $json = array();
            while ($row = mysqli_fetch_array($result)) {
                $json[] = array(
                    'id' => $row['id'],
                    'nombre' => $row['nombre'],
                    'direccion' => $row['direccion'],
                    'telefono' => $row['telefono']
                );
            }

            echo json_encode($json); // Envía la respuesta como JSON
        } else {
            echo json_encode([]); // Devuelve un JSON vacío si no hay resultados
        }
    } else {
        echo json_encode(["success" => false, "message" => 'No se ha recibido un término de búsqueda.']);
    }
?>
