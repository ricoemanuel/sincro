<?php


    $destino="emanuelrico1234@gmail.com";
    $mensaje=$_POST["mensaje1"];
    mail($destino,"Prueba",$mensaje);
    header("Location:main.html");
    


?>