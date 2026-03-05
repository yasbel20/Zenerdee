<?php
require_once 'config.php';
require_once 'models/Usuario.php';

$database = new Database();
$db       = $database->getConnection();
$usuario  = new Usuario($db);

$action = $_GET['action'] ?? '';

switch ($action) {

    case 'check':
        if (!empty($_SESSION['usuario_id'])) {
            echo json_encode([
                'logged' => true,
                'id'     => $_SESSION['usuario_id'],
                'nombre' => $_SESSION['usuario_nombre'],
                'email'  => $_SESSION['usuario_email'],
                'role'   => $_SESSION['usuario_role'] ?? 'user',
            ]);
        } else {
            echo json_encode(['logged' => false]);
        }
        break;

    case 'register':
        $data     = json_decode(file_get_contents('php://input'));
        $nombre   = trim($data->nombre   ?? '');
        $email    = strtolower(trim($data->email ?? ''));
        $password = $data->password ?? '';

        if (!$nombre || !$email || !$password) {
            http_response_code(400);
            echo json_encode(['error' => 'Todos los campos son obligatorios']);
            break;
        }
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            http_response_code(400);
            echo json_encode(['error' => 'Email no válido']);
            break;
        }
        if (strlen($password) < 6) {
            http_response_code(400);
            echo json_encode(['error' => 'La contraseña debe tener al menos 6 caracteres']);
            break;
        }

        $usuario->email = $email;
        if ($usuario->emailExists()) {
            http_response_code(409);
            echo json_encode(['error' => 'Ya existe una cuenta con ese email']);
            break;
        }

        $usuario->nombre   = $nombre;
        $usuario->password = $password;

        if ($usuario->create()) {
            $id = $usuario->lastInsertId();
            $_SESSION['usuario_id']     = $id;
            $_SESSION['usuario_nombre'] = $nombre;
            $_SESSION['usuario_email']  = $email;
            // default role already in DB, reflect in session
            $_SESSION['usuario_role']   = 'user';
            http_response_code(201);
            echo json_encode([
                'success' => true,
                'id'      => $id,
                'nombre'  => $nombre,
                'email'   => $email,
            ]);
        } else {
            http_response_code(503);
            echo json_encode(['error' => 'Error al crear la cuenta']);
        }
        break;

    case 'login':
        $data     = json_decode(file_get_contents('php://input'));
        $email    = strtolower(trim($data->email ?? ''));
        $password = $data->password ?? '';

        if (!$email || !$password) {
            http_response_code(400);
            echo json_encode(['error' => 'Email y contraseña son obligatorios']);
            break;
        }

        $usuario->email = $email;
        $row = $usuario->findByEmail();

        if (!$row || !password_verify($password, $row['password'])) {
            http_response_code(401);
            echo json_encode(['error' => 'Email o contraseña incorrectos']);
            break;
        }

        $_SESSION['usuario_id']     = $row['id'];
        $_SESSION['usuario_nombre'] = $row['nombre'];
        $_SESSION['usuario_email']  = $row['email'];
        $_SESSION['usuario_role']   = $row['role'] ?? 'user';

        echo json_encode([
            'success' => true,
            'id'      => $row['id'],
            'nombre'  => $row['nombre'],
            'email'   => $row['email'],
            'role'    => $row['role'] ?? 'user',
        ]);
        break;

    case 'logout':
        session_destroy();
        echo json_encode(['success' => true]);
        break;

    default:
        http_response_code(400);
        echo json_encode(['error' => 'Acción no válida']);
}