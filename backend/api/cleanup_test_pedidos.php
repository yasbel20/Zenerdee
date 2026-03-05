<?php
// Dev helper: elimina pedidos de prueba (detalle.nombre LIKE 'Prueba%')
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/config/database.php';

try {
    $dbs = new Database();
    $db = $dbs->getConnection();

    // Buscar pedidos con líneas de detalle que tengan nombre empezando por 'Prueba'
    $stmt = $db->prepare("SELECT DISTINCT pedido_id FROM detalle_pedidos WHERE nombre LIKE ?");
    $stmt->execute(['Prueba%']);
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $ids = array_column($rows, 'pedido_id');

    if (count($ids) === 0) {
        echo json_encode(['deleted' => 0, 'message' => 'No se encontraron pedidos de prueba.']);
        exit;
    }

    // Borrar detalle y pedidos en transacción
    $db->beginTransaction();
    $in = implode(',', array_fill(0, count($ids), '?'));
    $delDetalle = $db->prepare("DELETE FROM detalle_pedidos WHERE pedido_id IN ($in)");
    $delPedidos = $db->prepare("DELETE FROM pedidos WHERE id IN ($in)");
    $delDetalle->execute($ids);
    $delPedidos->execute($ids);
    $db->commit();

    echo json_encode(['deleted' => count($ids), 'ids' => $ids]);
} catch (Exception $e) {
    if (isset($db) && $db->inTransaction()) $db->rollBack();
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}

?>
