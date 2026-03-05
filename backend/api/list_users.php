<?php
// list_users.php — local dev helper
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/config/database.php';
try {
    $dbs = new Database();
    $db = $dbs->getConnection();
    $stmt = $db->query('SELECT id, nombre, email, role, created_at FROM usuarios');
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($rows, JSON_UNESCAPED_UNICODE);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
