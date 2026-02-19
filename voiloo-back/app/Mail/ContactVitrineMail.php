<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ContactVitrineMail extends Mailable
{
    use Queueable, SerializesModels;

    public $data;

    public function __construct($data)
    {
        $this->data = $data;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Nouveau message de contact - Voiloo',
            replyTo: [$this->data['email']],
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.contact-vitrine',
        );
    }
}
