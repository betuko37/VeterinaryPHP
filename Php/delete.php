<?php

    include('database.php');

    if(isset($_POST['id'])){

        $id = $_POST['id'];

        $query = "DELETE FROM productos WHERE id = $id";

        $result = mysqli_query($connection, $query);

        if(!$result){
            die('Fallo al eliminar');
        }

        echo "Producto eliminado correctamente";

    }


   

?>