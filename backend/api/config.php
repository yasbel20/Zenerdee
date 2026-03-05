<?php
// ============================================================
// api/config.php — Conexión a la base de datos
// Coloca esta carpeta "api" dentro de:
//   C:/xampp/htdocs/zanerdee/api/
// ============================================================

// Unified API config: CORS, headers, session and optional PDO Database include
// Enable PHP errors for local development (remove in production)
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);

// Permitir dinámicamente el Origin para desarrollo (5173 y 5174)
$allowed_origins = [
    'http://localhost:5173',
    'http://localhost:5174'
];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin) {
    // Allow listed origins or any localhost origin (dynamic dev ports)
    if (in_array($origin, $allowed_origins) || preg_match('#^https?://localhost(:\\d+)?$#', $origin)) {
        header("Access-Control-Allow-Origin: " . $origin);
    } else {
        // fallback to a sensible default for development
        header("Access-Control-Allow-Origin: http://localhost:5173");
    }
} else {
    header("Access-Control-Allow-Origin: http://localhost:5173");
}
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=utf-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Optionally include PDO Database helper if present
if (file_exists(__DIR__ . '/config/database.php')) {
    require_once __DIR__ . '/config/database.php';
}

function json_response($data, int $code = 200): void {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit();
}
