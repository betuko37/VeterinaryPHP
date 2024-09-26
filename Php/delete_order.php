<?php

include('database.php');

if(isset($_POST['id'])){
    $id = $_POST['id'];
    $query = "DELETE FROM compras WHERE id = $id"; // Cambia 'pedidos' al nombre de tu tabla de pedidos
    $result = mysqli_query($connection, $query);
    if(!$result){
        die('Fallo al eliminar el pedido');
    }
    echo "Pedido eliminado correctamente";
}
?>
