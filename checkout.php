
<?php

header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");
header("Content-Type: application/json");

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");


if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}


// Replace with your actual PayMongo secret key
$secretKey = "YOUR_PAYMONGO_SECRET_KEY";
$authHeader = "Basic " . base64_encode("$secretKey:");


switch($_SERVER["REQUEST_METHOD"]) {
    case "POST":

        $requestData = json_decode(file_get_contents('php://input'), true);
        $amount = intval($requestData['amount'] ?? 10000);
        $description = $requestData['description'] ?? "TasteMakers Order";
        $reference = $requestData['reference_number'] ?? "ORD-" . rand(1000, 9999);


        $data = [
            "data" => [
                "attributes" => [
                    "amount" => $amount,
                    "description" => $description,
                    "remarks" => "Payment for your order",
                    "reference_number" => $reference,
                    "redirect" => [
                        "success" => "https://tastemakers.com/success.html",
                        "failed" => "https://tastemakers.com/failed.html"
                    ],
                    "checkout_options" => [
                        "redirect_behavior" => "always",
                        "button_text" => "Pay Now"
                    ]
                ]
            ]
        ];

        $curl = curl_init();

        curl_setopt_array($curl, [
            CURLOPT_URL => "https://api.paymongo.com/v1/links",
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "POST",
            CURLOPT_POSTFIELDS => json_encode($data),
            CURLOPT_HTTPHEADER => [
                "Accept: application/json",
                "Authorization: $authHeader",
                "Content-Type: application/json"
            ],
        ]);

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            echo json_encode(["error" => "cURL Error: $err"]);
        } else {
            $result = json_decode($response, true);
            if (isset($result['data']['attributes']['checkout_url'])) {
                echo json_encode([
                    "success" => true,
                    "id" => $result['data']['id'],
                    "checkout_url" => $result['data']['attributes']['checkout_url']
                ]);
            } else {
                echo json_encode([
                    "error" => "Failed to create payment link",
                    "details" => $result
                ]);
            }
        }
        break;

    case "GET":

        echo json_encode([
            "status" => "active",
            "message" => "PayMongo payment service is running"
        ]);
        break;

    default:
        echo json_encode(["error" => "Invalid request method"]);
        break;
}

