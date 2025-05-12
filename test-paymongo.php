<?php
// This is a test file to verify PayMongo integration

// Set a test amount (20 PHP = 2000 centavos)
$testAmount = 2000;

// Your PayMongo Secret Key
$secretKey = "YOUR_PAYMONGO_SECRET_KEY"; // Replace with your actual secret key
$authHeader = "Basic " . base64_encode("$secretKey:");

// Initialize cURL session
$curl = curl_init();

// Set cURL options for PayMongo API request
curl_setopt_array($curl, [
  CURLOPT_URL => "https://api.paymongo.com/v1/links",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => "",
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 30,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => "POST",
  CURLOPT_POSTFIELDS => json_encode([
    'data' => [
        'attributes' => [
            'amount' => $testAmount,
            'description' => "Test payment from TasteMakers - " . date('Y-m-d H:i:s'),
            'remarks' => "Test payment",
            'reference_number' => "TEST-" . rand(1000, 9999),
            'redirect' => [
                'success' => "https://tastemakers.com/success.html",
                'failed' => "https://tastemakers.com/failed.html"
            ],
            'checkout_options' => [
                'redirect_behavior' => 'always',
                'button_text' => 'Pay Now'
            ]
        ]
    ]
  ]),
  CURLOPT_HTTPHEADER => [
    "Accept: application/json",
    "Authorization: $authHeader",
    "Content-Type: application/json"
  ],
]);

// Execute cURL request
$response = curl_exec($curl);
$err = curl_error($curl);

// Close cURL session
curl_close($curl);

// Display results
echo "<h1>PayMongo API Test</h1>";

if ($err) {
  echo "<div style='color: red; padding: 10px; border: 1px solid red;'>";
  echo "<h2>Error</h2>";
  echo "<p>cURL Error #: $err</p>";
  echo "</div>";
} else {
  echo "<div style='padding: 10px; border: 1px solid #ccc;'>";
  echo "<h2>Response</h2>";

  // Parse the JSON response
  $responseData = json_decode($response, true);

  // Check if we have a valid response with checkout URL
  if (isset($responseData['data']['attributes']['checkout_url'])) {
    $checkoutUrl = $responseData['data']['attributes']['checkout_url'];

    echo "<p style='color: green;'><strong>Success!</strong> Payment link created successfully.</p>";
    echo "<p><strong>Payment ID:</strong> " . $responseData['data']['id'] . "</p>";
    echo "<p><strong>Amount:</strong> " . ($responseData['data']['attributes']['amount'] / 100) . " PHP</p>";
    echo "<p><strong>Description:</strong> " . $responseData['data']['attributes']['description'] . "</p>";
    echo "<p><strong>Checkout URL:</strong> <a href='$checkoutUrl' target='_blank'>$checkoutUrl</a></p>";

    echo "<div style='margin-top: 20px;'>";
    echo "<a href='$checkoutUrl' target='_blank' style='padding: 10px 20px; background-color: #5A31F4; color: white; text-decoration: none; border-radius: 5px;'>Go to Payment Page</a>";
    echo "</div>";
  } else {
    echo "<p style='color: red;'><strong>Error:</strong> Unable to create payment link.</p>";
    echo "<pre>";
    print_r($responseData);
    echo "</pre>";
  }

  echo "</div>";

  echo "<div style='margin-top: 20px; padding: 10px; border: 1px solid #ccc;'>";
  echo "<h2>Raw Response</h2>";
  echo "<pre>" . htmlspecialchars($response) . "</pre>";
  echo "</div>";
}
?>

<div style="margin-top: 20px; display: flex; gap: 10px;">
  <a href="checkout.php" style="padding: 10px 20px; background-color: #333; color: white; text-decoration: none; border-radius: 5px;">Back to Checkout</a>
  <button onclick="testPaymentAPI()" style="padding: 10px 20px; background-color: #5A31F4; color: white; border: none; border-radius: 5px; cursor: pointer;">Test API Connection</button>
</div>

<script>
// Function to test the API connection
function testPaymentAPI() {
  fetch('checkout.php', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(data => {
    alert('API Connection Test: ' + (data.status === 'active' ? 'Success!' : 'Failed!') + '\n\nMessage: ' + data.message);
  })
  .catch(error => {
    alert('API Connection Test Failed: ' + error.message);
  });
}
</script>
