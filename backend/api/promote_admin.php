<?php
// promote_admin.php — local-only helper to set a user role to admin
$remote = $_SERVER['REMOTE_ADDR'] ?? '';
if (!in_array($remote, ['127.0.0.1', '::1', 'localhost'])) {
    http_response_code(403);
    echo json_encode(['error' => 'Acceso restringido']);
    exit();
}

header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/config/database.php';

$email = $_GET['email'] ?? 'admin@zanerdee.com';
try {
    $dbs = new Database();
    $db = $dbs->getConnection();
    $stmt = $db->prepare("UPDATE usuarios SET role = 'admin' WHERE email = ? LIMIT 1");
    $stmt->execute([$email]);
    echo json_encode(['ok' => true, 'rows' => $stmt->rowCount()]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => $e->getMessage()]);
}

?>
