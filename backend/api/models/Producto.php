<?php
class Producto {
    private $conn;
    private $table_name = "productos";

    public $id;
    public $nombre;
    public $descripcion;
    public $precio;
    public $old_price;  // AÑADIR ESTA LÍNEA
    public $categoria;
    public $imagen;
    public $stock;
    public $created_at;
    public $updated_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    // GET /elementos
    public function read() {
        $query = "SELECT * FROM " . $this->table_name . " ORDER BY created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    // GET /elementos/{id}
    public function readOne() {
        $query = "SELECT * FROM " . $this->table_name . " WHERE id = ? LIMIT 0,1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if($row) {
            $this->nombre = $row['nombre'];
            $this->descripcion = $row['descripcion'];
            $this->precio = $row['precio'];
            $this->old_price = isset($row['old_price']) ? $row['old_price'] : null;  // AÑADIR
            $this->categoria = $row['categoria'];
            $this->imagen = $row['imagen'];
            $this->stock = $row['stock'];
            return true;
        }
        return false;
    }

    // POST /elementos
    public function create() {
        $query = "INSERT INTO " . $this->table_name . "
                  SET nombre=:nombre, descripcion=:descripcion, precio=:precio,
                      old_price=:old_price, categoria=:categoria, imagen=:imagen, stock=:stock";  // MODIFICADO

        $stmt = $this->conn->prepare($query);

        // Sanitizar datos
        $this->nombre = htmlspecialchars(strip_tags($this->nombre));
        $this->descripcion = htmlspecialchars(strip_tags($this->descripcion));
        $this->precio = htmlspecialchars(strip_tags($this->precio));
        $this->old_price = isset($this->old_price) ? htmlspecialchars(strip_tags($this->old_price)) : null;  // AÑADIR
        $this->categoria = htmlspecialchars(strip_tags($this->categoria));
        $this->imagen = htmlspecialchars(strip_tags($this->imagen));
        $this->stock = htmlspecialchars(strip_tags($this->stock));

        // Bind valores
        $stmt->bindParam(":nombre", $this->nombre);
        $stmt->bindParam(":descripcion", $this->descripcion);
        $stmt->bindParam(":precio", $this->precio);
        $stmt->bindParam(":old_price", $this->old_price);  // AÑADIR
        $stmt->bindParam(":categoria", $this->categoria);
        $stmt->bindParam(":imagen", $this->imagen);
        $stmt->bindParam(":stock", $this->stock);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    // PUT /elementos/{id}
    public function update() {
        $query = "UPDATE " . $this->table_name . "
                  SET nombre=:nombre, descripcion=:descripcion, precio=:precio,
                      old_price=:old_price, categoria=:categoria, imagen=:imagen, stock=:stock
                  WHERE id = :id";

        $stmt = $this->conn->prepare($query);

        // Sanitizar
        $this->nombre = htmlspecialchars(strip_tags($this->nombre));
        $this->descripcion = htmlspecialchars(strip_tags($this->descripcion));
        $this->precio = htmlspecialchars(strip_tags($this->precio));
        $this->old_price = isset($this->old_price) ? htmlspecialchars(strip_tags($this->old_price)) : null;  // AÑADIR
        $this->categoria = htmlspecialchars(strip_tags($this->categoria));
        $this->imagen = htmlspecialchars(strip_tags($this->imagen));
        $this->stock = htmlspecialchars(strip_tags($this->stock));
        $this->id = htmlspecialchars(strip_tags($this->id));

        // Bind
        $stmt->bindParam(":nombre", $this->nombre);
        $stmt->bindParam(":descripcion", $this->descripcion);
        $stmt->bindParam(":precio", $this->precio);
        $stmt->bindParam(":old_price", $this->old_price);  // AÑADIR
        $stmt->bindParam(":categoria", $this->categoria);
        $stmt->bindParam(":imagen", $this->imagen);
        $stmt->bindParam(":stock", $this->stock);
        $stmt->bindParam(":id", $this->id);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    // DELETE /elementos/{id}
    public function delete() {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }
}
?>