<?php
require_once 'config.php';
require_once 'models/Producto.php';

$database = new Database();
$db = $database->getConnection();
$producto = new Producto($db);

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        if(isset($_GET['id'])) {
            $producto->id = $_GET['id'];
            if($producto->readOne()) {
                echo json_encode([
                    "id" => $producto->id,
                    "nombre" => $producto->nombre,
                    "descripcion" => $producto->descripcion,
                    "precio" => $producto->precio,
                    "old_price" => $producto->old_price,
                    "categoria" => $producto->categoria,
                    "imagen" => $producto->imagen,
                    "stock" => $producto->stock
                ]);
            } else {
                http_response_code(404);
                echo json_encode(["message" => "Producto no encontrado"]);
            }
        } else {
            $stmt = $producto->read();
            $num = $stmt->rowCount();
            
            if($num > 0) {
                $productos_arr = array();
                while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    extract($row);
                    $producto_item = array(
                        "id" => $id,
                        "nombre" => $nombre,
                        "descripcion" => $descripcion,
                        "precio" => $precio,
                        "old_price" => isset($old_price) ? $old_price : null,
                        "categoria" => $categoria,
                        "imagen" => $imagen,
                        "stock" => $stock
                    );
                    array_push($productos_arr, $producto_item);
                }
                echo json_encode($productos_arr);
            } else {
                echo json_encode([]);
            }
        }
        break;

    case 'POST':
        // Only admin can create products
        if (empty($_SESSION['usuario_role']) || $_SESSION['usuario_role'] !== 'admin') {
            http_response_code(401);
            echo json_encode(["message" => "No autorizado"]);
            break;
        }
        $data = json_decode(file_get_contents("php://input"));
        
        if(!empty($data->nombre) && !empty($data->precio)) {
            $producto->nombre = $data->nombre;
            $producto->descripcion = $data->descripcion ?? '';
            $producto->precio = $data->precio;
            $producto->old_price = $data->old_price ?? null;
            $producto->categoria = $data->categoria ?? 'ropa';
            $producto->imagen = $data->imagen ?? '';
            $producto->stock = $data->stock ?? 0;

            if($producto->create()) {
                http_response_code(201);
                echo json_encode(["message" => "Producto creado exitosamente"]);
            } else {
                http_response_code(503);
                echo json_encode(["message" => "Error al crear el producto"]);
            }
        } else {
            http_response_code(400);
            echo json_encode(["message" => "Datos incompletos"]);
        }
        break;

    case 'PUT':
        // Only admin can update products
        if (empty($_SESSION['usuario_role']) || $_SESSION['usuario_role'] !== 'admin') {
            http_response_code(401);
            echo json_encode(["message" => "No autorizado"]);
            break;
        }
        if(isset($_GET['id'])) {
            $data = json_decode(file_get_contents("php://input"));
            
            $producto->id = $_GET['id'];
            $producto->nombre = $data->nombre;
            $producto->descripcion = $data->descripcion;
            $producto->precio = $data->precio;
            $producto->old_price = $data->old_price ?? null;
            $producto->categoria = $data->categoria;
            $producto->imagen = $data->imagen;
            $producto->stock = $data->stock;

            if($producto->update()) {
                echo json_encode(["message" => "Producto actualizado"]);
            } else {
                http_response_code(503);
                echo json_encode(["message" => "Error al actualizar"]);
            }
        }
        break;

    case 'DELETE':
        // Only admin can delete products
        if (empty($_SESSION['usuario_role']) || $_SESSION['usuario_role'] !== 'admin') {
            http_response_code(401);
            echo json_encode(["message" => "No autorizado"]);
            break;
        }
        if(isset($_GET['id'])) {
            $producto->id = $_GET['id'];
            
            if($producto->delete()) {
                echo json_encode(["message" => "Producto eliminado"]);
            } else {
                http_response_code(503);
                echo json_encode(["message" => "Error al eliminar"]);
            }
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(["message" => "Método no permitido"]);
        break;
}
?>