<?php
// reset_admin_password.php
// Uso seguro y local: llama desde localhost con ?password=NEWPASS
// Para aplicar el cambio en la DB añade &apply=1

// Restrict to local access
$remote = $_SERVER['REMOTE_ADDR'] ?? '';
if (!in_array($remote, ['127.0.0.1', '::1', 'localhost'])) {
    http_response_code(403);
    echo json_encode(['error' => 'Acceso restringido']);
    exit();
}

header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/config/database.php';

$password = $_GET['password'] ?? null;
$apply = isset($_GET['apply']) && $_GET['apply'] == '1';

if (!$password) {
    echo json_encode([
        'ok' => false,
        'usage' => 'Visita ?password=TU_CONTRASEÑA  (añade &apply=1 para ejecutar el UPDATE)',
    ], JSON_UNESCAPED_UNICODE);
    exit();
}

$hash = password_hash($password, PASSWORD_DEFAULT);

$sql = "UPDATE usuarios SET password = :hash WHERE role = 'admin' LIMIT 1";

$result = ['ok' => true, 'hash' => $hash, 'sql' => $sql];

if ($apply) {
    try {
        $dbs = new Database();
        $db = $dbs->getConnection();
        $stmt = $db->prepare($sql);
        $stmt->execute([':hash' => $hash]);
        $result['applied'] = true;
        $result['rows'] = $stmt->rowCount();
    } catch (PDOException $e) {
        http_response_code(500);
        $result['applied'] = false;
        $result['error'] = $e->getMessage();
    }
}

echo json_encode($result, JSON_UNESCAPED_UNICODE);

?>
