<?php
// send_mail.php - Contact Form Handler

// Enable error reporting for debugging (disable in production)
// error_reporting(E_ALL);
// ini_set('display_errors', 1);

// Set headers for JSON response
header('Content-Type: application/json');

// CORS headers (if needed for local development)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Initialize response array
$response = array(
    'success' => false,
    'message' => ''
);

// Check if request is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    $response['message'] = 'Invalid request method.';
    echo json_encode($response);
    exit;
}

// =========================
// CONFIGURATION
// =========================

// Your email address where form submissions will be sent
$to_email = 'info@annyfitwear.com';

// Email subject prefix
$email_subject_prefix = '[Anny Fitwear] ';

// Admin notification email (optional - for internal notifications)
$admin_email = 'info@annyfitwear.com';

// =========================
// SANITIZE INPUT
// =========================

function sanitize_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    return $data;
}

// =========================
// VALIDATE & GET FORM DATA
// =========================

// Required fields
$name = isset($_POST['name']) ? sanitize_input($_POST['name']) : '';
$email = isset($_POST['email']) ? sanitize_input($_POST['email']) : '';
$subject = isset($_POST['subject']) ? sanitize_input($_POST['subject']) : '';
$message = isset($_POST['message']) ? sanitize_input($_POST['message']) : '';

// Optional fields
$phone = isset($_POST['phone']) ? sanitize_input($_POST['phone']) : '';
$cart_items = isset($_POST['cart_items']) ? sanitize_input($_POST['cart_items']) : '';

// Validation
$errors = array();

if (empty($name) || strlen($name) < 2) {
    $errors[] = 'Please enter a valid name.';
}

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Please enter a valid email address.';
}

if (empty($subject) || strlen($subject) < 3) {
    $errors[] = 'Please enter a subject.';
}

if (empty($message) || strlen($message) < 10) {
    $errors[] = 'Please enter a message (minimum 10 characters).';
}

// Check for errors
if (!empty($errors)) {
    $response['message'] = implode(' ', $errors);
    echo json_encode($response);
    exit;
}

// =========================
// PREPARE EMAIL
// =========================

// Email subject
$full_subject = $email_subject_prefix . $subject;

// Prepare product information if available
$product_info = '';
if (!empty($cart_items)) {
    $product_info = "\n\n--- PRODUCT INQUIRY ---\n";
    $product_info .= "Products: " . $cart_items . "\n";
    $product_info .= "----------------------\n";
}

// Email body (Plain text version)
$email_body = "New Contact Form Submission\n\n";
$email_body .= "Name: " . $name . "\n";
$email_body .= "Email: " . $email . "\n";
$email_body .= "Phone: " . ($phone ?: 'Not provided') . "\n";
$email_body .= "Subject: " . $subject . "\n";
$email_body .= $product_info;
$email_body .= "\nMessage:\n" . $message . "\n\n";
$email_body .= "---\n";
$email_body .= "Sent from: Anny Fitwear Contact Form\n";
$email_body .= "Date: " . date('Y-m-d H:i:s') . "\n";
$email_body .= "IP Address: " . $_SERVER['REMOTE_ADDR'] . "\n";

