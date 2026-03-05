<?php
// upload_image.php — recibe multipart/form-data con campo 'image' y guarda en /public/images
require_once 'config.php';

header('Content-Type: application/json; charset=utf-8');

$targetDir = realpath(__DIR__ . '/../../public') . DIRECTORY_SEPARATOR . 'images' . DIRECTORY_SEPARATOR;
if (!is_dir($targetDir)) {
    mkdir($targetDir, 0755, true);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
    exit();
}

if (empty($_FILES['image']) || !is_uploaded_file($_FILES['image']['tmp_name'])) {
    http_response_code(400);
    echo json_encode(['error' => 'No se recibió imagen']);
    exit();
}

$file = $_FILES['image'];
$ext = pathinfo($file['name'], PATHINFO_EXTENSION);
$safeName = preg_replace('/[^a-zA-Z0-9-_\.]/', '_', pathinfo($file['name'], PATHINFO_FILENAME));
$uniq = time() . '_' . bin2hex(random_bytes(4));
$filename = $safeName . '_' . $uniq . ($ext ? '.' . $ext : '');
$dest = $targetDir . $filename;

if (!move_uploaded_file($file['tmp_name'], $dest)) {
    http_response_code(500);
    echo json_encode(['error' => 'Error al mover el archivo']);
    exit();
}

// Return web path relative to site root, e.g. /images/filename.jpg
$webPath = '/images/' . $filename;
echo json_encode(['path' => $webPath]);

?>
