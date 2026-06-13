<?php
require_once 'config.php';

// ── Routing ───────────────────────────────────────────────────────────────────

$uri   = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$parts = array_values(array_filter(explode('/', $uri)));

$idx = null;
foreach ($parts as $i => $p) {
    if ($p === 'api' || $p === 'api.php') { $idx = $i; break; }
}
$segments = $idx !== null ? array_slice($parts, $idx + 1) : $parts;

$endpoint = $segments[0] ?? '';
$sub      = $segments[1] ?? '';

switch ($endpoint) {
    case 'google':  handleGoogleAuth();       break;
    case 'entries': handleEntries();          break;
    case 'profile': handleProfile($sub);      break;
    default:
        sendResponse(['success' => false, 'message' => "Unknown endpoint '$endpoint'"], 404);
}

// ── Google OAuth ──────────────────────────────────────────────────────────────

function handleGoogleAuth() {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        sendResponse(['success' => false, 'message' => 'Method not allowed'], 405);
    }

    $input = json_decode(file_get_contents('php://input'), true) ?? [];
    if (empty($input['id_token'])) {
        sendResponse(['success' => false, 'message' => 'id_token required'], 400);
    }

    $ch = curl_init('https://oauth2.googleapis.com/tokeninfo?id_token=' . urlencode($input['id_token']));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if (!$response || $httpCode !== 200) {
        sendResponse(['success' => false, 'message' => 'Failed to verify Google token'], 401);
    }

    $payload = json_decode($response, true);

    if (empty($payload['email']) || empty($payload['email_verified'])) {
        sendResponse(['success' => false, 'message' => 'Google token invalid or email not verified'], 401);
    }

    $clientId = defined('GOOGLE_CLIENT_ID') ? GOOGLE_CLIENT_ID : getenv('GOOGLE_CLIENT_ID');
    if ($clientId && $payload['aud'] !== $clientId) {
        sendResponse(['success' => false, 'message' => 'Token audience mismatch'], 401);
    }

    $email = $payload['email'];
    $name  = $payload['name'] ?? null;

    try {
        $user = fetchRow('SELECT id, email, display_name, centre_name FROM spc_users WHERE email = ?', [$email]);

        if (!$user) {
            $id   = executeInsert(
                'INSERT INTO spc_users (email, display_name) VALUES (?, ?)',
                [$email, $name]
            );
            $user = ['id' => $id, 'email' => $email, 'display_name' => $name, 'centre_name' => ''];
        }

        $token = bin2hex(random_bytes(32));
        executeInsert('INSERT INTO spc_tokens (user_id, token) VALUES (?, ?)', [(int)$user['id'], $token]);

        sendResponse([
            'success'    => true,
            'token'      => $token,
            'user'       => [
                'id'           => (int)$user['id'],
                'email'        => $user['email'],
                'display_name' => $user['display_name'],
                'centre_name'  => $user['centre_name'] ?? '',
            ],
        ]);
    } catch (Exception $e) {
        error_log('Google auth error: ' . $e->getMessage());
        sendResponse(['success' => false, 'message' => 'Authentication failed'], 500);
    }
}

// ── Daily Entries ─────────────────────────────────────────────────────────────

