<?php
// api/models/Usuario.php

class Usuario {
    private $conn;
    private $table = 'usuarios';

    public $id;
    public $nombre;
    public $email;
    public $password;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Buscar por email
    public function findByEmail() {
        // include role so callers can know if user is admin
        $query = "SELECT id, nombre, email, password, role FROM " . $this->table . " WHERE email = ? LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$this->email]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Comprobar si email ya existe
    public function emailExists() {
        $query = "SELECT id FROM " . $this->table . " WHERE email = ? LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$this->email]);
        return $stmt->rowCount() > 0;
    }

    // Crear nuevo usuario
    public function create() {
        $query = "INSERT INTO " . $this->table . " (nombre, email, password) VALUES (?, ?, ?)";
        $stmt = $this->conn->prepare($query);
        $hash = password_hash($this->password, PASSWORD_BCRYPT);
        return $stmt->execute([$this->nombre, $this->email, $hash]);
    }

    public function lastInsertId() {
        return $this->conn->lastInsertId();
    }
}
