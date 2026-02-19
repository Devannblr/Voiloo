@component('mail::message')
# Nouveau message pour votre vitrine

Vous avez reçu un nouveau message de la part de **{{ $data['nom'] }}**.

**Message :** {{ $data['message'] }}

@component('mail::button', ['url' => 'mailto:' . $data['email']])
    Répondre par email
@endcomponent

Merci,<br>
L'équipe {{ config('app.name') }}
@endcomponent