// HTML version of email
$email_html = "
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #d4af37; color: #000; padding: 20px; text-align: center; }
        .content { background: #f9f9f9; padding: 30px; border: 1px solid #ddd; }
        .field { margin-bottom: 15px; }
        .field-label { font-weight: bold; color: #555; }
        .field-value { color: #222; margin-top: 5px; }
        .product-box { background: #fff3cd; border-left: 4px solid #d4af37; padding: 15px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #777; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2>New Contact Form Submission</h2>
            <p>Anny Fitwear</p>
        </div>
        <div class='content'>
            <div class='field'>
                <div class='field-label'>Name:</div>
                <div class='field-value'>" . htmlspecialchars($name) . "</div>
            </div>
            <div class='field'>
                <div class='field-label'>Email:</div>
                <div class='field-value'><a href='mailto:" . htmlspecialchars($email) . "'>" . htmlspecialchars($email) . "</a></div>
            </div>
            <div class='field'>
                <div class='field-label'>Phone:</div>
                <div class='field-value'>" . ($phone ? htmlspecialchars($phone) : 'Not provided') . "</div>
            </div>
            <div class='field'>
                <div class='field-label'>Subject:</div>
                <div class='field-value'>" . htmlspecialchars($subject) . "</div>
            </div>";

if (!empty($cart_items)) {
    $email_html .= "
            <div class='product-box'>
                <div class='field-label'>Product Inquiry:</div>
                <div class='field-value'>" . htmlspecialchars($cart_items) . "</div>
            </div>";
}

$email_html .= "
            <div class='field'>
                <div class='field-label'>Message:</div>
                <div class='field-value'>" . nl2br(htmlspecialchars($message)) . "</div>
            </div>
        </div>
        <div class='footer'>
            <p>Sent from Anny Fitwear Contact Form<br>
            Date: " . date('Y-m-d H:i:s') . "<br>
            IP: " . $_SERVER['REMOTE_ADDR'] . "</p>
        </div>
    </div>
</body>
</html>
";

// =========================
// EMAIL HEADERS
// =========================

$headers = array();
$headers[] = 'MIME-Version: 1.0';
$headers[] = 'Content-Type: text/html; charset=UTF-8';
$headers[] = 'From: Anny Fitwear <noreply@annyfitwear.com>';
$headers[] = 'Reply-To: ' . $name . ' <' . $email . '>';
$headers[] = 'X-Mailer: PHP/' . phpversion();

// =========================
// SEND EMAIL
// =========================

try {
    // Send email
    $mail_sent = mail($to_email, $full_subject, $email_html, implode("\r\n", $headers));

    if ($mail_sent) {
        $response['success'] = true;
        $response['message'] = 'Thank you for contacting us! We will get back to you soon.';
        
        // Optional: Send auto-reply to customer
        sendAutoReply($email, $name);
        
    } else {
        $response['message'] = 'Failed to send email. Please try again later.';
    }

} catch (Exception $e) {
    $response['message'] = 'An error occurred: ' . $e->getMessage();
}

// Return JSON response
echo json_encode($response);

// =========================
// AUTO-REPLY FUNCTION
// =========================

function sendAutoReply($customer_email, $customer_name) {
    $auto_reply_subject = 'Thank you for contacting Anny Fitwear';
    
    $auto_reply_body = "
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #d4af37; color: #000; padding: 30px; text-align: center; }
            .content { padding: 30px; background: #f9f9f9; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #777; background: #222; color: #fff; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h1>Anny Fitwear</h1>
                <p>Premium Motorbike Gear Manufacturing</p>
            </div>
            <div class='content'>
                <h2>Thank You, " . htmlspecialchars($customer_name) . "!</h2>
                <p>We have received your inquiry and our team will get back to you within 24-48 hours.</p>
                <p>In the meantime, feel free to explore our product catalog or contact us directly:</p>
                <ul>
                    <li><strong>Email:</strong> info@annyfitwear.com</li>
                    <li><strong>Phone:</strong> +92 314 7568355</li>
                    <li><strong>WhatsApp:</strong> +92 314 7568355</li>
                </ul>
                <p>We look forward to working with you!</p>
                <p><strong>Best regards,</strong><br>The Anny Fitwear Team</p>
            </div>
            <div class='footer'>
                <p>Neka Pura, Sialkot, Pakistan<br>
                &copy; " . date('Y') . " Anny Fitwear. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    ";
    
    $auto_headers = array();
    $auto_headers[] = 'MIME-Version: 1.0';
    $auto_headers[] = 'Content-Type: text/html; charset=UTF-8';
    $auto_headers[] = 'From: Anny Fitwear <noreply@annyfitwear.com>';
    $auto_headers[] = 'Reply-To: info@sherazimpex.com';
    
    mail($customer_email, $auto_reply_subject, $auto_reply_body, implode("\r\n", $auto_headers));
}

?>