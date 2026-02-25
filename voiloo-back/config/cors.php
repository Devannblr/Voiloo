<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    */

    'paths' => [
        'api/*',
        'broadcasting/auth',
        'sanctum/csrf-cookie',
        'login',
        'logout',
        'register'
    ],

    'allowed_methods' => ['*'],

    // On met les variantes sans slash final pour éviter les échecs de matching
    'allowed_origins' => [
        'https://voiloo.fr',
        'https://www.voiloo.fr',
        'http://localhost:3000'
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

];