function handleEntries() {
    $userId = requireAuth();

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        try {
            $rows = fetchAll(
                'SELECT entry_date, gyan_murali, gyan_murali_stars, gyan_revision,
                        yog_amritvela, yog_amritvela_stars, yog_extra_hours,
                        yog_traffic_control, yog_traffic_stars,
                        dharana_aim, dharana_morning_pledge, dharana_night_check, dharana_night_stars,
                        seva_done, seva_stars, total_points, remarks, updated_at
                 FROM spc_daily_entries WHERE user_id = ? ORDER BY entry_date DESC',
                [$userId]
            );
            $entries = array_map('mapEntry', $rows);
            sendResponse(['success' => true, 'entries' => $entries]);
        } catch (Exception $e) {
            error_log('Entries GET error: ' . $e->getMessage());
            sendResponse(['success' => false, 'message' => 'Failed to load entries'], 500);
        }

    } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $input   = json_decode(file_get_contents('php://input'), true) ?? [];
        $missing = validateRequired($input, ['date']);
        if ($missing) sendResponse(['success' => false, 'message' => 'Missing: date'], 400);

        if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $input['date'])) {
            sendResponse(['success' => false, 'message' => 'Invalid date format'], 400);
        }

        $date    = $input['date'];
        $gyanM   = (int)(bool)($input['gyanMurali']          ?? false);
        $gyanMS  = min(5, max(0, (int)($input['gyanMuraliStars']    ?? 0)));
        $gyanR   = (int)(bool)($input['gyanRevision']         ?? false);
        $yogA    = (int)(bool)($input['yogAmritvela']         ?? false);
        $yogAS   = min(5, max(0, (int)($input['yogAmritvelaStars']  ?? 0)));
        $yogEH   = max(0, (float)($input['yogExtraHours']     ?? 0));
        $yogTC   = (int)(bool)($input['yogTrafficControl']    ?? false);
        $yogTS   = min(5, max(0, (int)($input['yogTrafficStars']    ?? 0)));
        $dhAim   = substr((string)($input['dharanaAim']       ?? ''), 0, 500);
        $dhMP    = (int)(bool)($input['dharanaMorningPledge'] ?? false);
        $dhNC    = (int)(bool)($input['dharanaNightCheck']    ?? false);
        $dhNS    = min(5, max(0, (int)($input['dharanaNightStars']  ?? 0)));
        $seva    = (int)(bool)($input['sevaDone']             ?? false);
        $sevaS   = min(5, max(0, (int)($input['sevaStars']          ?? 0)));
        $remarks = substr((string)($input['remarks']          ?? ''), 0, 2000);

        // Calculate total points
        $pts  = 0;
        if ($gyanM)  $pts += $gyanMS;           // max 5
        if ($gyanR)  $pts += 5;
        if ($yogA)   $pts += $yogAS * 2;        // max 10
        $pts += (int)($yogEH * 10);             // 10 per hour
        if ($yogTC)  $pts += $yogTS;            // max 5
        if ($dhMP)   $pts += 5;
        if ($dhNC)   $pts += $dhNS;             // max 5
        if ($seva)   $pts += $sevaS;            // max 5

        try {
            executeQuery(
                'INSERT INTO spc_daily_entries
                   (user_id, entry_date,
                    gyan_murali, gyan_murali_stars, gyan_revision,
                    yog_amritvela, yog_amritvela_stars, yog_extra_hours,
                    yog_traffic_control, yog_traffic_stars,
                    dharana_aim, dharana_morning_pledge, dharana_night_check, dharana_night_stars,
                    seva_done, seva_stars, total_points, remarks)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                 ON DUPLICATE KEY UPDATE
                    gyan_murali = VALUES(gyan_murali),
                    gyan_murali_stars = VALUES(gyan_murali_stars),
                    gyan_revision = VALUES(gyan_revision),
                    yog_amritvela = VALUES(yog_amritvela),
                    yog_amritvela_stars = VALUES(yog_amritvela_stars),
                    yog_extra_hours = VALUES(yog_extra_hours),
                    yog_traffic_control = VALUES(yog_traffic_control),
                    yog_traffic_stars = VALUES(yog_traffic_stars),
                    dharana_aim = VALUES(dharana_aim),
                    dharana_morning_pledge = VALUES(dharana_morning_pledge),
                    dharana_night_check = VALUES(dharana_night_check),
                    dharana_night_stars = VALUES(dharana_night_stars),
                    seva_done = VALUES(seva_done),
                    seva_stars = VALUES(seva_stars),
                    total_points = VALUES(total_points),
                    remarks = VALUES(remarks),
                    updated_at = CURRENT_TIMESTAMP',
                [$userId, $date, $gyanM, $gyanMS, $gyanR, $yogA, $yogAS, $yogEH,
                 $yogTC, $yogTS, $dhAim, $dhMP, $dhNC, $dhNS, $seva, $sevaS, $pts, $remarks]
            );
            sendResponse(['success' => true, 'totalPoints' => $pts]);
        } catch (Exception $e) {
            error_log('Entries POST error: ' . $e->getMessage());
            sendResponse(['success' => false, 'message' => 'Failed to save entry'], 500);
        }

    } else {
        sendResponse(['success' => false, 'message' => 'Method not allowed'], 405);
    }
}

function mapEntry(array $r): array {
    return [
        'date'                 => $r['entry_date'],
        'gyanMurali'           => (bool)$r['gyan_murali'],
        'gyanMuraliStars'      => (int)$r['gyan_murali_stars'],
        'gyanRevision'         => (bool)$r['gyan_revision'],
        'yogAmritvela'         => (bool)$r['yog_amritvela'],
        'yogAmritvelaStars'    => (int)$r['yog_amritvela_stars'],
        'yogExtraHours'        => (float)$r['yog_extra_hours'],
        'yogTrafficControl'    => (bool)$r['yog_traffic_control'],
        'yogTrafficStars'      => (int)$r['yog_traffic_stars'],
        'dharanaAim'           => $r['dharana_aim'] ?? '',
        'dharanaMorningPledge' => (bool)$r['dharana_morning_pledge'],
        'dharanaNightCheck'    => (bool)$r['dharana_night_check'],
        'dharanaNightStars'    => (int)$r['dharana_night_stars'],
        'sevaDone'             => (bool)$r['seva_done'],
        'sevaStars'            => (int)$r['seva_stars'],
        'totalPoints'          => (int)$r['total_points'],
        'remarks'              => $r['remarks'] ?? '',
        'updatedAt'            => $r['updated_at'],
    ];
}

// ── Profile ───────────────────────────────────────────────────────────────────

function handleProfile(string $sub) {
    $userId = requireAuth();

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        try {
            $user = fetchRow(
                'SELECT id, email, display_name, centre_name, created_at FROM spc_users WHERE id = ?',
                [$userId]
            );
            sendResponse(['success' => true, 'user' => [
                'id'           => (int)$user['id'],
                'email'        => $user['email'],
                'display_name' => $user['display_name'],
                'centre_name'  => $user['centre_name'] ?? '',
                'created_at'   => $user['created_at'],
            ]]);
        } catch (Exception $e) {
            sendResponse(['success' => false, 'message' => 'Failed to load profile'], 500);
        }

    } elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        $name  = trim($input['display_name'] ?? '');
        $centre = trim($input['centre_name'] ?? '');
        try {
            executeQuery(
                'UPDATE spc_users SET display_name = ?, centre_name = ? WHERE id = ?',
                [$name ?: null, $centre, $userId]
            );
            sendResponse(['success' => true]);
        } catch (Exception $e) {
            sendResponse(['success' => false, 'message' => 'Failed to update profile'], 500);
        }

    } else {
        sendResponse(['success' => false, 'message' => 'Method not allowed'], 405);
    }
}
