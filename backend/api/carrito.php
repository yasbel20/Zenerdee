<?php
require_once 'config.php';

// Requiere sesión iniciada por `config.php`
$user_id = $_SESSION['usuario_id'] ?? null;
if (!$user_id) {
    http_response_code(401);
    echo json_encode(['error' => 'No autenticado']);
    exit();
}

require_once 'config/database.php';

$database = new Database();
$db = $database->getConnection();

// Ensure table exists (safe to run multiple times)
try {
    $db->exec("CREATE TABLE IF NOT EXISTS user_carts (
        user_id INT PRIMARY KEY,
        data JSON,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )");
} catch (PDOException $e) {
    // ignore creation errors; downstream queries will surface issues
}

$method = $_SERVER['REQUEST_METHOD'];

// --- Debug helper (local only) ---
// Allow calling ?debug=1 from localhost origins to inspect session and DB state.
$isLocal = in_array($_SERVER['REMOTE_ADDR'] ?? '', ['127.0.0.1', '::1', 'localhost']);
$debug = isset($_GET['debug']) && $_GET['debug'] == '1';
if ($debug && $isLocal) {
    // show session and basic DB info for debugging
    $session_copy = $_SESSION ?? null;
    $tableExists = false;
    try {
        $res = $db->query("SHOW TABLES LIKE 'user_carts'");
        $tableExists = ($res && $res->rowCount() > 0);
    } catch (PDOException $e) {
        // ignore
    }
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'debug' => true,
        'remote_addr' => $_SERVER['REMOTE_ADDR'] ?? null,
        'session' => $session_copy,
        'table_exists' => $tableExists,
    ], JSON_UNESCAPED_UNICODE);
    exit();
}

if ($method === 'GET') {
    $stmt = $db->prepare("SELECT data FROM user_carts WHERE user_id = ? LIMIT 1");
    $stmt->execute([$user_id]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($row && $row['data']) {
        header('Content-Type: application/json; charset=utf-8');
        echo $row['data'];
    } else {
        echo json_encode([]);
    }
    exit();
}

if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    if (!is_array($input)) {
        http_response_code(400);
        echo json_encode(['error' => 'Datos inválidos']);
        exit();
    }

    $dataJson = json_encode($input, JSON_UNESCAPED_UNICODE);
    try {
        $stmt = $db->prepare("INSERT INTO user_carts (user_id, data) VALUES (?, ?) ON DUPLICATE KEY UPDATE data = ?, updated_at = NOW()");
        $stmt->execute([$user_id, $dataJson, $dataJson]);
        echo json_encode(['success' => true]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
    exit();
}

http_response_code(405);
echo json_encode(['error' => 'Método no permitido']);

?>
