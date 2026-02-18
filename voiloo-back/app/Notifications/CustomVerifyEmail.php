<?php
// app/Notifications/CustomVerifyEmail.php

namespace App\Notifications;

use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\URL;

class CustomVerifyEmail extends VerifyEmail
{
    protected function verificationUrl($notifiable)
    {
        $id = $notifiable->getKey();
        $hash = sha1($notifiable->getEmailForVerification());
        $expires = Carbon::now()->addMinutes(Config::get('auth.verification.expire', 60));

        // Signe l'URL mais la pointe vers le FRONT
        $signedUrl = URL::temporarySignedRoute(
            'verification.verify',
            $expires,
            ['id' => $id, 'hash' => $hash]
        );

        // Remplace l'URL Laravel par l'URL front
        $frontUrl = config('app.frontend_url') . '/verify-email';

        return $frontUrl . '?' . parse_url($signedUrl, PHP_URL_QUERY) . '&id=' . $id . '&hash=' . $hash;
    }
}
