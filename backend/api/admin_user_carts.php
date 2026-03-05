<?php
// admin_user_carts.php
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/config/database.php';

// Admin-only
if (empty($_SESSION['usuario_role']) || $_SESSION['usuario_role'] !== 'admin') {
    http_response_code(401);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['error' => 'No autorizado']);
    exit();
}

try {
    $dbs = new Database();
    $db = $dbs->getConnection();
    $stmt = $db->query("SELECT uc.user_id, uc.data, uc.updated_at, u.nombre, u.email FROM user_carts uc LEFT JOIN usuarios u ON u.id = uc.user_id ORDER BY uc.updated_at DESC");
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $out = [];
    foreach ($rows as $r) {
        $decoded = null;
        if (!empty($r['data'])) {
            $decoded = json_decode($r['data'], true);
            if ($decoded === null) {
                // Try to unescape if stored as escaped JSON string
                $decoded = json_decode(stripslashes($r['data']), true);
            }
        }
        $out[] = [
            'user_id' => (int)$r['user_id'],
            'nombre' => $r['nombre'],
            'email' => $r['email'],
            'data' => $decoded,
            'updated_at' => $r['updated_at'] ?? null,
        ];
    }

    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($out, JSON_UNESCAPED_UNICODE);
} catch (PDOException $e) {
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['error' => $e->getMessage()]);
}

?>
