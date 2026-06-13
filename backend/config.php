<?php
// ── CORS ──────────────────────────────────────────────────────────────────────
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

// ── DB connection ──────────────────────────────────────────────────────────────
// On FTP hosting: edit the fallback values directly here.
// On servers with env vars: set DB_HOST, DB_NAME, DB_USER, DB_PASSWORD.
$host   = getenv('DB_HOST')     ?: 'localhost';
$dbname = getenv('DB_NAME')     ?: 'your_db_name';
$user   = getenv('DB_USER')     ?: 'your_db_user';
$pass   = getenv('DB_PASSWORD') ?: 'your_db_password';

define('GOOGLE_CLIENT_ID', getenv('GOOGLE_CLIENT_ID') ?: 'your-google-client-id.apps.googleusercontent.com');

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE,            PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function sendResponse(array $data, int $code = 200): void {
    http_response_code($code);
    echo json_encode($data);
    exit;
}

function validateRequired(array $input, array $fields): array {
    return array_filter($fields, fn($f) => !isset($input[$f]) || $input[$f] === '');
}

function fetchRow(string $sql, array $params, string $types = ''): array|false {
    global $pdo;
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    return $stmt->fetch();
}

function fetchAll(string $sql, array $params, string $types = ''): array {
    global $pdo;
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    return $stmt->fetchAll();
}

function executeInsert(string $sql, array $params, string $types = ''): int|string {
    global $pdo;
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    return $pdo->lastInsertId();
}

function executeQuery(string $sql, array $params, string $types = ''): void {
    global $pdo;
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
}

function requireAuth(): int {
    $auth = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (!preg_match('/^Bearer (.+)$/', $auth, $m)) {
        sendResponse(['success' => false, 'message' => 'Unauthorized'], 401);
    }
    $token = $m[1];
    $row   = fetchRow(
        'SELECT user_id FROM spc_tokens WHERE token = ?', [$token]
    );
    if (!$row) sendResponse(['success' => false, 'message' => 'Invalid or expired token'], 401);
    return (int)$row['user_id'];
}
