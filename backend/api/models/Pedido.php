<?php
// api/models/Pedido.php

class Pedido {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Crear pedido + detalle en una transacción
    public function create($usuario_id, $total, $items) {
        try {
            $this->conn->beginTransaction();

            // support optional direccion as last param
            $args = func_get_args();
            $direccion = $args[3] ?? null;

            // Ensure 'direccion' column exists (safe check)
            try {
                $colStmt = $this->conn->query("SHOW COLUMNS FROM pedidos LIKE 'direccion'");
                $hasDireccion = ($colStmt && $colStmt->rowCount() > 0);
            } catch (Exception $e) {
                $hasDireccion = false;
            }
            if (!$hasDireccion) {
                try {
                    $this->conn->exec("ALTER TABLE pedidos ADD COLUMN direccion TEXT NULL");
                } catch (Exception $e) {
                    // ignore failures
                }
            }

            if ($direccion !== null) {
                $stmt = $this->conn->prepare(
                    "INSERT INTO pedidos (usuario_id, total, direccion) VALUES (?, ?, ?)"
                );
                $stmt->execute([$usuario_id, $total, $direccion]);
            } else {
                $stmt = $this->conn->prepare(
                    "INSERT INTO pedidos (usuario_id, total) VALUES (?, ?)"
                );
                $stmt->execute([$usuario_id, $total]);
            }
            $pedido_id = $this->conn->lastInsertId();

            // Líneas de detalle
            $stmt = $this->conn->prepare(
                "INSERT INTO detalle_pedidos 
                 (pedido_id, producto_id, nombre, precio, cantidad, talla, color, imagen)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
            );
            foreach ($items as $item) {
                $stmt->execute([
                    $pedido_id,
                    $item['id']       ?? 0,
                    $item['nombre']   ?? '',
                    $item['precio']   ?? 0,
                    $item['qty']      ?? 1,
                    $item['talla']    ?? null,
                    $item['color']    ?? null,
                    $item['imagen']   ?? null,
                ]);
            }

            $this->conn->commit();
            return $pedido_id;

        } catch (Exception $e) {
            if ($this->conn->inTransaction()) {
                $this->conn->rollBack();
            }
            return false;
        }
    }

    // Historial de pedidos de un usuario
    public function getByUsuario($usuario_id) {
        $stmt = $this->conn->prepare(
            "SELECT p.id, p.total, p.estado, p.created_at,
                   dp.nombre, dp.precio, dp.cantidad, dp.talla, dp.color, dp.imagen
            FROM pedidos p
            JOIN detalle_pedidos dp ON dp.pedido_id = p.id
            WHERE p.usuario_id = ?
            ORDER BY p.created_at DESC"
        );
        $stmt->execute([$usuario_id]);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Agrupar por pedido
        $pedidos = [];
        foreach ($rows as $row) {
            $pid = $row['id'];
            if (!isset($pedidos[$pid])) {
                $pedidos[$pid] = [
                    'id'         => $pid,
                    'total'      => $row['total'],
                    'estado'     => $row['estado'],
                    'created_at' => $row['created_at'],
                    'items'      => [],
                ];
            }
            $pedidos[$pid]['items'][] = [
                'nombre'   => $row['nombre'],
                'precio'   => $row['precio'],
                'cantidad' => $row['cantidad'],
                'talla'    => $row['talla'],
                'color'    => $row['color'],
                'imagen'   => $row['imagen'],
            ];
        }
        return array_values($pedidos);
    }

    // Admin: obtener todos los pedidos
    public function getAll() {
        $stmt = $this->conn->prepare(
            "SELECT p.id, p.usuario_id, p.total, p.estado, p.created_at, p.direccion,
                   dp.nombre, dp.precio, dp.cantidad, dp.talla, dp.color, dp.imagen
            FROM pedidos p
            JOIN detalle_pedidos dp ON dp.pedido_id = p.id
            ORDER BY p.created_at DESC"
        );
        $stmt->execute();
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $pedidos = [];
        foreach ($rows as $row) {
            $pid = $row['id'];
            if (!isset($pedidos[$pid])) {
                $pedidos[$pid] = [
                    'id' => $pid,
                    'usuario_id' => $row['usuario_id'],
                    'total' => $row['total'],
                    'estado' => $row['estado'],
                    'created_at' => $row['created_at'],
                    'direccion' => $row['direccion'] ?? null,
                    'items' => [],
                ];
            }
            $pedidos[$pid]['items'][] = [
                'nombre' => $row['nombre'],
                'precio' => $row['precio'],
                'cantidad' => $row['cantidad'],
                'talla' => $row['talla'],
                'color' => $row['color'],
                'imagen' => $row['imagen'],
            ];
        }
        return array_values($pedidos);
    }
}
