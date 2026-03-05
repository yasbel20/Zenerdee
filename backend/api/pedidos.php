<?php
require_once 'config.php';
require_once 'models/Pedido.php';

if (empty($_SESSION['usuario_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Debes iniciar sesión para comprar']);
    exit();
}

$database = new Database();
$db       = $database->getConnection();
$pedido   = new Pedido($db);

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {

    case 'POST':
        $data  = json_decode(file_get_contents('php://input'), true);
        $items = $data['items'] ?? [];
        $total = $data['total'] ?? 0;
        $direccion = $data['direccion'] ?? null;

        if (empty($items)) {
            http_response_code(400);
            echo json_encode(['error' => 'El carrito está vacío']);
            break;
        }

        $pedido_id = $pedido->create($_SESSION['usuario_id'], $total, $items, $direccion);

        if ($pedido_id) {
            http_response_code(201);
            echo json_encode(['success' => true, 'pedido_id' => $pedido_id]);
        } else {
            http_response_code(503);
            echo json_encode(['error' => 'Error al procesar el pedido']);
        }
        break;

    case 'GET':
        // If admin requested all orders
        if (!empty($_GET['admin']) && ($_SESSION['usuario_role'] ?? '') === 'admin') {
            $historial = $pedido->getAll();
            echo json_encode($historial);
            break;
        }

        $historial = $pedido->getByUsuario($_SESSION['usuario_id']);
        echo json_encode($historial);
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Método no permitido']);
}