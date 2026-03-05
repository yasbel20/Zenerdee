<?php
// Dev-only endpoint: create a PHP session for an admin user for local testing.
// Usage: dev_auto_login.php?email=admin@example.com&token=DEV_AUTOTOKEN

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/models/Usuario.php';
require_once __DIR__ . '/config/database.php';

header('Content-Type: application/json');

$expected = 'dev_auto_login_token_please_change';
$token = isset($_GET['token']) ? $_GET['token'] : null;
if ($token !== $expected) {
    http_response_code(403);
    echo json_encode(["message" => "Invalid token"]);
    exit;
}

$email = isset($_GET['email']) ? $_GET['email'] : 'admin@example.com';

$database = new Database();
$db = $database->getConnection();
$usr = new Usuario($db);
$usr->email = $email;
$usuario = $usr->findByEmail();
if (!$usuario) {
    http_response_code(404);
    echo json_encode(["message" => "User not found"]);
    exit;
}

// Ensure role is admin; if not, promote in-session only
if (!isset($usuario['role']) || $usuario['role'] !== 'admin') {
    // still allow creating session but set role to admin for testing
    $usuario['role'] = 'admin';
}

// Create PHP session variables (session already started in config.php)
$_SESSION['usuario_id'] = $usuario['id'];
$_SESSION['usuario_nombre'] = $usuario['nombre'] ?? $usuario['email'];
$_SESSION['usuario_role'] = $usuario['role'];

echo json_encode(["message" => "Auto-logged in as admin", "user" => $usuario]);
exit;

?>
