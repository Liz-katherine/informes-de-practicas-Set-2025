<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $to = "jsrph9@gmail.com";
    $subject = "Nueva reserva desde la web";

    $nombre = $_POST["nombre"];
    $email = $_POST["email"];
    $personas = $_POST["personas"];
    $fecha = $_POST["fecha"];
    $hora = $_POST["hora"];
    $comentarios = $_POST["comentarios"];

    $message = "Has recibido una nueva reserva:\n\n";
    $message .= "Nombre: $nombre\n";
    $message .= "Email: $email\n";
    $message .= "Número de personas: $personas\n";
    $message .= "Fecha: $fecha\n";
    $message .= "Hora: $hora\n";
    $message .= "Comentarios: $comentarios\n";

    $headers = "From: $email\r\n";
    $headers .= "Reply-To: $email\r\n";

    if (mail($to, $subject, $message, $headers)) {
        echo "✅ Reserva enviada correctamente. Te enviaremos un correo para confirmar la reserva.";
    } else {
        echo "❌ Hubo un error al enviar la reserva, comunicate a traves de whatsapp o instagram por favor.";
    }
}
?>
