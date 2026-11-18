<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

header("Content-Type: application/json");
date_default_timezone_set("Asia/Kolkata");

// $ADMIN_EMAIL = "grohairgloskintnj@gmail.com";
$ADMIN_EMAIL = "ara.karthika.n@gmail.com";
$GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycby7Jxrg4CfQ1gAuUEMRITnb2WsDaxDybNY0BJ5r5LQ-yc-hz5oR7yDPl7YubC_ywhHJ/exec";

/* GET JSON INPUT */
$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid input"
    ]);
    exit;
}

/* FIELDS */
$name    = trim($data['name'] ?? '');
$phone   = trim($data['phone'] ?? '');
$area    = trim($data['area'] ?? '');
$concern = trim($data['concern'] ?? '');
$source  = trim($data['source'] ?? 'Website Form');

/* VALIDATION */
if ($name === '' || $phone === '' || $area === '' || $concern === '') {
    echo json_encode([
        "success" => false,
        "message" => "Missing required fields"
    ]);
    exit;
}

/* SAFE OUTPUT */
$name_safe    = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
$phone_safe   = htmlspecialchars($phone, ENT_QUOTES, 'UTF-8');
$area_safe    = htmlspecialchars($area, ENT_QUOTES, 'UTF-8');
$concern_safe = htmlspecialchars($concern, ENT_QUOTES, 'UTF-8');
$source_safe  = htmlspecialchars($source, ENT_QUOTES, 'UTF-8');

$timestamp = date('D, d M Y \a\t h:i A');

/* SUBJECT */
$subject = "New Appointment | $concern_safe | $name_safe";

/* EMAIL TEMPLATE */
$emailBody = '
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#fff7f7;font-family:Arial,sans-serif;">
<div style="max-width:600px;margin:auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #ead7d7;">

    <div style="background:#5b0a0a;padding:30px;text-align:center;color:#ffffff;">
        <div style="font-size:26px;font-weight:bold;">New Appointment Booking</div>
        <div style="font-size:12px;color:#f5caca;margin-top:6px;">'.$timestamp.'</div>
        <div style="margin-top:10px;background:#7a1515;padding:6px 12px;border-radius:20px;display:inline-block;font-size:12px;">'.$concern_safe.'</div>
    </div>

    <div style="padding:24px;">
        <p><strong>Name:</strong> '.$name_safe.'</p>
        <p><strong>Phone:</strong> '.$phone_safe.'</p>
        <p><strong>Area:</strong> '.$area_safe.'</p>
        <p><strong>Concern:</strong> '.$concern_safe.'</p>
        <p><strong>Source:</strong> '.$source_safe.'</p>
    </div>

    <div style="text-align:center;padding:20px;">
        <a href="tel:'.$phone_safe.'" style="background:#5b0a0a;color:#fff;padding:10px 15px;border-radius:6px;text-decoration:none;margin:5px;display:inline-block;">Call</a>
        <a href="https://wa.me/'.preg_replace('/\D/', '', $phone).'" style="background:#16a34a;color:#fff;padding:10px 15px;border-radius:6px;text-decoration:none;margin:5px;display:inline-block;">WhatsApp</a>
    </div>

</div>
</body>
</html>
';

/* HEADERS */
$headers  = "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";
$headers .= "From: DrVelsDentistry <no-reply@drvelsdentistry.com>\r\n";

/* SEND MAIL */
$mailSent = @mail($ADMIN_EMAIL, $subject, $emailBody, $headers, "-fno-reply@drvelsdentistry.com");
$mailError = $mailSent ? "" : (error_get_last()["message"] ?? "mail() returned false");

/* SEND TO GOOGLE SHEET */
$sheetPayload = [
    "name"    => $name,
    "phone"   => $phone,
    "area"    => $area,
    "concern" => $concern,
    "source"  => $source
];

$sheetSent = false;
$sheetHttp = 0;
$sheetError = "";

if (!empty($GOOGLE_SCRIPT_URL) && $GOOGLE_SCRIPT_URL !== "YOUR_GOOGLE_APPS_SCRIPT_WEBAPP_URL") {
    $ch = curl_init($GOOGLE_SCRIPT_URL);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($sheetPayload));
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 15);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);

    $sheetResponse = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $sheetHttp = $httpCode;
    $sheetError = curl_error($ch);
    curl_close($ch);

    if ($sheetResponse !== false && $httpCode >= 200 && $httpCode < 300) {
        $sheetSent = true;
    }
}

/* RESPONSE */
echo json_encode([
    "success" => ($mailSent || $sheetSent),
    "mail_sent" => $mailSent,
    "sheet_sent" => $sheetSent,
    "debug" => ["mail_error" => $mailError, "sheet_http" => $sheetHttp, "sheet_error" => $sheetError],
    "message" => ($mailSent || $sheetSent) ? "Appointment submitted successfully" : "Mail and Sheet both failed"
]);
